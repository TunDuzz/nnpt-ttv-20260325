let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');

const publicKeyPath = path.join(__dirname, '..', 'keys', 'public.pem');

module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token) {
                res.status(401).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            
            // Read public key
            const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
            
            let result = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            
            if (result.exp * 1000 < Date.now()) {
                res.status(401).send({
                    message: "token da het han"
                })
                return;
            }
            let user = await userController.GetAnUserById(result.id);
            if (!user) {
                res.status(401).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            req.user = user;
            next()
        } catch (error) {
            res.status(401).send({
                message: "ban chua dang nhap"
            })
        }
    }
}