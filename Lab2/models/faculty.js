const { sequelize, DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define("faculty", {
        FACULTY: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        FACULTY_NAME: {
            type: DataTypes.STRING(50)
        }
    }, {
        tableName: 'FACULTY',
        timestamps: false
    });
};
