const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/user");


exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({ user_id: userId, products: [] });
    }

    // Defensive check to avoid crashing if a product in cart is null
    const isAlreadyInCart = cart.products.some(prodId =>
      prodId && prodId.toString() === productId
    );

    if (isAlreadyInCart) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // Add product
    cart.products.push(productId);
    await cart.save();

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body; // items: [ObjectId]
    const userId = req.userId;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array of product IDs" });
    }

    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Only keep valid ObjectIds (you may optionally validate against DB here)
    cart.products = items.filter(Boolean);
    cart.updatedAt = Date.now();

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error during cart update:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.userId;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      const cart = await Cart.findOne({ user_id: userId });
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Filter safely
      cart.products = cart.products.filter(prodId =>
        prodId && prodId.toString() !== productId
      );
  
      await cart.save();
  
      res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
      console.error("Remove from Cart Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  // Get cart details
exports.getCart = async (req, res) => {
    try {
      const userId = req.userId;
  
      const cart = await Cart.findOne({ user_id: userId })
        .populate("products");
  
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Optional: Filter out null or deleted products from populated data
      const validProducts = cart.products.filter(product => product !== null);
  
      res.status(200).json({ cart: { ...cart.toObject(), products: validProducts } });
    } catch (error) {
      console.error("Get Cart Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  