var express = require("express");
var router = express.Router();
let { validatedResult, CreateAnUserValidator, ModifyAnUserValidator } = require('../utils/validator')
const User = require("../models/User");
const Role = require("../models/Role");
let userController = require('../controllers/users')
let { CheckLogin } = require('../utils/authHandler')

router.get("/", CheckLogin, async function (req, res, next) {
    let users = await User.findAll({
        where: { isDeleted: false },
        include: [{ model: Role, as: 'role', attributes: ['name'] }]
    });
    res.send(users);
});

router.get("/:id", async function (req, res, next) {
    try {
        let result = await User.findOne({
            where: { id: req.params.id, isDeleted: false },
            include: [{ model: Role, as: 'role', attributes: ['name'] }]
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});

router.post("/", CreateAnUserValidator, validatedResult, async function (req, res, next) {
    try {
        let newItem = await userController.CreateAnUser(
            req.body.username, req.body.password, req.body.email, req.body.role,
            req.body.fullName, req.body.avatarUrl, req.body.status, req.body.loginCount);
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", ModifyAnUserValidator, validatedResult, async function (req, res, next) {
    try {
        let id = req.params.id;
        let user = await User.findByPk(id);

        if (!user) return res.status(404).send({ message: "id not found" });

        await user.update(req.body);
        
        let updated = await User.findByPk(id, {
            include: [{ model: Role, as: 'role', attributes: ['name'] }]
        });
        res.send(updated);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "id not found" });
        }
        await user.update({ isDeleted: true });
        res.send(user);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;