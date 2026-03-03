const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Get all products (General or for specific seller)
router.get('/', async (req, res) => {
    try {
        const sellerId = req.query.sellerId;
        const filter = sellerId ? { sellerId } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add Product
router.post('/', auth, async (req, res) => {
    try {
        const product = new Product({ ...req.body, sellerId: req.user.id });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Product
router.put('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, sellerId: req.user.id },
            req.body,
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Product
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
        if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
