const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();


// Middleware
app.use(cors());

app.use(express.json());


// Routes
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

//app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Flower Canvas API is running"
    });
});


// Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});