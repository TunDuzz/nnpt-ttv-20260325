const { Sequelize } = require('sequelize');

const createDatabase = async () => {
    const sequelizeMaster = new Sequelize('master', 'sa', '123456', {
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

    try {
        await sequelizeMaster.authenticate();
        await sequelizeMaster.query("IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'NNPTUD-C4') CREATE DATABASE [NNPTUD-C4]");
        console.log("Database 'NNPTUD-C4' created or already exists.");
    } catch (err) {
        console.error("Error creating database:", err);
    } finally {
        await sequelizeMaster.close();
    }
};

module.exports = createDatabase;
