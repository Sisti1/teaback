const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/user");

// Add a product to the cart
exports.addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId; // User ID from auth middleware

        // Find the user's cart
        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            // If no cart exists for the user, create one
            cart = new Cart({ user_id: userId, products: [] });
        }

        // Add product to cart if it doesn't already exist
        if (!cart.products.includes(productId)) {
            cart.products.push(productId);
            await cart.save();
            return res.status(200).json({ message: "Product added to cart", cart });
        } else {
            return res.status(400).json({ message: "Product already in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.userId; // User ID from auth middleware

        // Find the user's cart
        let cart = await Cart.findOne({ user_id: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(product => product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get cart details
exports.getCart = async (req, res) => {
    try {
        const userId = req.userId; // User ID from auth middleware

        // Find the user's cart
        const cart = await Cart.findOne({ user_id: userId }).populate("products");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
