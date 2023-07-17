const redis = require("redis");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config')[env];

class RedisManager {
  constructor() {
    this.redisClient = redis.createClient({
      socket: {
        host: config.redisHost,
        port: config.redisPort
      },
      password: config.redisPassword
    });
  }

  async connect() {
    await this.redisClient.connect();
  }

  async disconnect() {
    await this.redisClient.quit();
  }

  async setToken(token) {
    await this.redisClient.set(token, 1, {
        EX: 3600
    });
  }

  async delToken(token) {
    await this.redisClient.del(token);
  }

  async checkToken(token) {
    // Check if the token exists in Redis
    return await this.redisClient.get(token);
  }

  async get_cache(key, storeFunction) {
    /*
    params:
    - key: str 
    - storeFunction: function
    Get the cache data from redis 
    If the cache is not found, execute the store function (which directly make request to primary database)
    And return the result 
    */
    const value = await this.redisClient.get(key);
    if (value) {
      console.log(`Retrieving ${key} from cache`);
      return JSON.parse(value);
    } 
    const result = await storeFunction();
    await this.redisClient.set(key, JSON.stringify(result), {
      EX: 3600
    });
    return result
  }

  async delete_cache(key) {
    console.log(`Deleting ${key} from cache`);
    await this.redisClient.del(key);
  }

  async flush() {
    this.redisClient.flushAll()
  }

  getRedisClient() {
    return this.redisClient;
  }
}

// async function main() {
//   const redisManager = new RedisManager();
//   await redisManager.connect();
//   (redisManager.getRedisClient().isOpen) ? console.log(`Redis is ready.`) : console.log(`Redis is not ready.`);

//   const result = await redisManager.setToken("1234");
//   console.log(result);


//   await redisManager.delToken("1234");
//   await redisManager.getRedisClient().quit();
// }

const redisManager = new RedisManager();
redisManager.connect();
(redisManager.getRedisClient().isOpen) ? console.log(`Redis is ready.`) : console.log(`Redis is not ready.`);

module.exports = redisManager;