const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      category: { type: String, required: true },  // Add category here
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalAmount: { type: Number, required: true },
  user: { type: String, required: true },
  paymentMethod: { type: String, enum: ["COD", "Online Payment"], required: true },
  status: {
    type: String,
    enum: ["Pending", "Preparing", "Ready for Pickup", "Completed"],
    default: "Pending"
  },
  preOrderDate: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
