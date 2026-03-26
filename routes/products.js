var express = require('express');
var router = express.Router();
const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { Op } = require('sequelize');

/* GET products listing. */
router.get('/', async function (req, res, next) {
    try {
        let queries = req.query;
        let titleQ = queries.title ? queries.title : "";
        let minPrice = queries.min ? parseFloat(queries.min) : 0;
        let maxPrice = queries.max ? parseFloat(queries.max) : 1000000000;

        let result = await Product.findAll({
            where: {
                isDeleted: false,
                title: { [Op.like]: `%${titleQ}%` },
                price: { [Op.between]: [minPrice, maxPrice] }
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['name']
            }]
        });
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category', attributes: ['name'] }]
        });
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "ID NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

const Inventory = require('../models/Inventory');

router.post('/', async function (req, res, next) {
    try {
        let newProduct = await Product.create({
            title: req.body.title,
            slug: slugify(req.body.title, { lower: true, replacement: '-' }),
            price: req.body.price,
            description: req.body.description || "",
            images: req.body.images || ["https://i.imgur.com/R3iobJA.jpeg"],
            CategoryId: req.body.category
        });

        // Auto-create Inventory
        await Inventory.create({
            ProductId: newProduct.id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });

        res.send(newProduct);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let product = await Product.findByPk(id);
        if (!product || product.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        
        if (req.body.title) {
            req.body.slug = slugify(req.body.title, { lower: true, replacement: '-' });
        }
        
        await product.update(req.body);
        res.send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let product = await Product.findByPk(id);
        if (!product || product.isDeleted) {
            return res.status(404).send({ message: "ID NOT FOUND" });
        }
        await product.update({ isDeleted: true });
        res.send(product);
    } catch (error) {
        res.status(404).send({ message: "ID NOT FOUND" });
    }
});

module.exports = router;

