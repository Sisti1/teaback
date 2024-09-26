const express = require("express");
const router = express.Router();
const userController = require("../controllers/user_Controller");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Protected routes
router.get("/profile", authMiddleware.authenticateToken, userController.getUserProfile);
router.put("/profile", authMiddleware.authenticateToken, userController.updateUserProfile);

module.exports = router;
