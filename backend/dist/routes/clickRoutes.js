"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clickController_1 = require("../controllers/clickController");
const auth_1 = require("../middleware/auth");
const clickRateLimiter_1 = require("../middleware/clickRateLimiter");
const router = express_1.default.Router();
// POST /api/clicks - Record a new click
router.post('/', auth_1.auth, clickRateLimiter_1.clickRateLimiter, clickRateLimiter_1.validateClick, clickController_1.recordClick);
// GET /api/clicks/history - Get user's click history
router.get('/history', auth_1.auth, clickController_1.getClickHistory);
// GET /api/clicks/stats - Get click statistics
router.get('/stats', auth_1.auth, clickController_1.getClickStats);
exports.default = router;
