const redis = require('redis');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize("Lab6_PSKP", "Ilya", "bkmz",  {
    dialect: "mssql",
    host: "localhost",
    logging: false,
})

const users = sequelize.define("Users", {
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING(255)
    }
}, {
    tableName: 'Users',
    timestamps: false
});

module.exports = {
    users: users,
}

// const {Sequelize, DataTypes} = require('sequelize');

// class DBsequelize {
//     constructor(){
//         this.Model = Sequelize.Model;
//         this.sequelize = new Sequelize('Lab17NodeJS', 'sa', '1111', {
//             host: 'localhost',
//             dialect: 'mssql',
//             logging: false,
//             port:1433
//         });
        
//         this.users = this.sequelize.define('Users', {
//             username: {
//                 type: DataTypes.CHAR(20),
//                 allowNull: false,
//                 primaryKey: true
//             },
//             FIO: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             password: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             }
//         }, {
//             tableName: 'Users', // Название таблицы
//             timestamps: false // Если нет столбцов created_at и updated_at
//         });
//     }

//     async client_connect() {
//         try {
//             await this.sequelize.authenticate();
//             console.log('Соединение с базой данных установлено успешно.');
//             await this.sequelize.sync({ alter: true });
//             console.log('Модели успешно синхронизированы');
//         } catch (error) {
//             console.error('Ошибка подключения к базе данных:', error);
//         }
//     }
// }

// class DBredis{
//     constructor(){
//         this.RC = redis.createClient();
//     }

//     async client_connect(){
//         this.RC.connect();

//         this.RC.on('error', err => {
//           console.log('error ' + err);
//         });

//         this.RC.on('connect', () => {
//           console.log('redis ok');
//         });
//     }
// }

// module.exports = {
//     DBredis,
//     DBsequelize
// };