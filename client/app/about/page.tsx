"use client";

import Navbar from "../components/Navbar";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            About ClickMaster
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Learn more about the ultimate clicking competition platform.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ClickMaster was created with a simple mission: to provide a fun,
              competitive, and engaging platform for people around the world to
              compete in the ultimate test of clicking speed and endurance.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  1. Click to Compete
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click the button as fast as you can to earn points. The button
                  moves after each click to prevent bots and keep the
                  competition fair.
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  2. Climb the Leaderboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your clicks are tracked and displayed on our global
                  leaderboard. Compete with players worldwide to reach the top
                  positions.
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                  3. Win Rewards
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The top 3 players each month receive exciting rewards. Keep
                  clicking to maintain your position and earn prizes!
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Special Features
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Daily Streaks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Log in and click every day to build your streak. Longer
                    streaks earn bonus points!
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Referral System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Invite friends using your unique referral code. Both you and
                    your friends earn bonus points!
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-600 dark:text-blue-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Multiple Leaderboards
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compete on daily, weekly, monthly, and all-time
                    leaderboards. Different timeframes give everyone a chance to
                    shine!
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center text-gray-600 dark:text-gray-300 text-2xl font-bold">
                  JD
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  John Doe
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Founder & CEO
                </p>
              </div>
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center text-gray-600 dark:text-gray-300 text-2xl font-bold">
                  JS
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Jane Smith
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Lead Developer
                </p>
              </div>
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center text-gray-600 dark:text-gray-300 text-2xl font-bold">
                  RJ
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Robert Johnson
                </h3>
                <p className="text-gray-600 dark:text-gray-400">UX Designer</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Have questions, suggestions, or feedback? We'd love to hear from
              you!
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">
                Email:{" "}
                <a
                  href="mailto:contact@clickmaster.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  contact@clickmaster.com
                </a>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Twitter:{" "}
                <a
                  href="https://twitter.com/clickmaster"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  @clickmaster
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
