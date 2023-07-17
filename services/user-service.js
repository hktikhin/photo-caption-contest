const User = require('../db/models').User;
const Caption = require('../db/models').Caption;
const redisManager = require('../utils/redis');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const CACHE_KEY = 'user';

function list(req, res) {
    return User
        .findAll({
            order: [
                ["createdAt", "DESC"]
            ],
            attributes: ['id', 'name', 'email']
        })
        .then((users) => res.status(200).send(users))
        .catch((err) => res.status(400).send(err));
}

function getById(req, res) {
    
    return redisManager.get_cache(`${CACHE_KEY}_${req.params.id}`, () => User
        .findByPk(req.params.id,{
            include: [
                {
                    model: Caption, 
                    as: 'captions',
                    attributes: { exclude: ['userId'] }
                }
            ],
            attributes: ['id', 'name', 'email']
        }))
        .then((user) => {
            if (!user) {
                return res.status(404).send({message: 'User Not Found'})
            }
            return res.status(200).send(user)
        })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        })
}

function create(req, res) {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        return User
            .create({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })
            .then((user) => res.status(201).send({...user.get(), password: undefined}))
            .catch((err) => res.status(400).send(err));
    })
}

function login(req, res) {
    return User
        .findOne({
            where: {
                email: req.body.email
            }
        })
        .then(async (user) => {
            if (!user) {
                return res.status(401).send({message: 'Incorrect username or password'});
            }
            bcrypt.compare(req.body.password, user.password, async (err, result) => {
                if (result) {
                    // Token based authentication
                    const token = user.generateToken();
                    // Store the token in Redis with an expiration time 1hr
                    try {
                        await redisManager.setToken(token);
                        return res.header("authorization", token).status(200).send({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            token: token
                        });
                    } catch (err) {
                        await redisManager.disconnect();
                        return res.status(400).send(err);
                    }
                    
                } else {
                    return res.status(401).send({message: 'Incorrect username or password'});
                }
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        })
}

async function logout(req, res) {
    const token = req.headers["authorization"].split(" ")[1];
    // Expire token from redis
    try {
        await redisManager.delToken(token);
        return res.status(200).send({
            message: 'Logout successful'
        });
    } catch (err) {
        await redisManager.disconnect();
        return res.status(400).send(err);
    }
}

function update(req, res) {
    if (req.user.id.toString() !== req.params.id) {
        return res.status(403).send({
            message: 'Unauthorized to update this user.'
        })
    }

    return User
      .findByPk(req.params.id)
      .then(async user => {
          if (!user) {
              return res.status(404).send({
                  message: 'User Not Found'
              })
          }
          let hash;
          if (req.body.password){
            hash = await bcrypt.hash(req.body.password, saltRounds) 
          }
          return user
              .update({
                  name: req.body.name || user.name,
                  password: hash || user.password
              })
              .then((user) => {
                  res.status(200).send({
                      id: user.id,
                      name: user.name,
                      email: user.email
                  })
              })
              .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
              .catch((err) => res.status(400).send(err))
      })
      .catch((err) => res.status(400).send(err))
}

function remove(req, res) {
    if (req.user.id.toString() !== req.params.id) {
        return res.status(403).send({
            message: 'Unauthorized to update this user.'
        })
    }
    return User
        .findByPk(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(400).send({
                    message: 'User Not Found.'
                })
            }
            return user
                .destroy()
                .then(() => redisManager.delete_cache(`${CACHE_KEY}_${req.params.id}`))
                .then(() => res.status(204).send())
                .catch((err) => res.status(400).send(err));
        })
        .catch((err) => res.status(400).send(err));
}


module.exports = {
    list,
    getById,
    create,
    login,
    logout,
    update,
    remove
};