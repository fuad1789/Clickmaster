import User from "../models/User.js";
import { validateReferralCode } from "../utils/referralCode.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let query = {};

    // Add search functionality
    if (search) {
      query = {
        $or: [
          { displayName: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
          { referralCode: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("-__v")
      .sort({ totalClicks: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, isAdmin, totalClicks } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (displayName) user.displayName = displayName;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;
    if (totalClicks !== undefined) user.totalClicks = totalClicks;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Apply referral code
export const applyReferralCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ message: "Referral code is required" });
    }

    // Validate referral code format
    if (!validateReferralCode(referralCode)) {
      return res.status(400).json({ message: "Invalid referral code format" });
    }

    // Get current user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a referral
    if (user.referredBy) {
      return res.status(400).json({ message: "You already have a referral" });
    }

    // Check if user is trying to refer themselves
    if (user.referralCode === referralCode) {
      return res.status(400).json({ message: "You cannot refer yourself" });
    }

    // Find referrer
    const referrer = await User.findOne({ referralCode });

    if (!referrer) {
      return res.status(404).json({ message: "Referral code not found" });
    }

    // Update user with referral
    user.referredBy = referralCode;
    await user.save();

    // Update referrer's referral count and give bonus
    referrer.referralCount += 1;
    referrer.totalClicks += 10; // Bonus for referral
    await referrer.save();

    // Give bonus to the referred user
    user.totalClicks += 5; // Bonus for being referred
    await user.save();

    res.status(200).json({
      message: "Referral code applied successfully",
      bonusClicks: 5,
      totalClicks: user.totalClicks,
    });
  } catch (error) {
    console.error("Apply referral code error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
