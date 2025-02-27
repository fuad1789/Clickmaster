import express from "express";
import {
  recordClick,
  getClickHistory,
  getClickStats,
} from "../controllers/clickController.js";
import { auth } from "../middleware/auth.js";
import {
  clickRateLimiter,
  validateClick,
} from "../middleware/clickRateLimiter.js";

const router = express.Router();

// POST /api/clicks - Record a new click
router.post("/", auth, clickRateLimiter, validateClick, recordClick);

// GET /api/clicks/history - Get user's click history
router.get("/history", auth, getClickHistory);

// GET /api/clicks/stats - Get click statistics
router.get("/stats", auth, getClickStats);

export default router;
