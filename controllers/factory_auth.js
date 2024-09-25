const User = require("../models/user");  // Assuming your user model file is named 'User.js'
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT secret key
const JWT_SECRET = "your_secret_key";  // Replace this with an environment variable in production

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// User login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Fetch user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;  // Assuming userId is set in the middleware

        // Fetch user details
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;  // Assuming userId is set in the middleware
        const updates = req.body;

        // Update user details
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
