const http = require('http');
const fs = require('fs');
const path = require('path');
const db = require('./models/db');

const server = http.createServer(async  (req, res) => {
    switch (req.method) {
        case 'GET': {
            switch (req.url) {
                case '/' : {
                    fs.readFile(path.join(__dirname, 'resources/index.html'), (err, data) => {
                        if(err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                            res.end('Ошибка сервера');
                        }
                        else { 
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(data);
                        }
                    })
                    break;
                }
                case '/api/faculties' : {
                    await db.faculty.findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/pulpits' : {
                    await db.pulpit.findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/subjects' : {
                    await db.subject.findAll().then((results) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/teachers' : {
                    await db.teacher.findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/auditoriumstypes' : {
                    await db.auditoriumType.findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/auditoriums' : {
                    await db.auditorium.findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/auditoriums/scopes' : {
                    await db.auditorium.scope('between10And60').findAll().then((results) => {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    })
                    .catch((err) => {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    });

                    break;
                }
                case '/api/auditoriums/transaction' : {
                    db.updateCapacity();
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('Транзакция прошла!');
                    break;
                }
                default : {
                    const pathSegments = req.url.split('/').filter(segment => segment !== '');

                    if(pathSegments.length === 4 && pathSegments[0] === 'api' && pathSegments[1] === 'faculties' && pathSegments[3] === 'subjects') {
                        await db.faculty.findOne({
                            where: { FACULTY: decodeURIComponent(pathSegments[2])},
                            attributes: ['FACULTY'],
                            include: {
                                model: db.pulpit,
                                attributes: ['PULPIT'],
                                include: {
                                    model: db.subject,
                                    attributes: ['SUBJECT'],
                                }
                            }
                        }).then((results) => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(results));
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }

                    if(pathSegments.length === 4 && pathSegments[0] === 'api' && pathSegments[1] === 'auditoriumtypes' && pathSegments[3] === 'auditoriums') {
                        await db.auditoriumType.findOne({
                            where: { AUDITORIUM_TYPE: decodeURIComponent(pathSegments[2])},
                            attributes: ['AUDITORIUM_TYPE'],
                            include: {
                                model: db.auditorium,
                                attributes: ['AUDITORIUM'],
                            }
                        }).then((results) => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(results));
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }

                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
                    break;
                }
            }
            
            break;
        }
        case 'POST': {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            
            req.on('end', async () => {
                let parsedData;

                try {
                    parsedData = JSON.parse(data);
                }
                catch { 
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Ошибка при преобразовании данных!' }));
                }

                switch (req.url) {
                    case '/api/faculties' : {
                        await db.faculty.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    case '/api/pulpits' : {
                        await db.pulpit.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    case '/api/subjects' : {
                        await db.subject.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    case '/api/teachers' : {

                        await db.teacher.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    case '/api/auditoriumstypes' : {
                        await db.auditoriumType.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    case '/api/auditoriums' : {
                        await db.auditoriumType.create(parsedData).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data);
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
    
                        break;
                    }
                    default : {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))

                        break;
                    }
                }
            })
            break;
        }
        case 'PUT': {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            

            req.on('end', async () => {
                let parsedData;

                try {
                    parsedData = JSON.parse(data);
                }
                catch { 
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Ошибка при преобразовании данных!' }));
                }

                switch (req.url) {
                    case '/api/faculties' : {
                        await db.faculty.update(parsedData, { where: {FACULTY: parsedData.FACULTY} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case '/api/pulpits' : {
                        await db.pulpit.update(parsedData, { where: {PULPIT: parsedData.PULPIT} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case '/api/subjects' : {
                        await db.subject.update(parsedData, { where: {SUBJECT: parsedData.SUBJECT} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case '/api/teachers' : {
                        await db.teacher.update(parsedData, { where: {TEACHER: parsedData.TEACHER} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case '/api/auditoriumstypes' : {
                        await db.auditoriumType.update(parsedData, { where: {AUDITORIUM_TYPE: parsedData.AUDITORIUM_TYPE} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case 'api/auditoriums' : {
                        await db.auditorium.update(parsedData, { where: {AUDITORIUM: parsedData.AUDITORIUM} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(data); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
                        
                        break;
                    }
                    default : {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
                        
                        break;
                    }
                }
            });

            break;
        }
        case 'DELETE': {
            const pathSegments = req.url.split('/').filter(segment => segment !== '');
            if(pathSegments.length === 3 && pathSegments[0] === 'api')
            {
                pathSegments[2] = decodeURIComponent(pathSegments[2]);

                switch(pathSegments[1]) {
                    case 'faculties': {
                        const faculty = await db.faculty.findOne({
                            where: { FACULTY: pathSegments[2] }
                        });

                        if(!faculty)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти факультет' }));
                        }

                        await db.faculty.destroy({where: {FACULTY: pathSegments[2]}, }).then(() => {
                            
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(faculty)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case 'pulpits':{
                        const pulpit = await db.pulpit.findOne({
                            where: { PULPIT: pathSegments[2] }
                        });

                        
                        if(!pulpit)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти кафедру' }));
                        }
                        
                        await db.pulpit.destroy({where: {PULPIT: pathSegments[2]} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(pulpit)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case 'subjects': {
                        const subject = await db.subject.findOne({
                            where: { SUBJECT: pathSegments[2] }
                        });

                        if(!subject)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти дисциплину' }));
                        }

                        await db.subject.destroy({where: {SUBJECT: pathSegments[2]} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(subject)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case 'teachers': {
                        const teacher = await db.teacher.findOne({
                            where: { TEACHER: pathSegments[2] }
                        });

                        if(!teacher)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти преподавателя' }));
                        }

                        await db.teacher.destroy({where: {TEACHER: pathSegments[2]} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(teacher)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });
                        
                        break;
                    }
                    case 'auditoriumstypes':{
                        const auditoriumType = await db.auditoriumType.findOne({
                            where: { AUDITORIUM_TYPE: pathSegments[2] }
                        });

                        if(!auditoriumType)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти тип аудитории' }));
                        }


                        await db.auditoriumType.destroy({where: {AUDITORIUM_TYPE: pathSegments[2]} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(auditoriumType)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    case 'auditoriums': {
                        const auditorium = await db.auditorium.findOne({
                            where: { AUDITORIUM: pathSegments[2] }
                        });

                        if(!auditorium)
                        { 
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: 'Не удалось найти аудиторию' }));
                        }

                        await db.auditorium.destroy({where: {AUDITORIUM: pathSegments[2]} }).then(() => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(auditorium)); //
                        })
                        .catch((err) => {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        });

                        break;
                    }
                    default: {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
                        
                        break;
                    }
                }     
            }
            else 
            {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
            }

            break;
        }
        default: {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
            break;
        }
    }
});

server.listen(3000, () => {
    console.log("Сервер начал прослушивание запросов на порту 3000");
});