import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    // Check if user exists
    const user = await User.findById((decoded as any).userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authentication failed" });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First run the regular auth middleware
    await auth(req, res, () => {
      // Check if user is admin
      if (req.user && req.user.isAdmin) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Access denied, admin privileges required" });
      }
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
