const express = require('express');
const { Dependency } = require('./../DependencyStore');
const AbilityService = require('../AbilityService');
const { subject } = require('@casl/ability');
const AppException = require('./../AppException');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function (app, dependency) {
    app.get("/api/repos", async (req, res) => {
        try {
            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.Repo, {}))) {
                res.json(await dependency.prisma.repos.findMany());
            }
            else throw new AppException(403, "Not enough rights!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.get("/api/repos/:id", async (req, res) => {
        try {
            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
                throw new AppException(400, "Not right params!");

            /**
             * @type {import('@prisma/client').repos}
             */
            let repo = undefined;

            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.Repo, {}))) {
                repo = await dependency.prisma.repos.findFirst({ where: { id: id } });
            }
            else throw new AppException(403, "Not enough rights!");

            if (repo)
                res.json(repo);
            else
                throw new AppException(404, "Repo not found!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.post("/api/repos", async (req, res) => {
        try {
            if (!req.isauth)
                throw new AppException(401, "Not auth!");

            if (req.ability.can(AbilityService.Actions.create, subject(AbilityService.Entitys.Repo, { userId: req.user.id }))) {
                console.log(req.user.id);
                console.log(req.body.name);
                await dependency.prisma.repos.create({ data: { authorid: req.user.id, name: req.body.name } });
            }
            else throw new AppException(403, "Not enough rights!");

            res.end("success");
        }
        catch (error) {
            res.writeHead(error.code, error.message);
            res.end();
        }
    });

    app.put("/api/repos/:id", async (req, res) => {
        try {
            if (!req.isauth)
                throw new AppException(401, "Not auth!");

            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
                throw new AppException(400, "Not right params!");

            let repo = await dependency.prisma.repos.findFirst({ where: { id: id } });

            if (!repo)
                throw new AppException(404, "Repo not found!");

            if (req.ability.can(AbilityService.Actions.update, subject(AbilityService.Entitys.Repo, {})) ||
                req.ability.can(AbilityService.Actions.update, subject(AbilityService.Entitys.Repo, { userId: repo.authorid }))) {

                await dependency.prisma.repos.update({ where: { id: repo.id }, data: { name: req.body.name } });
            }
            else throw new AppException(403, "Not enough rights!");

            res.end("success");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.delete("/api/repos/:id", async (req, res) => {
        try {
            if (!req.isauth)
            throw new AppException(401, "Not auth!");

            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
            throw new AppException(400, "Not right params!");

            let repo = await dependency.prisma.repos.findFirst({ where: { id: id } });

            if (!repo)
            throw new AppException(404, "Repo not found!");

            if (req.ability.can(AbilityService.Actions.delete, subject(AbilityService.Entitys.Repo, {}))) {

                await dependency.prisma.commits.deleteMany({ where: { repoid: repo.id } });
                await dependency.prisma.repos.delete({ where: { id: repo.id } });
            }
            else throw new AppException(403, "Not enough rights!");

            res.end("success");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });
}