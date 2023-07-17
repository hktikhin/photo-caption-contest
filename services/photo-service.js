const Photo = require('../db/models').Photo;
const Caption = require('../db/models').Caption;

const redisManager = require('../utils/redis');
const CACHE_KEY = 'photo';

function list(req, res) {
    return Photo
        .findAll({order: [
            ["createdAt", "DESC"]
        ]})
        .then((photos) => res.status(200).send(photos))
        .catch((err) => res.status(400).send(err));
}

function getById(req, res) {
    return redisManager.get_cache(`${CACHE_KEY}_${req.params.id}`, () => Photo
        .findByPk(req.params.id, {
            include: [{
                model: Caption,
                as: 'captions',
                attributes: { exclude: ['photoId'] }
            }],
        }))
        .then((photo) => {
            if (!photo) {
                return res.status(404).send({
                    message: 'Photo Not Found',
                });
            }
            return res.status(200).send(photo);
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send(error);
        })
}

function add(req, res) {
    return Photo
        .create({
            name: req.body.name,
            url: req.body.url,
            citation: req.body.citation,
        })
        .then((photo)=>res.status(201).send(photo))
        .catch((err)=>res.status(400).send(err));
}

function update(req, res) {
    return Photo
        .findByPk(req.params.id)
        .then((photo) => {
            if (!photo) {
                return res.status(404).send({message: 'Photo Not Found'});
            }
            return photo
                .update({
                    name: req.body.name || photo.name,
                    url: req.body.url || photo.url,
                    citation: req.body.citation || photo.citation
                })
                .then((photo) => res.status(200).send(photo))
                .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
                .catch((error) => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

function remove(req, res) {
    return Photo
        .findByPk(req.params.id)
        .then((photo) => {
            if (!photo) {
                return res.status(404).send({message: 'Photo Not Found'});
            }
            return photo
                .destroy()
                .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
                .then(() => res.status(204).send())
                .catch((error) => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}


module.exports = {
    list,
    getById,
    add,
    update,
    remove
};