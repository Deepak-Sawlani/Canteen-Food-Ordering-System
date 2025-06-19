const express = require("express");
const router = express.Router();
const Order = require("../models/Order");


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // newest first
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
  }
});

module.exports = router;


router.post("/", async (req, res) => {
  try {
    const { name, email, items,mobile,address } = req.body;

    // Each item should include item name, price, and quantity
    const detailedItems = items.map(item => ({
      item: item.item,
      price: item.price, // store price at order time
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      name,
      email,
      mobile,
      address,
      items:detailedItems, // full item info stored
      createdAt: new Date(),
      status: "Order Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed" });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
});


// Cancel Order
router.put("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const deliveryDeadline = new Date(orderTime.getTime() + 30 * 60 * 1000);

    if (now > deliveryDeadline) {
      return res.status(400).json({ message: "Too late to cancel the order" });
    }

    order.status = "Order Cancelled";
    order.cancelledAt = now;
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel order", error });
  }
});




// ✅ Route 2: Get all orders for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Confirm Order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error confirming order" });
  }
});


module.exports = router;
