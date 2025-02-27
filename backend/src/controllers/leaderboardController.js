import mongoose from "mongoose";
import User from "../models/User.js";

// Get global leaderboard
export const getGlobalLeaderboard = async (req, res) => {
  try {
    // Make sure User is a valid Mongoose model
    const UserModel = mongoose.models.User || User;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const period = req.query.period || "all"; // all, daily, weekly, monthly

    let sortField = "totalClicks";

    // Determine which field to sort by based on the period
    switch (period) {
      case "daily":
        sortField = "dailyClicks";
        break;
      case "weekly":
        sortField = "weeklyClicks";
        break;
      case "monthly":
        sortField = "monthlyClicks";
        break;
      default:
        sortField = "totalClicks";
    }

    // Get top users
    const users = await UserModel.find({})
      .select(`displayName ${sortField} streak referralCount`)
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await UserModel.countDocuments();

    // Get user's rank if authenticated
    let userRank = null;
    if (req.user) {
      const userId = req.user._id;
      const user = await UserModel.findById(userId);

      if (user) {
        // Count users with more clicks than the current user
        const betterUsers = await UserModel.countDocuments({
          [sortField]: { $gt: user[sortField] },
        });

        userRank = betterUsers + 1; // Add 1 because ranks start at 1, not 0
      }
    }

    res.status(200).json({
      leaderboard: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      userRank,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get friends leaderboard (users referred by the current user)
export const getFriendsLeaderboard = async (req, res) => {
  try {
    // Make sure User is a valid Mongoose model
    const UserModel = mongoose.models.User || User;

    const userId = req.user._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const referralCode = user.referralCode;

    // Find users who were referred by the current user
    const friends = await UserModel.find({ referredBy: referralCode })
      .select("displayName totalClicks streak")
      .sort({ totalClicks: -1 });

    res.status(200).json({
      friends,
      total: friends.length,
    });
  } catch (error) {
    console.error("Friends leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset daily, weekly, and monthly clicks (admin only)
export const resetPeriodClicks = async (req, res) => {
  try {
    // Make sure User is a valid Mongoose model
    const UserModel = mongoose.models.User || User;

    const { period } = req.params;

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return res.status(400).json({ message: "Invalid period specified" });
    }

    const updateField = `${period}Clicks`;

    // Reset the specified period clicks for all users
    await UserModel.updateMany({}, { $set: { [updateField]: 0 } });

    res.status(200).json({ message: `${period} clicks reset successfully` });
  } catch (error) {
    console.error("Reset period clicks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
