const mongoose = require("mongoose")

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ["Salatlar", "Asosiy", "Ichimliklar", "Desertlar"]
    },
    available: {
        type: Boolean,
        default: true
    }
})

const Menu = mongoose.model("Menu", menuSchema)

module.exports = Menu
