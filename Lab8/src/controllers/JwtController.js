const express = require('express');
const { Dependency } = require('./../DependencyStore');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.get('/refresh-token', async (req, res) => {

        if (req.cookies.refreshToken) {
            let token = await dependency.redis.get(req.cookies.refreshToken);
    
            if (token === null) {
                let payload = dependency.jwt.verify(req.cookies.refreshToken, refreshKey);
    
                if (payload) {
                    await dependency.redis.set(req.cookies.refreshToken, 'blocked');
    
                    const user = await prismaInstance.users.findFirst({ where: { id: payload.id } });
    
                    const accessToken = dependency.jwt.sign({ id: user.id, username: user.username }, dependency.accessTokenKey, { expiresIn: 10 * 60 });
                    const refreshToken = dependency.jwt.sign({ id: user.id, username: user.username }, dependency.refreshTokenKey, { expiresIn: 24 * 60 * 60 });
    
                    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: 'strict' });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: 'strict' });
    
                    res.redirect("/login");
                }
                else {
                    res.writeHead(401);
                    res.end();
                }
            }
            else {
                res.writeHead(401);
                res.end();
            }
        }
        else {
            res.writeHead(401);
            res.end();
        }
    });
};