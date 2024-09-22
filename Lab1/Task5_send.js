const redis = require('redis');

const publisher = redis.createClient();
publisher.connect();

for (let i = 0; i < 10; i++) {
    publisher.publish('message', `${i}`);
}

publisher.quit();
