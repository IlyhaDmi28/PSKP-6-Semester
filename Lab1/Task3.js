const redis = require('redis');

const client = redis.createClient();

async function Task3() {
    await client.connect();
    
    await client.set(`counter`, 0);

    console.time('incr');
    for (let i = 0; i < 10000; i++) {
        await client.incr(`counter`);
    }
    console.timeEnd('incr');

    console.time('decr');
    for (let i = 0; i < 10000; i++) {
        await client.decr(`counter`);
    }
    console.timeEnd('decr');
    
    await client.quit();
}

Task3();