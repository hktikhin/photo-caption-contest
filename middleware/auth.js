const jwt = require("jsonwebtoken");
const redisManager = require("../utils/redis");

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

function getToken(req) {
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[0] === "Bearer"
    ) {
      return req.headers["authorization"].split(" ")[1];
    } 
    return null;
  }


module.exports = async function(req, res, next) {
    const token = getToken(req);

    if (!token) return res.status(401).send("Access denied. No token provided.")

    // Check if the token exists in Redis
    try {
        const reply = await redisManager.checkToken(token);
        if (!reply) {
            return res.status(401).json({message: "Invalid token" });
        }
    } catch (err) {
        await redisManager.disconnect();
        return res.status(500).json({error: 'Internal server error' });
    }

    try {
        req.user = jwt.verify(token, config.privateKey);
        next();
    } catch (err) {
        res.status(401).send({message: "Invalid token"});
    }
}