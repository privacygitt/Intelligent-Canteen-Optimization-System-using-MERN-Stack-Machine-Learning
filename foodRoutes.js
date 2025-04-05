const express = require("express");
const MenuItem = require("../models/Food");

const router = express.Router();

// Get all menu items
router.get("/", async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
});

// Get unique categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get menu items by category
router.get("/category", async (req, res) => {
  try {
    const category = req.query.category;
    const menuItems = category ? await MenuItem.find({ category }) : await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu items by category" });
  }
});

// Add new menu item
router.post("/", async (req, res) => {
  try {
      const { name, category, type, price, image, stock } = req.body;
      if (!name || !category || !type || !price || !image || stock === undefined) {
          return res.status(400).json({ error: "All fields are required" });
      }
      const newItem = new MenuItem({ name, category, type, price, image, stock });
      await newItem.save();
      res.status(201).json(newItem);
  } catch (error) {
      res.status(500).json({ error: "Failed to add menu item" });
  }
});

// Edit menu item
router.put("/:id", async (req, res) => {
  try {
      const { name, category, type, price, image, stock } = req.body;
      const updatedItem = await MenuItem.findByIdAndUpdate(
          req.params.id,
          { name, category, type, price, image, stock },
          { new: true }
      );
      res.json(updatedItem);
  } catch (error) {
      res.status(500).json({ error: "Failed to update menu item" });
  }
});

// Delete menu item
router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
});

// Update a menu item
router.put("/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});

module.exports = router;
