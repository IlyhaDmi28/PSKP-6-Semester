const redis = require('redis');

const subscriber = redis.createClient();
subscriber.connect();

subscriber.subscribe('message', message => {
    console.log(message);
});