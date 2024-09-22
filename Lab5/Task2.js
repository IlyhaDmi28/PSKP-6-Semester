const express = require('express');
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const Users = require('./users.json');
const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '1234'
    }
);

function getUser (userName) {
    return Users.find((user) => {return user.name.toUpperCase() == userName.toUpperCase();});
}

const app = express();
app.use(session);
app.use(passport.initialize());

passport.use(new DigestStrategy({qop: 'auth'}, (user, done) => {
    let authResult = null;
    let authUser = getUser(user);
    if (!authUser) {
        authResult = done(null, false);
    } else {
        authResult = done(null, authUser.name, authUser.password);
    }
    return authResult;
}));

app.get('/login',
    (req, res, next) => {
        if (req.session && req.session.logout) {
            req.session.logout = false;
            delete req.headers['authorization'];
        }
        next();
    }, 
    passport.authenticate('digest', { session: false }),
    (req, res) => {
        res.redirect('/resource');
    }
);

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', 
    passport.authenticate('digest', { session: false }),
    (req, res) => {
        res.send('Hello, you successfully authenticated');
    }
);

app.use((req, res) => {
    res.status(404).send('Сообщение со статусом 404');
});

app.listen(3000, () => console.log('Сервер прослушивает запросы на порту 3000'));