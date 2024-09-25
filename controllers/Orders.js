const Order = require("../models/Orders");
const Cart = require("../models/Cart");
const User = require("../models/user");

// Place an order
exports.placeOrder = async (req, res) => {
    try {
        const userId = req.userId; // User ID from auth middleware
        const { status } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ user_id: userId }).populate("products");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty or not found" });
        }

        // Calculate total amount
        const totalAmount = cart.products.reduce((acc, product) => acc + product.price, 0);

        // Create a new order
        const newOrder = new Order({
            user_id: userId,
            order_date: new Date(),
            cart: cart._id,
            total_amount: totalAmount,
            status: status || "pending",
        });

        // Save the order and clear the cart
        await newOrder.save();
        cart.products = [];
        await cart.save();

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId; // User ID from auth middleware

        // Find all orders for the user
        const orders = await Order.find({ user_id: userId }).populate({
            path: "cart",
            populate: {
                path: "products"
            }
        });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get order details by order ID
exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Find the order by ID
        const order = await Order.findById(orderId).populate({
            path: "cart",
            populate: {
                path: "products"
            }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
