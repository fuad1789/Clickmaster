import express from "express";
import {
  getGlobalLeaderboard,
  getFriendsLeaderboard,
  resetPeriodClicks,
} from "../controllers/leaderboardController.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/leaderboard/global - Get global leaderboard
router.get("/global", getGlobalLeaderboard);

// GET /api/leaderboard/friends - Get friends leaderboard
router.get("/friends", auth, getFriendsLeaderboard);

// POST /api/leaderboard/reset/:period - Reset period clicks (admin only)
router.post("/reset/:period", adminAuth, resetPeriodClicks);

export default router;
