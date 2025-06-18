// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Order = require("../models/Order");

// // Update user info
// router.put("/:id", async (req, res) => {
//   const { name, email, mobile, address } = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(req.params.id, {
//       name,
//       email,
//       mobile,
//       address,
//     }, { new: true });

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update user" });
//   }
// });

// // Delete user info
// router.delete("/:id", async (req, res) => {
//   try {
//     // Delete user
//     await User.findByIdAndDelete(req.params.id);

//     // Also delete all orders linked to this user
//     await Order.deleteMany({ email: req.body.email });

//     res.json({ message: "User and related data deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete user data" });
//   }
// });

// // ✅ DELETE a user and their orders by ID + email
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email } = req.body;

//     // Delete orders associated with this user's email
//     await Order.deleteMany({ email });

//     // No user model to delete since you don't have a separate user collection
//     res.status(200).json({ message: "User and their orders deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to delete user", error: err.message });
//   }
// });
// module.exports = router;


















const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");

// POST /api/user/login
// router.post("/login", async (req, res) => {
//   const { name, email, address, mobile } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ name, email, address, mobile });
//     }
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


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
// WARNING: Deletes all users and their orders — use carefully!
// router.delete("/all", async (req, res) => {
//   try {
//     await User.deleteMany({});
//     await Order.deleteMany({});
//     res.json({ message: "All users and their orders deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete all users", error: err.message });
//   }
// });


 module.exports = router;
