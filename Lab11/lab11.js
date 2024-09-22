const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const axios = require('axios');
const token = '6782188601:AAE6v3IzK2j6O_5u7PHEWEK6epa4_Uyp8Kw';
const weatherApiToken = 'cc6f4838d7574082a1d92700241905';

const bot = new TelegramBot(token, { polling: true });

let subscribers = [];

// Случайный факт
async function sendRandomFact(chatId) {
    try {
        const response = await axios.get('https://useless-facts.sameerkumar.website/api');
        const fact = response.data.data;
        bot.sendMessage(chatId, fact);
    } catch (error) {
        console.error('Error fetching fact:', error);
    }
}

// /subscribe
bot.onText(/\/subscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (!subscribers.includes(chatId)) {
        subscribers.push(chatId);
        bot.sendMessage(chatId, 'Вы подписались на рассылку случайного факта.');
        
        if (subscribers.length === 1) {
            cron.schedule('*/3 * * * * *', () => {
                subscribers.forEach(chatId => {
                    sendRandomFact(chatId);
                });
            });
        }
    } else {
        bot.sendMessage(chatId, 'Вы уже подписаны на рассылку.');
    }

    console.log('Список подписчиков:', subscribers);
});

// /unsubscribe
bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    if (subscribers.includes(chatId)) {
        subscribers = subscribers.filter(id => id !== chatId);
        bot.sendMessage(chatId, 'Вы отписались от рассылки.');
    } else {
        bot.sendMessage(chatId, 'Вы не подписаны на рассылку.');
    }

    console.log('Список подписчиков:', subscribers);
});

// /weather
bot.onText(/\/weather (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const city = match[1];
    
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${weatherApiToken}&q=${city}&aqi=no`;
        const response = await axios.get(url);
        const { location, current } = response.data;
        
        const weatherInfo = `
            Город: ${location.name}, ${location.country}
            Температура: ${current.temp_c}°C
            Влажность: ${current.humidity}%
            Давление: ${current.pressure_mb}hPa
            Ветер: ${current.wind_kph}km/h ${current.wind_dir}
            Условия: ${current.condition.text}
            Время обновления: ${current.last_updated}
        `;
        
        bot.sendMessage(chatId, weatherInfo);
    } catch (error) {
        console.error('Error fetching weather:', error);
        bot.sendMessage(chatId, 'Не удалось получить информацию о погоде.');
    }
});

// /joke
bot.onText(/\/joke/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('http://www.anekdot.ru/random/anekdot/');

        const joke = response.data.match(/<div class="text">([\s\S]*?)<\/div>/);
        
        if (joke && joke[1]) {
            const formattedJoke = joke[1].trim().replace(/<br>/g, '\n');
            bot.sendMessage(chatId, formattedJoke);
        } else {
            throw new Error('Не удалось получить шутку.');
        }
    } catch (error) {
        console.error('Error fetching joke:', error);
        bot.sendMessage(chatId, 'Не удалось получить шутку.');
    }
});

// /cat 
bot.onText(/\/cat/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        const imageUrl = response.data[0].url;
        bot.sendPhoto(chatId, imageUrl);
    } catch (error) {
        console.error('Error fetching cat image:', error);
        bot.sendMessage(chatId, 'Не удалось найти изображение кота.');
    }
});

bot.onText(/\/dog/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const response = await axios.get('https://api.thedogapi.com/v1/images/search');
        const imageUrl = response.data[0].url;
        bot.sendPhoto(chatId, imageUrl);
    } catch (error) {
        console.error('Error fetching cat image:', error);
        bot.sendMessage(chatId, 'Не удалось найти изображение кота.');
    }
});

// Фраза - стикер
const stickerResponses = {
    'привет': 'CAACAgIAAxkBAAEFiQ5mSg-v9Zxc5W5gkzPs9p1c7AcvkgACWQEAAimWgSWwksRpk6qGpzUE',
    'зыков': 'CAACAgIAAxkBAAEFiRZmShDOXp5JVBQpdUpx_xfMAoLygwAChT0AAptT2UqxHMB_AdmRdTUE',
    'хомяк': 'CAACAgIAAxkBAAEFiSNmShF9SD873MPGM17WtUu3fEN2HAACFSoAAub7MUqU7siTXqL6XDUE',
    'поступил в бгту': 'CAACAgIAAxkBAAEFiSVmShHp9hWqa0W7i9fJzUpJWYpV1QACeRIAAoc8-Uoz1YYZXbBuIjUE'
};

// Отправка стикеров в ответ
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.toLowerCase();

    for (const [phrase, sticker] of Object.entries(stickerResponses)) {
        if (messageText.includes(phrase)) {
            bot.sendSticker(chatId, sticker);
            return;
        }
    }
});




console.log('Бот запущен');