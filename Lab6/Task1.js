const express = require("express");
const express_session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('./db/users.json');

const port = 3000;
const app = express();

const Strategy = new LocalStrategy(
  {
    usernameField: 'name', 
    passwordField: 'password'
  },
  ( name, password, done) => {
    for (let user of users){
      if(name === user.login && password === user.password)
        return done(null, user);
    }
    return done(null, false, {message: 'Всё плохо'});
  }
)

passport.use(Strategy);

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((user, next) => {
  next(null, user);
});

const session = new express_session({
    resave:false,
    saveUninitialized: false,
    secret: "salt"
})


app.use(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/loginPage.html');
}),

app.get('/resource', (req, res, next) => {
        if(!req.isAuthenticated()) res.redirect('/login');
        else res.send(`RESOURCE<br/>Username: ${req.user.login}`);
    }
);

app.get('/logout', (req, res) => {
    req.logout(() => {});
    res.redirect('/login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/resource',
    failureRedirect: '/login'
}));

app.use((req, res) => {
  res.status(404).send('404');
});

app.listen(port, ()=>{console.log("Server starter on PORT: ", port)})