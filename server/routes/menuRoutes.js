const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// Get all menu items
router.get("/", async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
});

// Add new menu item
router.post("/", async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.json({ message: "Item added" });
});

// ✅ Delete menu item by ID
router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;
