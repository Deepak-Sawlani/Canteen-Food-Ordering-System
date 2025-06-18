// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   items: [String],
//   status: { type: String, default: "Pending" }
// });

// module.exports = mongoose.model("Order", orderSchema);















const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile:String,
  address:String,
  items: [
    {
      item: String,
      quantity: Number,
      price:Number
    },
  ],
   status: {
    type: String,
    default: "Order Pending",
   },
   cancelledAt:Date,
   deliveredAt:Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
