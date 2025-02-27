"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReferralCode = exports.generateReferralCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a unique referral code
 * @returns A 6-character alphanumeric referral code
 */
const generateReferralCode = () => {
    // Generate a random buffer
    const buffer = crypto_1.default.randomBytes(3);
    // Convert to a base64 string and remove non-alphanumeric characters
    const base64 = buffer.toString("base64").replace(/[+/=]/g, "").toUpperCase();
    // Return the first 6 characters
    return base64.slice(0, 6);
};
exports.generateReferralCode = generateReferralCode;
/**
 * Validates a referral code format
 * @param code The referral code to validate
 * @returns True if the code is valid, false otherwise
 */
const validateReferralCode = (code) => {
    // Check if the code is a 6-character alphanumeric string
    return /^[A-Z0-9]{6}$/.test(code);
};
exports.validateReferralCode = validateReferralCode;
