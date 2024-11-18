const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth-route");
const adminProductsRouters = require("./routes/admin/products-routes")

dotenv.config();


const URL = process.env.MONGODB_URL || "mongodb://localhost:27017";

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
        origin: ["http://localhost:5174","http://localhost:5173", "https://your-frontend-domain.com"],
        methods: ["GET", "POST", "DELETE", "PUT"],
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

app.use("/api/auth", authRouter);
app.use("/api/admin/products",adminProductsRouters)

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).send("Route not found");
});

// Start server
const server = app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        mongoose.connection.close(() => {
            console.log("MongoDB connection closed.");
            process.exit(0);
        });
    });
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    process.exit(1);
});
