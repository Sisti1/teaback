const express = require("express");
const router = express.Router();
const cartController = require("../controllers/Cart");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes for cart
router.post("/add", authMiddleware.authenticateToken, cartController.addToCart);
router.post("/remove", authMiddleware.authenticateToken, cartController.removeFromCart);
router.get("/", authMiddleware.authenticateToken, cartController.getCart);

module.exports = router;

/*
addToCart: Adds a product to the user's cart.
removeFromCart: Removes a product from the user's cart.
getCart: Retrieves the current cart details for the user.
*/