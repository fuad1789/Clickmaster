"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  selectIsAuthenticated,
} from "../redux/slices/authSlice";
import {
  getGlobalLeaderboard,
  getFriendsLeaderboard,
  selectLeaderboard,
  selectFriends,
} from "../redux/slices/leaderboardSlice";
import { AppDispatch } from "../redux/store";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";
import { useState } from "react";

export default function LeaderboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const globalLeaderboard = useSelector(selectLeaderboard);
  const friendsLeaderboard = useSelector(selectFriends);
  const [activeTab, setActiveTab] = useState("global");

  useEffect(() => {
    // Try to get current user if token exists
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Get global leaderboard
    dispatch(getGlobalLeaderboard({}));

    // Get friends leaderboard if authenticated
    if (isAuthenticated) {
      dispatch(getFriendsLeaderboard());
    }
  }, [dispatch, isAuthenticated]);

  // Function to force refresh data
  const refreshData = () => {
    dispatch(getCurrentUser());
    if (isAuthenticated) {
      dispatch(getFriendsLeaderboard());
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            See who's leading the competition and where you stand.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("global")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "global"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                Global Leaderboard
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab("friends")}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === "friends"
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  Friends Leaderboard
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "global" ? (
              <Leaderboard />
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Friends Leaderboard
                  </h2>
                  <button
                    onClick={() => refreshData()}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Refresh
                  </button>
                </div>
                {friendsLeaderboard.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total Clicks
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Streak
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {friendsLeaderboard.map((friend, index) => (
                          <tr key={friend._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {index + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {friend.displayName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white font-bold">
                                {friend.totalClicks.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {friend.streak} days
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      You haven't referred any friends yet. Share your referral
                      code to get started!
                    </p>
                    <button
                      onClick={() => refreshData()}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Refresh Friends List
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ad Banner */}
        <div className="mt-12 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Advertisement
          </p>
          <div className="h-24 flex items-center justify-center border border-dashed border-gray-400 dark:border-gray-600 rounded">
            <p className="text-gray-500 dark:text-gray-400">
              Google AdSense Banner
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
