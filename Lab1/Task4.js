const redis = require('redis');

const client = redis.createClient();

async function Task4() {
    await client.connect();

    console.time('hset');
    for (let i = 0; i < 10000; i++) {
        await client.hSet(`id${i}`, `field${i}`, JSON.stringify({value: `${i}`}));
    }
    console.timeEnd('hset');

    console.time('hget');
    for (let i = 0; i < 10000; i++) {
        await client.hGet(`id${i}`, `field${i}`);
    }
    console.timeEnd('hget');
    
    await client.quit();
}

Task4();