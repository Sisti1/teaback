const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/user");


exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({ user_id: userId, products: [], total: 0 });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // Push new product with quantity and total price
    const itemTotal = product.price * 1;

    cart.products.push({
      product: product._id,
      quantity: 1,
      total: itemTotal,
    });

    // Update cart total
    cart.updatedAt = new Date();
    cart.total = cart.products.reduce((sum, item) => sum + item.total, 0);

    await cart.save();

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body; // <-- fix here

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array of objects" });
    }

    const userId = req.userId;
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedProducts = items.map(item => ({
      product: item.product,
      quantity: item.quantity || 1
    }));

    cart.products = updatedProducts;
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
      const cart = await Cart.findOne({ user_id: userId }).populate('products.product');
  
      if (!cart) {
        return res.status(200).json({ cart: { products: [] } });
      }
  
      return res.status(200).json({ cart });
    } catch (error) {
      console.error("Get Cart Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  