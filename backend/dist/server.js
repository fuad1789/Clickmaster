"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_1 = require("http");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
// Import routes
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const clickRoutes_1 = __importDefault(require("./routes/clickRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Load environment variables
dotenv_1.default.config();
// Determine the number of CPU cores
const numCPUs = os_1.default.cpus().length;
// Define app outside the worker scope so it can be exported
let app = null;
// Implement clustering for better performance
if (cluster_1.default.isPrimary) {
    console.log(`Master process ${process.pid} is running`);
    // Fork workers based on CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster_1.default.fork();
    });
}
else {
    // Worker process
    app = (0, express_1.default)();
    const PORT = process.env.PORT || 5000;
    // Middleware
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)("dev"));
    // Rate limiting
    const apiLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
    });
    // Apply rate limiting to all requests
    app.use(apiLimiter);
    // Routes
    app.use("/api/users", userRoutes_1.default);
    app.use("/api/clicks", clickRoutes_1.default);
    app.use("/api/leaderboard", leaderboardRoutes_1.default);
    app.use("/api/auth", authRoutes_1.default);
    // Health check endpoint
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "OK", message: "Server is running" });
    });
    // MongoDB Connection
    mongoose_1.default
        .connect(process.env.MONGODB_URI || "mongodb://localhost:27017")
        .then(() => {
        console.log("Connected to MongoDB");
        // Create HTTP server - ensure app is not null
        if (app) {
            const server = (0, http_1.createServer)(app);
            // Start the server with error handling for port conflicts
            server
                .listen(PORT, () => {
                console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
            })
                .on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    // If port is in use, try another port
                    const newPort = Number(PORT) + 1;
                    console.log(`Port ${PORT} is in use, trying port ${newPort} instead`);
                    server
                        .listen(newPort, () => {
                        console.log(`Worker ${process.pid} started and listening on port ${newPort}`);
                    })
                        .on("error", (err) => {
                        console.error("Failed to start server on alternative port:", err);
                        process.exit(1);
                    });
                }
                else {
                    console.error("Server error:", err);
                    process.exit(1);
                }
            });
        }
    })
        .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });
}
// Export app for testing
exports.default = app;
