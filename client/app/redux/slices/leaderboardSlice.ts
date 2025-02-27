import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getApiUrl } from "../../utils/api";

// Define types
interface LeaderboardUser {
  _id: string;
  displayName: string;
  totalClicks: number;
  dailyClicks: number;
  weeklyClicks: number;
  monthlyClicks: number;
  streak: number;
  referralCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface LeaderboardState {
  leaderboard: LeaderboardUser[];
  friends: LeaderboardUser[];
  userRank: number | null;
  pagination: Pagination;
  period: "all" | "daily" | "weekly" | "monthly";
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: LeaderboardState = {
  leaderboard: [],
  friends: [],
  userRank: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  period: "all",
  loading: false,
  error: null,
};

// Async thunks
export const getGlobalLeaderboard = createAsyncThunk(
  "leaderboard/getGlobalLeaderboard",
  async (
    {
      page = 1,
      limit = 10,
      period = "all",
    }: {
      page?: number;
      limit?: number;
      period?: "all" | "daily" | "weekly" | "monthly";
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as RootState;
      // Get token from localStorage since it's not in the auth state
      const token = localStorage.getItem("token");

      const url = new URL(getApiUrl("api/leaderboard/global"));
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());
      url.searchParams.append("period", period);

      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to get leaderboard");
      }

      return data;
    } catch (error) {
      return rejectWithValue("Failed to get leaderboard. Please try again.");
    }
  }
);

export const getFriendsLeaderboard = createAsyncThunk(
  "leaderboard/getFriendsLeaderboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as RootState;

      // Get token from localStorage since it's not in the auth state
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No authentication token found for friends leaderboard");
        return rejectWithValue("No authentication token");
      }

      const url = new URL(getApiUrl("api/leaderboard/friends"));

      console.log("Fetching friends leaderboard from:", url);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Friends leaderboard response:", data);

      if (!response.ok) {
        console.error("Friends leaderboard error:", data.message);
        return rejectWithValue(
          data.message || "Failed to get friends leaderboard"
        );
      }

      return data;
    } catch (error) {
      console.error("Friends leaderboard fetch error:", error);
      return rejectWithValue(
        "Failed to get friends leaderboard. Please try again."
      );
    }
  }
);

// Slice
const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    changePeriod: (
      state,
      action: PayloadAction<"all" | "daily" | "weekly" | "monthly">
    ) => {
      state.period = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getGlobalLeaderboard
      .addCase(getGlobalLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getGlobalLeaderboard.fulfilled,
        (
          state,
          action: PayloadAction<{
            leaderboard: LeaderboardUser[];
            pagination: Pagination;
            userRank: number | null;
          }>
        ) => {
          state.loading = false;
          state.leaderboard = action.payload.leaderboard;
          state.pagination = action.payload.pagination;
          state.userRank = action.payload.userRank;
        }
      )
      .addCase(getGlobalLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getFriendsLeaderboard
      .addCase(getFriendsLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFriendsLeaderboard.fulfilled,
        (
          state,
          action: PayloadAction<{
            friends: LeaderboardUser[];
            total: number;
          }>
        ) => {
          state.loading = false;
          state.friends = action.payload.friends;
        }
      )
      .addCase(getFriendsLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { changePeriod, resetError } = leaderboardSlice.actions;

export const selectLeaderboard = (state: RootState) =>
  state.leaderboard.leaderboard;
export const selectFriends = (state: RootState) => state.leaderboard.friends;
export const selectUserRank = (state: RootState) => state.leaderboard.userRank;
export const selectPagination = (state: RootState) =>
  state.leaderboard.pagination;
export const selectPeriod = (state: RootState) => state.leaderboard.period;
export const selectLeaderboardLoading = (state: RootState) =>
  state.leaderboard.loading;

export default leaderboardSlice.reducer;
