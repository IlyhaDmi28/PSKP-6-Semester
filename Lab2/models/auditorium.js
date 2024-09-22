const { Sequelize, DataTypes, Op } = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('auditorium', {
        AUDITORIUM: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        AUDITORIUM_NAME: {
            type: DataTypes.STRING(200)
        },
        AUDITORIUM_CAPACITY: {
            type: DataTypes.INTEGER
        },
        AUDITORIUM_TYPE: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    }, {
        tableName: 'AUDITORIUM',
        timestamps: false,
        scopes: {
            between10And60: {
                where: { AUDITORIUM_CAPACITY: { [Op.between]: [10, 60] } }
            }
        }
    });
};
