const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const productRouter = require("./routes/Product");
const contactUsRouter = require("./routes/contact_us");
const cartRoutes = require("./routes/Cart");
const orderRoutes = require("./routes/Orders");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "🛍️ Tea Store API is working!" });
});

// API Routes
app.use("/product", productRouter);
app.use("/contact", contactUsRouter);
app.use("/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
