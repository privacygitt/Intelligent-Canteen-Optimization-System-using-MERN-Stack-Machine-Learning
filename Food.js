const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },  // Snacks, Drinks, etc.
    type: { type: String, enum: ["Veg", "Non-Veg"], required: true },  // Veg / Non-Veg
    price: { type: Number, required: true },
    image: { type: String, required: true },  // Image URL
    stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Food", foodSchema);
