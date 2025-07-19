const Cart = require("../models/Cart");
const Product = require("../models/Product");
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    console.log("🚀 Add to Cart Triggered");
    console.log("🧾 Incoming Product ID:", productId);
    console.log("👤 Authenticated User ID:", userId);

    if (!productId) {
      console.warn("⚠️ Product ID missing in request body.");
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      console.warn("❌ Product not found in database.");
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      console.log("🛒 No existing cart found. Creating a new one...");
      cart = new Cart({
        user_id: userId,
        products: [],
        total: 0,
      });
    }

    const existingItemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity and total for the existing item
      cart.products[existingItemIndex].quantity += 1;
      cart.products[existingItemIndex].total =
        cart.products[existingItemIndex].quantity * product.price;
      console.log(
        `🔁 Increased quantity for product: ${product.product_name} to ${cart.products[existingItemIndex].quantity}`
      );
    } else {
      // Add new item
      const itemTotal = product.price;
      cart.products.push({
        product: product._id,
        quantity: 1,
        total: itemTotal,
      });
      console.log(`➕ Added new product to cart: ${product.product_name} | ₹${itemTotal}`);
    }

    // Recalculate cart total
    cart.total = cart.products.reduce((sum, item) => sum + item.total, 0);
    cart.updatedAt = new Date();

    await cart.save();

    console.log("✅ Product added/updated successfully. Cart saved.");
    res.status(200).json({ message: "Product added to cart", cart });

  } catch (error) {
    console.error("❗ Error in addToCart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Update entire cart
exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.userId;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Items must be an array" });
    }

    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const updatedProducts = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error(`Product not found: ${item.product}`);

        const quantity = item.quantity || 1;
        return {
          product: product._id,
          quantity,
          total: product.price * quantity,
        };
      })
    );

    cart.products = updatedProducts;
    cart.total = updatedProducts.reduce((sum, item) => sum + item.total, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove product from cart
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

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    cart.total = cart.products.reduce((sum, item) => sum + item.total, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ user_id: userId }).populate('products.product');

    if (!cart) {
      return res.status(200).json({ cart: { products: [], total: 0 } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
