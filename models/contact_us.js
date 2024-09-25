// models/contactUs.js
const mongoose = require("mongoose");

const contactUsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
