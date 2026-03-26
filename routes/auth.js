let express = require('express');
let router = express.Router()
let userController = require('../controllers/users')
let bcrypt = require('bcrypt');
const { CheckLogin } = require('../utils/authHandler');
const { ChangePasswordValidator, validatedResult } = require('../utils/validator');
let jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');

const privateKeyPath = path.join(__dirname, '..', 'keys', 'private.pem');

router.post('/register', async function (req, res, next) {
    try {
        let { username, password, email } = req.body;
        // In SQL Server, Role ID is usually an integer. Assuming ID 1 exists as default.
        let newUser = await userController.CreateAnUser(username, password, email, 1)
        res.send(newUser)
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

router.post('/login', async function (req, res, next) {
    try {
        let { username, password } = req.body;
        let user = await userController.GetAnUserByUsername(username);
        if (!user) {
            res.status(401).send({
                message: "thong tin dang nhap khong dung"
            })
            return;
        }
        if (user.lockTime && user.lockTime > Date.now()) {
            res.status(403).send({
                message: "ban dang bi ban"
            })
            return;
        }
        if (bcrypt.compareSync(password, user.password)) {
            user.loginCount = 0;
            await user.save()
            
            // Read private key
            const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
            
            let token = jwt.sign({
                id: user.id
            }, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1d'
            })
            res.send(token)
        } else {
            user.loginCount++;
            if (user.loginCount >= 3) {
                user.loginCount = 0;
                user.lockTime = new Date(Date.now() + 3600 * 1000);
            }
            await user.save()
            res.status(401).send({
                message: "thong tin dang nhap khong dung"
            })
        }
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

router.post('/change-password', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    try {
        const { oldpassword, newpassword } = req.body;
        const user = req.user;
        
        if (!bcrypt.compareSync(oldpassword, user.password)) {
            return res.status(400).send({ message: "Mat khau cu khong dung" });
        }
        
        user.password = newpassword;
        await user.save(); // Sequelize hook beforeUpdate hashes this
        
        res.send({ message: "Doi mat khau thanh cong" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})

module.exports = router