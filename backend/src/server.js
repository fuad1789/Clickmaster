import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import cluster from "cluster";
import os from "os";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import clickRoutes from "./routes/clickRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Determine the number of CPU cores
const numCPUs = os.cpus().length;

// Define app outside the worker scope so it can be exported
let app = null;

// Implement clustering for better performance
if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers based on CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process
  app = express();
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));

  // Rate limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to all requests
  app.use(apiLimiter);

  // Routes
  app.use("/api/users", userRoutes);
  app.use("/api/clicks", clickRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/auth", authRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
  });

  // MongoDB Connection
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017")
    .then(() => {
      console.log("Connected to MongoDB");

      // Create HTTP server - ensure app is not null
      if (app) {
        const server = createServer(app);

        // Start the server with error handling for port conflicts
        server
          .listen(PORT, () => {
            console.log(
              `Worker ${process.pid} started and listening on port ${PORT}`
            );
          })
          .on("error", (err) => {
            if (err.code === "EADDRINUSE") {
              // If port is in use, try another port
              const newPort = Number(PORT) + 1;
              console.log(
                `Port ${PORT} is in use, trying port ${newPort} instead`
              );
              server
                .listen(newPort, () => {
                  console.log(
                    `Worker ${process.pid} started and listening on port ${newPort}`
                  );
                })
                .on("error", (err) => {
                  console.error(
                    "Failed to start server on alternative port:",
                    err
                  );
                  process.exit(1);
                });
            } else {
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
export default app;
