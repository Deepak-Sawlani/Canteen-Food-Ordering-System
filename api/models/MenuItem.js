const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
