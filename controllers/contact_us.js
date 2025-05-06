// controllers/contactController.js

const ContactUs = require('../models/contact_us'); // Import the Contact Us model

// Function to handle contact form submissions
exports.handleContactUs = async (req, res) => {
    const { name, emailAddress, feedback } = req.body;

    try {
        // Create a new contact message
        const newContact = new ContactUs({
            name,
            emailAddress,
            feedback
        });

        // Save the contact message to the database
        await newContact.save();

        res.status(201).json({ message: 'Contact message received successfully!' });
    } catch (error) {
        console.error('Error handling contact form submission:', error.message);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

// ✅ GET - retrieve all contact submissions
exports.getContactUsMessages = async (req, res) => {
    try {
        const messages = await ContactUs.find().sort({ createdAt: -1 }); // sorted by newest first
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching contact messages:', error.message);
        res.status(500).json({ error: 'Failed to fetch contact messages' });
    }
};