const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Product = require('./Product');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    reserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    soldCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true
});

// Associations
Inventory.belongsTo(Product, { foreignKey: { name: 'ProductId', allowNull: false, unique: true }, as: 'product' });
Product.hasOne(Inventory, { foreignKey: 'ProductId', as: 'inventory' });

module.exports = Inventory;
