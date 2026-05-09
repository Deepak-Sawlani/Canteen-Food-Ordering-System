require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");

const app = express();
app.use(cors({
    origin: "*",  // Yahan apna Vercel link paste karein
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
//app.use(express.json());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log("Database Connection Error: ", err));

app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//app.listen(5000, () => console.log("Server running on port 5000"));
module.exports = app;