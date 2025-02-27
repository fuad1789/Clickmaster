"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth = async (req, res, next) => {
    var _a;
    try {
        // Get token from header
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return res
                .status(401)
                .json({ message: "No authentication token, access denied" });
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        // Check if user exists
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return res
                .status(401)
                .json({ message: "User not found, authentication failed" });
        }
        // Add user to request
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
exports.auth = auth;
const adminAuth = async (req, res, next) => {
    try {
        // First run the regular auth middleware
        await (0, exports.auth)(req, res, () => {
            // Check if user is admin
            if (req.user && req.user.isAdmin) {
                next();
            }
            else {
                res
                    .status(403)
                    .json({ message: "Access denied, admin privileges required" });
            }
        });
    }
    catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};
exports.adminAuth = adminAuth;
