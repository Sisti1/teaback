const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'Keshav-is-my-love';  // Ensure this is set in your environment variables

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.error("Error during user registration:", error);  // Log the error details
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Fetch user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

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
        const userId = req.userId;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
