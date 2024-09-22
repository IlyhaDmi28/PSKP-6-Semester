const express = require('express');
const fs = require('fs');
const { Dependency } = require('./../DependencyStore');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.get('/register', (req, res) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(fs.readFileSync("./public/register.html"));
        res.end();
    });
    
    app.post('/register', async (req, res) => {
        console.log(req.body);
        console.log(req.body.username);
        console.log(req.body.password);

        if (req.body.username !== "" && req.body.password !== "")
            await dependency.prisma.users.create({ data: { username: req.body.username, password: req.body.password, email: req.body.email, role: "User" } });
    
        res.redirect("/login");
    });
};