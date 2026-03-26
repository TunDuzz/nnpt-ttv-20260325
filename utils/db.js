const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('NNPTUD-C4', 'sa', '123456', {
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
});

module.exports = sequelize;
