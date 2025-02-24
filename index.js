const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth-route");
const adminProductsRouters = require("./routes/admin/products-routes")
const userProductRouter = require("./routes/user/products-routes-user")
const cartRouter = require("./routes/user/cart-routes")
const addressRouter = require("./routes/user/address-routes")
const orderRouter = require('./routes/user/orders-router')
const adminOrders = require("./routes/admin/order-router");
const reviewRouter = require('./routes/reviewRouter')
const { fetchUserPurchaseProducts } = require("./controllers/review-controller");
const { searchProducts } = require("./controllers/search-controller");




const URL = process.env.MONGODB_URL

// console.log(process.env.MONGODB_URL)


// Database connection
mongoose
    .connect(URL)
    .then(() => console.log("DB connected"))
    .catch((err) => {
        console.log("DB connection failed: ", err);
        process.exit(1); // Exit process if DB connection fails
    });

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
    cors({
        origin: ['https://mern-eccomerse.netlify.app' , 'http://localhost:5173','http://localhost:5176'],
        // origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.get('/fetchUserPurchaseProducts/:userId',fetchUserPurchaseProducts)

app.use("/api/auth", authRouter);
app.use("/api/admin/products",adminProductsRouters)
app.use("/api/user/products" , userProductRouter);
app.use("/api/user/cart" ,cartRouter )
app.use('/api/user/order',orderRouter)
app.use("/api/user/address",addressRouter)
app.use("/api/admin/adminGetOrders",adminOrders)
app.use("/api/reviews" , reviewRouter)
app.get("/api/search/:keyword", searchProducts)


// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).send("Route not found");
});

// Start server
const server = app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

// Graceful shutdown
process.on("SIGINT", () => {
    // console.log("Shutting down gracefully...");
    server.close(() => {
        mongoose.connection.close(() => {
            // console.log("MongoDB connection closed.");
            process.exit(0);
        });
    });
});

process.on("unhandledRejection", (err) => {
    // console.error("Unhandled Promise Rejection:", err);
    process.exit(1);
});
