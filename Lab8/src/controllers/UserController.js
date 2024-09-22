const express = require('express');
const { Dependency } = require('./../DependencyStore');
const AbilityService = require('../AbilityService');
const { subject } = require('@casl/ability');
const AppException = require('./../AppException');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.get("/api/user", async (req, res) => {  
        try {
            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.User, { }))){
                res.json(await dependency.prisma.users.findMany({ select: { id: true, username: true, email: true, role: true } }));
            }
            else throw new AppException(403, "Not enough rights!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.get("/api/user/:id", async (req, res) => {  
        try {
            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
                throw new AppException(400, "Not right params!");

            /**
             * @type {import('@prisma/client').users}
             */
            let user = undefined;

            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.User, { userId: id }))){
                user = await dependency.prisma.users.findFirst({ where: { id: id }, select: { id: true, username: true, email: true, role: true } });
            }
            else if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.User, { }))){
                user = await dependency.prisma.users.findMany({ where: { id: id }, select: { id: true, username: true, email: true, role: true } });
            }
            else throw new AppException(403, "Not enough rights!");

            if (user) 
                res.json(user);
            else 
                throw new AppException(404, "User not found!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });
}