import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
} from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/me - Get current user profile
router.get("/me", auth, getCurrentUser);

// PUT /api/auth/profile - Update user profile
router.put("/profile", auth, updateProfile);

export default router;
