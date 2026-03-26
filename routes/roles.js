var express = require("express");
var router = express.Router();

let Role = require("../models/Role");

router.get("/", async function (req, res, next) {
    let roles = await Role.findAll({ where: { isDeleted: false } });
    res.send(roles);
});

router.get("/:id", async function (req, res, next) {
    try {
        let result = await Role.findOne({ where: { id: req.params.id, isDeleted: false } });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});

router.post("/", async function (req, res, next) {
    try {
        let newItem = await Role.create({
            name: req.body.name,
            description: req.body.description || ""
        });
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).send({ message: "id not found" });
        }
        await role.update(req.body);
        res.send(role);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).send({ message: "id not found" });
        }
        await role.update({ isDeleted: true });
        res.send(role);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;