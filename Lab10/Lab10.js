const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;


import('webdav')
.then(webdav => {
    const { createClient, AuthType } = webdav;

    const Error = (res, message) => res.status(408).send(`${message}`);
    const Error404 = (res, message) => res.status(404).send(`${message}`);

    const client = createClient('https://webdav.yandex.ru', {
        username: 'mondaxfeall1@gmail.com',
        password: 'kvwxqszhcdteljwa',  
    });


    app.post('/md/:name', (req, res) => {
        const nameFile = `/${req.params.name}`;
        client.exists(nameFile).then(result => {
            if (!result) {
                client.createDirectory(nameFile);
                res.status(200).send('Directory created.');
            }
            else
                Error(res, `Failed to create folder ${req.params.name}.`);
        });
    });


    app.post('/rd/:name', (req, res) => {
        const nameFile = `/${req.params.name}`;
        client.exists(nameFile).then(result => {
            if (result) {
                client.deleteFile(nameFile);
                res.status(200).send('Directory deleted.');
            }
            else
                Error404(res, `There is no directory  ${req.params.name}.`);
        });
    });


    app.post('/up/:name', (req, res) => {
        try {
            const filePath = req.params.name;

            if (!fs.existsSync(filePath)) {
                Error404(res, `There is no file ${req.params.name}.`);
                return;
            }

            let rs = fs.createReadStream(filePath);
            let ws = client.createWriteStream(req.params.name);
            rs.pipe(ws);
            res.status(200).send('File uploaded.');
        }
        catch (err) {
            Error(res, `Cannot upload file: ${err.message}.`);
        }
    });


    app.post('/down/:name', (req, res) => {
        const filePath = '/' + req.params.name;
        client
            .exists(filePath)
            .then(alreadyExists => {
                if (alreadyExists) {
                    let rs = client.createReadStream(filePath);
                    let ws = fs.createWriteStream(Date.now() + req.params.name);
                    rs.pipe(ws);
                    rs.pipe(res);
                }
                else
                    Error404(res, `There is no file ${req.params.name}.`);
            })
            .then(message => (message ? res.json(message) : null))
            .catch(err => { Error404(res, err.message); });
    });


    app.post('/del/:name', (req, res) => {
        const nameFile = req.params.name;
        client.exists(nameFile).then(result => {
            if (result) {
                client.deleteFile(nameFile);
                res.status(200).send('File deleted.');
            }
            else
                Error404(res, `There is no file ${req.params.name}.`);
        });
    });


    app.post('/copy/:from/:to', (req, res) => {
        const nameFrom = req.params.from;
        const nameTo = `${req.params.to}`;
        client
            .exists(nameFrom)
            .then(result => {
                if (result) {
                    client.copyFile(nameFrom, nameTo);
                    res.status(200).send('File copied.');
                }
                else
                    Error404(res, `There is no file ${req.params.from}.`);
            })
            .catch(err => Error(res, err.message));
    });


    app.post('/move/:from/:to', (req, res) => {
        const nameFrom = req.params.from;
        const nameTo = req.params.to;
        client
            .exists(nameFrom)
            .then(result => {
                if (result) {
                    client.moveFile(nameFrom, nameTo);
                    res.status(200).send('File moved.');
                }
                else
                    Error404(res, `There is no file ${req.params.from}.`);
                })
            .catch(err => Error(res, err.message));
    });


    app.listen(port, () => console.log(`Server running at localhost:${port}/\n`));
})
.catch(err => console.error('WebDAV: ', err.message));