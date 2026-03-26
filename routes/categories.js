var express = require('express');
var router = express.Router();
const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');

/* GET categories listing. */
router.get('/', async function (req, res, next) {
    try {
        let dataCategories = await Category.findAll({
            where: { isDeleted: false }
        });
        res.send(dataCategories);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await Category.findByPk(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

router.get('/:id/products', async function (req, res, next) {
    try {
        let id = req.params.id;
        let category = await Category.findByPk(id);
        if (category && !category.isDeleted) {
            let products = await Product.findAll({
                where: { CategoryId: id, isDeleted: false }
            });
            res.send(products);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/', async function (req, res, next) {
    try {
        let newCate = await Category.create({
            name: req.body.name,
            slug: slugify(req.body.name, { lower: true, replacement: '-' }),
            image: req.body.image || "https://placeimg.com/640/480/any"
        });
        res.send(newCate);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let category = await Category.findByPk(id);
        if (!category || category.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        await category.update(req.body);
        res.send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let category = await Category.findByPk(id);
        if (!category || category.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        await category.update({ isDeleted: true });
        res.send(category);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

module.exports = router;

