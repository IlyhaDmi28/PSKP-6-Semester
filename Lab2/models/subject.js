const { sequelize, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('subject', {
        SUBJECT: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        SUBJECT_NAME: {
            type: DataTypes.STRING(50)
        },
        PULPIT: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'SUBJECT',
        timestamps: false
    });
};

