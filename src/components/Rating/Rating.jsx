import React from "react";
import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ value, count, size = "sm" }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (value >= i + 1) return "full";
    if (value >= i + 0.5) return "half";
    return "empty";
  });

  const sizeClass = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) =>
          type === "full" ? (
            <FaStar key={i} className={`text-yellow-400 ${sizeClass}`} />
          ) : type === "half" ? (
            <FaStarHalfAlt key={i} className={`text-yellow-400 ${sizeClass}`} />
          ) : (
            <FiStar key={i} className={`text-gray-300 ${sizeClass}`} />
          )
        )}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count.toLocaleString()})</span>
      )}
    </div>
  );
};

export default Rating;
