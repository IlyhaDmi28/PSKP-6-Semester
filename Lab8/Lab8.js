const express = require('express');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const { PrismaClient } = require('@prisma/client');

const jwt = require('jsonwebtoken');
const redis = require('redis');

const LoginController = require('./src/controllers/LoginController');
const RegisterController = require('./src/controllers/RegisterController');
const JwtController = require('./src/controllers/JwtController');
const DepStore = require('./src/DependencyStore');
const AuthController = require('./src/controllers/AuthController');
const IndexController = require('./src/controllers/IndexController');
const UserController = require('./src/controllers/UserController');
const ReposController = require('./src/controllers/ReposController');
const CommitController = require('./src/controllers/CommitController');

const prismaInstance = new PrismaClient();

prismaInstance.$connect();

const redisInstance = redis.createClient();

redisInstance.on('error', (error) => console.log(`Redis error: ${error}`));
redisInstance.on('end', () => console.log(`Redis end!`));

redisInstance.connect()
    .then(() => console.log("REDIS CONNECTED!"))
    .catch((error) => console.log(`Redis error: ${error}`));

const app = express();

const accessKey = 'access_key';
const refreshKey = 'refresh_key';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("cookie"));
app.use(expressSession({
    secret: "session",
    saveUninitialized: false,
    resave: false
}));

let deps = DepStore.Create(prismaInstance, redisInstance, jwt, accessKey, refreshKey);

AuthController(app, deps);
IndexController(app, deps);
LoginController(app, deps);
RegisterController(app, deps);
JwtController(app, deps);
UserController(app, deps);
ReposController(app, deps);
CommitController(app, deps);

app.listen(3000, () => console.log("Listen: http://localhost:3000"));