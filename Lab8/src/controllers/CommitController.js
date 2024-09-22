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
    app.get("/api/repos/:id/commits", async (req, res) => {
        try {
            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
                throw new AppException(400, "Not right params!");

            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.Commit, {}))) {
                res.json(await dependency.prisma.commits.findMany({ where: { repoid: id } }));
            }
            else throw new AppException(403, "Not enough rights!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.get("/api/repos/:id/commits/:commitId", async (req, res) => {
        try {
            let id = Number.parseInt(req.params.id);
            let commitId = Number.parseInt(req.params.commitId);

            if (!Number.isInteger(id) || !Number.isInteger(commitId))
                throw new AppException(400, "Not right params!");

            /**
             * @type {import('@prisma/client').repos}
             */
            let commit = undefined;

            if (req.ability.can(AbilityService.Actions.read, subject(AbilityService.Entitys.Commit, {}))) {
                commit = await dependency.prisma.commits.findFirst({ where: { id: commitId, repoid: id } });
            }
            else 
                throw new AppException(403, "Not enough rights!");

            if (commit)
                res.json(commit);
            else
                throw new AppException(404, "Commit not found!");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.post("/api/repos/:id/commits", async (req, res) => {
        try {
            if (!req.isauth)
                throw new AppException(401, "Not auth!");

            let id = Number.parseInt(req.params.id);

            if (!Number.isInteger(id))
                throw new AppException(400, "Not right params!");

            let repo = await dependency.prisma.repos.findFirst({ where: { id: id } });

            if (!repo)
                throw new AppException(404, "Repo not found!");

            if (req.ability.can(AbilityService.Actions.create, subject(AbilityService.Entitys.Commit, { userId: repo.authorid }))) {
                await dependency.prisma.commits.create({ data: { repoid: id, message: req.body.message } });
            }
            else throw new AppException(403, "Not enough rights!");

            res.end("success");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });

    app.put("/api/repos/:id/commits/:commitId", async (req, res) => {
        try {
            if (!req.isauth)
                throw new AppException(401, "Not auth!");

            let id = Number.parseInt(req.params.id);
            let commitId = Number.parseInt(req.params.commitId);

            if (!Number.isInteger(id) || !Number.isInteger(commitId))
                throw new AppException(400, "Not right params!");

            let repo = await dependency.prisma.repos.findFirst({ where: { id: id } });
            let commit = await dependency.prisma.commits.findFirst({ where: { id: commitId } });

            if (!repo)
                throw new AppException(404, "Repo not found!");
            if (!commit)
                throw new AppException(404, "Commit not found!");

            if (req.ability.can(AbilityService.Actions.update, subject(AbilityService.Entitys.Commit, {})) ||
                req.ability.can(AbilityService.Actions.update, subject(AbilityService.Entitys.Commit, { userId: repo.authorid }))) {

                await dependency.prisma.commits.update({ where: { id: commit.id }, data: { message: req.body.message } });
            }
            else throw new AppException(403, "Not enough rights!");

            res.end("success");
        }
        catch (error) {
            res.writeHead(error.code, `${error.message}`);
            res.end();
        }
    });
    
    app.delete("/api/repos/:id/commits/:commitId", async (req, res) => {
        try {
            if (!req.isauth)
                throw new AppException(401, "Not auth!");

            let id = Number.parseInt(req.params.id);
            let commitId = Number.parseInt(req.params.commitId);

            if (!Number.isInteger(id) || !Number.isInteger(commitId))
                throw new AppException(400, "Not right params!");

            let repo = await dependency.prisma.repos.findFirst({ where: { id: id } });
            let commit = await dependency.prisma.commits.findFirst({ where: { id: commitId } });

            if (!repo)
                throw new AppException(404, "Repo not found!");
            if (!commit)
                throw new AppException(404, "Commit not found!");;

            if (req.ability.can(AbilityService.Actions.delete, subject(AbilityService.Entitys.Commit, {}))) {

                await dependency.prisma.commits.delete({ where: { id: commit.id } });
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