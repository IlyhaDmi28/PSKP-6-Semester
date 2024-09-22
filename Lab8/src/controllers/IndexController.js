const express = require('express');
const fs = require('fs');
const { Dependency } = require('./../DependencyStore');

/**
 * @param {express.Express} app 
 * @param {Dependency} dependency
 */
module.exports = function(app, dependency) {
    app.get("/", (req, res) => {
        res.writeHead(200, { "content-type": "text/html" });
        res.write(fs.readFileSync("./public/index.html"));
        res.end();
    });
}