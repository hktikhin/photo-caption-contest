const Caption = require('../db/models').Caption;
const User = require('../db/models').User;
const Photo = require('../db/models').Photo;

const redisManager = require('../utils/redis');
const CACHE_KEY = 'caption';

function getById(req, res) {
    return redisManager.get_cache(`${CACHE_KEY}_${req.params.id}`, () => Caption
        .findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['id', 'password'] }
            }, 
            {
                model: Photo,
                as: 'photo',
                attributes: { exclude: ['id'] }
            }
        ]}))
        .then((caption) => {
            if (!caption) {
                return res.status(404).send({message: 'Caption Not Found'});
            }
            return res.status(200).send(caption);
        })
        .catch((err) => {
            console.log(err)
            res.status(400).send(err);
        })
}


function add(req, res) {
    const userId = req.user.id;
    return Caption
        .create({
            photoId: req.body.photoId,
            userId: userId,
            comment: req.body.comment
        })
        .then((caption) => res.status(201).send(caption))
        .then(() => redisManager.delete_cache(`user_${userId}`))
        .then(() => redisManager.delete_cache(`photo_${req.body.photoId}`))
        .catch((err) => res.status(400).send(err));
}

function update(req, res) {
    return Caption
        .findByPk(req.params.id)
        .then((caption) => {
            if (!caption) {
                return res.status(404).send({message: 'Caption Not Found'});
            }
            if (caption.userId !== req.user.id) {
                return res.status(403).send({message: 'User not authorized to update this caption.'});
            }
            return caption
                .update({comment: req.body.comment || caption.comment})
                .then((caption) => res.status(200).send(caption))
                .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
                .then(() => redisManager.delete_cache(`user_${caption.userId}`))
                .then(() => redisManager.delete_cache(`photo_${caption.photoId}`))
                .catch((err) => res.status(400).send(err))
        })
        .catch((err) => res.status(400).send(err))
}

function remove(req, res) {
    return Caption
        .findByPk(req.params.id)
        .then((caption) => {
            if (!caption) {
                return res.status(404).send({message: 'Caption Not Found'});
            }
            if (caption.userId !== req.user.id) {
                return res.status(403).send({message: 'User not authorized to delete this caption.'});
            }
            return caption
                .destroy()
                .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
                .then(() => redisManager.delete_cache(`user_${caption.userId}`))
                .then(() => redisManager.delete_cache(`photo_${caption.photoId}`))
                .then(() => res.status(204).send())
                .catch((err) => res.status(400).send(err))
        })
        .catch((err) => res.status(400).send(err))
}


module.exports = {
    getById,
    add,
    update,
    remove
};