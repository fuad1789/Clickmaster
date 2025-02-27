import crypto from "crypto";

/**
 * Generates a unique referral code
 * @returns A 6-character alphanumeric referral code
 */
export const generateReferralCode = (): string => {
  // Generate a random buffer
  const buffer = crypto.randomBytes(3);

  // Convert to a base64 string and remove non-alphanumeric characters
  const base64 = buffer.toString("base64").replace(/[+/=]/g, "").toUpperCase();

  // Return the first 6 characters
  return base64.slice(0, 6);
};

/**
 * Validates a referral code format
 * @param code The referral code to validate
 * @returns True if the code is valid, false otherwise
 */
export const validateReferralCode = (code: string): boolean => {
  // Check if the code is a 6-character alphanumeric string
  return /^[A-Z0-9]{6}$/.test(code);
};
