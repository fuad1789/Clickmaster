import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClickStats,
  selectClickStats,
  selectTotalClicks,
  selectDailyClicks,
  selectStreak,
} from "../redux/slices/clickSlice";
import { AppDispatch } from "../redux/store";
import { selectUser } from "../redux/slices/authSlice";

const UserStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const totalClicks = useSelector(selectTotalClicks);
  const dailyClicks = useSelector(selectDailyClicks);
  const streak = useSelector(selectStreak);
  const stats = useSelector(selectClickStats);

  useEffect(() => {
    if (user) {
      dispatch(getClickStats());
    }
  }, [dispatch, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-green-500 to-teal-500">
        <h2 className="text-xl font-bold text-white">Your Stats</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200 uppercase">
              Total Clicks
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">
              {totalClicks.toLocaleString()}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 uppercase">
              Today's Clicks
            </h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">
              {dailyClicks.toLocaleString()}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200 uppercase">
              Streak
            </h3>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-300">
              {streak} days
            </p>
          </div>
        </div>

        {stats && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Click History
            </h3>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase mb-2">
                Weekly Performance
              </h4>
              <div className="h-40 flex items-end space-x-2">
                {stats.hourlyClicks && stats.hourlyClicks.length > 0
                  ? stats.hourlyClicks.map((hour, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{
                            height: `${
                              (hour.count /
                                Math.max(
                                  ...stats.hourlyClicks.map((h) => h.count),
                                  1
                                )) *
                              100
                            }%`,
                            minHeight: hour.count > 0 ? "8px" : "0",
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {hour._id}:00
                        </span>
                      </div>
                    ))
                  : Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full h-0"></div>
                        <span className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                          -
                        </span>
                      </div>
                    ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase mb-2">
                  Weekly Stats
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.weeklyClicks.toLocaleString()} clicks
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.weeklyClicks > 0
                    ? `That's about ${Math.round(
                        stats.weeklyClicks / 7
                      )} clicks per day!`
                    : "Start clicking to see your weekly stats!"}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-300 uppercase mb-2">
                  Monthly Stats
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.monthlyClicks.toLocaleString()} clicks
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.monthlyClicks > 0
                    ? `You're averaging ${Math.round(
                        stats.monthlyClicks / 30
                      )} clicks per day this month!`
                    : "Start clicking to see your monthly stats!"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 uppercase">
            Referral Code
          </h3>
          <p className="mt-2 text-xl font-mono font-bold text-yellow-600 dark:text-yellow-300">
            {user.referralCode}
          </p>
          <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
            Share this code with friends to earn bonus clicks!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
