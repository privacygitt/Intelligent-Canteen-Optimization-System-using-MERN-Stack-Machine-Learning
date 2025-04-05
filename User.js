const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, enum: ["student", "staff", "admin"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);
