const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  address: String,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
