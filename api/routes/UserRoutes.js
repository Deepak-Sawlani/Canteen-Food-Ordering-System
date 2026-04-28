const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");


// POST /api/user/login
router.post("/login", async (req, res) => {
  const { name, email, address, mobile } = req.body;

  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update info if changed
      existingUser.name = name;
      existingUser.address = address;
      existingUser.mobile = mobile;
      await existingUser.save();
      return res.json(existingUser);
    } else {
      const newUser = new User({ name, email, address, mobile });
      await newUser.save();
      return res.json(newUser);
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});


// PUT /api/user/:id — Update user
router.put("/:id", async (req, res) => {
  const { name, email, mobile, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, address },
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

//DELETE /api/user/:id — Delete user and related orders
router.delete("/:id", async (req, res) => {
  try {
    const { email } = req.body;

    await User.findByIdAndDelete(req.params.id);
    await Order.deleteMany({ email });

    res.json({ message: "User and related orders deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});
 module.exports = router;