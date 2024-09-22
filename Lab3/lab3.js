const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { connect } = require('http2');
const prisma = new PrismaClient();

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
                    try {
                        const results = await prisma.faculty.findMany()
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }
                    break;
                }
                case '/api/pulpits' : {
                    try {
                        const results = await prisma.pulpit.findMany({
                            select: {
                                pulpit: true,
                                pulpit_name: true,
                                faculty: true,
                                _count: {
                                    select: { teacherRef: true }
                                }
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }
                    break;
                }
                case '/api/subjects' : {
                    try {
                        const results = await prisma.subject.findMany()
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/teachers' : {
                    try {
                        const results = await prisma.teacher.findMany()
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/auditoriumstypes' : {
                    try {
                        const results = await prisma.auditoriumType.findMany()
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/auditoriums' : {
                    try {
                        const results = await prisma.auditorium.findMany()
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/auditoriumsWithComp1' : {
                    try {
                        const results = await prisma.auditorium.findMany({
                            where: {
                                auditorium_type: 'ЛБ-К',
                                auditorium_name: { endsWith: '-1' }
                            },
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/puplitsWithoutTeachers' : {
                    try {
                        const results = await prisma.pulpit.findMany({
                            where: {
                                teacherRef: { none: {} }
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/pulpitsWithVladimir' : {
                    try {
                        const results = await prisma.pulpit.findMany({
                            where: {
                                teacherRef: {
                                    some: {
                                        teacher_name: { contains: 'Владимир' }
                                    }
                                }
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/auditoriumsSameCount' : {
                    try {
                        const results = await prisma.auditorium.groupBy({
                            by: ['auditorium_type', 'auditorium_capacity'],
                            _count: {
                              auditorium: true
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/fluent' : {
                    try {
                        const results = await prisma.auditorium.findUnique({
                            where: { auditorium: "206-1" }
                        }).AuditoriumTypeRef()
                        
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                    }

                    break;
                }
                case '/api/auditoriums/transaction' : {
                    try {
                        await prisma.$transaction(async prisma => {

                            await prisma.auditorium.updateMany({
                                data: {
                                    auditorium_capacity: {
                                        increment: 100
                                    }
                                }
                            });
                            throw new Error('Transaction rollback');
                            
                        });
                    } catch (err) {
                        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                        res.end(err.message);
                    }

                    break;
                }
                default : {
                    const pathSegments = req.url.split('/').filter(segment => segment !== '');

                    if(pathSegments.length === 4 && pathSegments[0] === 'api' && pathSegments[1] === 'faculties' && pathSegments[3] === 'subjects') {
                        console.log( decodeURIComponent(pathSegments[2]));
                        const results = await prisma.faculty.findMany({
                            where: { faculty: decodeURIComponent(pathSegments[2]) },
                            select: {
                                faculty: true,
                                pulpitRef: {
                                    select: {
                                        pulpit: true,
                                        subjectRef: { select: { subject_name: true } }
                                    }
                                }
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    else if(pathSegments.length === 4 && pathSegments[0] === 'api' && pathSegments[1] === 'auditoriumstypes' && pathSegments[3] === 'auditoriums') {
                        console.log( decodeURIComponent(pathSegments[2]));
                        const results = await prisma.auditoriumType.findMany({
                            where: { auditorium_type: decodeURIComponent(pathSegments[2]) },
                            select: {
                                auditorium_type: true,
                                auditoriumRef: { select: { auditorium: true } }
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(results));
                    }
                    else {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 404, errorMessage: 'Not Found(' }))
                    }
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
                        try {
                        const { FACULTY, FACULTY_NAME, PULPITS } = parsedData
                        
                        if(PULPITS === undefined) {
                            const result = await prisma.faculty.create({
                                data: {
                                    faculty: FACULTY,
                                    faculty_name: FACULTY_NAME,
                                }
                            });
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(result));
                        }
                        else {
                            const result = await prisma.faculty.create({
                                data: {
                                    faculty: FACULTY,
                                    faculty_name: FACULTY_NAME,
                                    pulpitRef: {
                                        createMany: {
                                        data: PULPITS.map(pulpitData => ({
                                            pulpit: pulpitData.PULPIT,
                                            pulpit_name: pulpitData.PULPIT_NAME,
                                        })),
                                    },
                                },
                            },
                            include: {
                                pulpitRef: true,
                            },
                            });
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(result));
                        }
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case '/api/pulpits' : {
                        const { PULPIT, PULPIT_NAME, FACULTY, FACULTY_NAME } = parsedData

                        try {
                        const result = await prisma.pulpit.create({
                            data: {
                                pulpit: PULPIT,
                                pulpit_name: PULPIT_NAME,
                                facultyRef: {
                                    connectOrCreate: {
                                        where: { faculty: FACULTY },
                                        create: {
                                            faculty: FACULTY,
                                            faculty_name: FACULTY_NAME 
                                        }
                                        
                                    }
                                }
                            },
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

                        break;
                    }
                    case '/api/subjects' : {
                        const { SUBJECT, SUBJECT_NAME, PULPIT } = parsedData
                        
                        try {
                        const result = await prisma.subject.create({
                            data: {
                                subject: SUBJECT,
                                subject_name: SUBJECT_NAME,
                                pulpitRef: {
                                    connect: { pulpit: PULPIT}
                                }

                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

                        break;
                    }
                    case '/api/teachers' : {
                        const { TEACHER, TEACHER_NAME, PULPIT } = parsedData

                        try {
                        const result = await prisma.teacher.create({
                            data: {
                                teacher: TEACHER,
                                teacher_name: TEACHER_NAME,
                                pulpitRef: PULPIT
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        
                        break;
                    }
                    case '/api/auditoriumstypes' : {
                        const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = parsedData
                        
                        try {
                        const result = await prisma.auditoriumType.create({
                            data: {
                                auditorium_type: AUDITORIUM_TYPE,
                                auditorium_typename: AUDITORIUM_TYPENAME
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        
                        break;
                    }
                    case '/api/auditoriums' : {
                        const { AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE } = parsedData
                        
                        try {
                        const result = await prisma.auditorium.create({
                            data: {
                                auditorium: AUDITORIUM,
                                auditorium_name: AUDITORIUM_NAME,
                                auditorium_capacity: AUDITORIUM_CAPACITY,
                                AuditoriumTypeRef: AUDITORIUM_TYPE
                            }
                        });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

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
                        try {
                        const { FACULTY, FACULTY_NAME } = parsedData
                       
                        const result = await prisma.faculty.update({
                            where: { faculty: FACULTY },
                            data: { faculty_name: FACULTY_NAME }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case '/api/pulpits' : {
                        try {
                        const { PULPIT, PULPIT_NAME, FACULTY } = parsedData
                       
                        const result = await prisma.pulpit.update({
                            where: { pulpit: PULPIT },
                            data: { 
                                pulpit_name: PULPIT_NAME,
                                faculty: FACULTY
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case '/api/subjects' : {
                        try {
                        const { SUBJECT, SUBJECT_NAME, PULPIT } = parsedData
                       
                        const result = await prisma.subject.update({
                            where: { subject: SUBJECT },
                            data: { 
                                subject_name: SUBJECT_NAME,
                                pulpit: PULPIT
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case '/api/teachers' : {
                        try {
                        const { TEACHER, TEACHER_NAME, PULPIT } = parsedData
                        
                        const result = await prisma.subject.update({
                            where: { teacher: TEACHER },
                            data: { 
                                teacher_name: TEACHER_NAME,
                                pulpit: PULPIT
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case '/api/auditoriumstypes' : {
                        try {
                        const { AUDITORIUM_TYPE, AUDITORIUM_TYPENAME } = parsedData
                       
                        const result = await prisma.auditoriumType.update({
                            where: { auditorium_type: AUDITORIUM_TYPE },
                            data: { auditorium_typename: AUDITORIUM_TYPENAME }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case 'api/auditoriums' : {
                        try {
                        const { AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE } = parsedData

                        const result = await prisma.auditorium.update({
                            where: { auditorium: AUDITORIUM },
                            data: { 
                                auditorium_name: AUDITORIUM_NAME,
                                auditorium_capacity: AUDITORIUM_CAPACITY,
                                auditorium_type: AUDITORIUM_TYPE
                            }
                        })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
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
                        try {
                        const result = await prisma.faculty.findUnique({ where: { faculty: pathSegments[2] } })
                        await prisma.faculty.delete({ where: { faculty: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        break;
                    }
                    case 'pulpits':{
                        try {

                        const result = await prisma.pulpit.findUnique({ where: { pulpit: pathSegments[2] } })
                        await prisma.pulpit.delete({ where: { pulpit: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

                        break;
                    }
                    case 'subjects': {
                        try {

                        const result = await prisma.subject.findUnique({ where: { subject: pathSegments[2] } })
                        await prisma.subject.delete({ where: { subject: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

                        break;
                    }
                    case 'teachers': {
                        try {

                        const result = await prisma.teacher.findUnique({ where: { teacher: pathSegments[2] } })
                        await prisma.teacher.delete({ where: { teacher: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }
                        
                        break;
                    }
                    case 'auditoriumstypes':{
                        try {

                        const result = await prisma.auditoriumType.findUnique({ where: { auditorium_type: pathSegments[2] } })
                        await prisma.auditoriumType.delete({ where: { auditorium_type: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

                        break;
                    }
                    case 'auditoriums': {
                        try {

                        const result = await prisma.auditorium.findUnique({ where: { auditorium: pathSegments[2] } })
                        await prisma.auditorium.delete({ where: { auditorium: pathSegments[2] } })
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(result));
                        } catch (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ errorCode: 500, errorMessage: err }));
                        }

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