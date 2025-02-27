import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  applyReferralCode,
} from "../controllers/userController";
import { auth, adminAuth } from "../middleware/auth";

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get("/", adminAuth, getAllUsers);

// GET /api/users/:id - Get user by ID (admin only)
router.get("/:id", adminAuth, getUserById);

// PUT /api/users/:id - Update user (admin only)
router.put("/:id", adminAuth, updateUser);

// DELETE /api/users/:id - Delete user (admin only)
router.delete("/:id", adminAuth, deleteUser);

// POST /api/users/referral - Apply referral code
router.post("/referral", auth, applyReferralCode);

export default router;
