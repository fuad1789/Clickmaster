import User from "../models/User.js";
import Click from "../models/Click.js";
import mongoose from "mongoose";

// Record a new click
export const recordClick = async (req, res) => {
  try {
    const userId = req.user._id;
    const { coordinates } = req.body;
    const { ipAddress, userAgent } = req.body;

    // Create a new click record
    const click = new Click({
      userId,
      coordinates,
      ipAddress,
      userAgent,
      timestamp: new Date(),
    });

    await click.save();

    // Update user's click counts
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update total clicks
    user.totalClicks += 1;

    // Update daily clicks
    user.dailyClicks += 1;

    // Update weekly clicks
    user.weeklyClicks += 1;

    // Update monthly clicks
    user.monthlyClicks += 1;

    // Check if this is a streak continuation
    const now = new Date();
    const lastClickDate = user.lastClickedAt
      ? new Date(user.lastClickedAt)
      : null;

    if (lastClickDate) {
      // Check if the last click was on a different day
      const isNewDay =
        now.getDate() !== lastClickDate.getDate() ||
        now.getMonth() !== lastClickDate.getMonth() ||
        now.getFullYear() !== lastClickDate.getFullYear();

      // Check if the last click was yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const isYesterday =
        yesterday.getDate() === lastClickDate.getDate() &&
        yesterday.getMonth() === lastClickDate.getMonth() &&
        yesterday.getFullYear() === lastClickDate.getFullYear();

      if (isNewDay && isYesterday) {
        // Increment streak if the user clicked yesterday
        user.streak += 1;

        // Give bonus points for streaks
        if (user.streak % 7 === 0) {
          // Weekly streak bonus
          user.totalClicks += 20;
        } else {
          // Daily streak bonus
          user.totalClicks += 5;
        }
      } else if (isNewDay && !isYesterday) {
        // Reset streak if the user didn't click yesterday
        user.streak = 1;
      }

      // Reset daily clicks if it's a new day
      if (isNewDay) {
        user.dailyClicks = 1;
      }
    } else {
      // First click ever, start streak
      user.streak = 1;
    }

    // Update last clicked time
    user.lastClickedAt = now;

    await user.save();

    res.status(200).json({
      message: "Click recorded successfully",
      totalClicks: user.totalClicks,
      dailyClicks: user.dailyClicks,
      streak: user.streak,
    });
  } catch (error) {
    console.error("Click recording error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's click history
export const getClickHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const clicks = await Click.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Click.countDocuments({ userId });

    res.status(200).json({
      clicks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get click history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get click statistics
export const getClickStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get clicks per hour for today
    const hourlyClicks = await Click.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
          timestamp: { $gte: today },
        },
      },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get clicks per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyClicks = await Click.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId.toString()),
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      totalClicks: user.totalClicks,
      dailyClicks: user.dailyClicks,
      weeklyClicks: user.weeklyClicks,
      monthlyClicks: user.monthlyClicks,
      streak: user.streak,
      hourlyClicks,
    });
  } catch (error) {
    console.error("Get click stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
