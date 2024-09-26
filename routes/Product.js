const express = require('express');
const router = express.Router();
const Product = require("../controllers/Product");
const authMiddleware = require("../middleware/authMiddleware");  // Import your authentication middleware

// Apply middleware to protect routes
router.post('/addProduct', authMiddleware.authenticateToken, Product.addProduct);
router.delete('/delProduct/:id', authMiddleware.authenticateToken, Product.delProduct);
router.put('/updateProduct/:id', authMiddleware.authenticateToken, Product.updateProduct);
router.get('/ProductList', authMiddleware.authenticateToken, Product.productList);

module.exports = router;
