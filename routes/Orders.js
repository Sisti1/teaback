const express = require("express");
const router = express.Router();
const orderController = require("../controllers/Orders");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes for orders
router.post("/place", authMiddleware.authenticateToken, orderController.placeOrder);
router.get("/", authMiddleware.authenticateToken, orderController.getUserOrders);
router.get("/:orderId", authMiddleware.authenticateToken, orderController.getOrderDetails);

module.exports = router;

/*
placeOrder: Places an order for the user by calculating the total amount from the cart.
getUserOrders: Fetches all orders for the user.
getOrderDetails: Fetches details of a specific order by order ID.
*/