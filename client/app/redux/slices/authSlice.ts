import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getApiUrl } from "../../utils/api";

// Types
interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  referralCode: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        return null;
      }

      // Make an API call to get the current user
      const response = await fetch(getApiUrl("api/auth/me"), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, clear it
        if (response.status === 401) {
          localStorage.removeItem("token");
        }
        return rejectWithValue(data.message || "Failed to get current user");
      }

      return data.user;
    } catch (error) {
      console.error("Get current user error:", error);
      return rejectWithValue("Failed to get current user");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    {
      username,
      password,
    }: {
      username: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Make an actual API call to the backend
      const response = await fetch(getApiUrl("api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      // Handle non-JSON responses
      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        return rejectWithValue(
          "Server response error. Please try again later."
        );
      }

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue("Login failed. Please try again.");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      username,
      password,
      displayName,
      referredBy,
    }: {
      username: string;
      password: string;
      displayName: string;
      referredBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // Make an actual API call to the backend
      const response = await fetch(getApiUrl("api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          displayName,
          referredBy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Registration failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      return data.user;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (
    {
      phoneNumber,
      firebaseToken,
      displayName,
      referredBy,
    }: {
      phoneNumber: string;
      firebaseToken: string;
      displayName?: string;
      referredBy?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // In a real app, you would make an API call to your backend
      // For now, we'll simulate a successful response

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data
      const user = {
        id: "1",
        username: displayName || "User1",
        email: `${phoneNumber}@example.com`,
        displayName: displayName || "User1",
        phoneNumber: phoneNumber,
        referralCode: "REF123",
      };

      // Store token in localStorage
      localStorage.setItem("token", firebaseToken);

      return user;
    } catch (error) {
      return rejectWithValue("Failed to verify OTP. Please try again.");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { displayName }: { displayName: string },
    { rejectWithValue, getState }
  ) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("Not authenticated");
      }

      // Make an API call to update the user profile
      const response = await fetch(getApiUrl("api/auth/profile"), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update profile");
      }

      return data.user;
    } catch (error) {
      console.error("Update profile error:", error);
      return rejectWithValue("Failed to update profile. Please try again.");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Remove token from localStorage
      localStorage.removeItem("token");
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { login, logout, setError, clearError } = authSlice.actions;

// Export selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Export reducer
export default authSlice.reducer;
