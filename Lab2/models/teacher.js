const { sequelize, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('teacher', {
        TEACHER: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        TEACHER_NAME: {
            type: DataTypes.STRING(50)
        },
        PULPIT: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'TEACHER',
        timestamps: false
    });
};
