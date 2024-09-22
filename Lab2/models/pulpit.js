const { sequelize, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('pulpit', {
        PULPIT: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        PULPIT_NAME: {
            type: DataTypes.STRING(100)
        },
        FACULTY: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'PULPIT',
        timestamps: false
    });
};

