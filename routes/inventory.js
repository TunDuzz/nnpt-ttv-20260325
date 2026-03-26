const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// GET all inventory records with Product details
router.get('/', async (req, res) => {
    try {
        const inventories = await Inventory.findAll({
            include: [{
                model: Product,
                as: 'product',
                attributes: ['title', 'price']
            }]
        });
        res.send(inventories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET inventory by ID with Product details
router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id, {
            include: [{
                model: Product,
                as: 'product',
                attributes: ['title', 'price']
            }]
        });
        if (!inventory) return res.status(404).send({ message: "Inventory not found" });
        res.send(inventory);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Add stock: {product: productId, quantity: number}
router.post('/add-stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ where: { ProductId: product } });
        if (!inventory) return res.status(404).send({ message: "Inventory for this product not found" });

        inventory.stock += parseInt(quantity);
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Remove stock: {product: productId, quantity: number}
router.post('/remove-stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ where: { ProductId: product } });
        if (!inventory) return res.status(404).send({ message: "Inventory for this product not found" });

        if (inventory.stock < quantity) {
            return res.status(400).send({ message: "Insufficient stock" });
        }

        inventory.stock -= parseInt(quantity);
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Reservation: {product: productId, quantity: number}
// Giảm stock và tăng reserved
router.post('/reservation', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ where: { ProductId: product } });
        if (!inventory) return res.status(404).send({ message: "Inventory for this product not found" });

        if (inventory.stock < quantity) {
            return res.status(400).send({ message: "Insufficient stock for reservation" });
        }

        inventory.stock -= parseInt(quantity);
        inventory.reserved += parseInt(quantity);
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Sold: {product: productId, quantity: number}
// Giảm reserved và tăng soldCount
router.post('/sold', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const inventory = await Inventory.findOne({ where: { ProductId: product } });
        if (!inventory) return res.status(404).send({ message: "Inventory for this product not found" });

        if (inventory.reserved < quantity) {
            return res.status(400).send({ message: "Insufficient reserved items for sale" });
        }

        inventory.reserved -= parseInt(quantity);
        inventory.soldCount += parseInt(quantity);
        await inventory.save();
        res.send(inventory);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
