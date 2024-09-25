const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'The username is required']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Enter a valid email']
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// // Hash password before saving
// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// });

// Compare password
UserSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
