const express = require('express');
const fs = require('fs');
const { Dependency } = require('./../DependencyStore');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.get('/login', (req, res) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(fs.readFileSync("./public/login.html"));
        res.end();
    });
    
    app.post("/login", async (req, res) => {
        console.log("dddd");
        let user = await dependency.prisma.users.findFirst({ where: { username: req.body.username, password: req.body.password } });
        console.log(user);
    
        if (user) {
            const accessToken = dependency.jwt.sign({ id: user.id, username: user.username }, dependency.accessTokenKey, { expiresIn: 10 * 60 });
            const refreshToken = dependency.jwt.sign({ id: user.id, username: user.username }, dependency.refreshTokenKey, { expiresIn: 24 * 60 * 60 });
    
            res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'strict' });
            res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: 'strict' });
        }
        
        res.redirect('/login');  
    });

    app.get('/logout', async (req, res) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
    
        if (req.cookies.refreshToken) {
            await dependency.redis.set(req.cookies.refreshToken, 'blocked');
        }
    
        res.redirect("/login");
    });
};