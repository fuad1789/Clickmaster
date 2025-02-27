import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateReferralCode } from "../utils/referralCode";

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, displayName, referredBy } = req.body;

    if (!username || !password || !displayName) {
      return res
        .status(400)
        .json({ message: "Username, password, and display name are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate a unique referral code
    const referralCode = generateReferralCode();

    // Create new user
    const user = new User({
      username,
      password, // Will be hashed by the pre-save hook
      displayName,
      referralCode,
      referredBy: referredBy || null,
    });

    // If user was referred, increment referral count for the referrer
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });
      if (referrer) {
        referrer.referralCount += 1;
        // Give bonus points to referrer (optional feature)
        referrer.totalClicks += 10;
        await referrer.save();
      }
    }

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        totalClicks: user.totalClicks,
        referralCode: user.referralCode,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login time
    user.lastLoginAt = new Date();
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "30d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        totalClicks: user.totalClicks,
        referralCode: user.referralCode,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { displayName } = req.body;

    if (!displayName) {
      return res.status(400).json({ message: "Display name is required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.displayName = displayName;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        totalClicks: user.totalClicks,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
