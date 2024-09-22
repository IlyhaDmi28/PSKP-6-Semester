const express = require('express');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const Users = require('./users.json');
const session = require('express-session')
(
    {
        resave: false,
        saveUninitialized: false,
        secret: '1234'
    }
);

function getUser (userName) {
    return Users.find((user) => {return user.name.toUpperCase() == userName.toUpperCase();});
}

function isCorrectPassword (pass1, pass2) {
    return pass1 == pass2;
}

const app = express();
app.use(session);

app.use(passport.initialize());

passport.use(new BasicStrategy((user, password, done) => {
    let authResult = null;
    let authUser = getUser(user);
    if (!authUser) {
        authResult = done(null, false, {message: 'Неверное имя пользователя'});
    } else if (!isCorrectPassword(authUser.password, password)) {
        authResult = done(null, false, {message: 'Неверный пароль'});
    } else {
        authResult = done(null, user);
    }

    return authResult;
}))

app.get('/login',
    (req, res, next) => {
        if (req.session.logout) { 
            req.session.logout = false; 
            delete req.headers['authorization']; 
        }
        next(); 
    }, 
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        res.redirect('/resource');
    }
);

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', 
    passport.authenticate('basic', { session: false }),
    (req, res) => {
        res.send('Hello, you successfully authenticated');
    }
);

app.use((req, res) => {
    res.status(404).send('Сообщение со статусом 404');
});

app.listen(3000, () => console.log('Сервер прослушивает запросы на порту 3000'));