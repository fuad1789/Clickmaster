"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  selectIsAuthenticated,
  selectUser,
  updateProfile,
} from "../redux/slices/authSlice";
import { getClickStats } from "../redux/slices/clickSlice";
import { AppDispatch } from "../redux/store";
import Navbar from "../components/Navbar";
import UserStats from "../components/UserStats";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Try to get current user if token exists
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      dispatch(getClickStats());
    }
  }, [user, dispatch]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ displayName }));
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage your profile information and statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label
                        htmlFor="displayName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Display Name
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user.displayName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone Number
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Referral Code
                      </h3>
                      <p className="mt-1 text-lg font-mono font-medium text-blue-600 dark:text-blue-400">
                        {user.referralCode}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Share this code with friends to earn bonus clicks!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <UserStats />
          </div>
        </div>
      </div>
    </main>
  );
}
