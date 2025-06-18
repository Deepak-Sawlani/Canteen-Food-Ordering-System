const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/canteen", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/user", userRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
