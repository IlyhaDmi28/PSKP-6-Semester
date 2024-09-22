const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { users } = require('./db/DB');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const secretKey = 'SECRET_KEY';
const accessTokenExpiry = '10m';
const refreshTokenExpiry = '24h';

const redisClient = redis.createClient();


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/registerPage.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/loginPage.html');
});

app.post('/register', async (req, res) => {
    const { name, password } = req.body;
    console.log(name);
    console.log(password);
    try {
        const user = await users.create({ name, password });
        res.redirect('/resource');
    } catch (error) {
        res.redirect('/register');
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await users.findOne({ where: { name, password } });
        if (!user) {
            console.log("sdsde");
            res.redirect('/login');
        }

        const accessToken = jwt.sign({ name: user.name }, secretKey, { expiresIn: accessTokenExpiry });
        const refreshToken = jwt.sign({ name: user.name }, secretKey, { expiresIn: refreshTokenExpiry });

        res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict', maxAge: 600000 });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 86400000, path: '/' });

        res.redirect('/resource');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(401);
    
    jwt.verify(refreshToken, secretKey, async (err, user) => {
        if (err) return res.sendStatus(401);
        
        await redisClient.set(`key${req.cookies.refresh_token}`, `${user.username}`);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        const accessToken = jwt.sign({ name: user.name }, secretKey, { expiresIn: accessTokenExpiry });
        const refreshToken = jwt.sign({ name: user.name }, secretKey, { expiresIn: refreshTokenExpiry });

        res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'strict', maxAge: 600000 });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'strict', maxAge: 86400000, path: '/' });


        console.log('Add refresh token in black list');
        
        res.status(200).send('Token refreshed successfully');
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.redirect('/login');
});

app.get('/resource', authenticateToken, async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.redirect('/login');

    const Banned = await redisClient.get(`key${refreshToken}`);
    if (Banned) {
        console.log('token banned');
        return res.status(401).send('Refresh token in black list');
    }

    res.send(`RESOURCE<br/>User: ${req.user.name}`);
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

async function authenticateToken(req, res, next) {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.redirect('/login');
    }

    jwt.verify(accessToken, secretKey, (err, user) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}

app.listen(PORT, () => {
    redisClient.connect();
    console.log(`Server is running on port ${PORT}`);
});
