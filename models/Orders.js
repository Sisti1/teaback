const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order_date: {
        type: Date,
        required: true,
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }],
    total_amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Order", OrderSchema);
