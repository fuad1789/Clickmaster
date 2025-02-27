/**
 * Centralized API configuration
 * This file provides a single source of truth for API-related constants
 */

// Base API URL from environment variable with fallback
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://clickmaster.onrender.com";

// Helper function to build API endpoints
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
