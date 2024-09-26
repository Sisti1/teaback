// routes/contact_us.js
const express = require('express');
const router = express.Router();

// Import the controller function
const { handleContactUs } = require('../controllers/contact_us');

// Define the POST route for handling contact form submissions
router.post('/submit', handleContactUs);

module.exports = router;
