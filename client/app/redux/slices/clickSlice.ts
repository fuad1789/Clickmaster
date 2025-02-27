import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getApiUrl } from "../../utils/api";

// Define types
interface ClickCoordinates {
  x: number;
  y: number;
}

interface ClickStats {
  totalClicks: number;
  dailyClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  streak: number;
  hourlyClicks: any[];
  dailyClicksData: any[];
}

// Define auth state interface for type safety
interface AuthState {
  token: string | null;
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface ClickState {
  totalClicks: number;
  dailyClicks: number;
  streak: number;
  buttonPosition: ClickCoordinates;
  stats: ClickStats | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ClickState = {
  totalClicks: 0,
  dailyClicks: 0,
  streak: 0,
  buttonPosition: {
    x: 50, // percentage
    y: 50, // percentage
  },
  stats: null,
  loading: false,
  error: null,
};

// Helper function to generate random position
const generateRandomPosition = (): ClickCoordinates => {
  // Generate random position between 10% and 90% of the container
  return {
    x: Math.floor(Math.random() * 80) + 10,
    y: Math.floor(Math.random() * 80) + 10,
  };
};

// Async thunks
export const recordClick = createAsyncThunk(
  "click/recordClick",
  async (coordinates: ClickCoordinates, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const auth = state.auth;

      // Get token from localStorage since it's not in the state
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token");
      }

      const response = await fetch(getApiUrl("api/clicks"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coordinates }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to record click");
      }

      return data;
    } catch (error) {
      console.error("Record click error:", error);
      return rejectWithValue("Failed to record click. Please try again.");
    }
  }
);

export const getClickStats = createAsyncThunk(
  "click/getClickStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from localStorage since it's not in the state
      const token = localStorage.getItem("token");

      if (!token) {
        return rejectWithValue("No authentication token");
      }

      const response = await fetch(getApiUrl("api/clicks/stats"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to get click stats");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Failed to get click stats. Please try again.");
    }
  }
);

// Slice
const clickSlice = createSlice({
  name: "click",
  initialState,
  reducers: {
    moveButton: (state) => {
      state.buttonPosition = generateRandomPosition();
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // recordClick
      .addCase(recordClick.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        recordClick.fulfilled,
        (
          state,
          action: PayloadAction<{
            totalClicks: number;
            dailyClicks: number;
            streak: number;
          }>
        ) => {
          state.loading = false;
          state.totalClicks = action.payload.totalClicks;
          state.dailyClicks = action.payload.dailyClicks;
          state.streak = action.payload.streak;
          // Move button to a new random position
          state.buttonPosition = generateRandomPosition();
        }
      )
      .addCase(recordClick.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getClickStats
      .addCase(getClickStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getClickStats.fulfilled,
        (state, action: PayloadAction<ClickStats>) => {
          state.loading = false;
          state.stats = action.payload;
          state.totalClicks = action.payload.totalClicks;
          state.dailyClicks = action.payload.dailyClicks;
          state.streak = action.payload.streak;
        }
      )
      .addCase(getClickStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { moveButton, resetError } = clickSlice.actions;

export const selectClick = (state: RootState) => state.click;
export const selectTotalClicks = (state: RootState) => state.click.totalClicks;
export const selectDailyClicks = (state: RootState) => state.click.dailyClicks;
export const selectStreak = (state: RootState) => state.click.streak;
export const selectButtonPosition = (state: RootState) =>
  state.click.buttonPosition;
export const selectClickStats = (state: RootState) => state.click.stats;
export const selectLoading = (state: RootState) => state.click.loading;

export default clickSlice.reducer;
