import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

// Create a rate limiter specifically for click actions
// This is more strict than the general API rate limiter
export const clickRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 3, // limit each IP to 3 clicks per second
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many clicks, please slow down",
  },
  keyGenerator: (req: Request) => {
    // Use both IP and user ID for rate limiting
    // This prevents users from bypassing the limit by using multiple accounts
    return `${req.ip}-${req.user?._id || "anonymous"}`;
  },
});

// Additional click validation middleware
export const validateClick = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if coordinates are provided
    if (
      !req.body.coordinates ||
      typeof req.body.coordinates.x !== "number" ||
      typeof req.body.coordinates.y !== "number"
    ) {
      return res.status(400).json({ message: "Invalid click coordinates" });
    }

    // Check if the click is within reasonable bounds (prevent fake clicks)
    const { x, y } = req.body.coordinates;
    if (x < 0 || y < 0 || x > 5000 || y > 5000) {
      return res
        .status(400)
        .json({ message: "Click coordinates out of bounds" });
    }

    // Add IP address to the request body
    req.body.ipAddress = req.ip;

    // Add user agent to the request body
    req.body.userAgent = req.headers["user-agent"] || "unknown";

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid click data" });
  }
};
