"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// GET /api/users - Get all users (admin only)
router.get("/", auth_1.adminAuth, userController_1.getAllUsers);
// GET /api/users/:id - Get user by ID (admin only)
router.get("/:id", auth_1.adminAuth, userController_1.getUserById);
// PUT /api/users/:id - Update user (admin only)
router.put("/:id", auth_1.adminAuth, userController_1.updateUser);
// DELETE /api/users/:id - Delete user (admin only)
router.delete("/:id", auth_1.adminAuth, userController_1.deleteUser);
// POST /api/users/referral - Apply referral code
router.post("/referral", auth_1.auth, userController_1.applyReferralCode);
exports.default = router;
