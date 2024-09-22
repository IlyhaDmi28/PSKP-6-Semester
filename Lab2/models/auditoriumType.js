const { sequelize, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('auditoriumType', {
        AUDITORIUM_TYPE: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        AUDITORIUM_TYPENAME: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    }, {
        tableName: 'AUDITORIUM_TYPE',
        timestamps: false
    });
};
