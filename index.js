const express = require("express");

const https = require('https');
const fs = require('fs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
// Import routes
const productRouter = require("./routes/Product");
const contactUsRouter = require("./routes/contact_us");
const cartRoutes = require("./routes/Cart");
const orderRoutes = require("./routes/Orders");
const userRoutes = require("./routes/userRoutes");  // Adjust the path if necessary


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://Srishti:keshav123@cluster0.u87vkyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to the database"))
.catch((err) => console.error("Database connection error:", err));

// Check if the API is working
app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

// Use routes
app.use("/product", productRouter);
app.use("/contact", contactUsRouter);
app.use("/cart", cartRoutes);
app.use("/api/users", userRoutes);  // This will make routes like /api/users/register and /api/users/login accessible

app.use("/api/orders", orderRoutes);  // Use consistent path for order routes

const sslOptions = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// Start HTTPS Server
https.createServer(sslOptions, app).listen(5200, () => {
  console.log(`🚀 HTTPS Server running at https://localhost:${5200}`);
  
});
