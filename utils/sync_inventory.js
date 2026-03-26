const sequelize = require('./db');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

async function syncInventory() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync Inventory model
        await Inventory.sync({ force: false, alter: true });
        console.log('Inventory table synchronized successfully.');

    } catch (error) {
        console.error('Unable to connect or sync database:', error);
    } finally {
        await sequelize.close();
    }
}

syncInventory();
