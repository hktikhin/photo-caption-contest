const redisManager = require('./utils/redis');

async function main() {
    await redisManager.setToken("1234");
    console.log(await redisManager.checkToken("1234"));
}

main()




