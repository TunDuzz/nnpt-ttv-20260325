const User = require('../models/User');

module.exports = {
    CreateAnUser: async function (username, password, email, roleId,
        fullName, avatarUrl, status, loginCount) {
        let newItem = await User.create({
            username: username,
            password: password,
            email: email,
            fullName: fullName || "",
            avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
            status: status || false,
            RoleId: roleId,
            loginCount: loginCount || 0
        });
        return newItem;
    },
    GetAnUserByUsername: async function (username) {
        return await User.findOne({
            where: {
                isDeleted: false,
                username: username
            }
        });
    }, GetAnUserById: async function (id) {
        return await User.findOne({
            where: {
                isDeleted: false,
                id: id
            }
        });
    }
}