"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPeriodClicks = exports.getFriendsLeaderboard = exports.getGlobalLeaderboard = void 0;
const User_1 = __importDefault(require("../models/User"));
// Get global leaderboard
const getGlobalLeaderboard = async (req, res) => {
    try {
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
        const users = await User_1.default.find({})
            .select(`displayName ${sortField} streak referralCount`)
            .sort({ [sortField]: -1 })
            .skip(skip)
            .limit(limit);
        // Get total count
        const total = await User_1.default.countDocuments();
        // Get user's rank if authenticated
        let userRank = null;
        if (req.user) {
            const userId = req.user._id;
            const user = await User_1.default.findById(userId);
            if (user) {
                // Count users with more clicks than the current user
                const betterUsers = await User_1.default.countDocuments({
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
    }
    catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getGlobalLeaderboard = getGlobalLeaderboard;
// Get friends leaderboard (users referred by the current user)
const getFriendsLeaderboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const referralCode = user.referralCode;
        // Find users who were referred by the current user
        const friends = await User_1.default.find({ referredBy: referralCode })
            .select("displayName totalClicks streak")
            .sort({ totalClicks: -1 });
        res.status(200).json({
            friends,
            total: friends.length,
        });
    }
    catch (error) {
        console.error("Friends leaderboard error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getFriendsLeaderboard = getFriendsLeaderboard;
// Reset daily, weekly, and monthly clicks (admin only)
const resetPeriodClicks = async (req, res) => {
    try {
        const { period } = req.params;
        if (!["daily", "weekly", "monthly"].includes(period)) {
            return res.status(400).json({ message: "Invalid period specified" });
        }
        const updateField = `${period}Clicks`;
        // Reset the specified period clicks for all users
        await User_1.default.updateMany({}, { $set: { [updateField]: 0 } });
        res.status(200).json({ message: `${period} clicks reset successfully` });
    }
    catch (error) {
        console.error("Reset period clicks error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.resetPeriodClicks = resetPeriodClicks;
