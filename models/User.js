const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const bcrypt = require('bcrypt');
const Role = require('./Role');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    fullName: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    avatarUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://i.sstatic.net/l60Hf.png"
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    loginCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lockTime: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            if (user.password) {
                const salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, salt);
            }
        },
        beforeUpdate: (user) => {
            if (user.changed('password')) {
                const salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, salt);
            }
        }
    }
});

User.belongsTo(Role, { foreignKey: 'RoleId', as: 'role' });

module.exports = User;
