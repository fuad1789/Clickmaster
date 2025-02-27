import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clickReducer from './slices/clickSlice';
import leaderboardReducer from './slices/leaderboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    click: clickReducer,
    leaderboard: leaderboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 