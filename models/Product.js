const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ""
    },
    images: {
        type: DataTypes.TEXT,
        defaultValue: JSON.stringify(["https://i.imgur.com/R3iobJA.jpeg"]),
        get() {
            const rawValue = this.getDataValue('images');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('images', JSON.stringify(value));
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'category' });

module.exports = Product;
