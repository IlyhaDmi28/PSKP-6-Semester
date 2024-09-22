const redis = require('redis');

const client = redis.createClient();

async function Task2() {
    await client.connect();

    console.time('set');
    for (let i = 0; i < 10000; i++) {
        await client.set(`key${i}`, `set${i}`);
    }
    console.timeEnd('set');

    console.time('get');
    for (let i = 0; i < 10000; i++) {
        await client.get(`key${i}`);
    }
    console.timeEnd('get');

    console.time('del');
    for (let i = 0; i < 10000; i++) {
        await client.del(`key${i}`);
    }
    console.timeEnd('del');
    
    await client.quit();
}

Task2();