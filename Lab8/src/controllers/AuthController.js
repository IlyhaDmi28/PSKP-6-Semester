const express = require('express');
const { Dependency } = require('./../DependencyStore');
const { GetAbility } = require('../AbilityService');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.use('/api/*', async (req, res, next) => {
        console.log(req.method);
            
        try {
            if (req.cookies.accessToken && req.cookies.refreshToken) {
                let payload = dependency.jwt.verify(req.cookies.accessToken, dependency.accessTokenKey);
                let payloadRef = dependency.jwt.verify(req.cookies.refreshToken, dependency.refreshTokenKey);
        
                let token = await dependency.redis.get(req.cookies.refreshToken);
        
                if (payload && payloadRef && !token) {
                    req.user = await dependency.prisma.users.findFirst({ where: { id: payload.id } });
                    req.isauth = true;
                    req.role = req.user.role;
                }
                else throw "jwt";
            }
            else throw "jwt";
        }
        catch (error) {
            req.isauth = false;
            req.role = "Guest";
        }

        req.ability = GetAbility(req);

        next();
    });

    app.get("/api/ability", (req, res) => {
        res.end(JSON.stringify(req.ability.rules));
    });
}