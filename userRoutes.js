const express = require("express");
const bcrypt = require("bcrypt"); // Import bcrypt
const User = require("../models/User");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, mobile, department } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword, role, mobile, department });
        await user.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "Invalid Credentials" });

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

        res.status(200).json({
            success: true,
            message: "Login Successful",
            user: {
              _id: user._id, // MongoDB ID
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              department: user.department,
              role: user.role
            }
          });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  });
  

module.exports = router;
