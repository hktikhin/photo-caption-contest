require('dotenv').config(); 
module.exports = {
  "development": {
    "username": "postgres",
    "password": "password123",
    "database": "photo_caption_contest",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "define": {"freezeTableName": true},
    "privateKey": "74395e80-f851-4291-9d79-e21e3de37be6",
    "redisHost": "127.0.0.1",
    "redisPort": "6380"
  },
  "production": {
      "username": process.env.DB_USERNAME,
      "password": process.env.DB_PASSWORD,
      "database": "photo_caption_contest",
      "host": process.env.DB_HOST,
      "dialect": "postgres",
      "define": {"freezeTableName": true},
      "privateKey": process.env.PRIVATE_KEY,
      "redisHost": process.env.REDIS_HOST,
      "redisPort": process.env.REDIS_PORT,
      "redisPassword": process.env.REDIS_PASSWORD,
  }
};
