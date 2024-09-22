const redis = require('redis');

const client = redis.createClient();

client.connect();
client.on('connect', () => {
        console.log('Подключение к Redis выполнено успешно!');
});
    
client.quit();