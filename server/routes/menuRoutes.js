// // const express = require("express");
// // const router = express.Router();
// // const MenuItem = require("../models/MenuItem");

// // router.get("/", async (req, res) => {
// //   const items = await MenuItem.find();
// //   res.json(items);
// // });

// // router.post("/", async (req, res) => {
// //   const newItem = new MenuItem(req.body);
// //   await newItem.save();
// //   res.json({ message: "Item added" });
// // });

// // module.exports = router;

















// const express = require("express");
// const router = express.Router();
// const MenuItem = require("../models/MenuItem");

// // GET all menu items
// router.get("/", async (req, res) => {
//   const items = await MenuItem.find();
//   res.json(items);
// });

// // POST a new menu item with name formatting
// router.post("/", async (req, res) => {
//   let { name, price, description } = req.body;

//   // Clean and format name
//   name = name.trim(); // remove leading/trailing spaces
//   name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(); // capitalize first letter

//   const newItem = new MenuItem({
//     name,
//     price,
//     description,
//   });

//   await newItem.save();
//   res.json({ message: "Item added" });
// });

// module.exports = router;


































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
