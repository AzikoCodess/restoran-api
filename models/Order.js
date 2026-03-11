const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Menu",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "delivered"],
        default: "pending"
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)

module.exports = Order
