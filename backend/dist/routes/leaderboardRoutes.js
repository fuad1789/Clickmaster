"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/leaderboard/global - Get global leaderboard
router.get("/global", leaderboardController_1.getGlobalLeaderboard);
// GET /api/leaderboard/friends - Get friends leaderboard
router.get("/friends", auth_1.auth, leaderboardController_1.getFriendsLeaderboard);
// POST /api/leaderboard/reset/:period - Reset period clicks (admin only)
router.post("/reset/:period", auth_1.adminAuth, leaderboardController_1.resetPeriodClicks);
exports.default = router;
