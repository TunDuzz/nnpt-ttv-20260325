const sequelize = require('./db');
const Role = require('../models/Role');
const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product');

async function syncDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all models
        await sequelize.sync({ force: false, alter: true });
        console.log('Tables synchronized successfully.');

        // Seed Default Role if not exists
        const [role, created] = await Role.findOrCreate({
            where: { id: 1 },
            defaults: { name: 'Admin', description: 'Administrator' }
        });
        if (created) console.log('Created default Admin role.');

        const [userRole, created2] = await Role.findOrCreate({
            where: { id: 2 },
            defaults: { name: 'User', description: 'Regular User' }
        });
        if (created2) console.log('Created default User role.');

    } catch (error) {
        console.error('Unable to connect or sync database:', error);
    } finally {
        await sequelize.close();
    }
}

syncDB();
