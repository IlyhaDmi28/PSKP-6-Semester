const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize("PSKP_Lab2", "Ilya", "bkmz",  {
    dialect: "mssql",
    host: "localhost",
    logging: false,
})

sequelize.addHook('beforeBulkDestroy', (data, options) => {
    console.log('Хук beforeDestroy вызван!');
})

const faculty = require('./faculty')(sequelize);
const pulpit = require('./pulpit')(sequelize);
const teacher = require('./teacher')(sequelize);
const subject = require('./subject')(sequelize);
const auditoriumType = require('./auditoriumType')(sequelize);
const auditorium = require('./auditorium')(sequelize);

faculty.hasMany(pulpit, {
    foreignKey: 'FACULTY',
    sourceKey: 'FACULTY'
});

pulpit.hasMany(teacher, {
    foreignKey: 'PULPIT',
    sourceKey: 'PULPIT'
});
pulpit.hasMany(subject, {
    foreignKey: 'PULPIT',
    sourceKey: 'PULPIT'
});

auditoriumType.hasMany(auditorium, {
    foreignKey: 'AUDITORIUM_TYPE',
    sourceKey: 'AUDITORIUM_TYPE'
})

faculty.beforeCreate((faculty, options) => {
    console.log('Хук beforeCreate вызван! Был добавлен факультет ' + faculty.dataValues.FACULTY);
});

faculty.afterCreate((faculty, options) => {
    console.log('Хук afterCreate вызван! Был добавлен факультет ' + faculty.dataValues.FACULTY);
});


async function updateCapacity() {
    const t = await sequelize.transaction();

    try {
        console.log("Начало транзакции!");

        await auditorium.update({ AUDITORIUM_CAPACITY: 0 }, { where: {}, transaction: t });
        await new Promise(resolve => setTimeout(resolve, 10000));
        await t.rollback();

        console.log("Конец транзакции!");
    } catch (error) {
        t.rollback();
        console.error(error.message);
    }
}

module.exports = {
    sequelize: sequelize,
    faculty: faculty,
    pulpit: pulpit,
    teacher: teacher,
    subject: subject,
    auditoriumType: auditoriumType,
    auditorium: auditorium,
    updateCapacity: updateCapacity
}