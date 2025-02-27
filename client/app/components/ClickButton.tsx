import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  recordClick,
  selectButtonPosition,
  selectLoading,
} from "../redux/slices/clickSlice";
import { AppDispatch } from "../redux/store";

const ClickButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const position = useSelector(selectButtonPosition);
  const loading = useSelector(selectLoading);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [buttonSize, setButtonSize] = useState({ width: 80, height: 80 }); // Default button size in pixels

  // Update container size on window resize
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById("click-container");
      if (container) {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    // Initial size
    updateSize();

    // Add resize listener
    window.addEventListener("resize", updateSize);

    // Cleanup
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleClick = () => {
    // Calculate actual pixel coordinates
    const x = (position.x / 100) * containerSize.width;
    const y = (position.y / 100) * containerSize.height;

    // Dispatch click action
    dispatch(recordClick({ x, y }));
  };

  return (
    <div
      id="click-container"
      className="relative w-full h-[60vh] bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden"
    >
      <button
        onClick={handleClick}
        disabled={loading}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-red-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${buttonSize.width}px`,
          height: `${buttonSize.height}px`,
        }}
      >
        {loading ? (
          <svg
            className="animate-spin h-6 w-6 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          "CLICK ME!"
        )}
      </button>
    </div>
  );
};

export default ClickButton;
