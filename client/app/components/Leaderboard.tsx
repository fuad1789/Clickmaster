import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGlobalLeaderboard,
  changePeriod,
  selectLeaderboard,
  selectPeriod,
  selectPagination,
  selectUserRank,
  selectLeaderboardLoading,
} from "../redux/slices/leaderboardSlice";
import { AppDispatch } from "../redux/store";
import { selectIsAuthenticated } from "../redux/slices/authSlice";

const Leaderboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const leaderboard = useSelector(selectLeaderboard);
  const period = useSelector(selectPeriod);
  const pagination = useSelector(selectPagination);
  const userRank = useSelector(selectUserRank);
  const loading = useSelector(selectLeaderboardLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    dispatch(getGlobalLeaderboard({ period }));
  }, [dispatch, period]);

  const handlePeriodChange = (
    newPeriod: "all" | "daily" | "weekly" | "monthly"
  ) => {
    dispatch(changePeriod(newPeriod));
  };

  const handlePageChange = (page: number) => {
    dispatch(getGlobalLeaderboard({ page, period }));
  };

  const handleRefresh = () => {
    dispatch(getGlobalLeaderboard({ period }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Refresh leaderboard"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handlePeriodChange("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              period === "all"
                ? "bg-white text-blue-600"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => handlePeriodChange("daily")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              period === "daily"
                ? "bg-white text-blue-600"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => handlePeriodChange("weekly")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              period === "weekly"
                ? "bg-white text-blue-600"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => handlePeriodChange("monthly")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              period === "monthly"
                ? "bg-white text-blue-600"
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {isAuthenticated && userRank && (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            Your Rank: <span className="font-bold">{userRank}</span> out of{" "}
            {pagination.total}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
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
                    {period === "all"
                      ? "Total Clicks"
                      : period === "daily"
                      ? "Daily Clicks"
                      : period === "weekly"
                      ? "Weekly Clicks"
                      : "Monthly Clicks"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboard.map((user, index) => {
                  const clickCount =
                    period === "daily"
                      ? user.dailyClicks
                      : period === "weekly"
                      ? user.weeklyClicks
                      : period === "monthly"
                      ? user.monthlyClicks
                      : user.totalClicks;

                  return (
                    <tr
                      key={user._id}
                      className={
                        index < 3 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <span
                              className={`
                              flex items-center justify-center w-8 h-8 rounded-full mr-2
                              ${
                                index === 0
                                  ? "bg-yellow-400 text-yellow-900"
                                  : index === 1
                                  ? "bg-gray-300 text-gray-800"
                                  : "bg-amber-700 text-amber-100"
                              }
                            `}
                            >
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.displayName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-bold">
                          {clickCount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.streak} days
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                      let pageNumber;

                      if (pagination.pages <= 5) {
                        pageNumber = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNumber = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNumber = pagination.pages - 4 + i;
                      } else {
                        pageNumber = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNumber
                              ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-200"
                              : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
