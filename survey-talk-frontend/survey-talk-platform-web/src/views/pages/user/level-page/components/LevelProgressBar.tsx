import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface LevelProgressBarProps {
  currentLevel: number;
  currentXp: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentLevel,
  currentXp,
}) => {
  const maxXp = 1000;
  const maxWidth = 1000; // Maximum width in pixels
  const progressPercentage = Math.min((currentXp / maxXp) * 100, 100);
  const progressWidth = (currentXp / maxXp) * maxWidth;

  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  const getLevelStatus = (level: number) => {
    if (level < currentLevel) return "completed";
    if (level === currentLevel) return "current";
    return "locked";
  };

  const getLevelColor = (level: number) => {
    const status = getLevelStatus(level);
    switch (status) {
      case "completed":
        return "bg-[#3E5DAB] text-white border-[#3E5DAB]";
      case "current":
        return "bg-[#FFC40D] text-black border-[#FFC40D] shadow-lg";
      default:
        return "bg-gray-300 text-gray-600 border-gray-300";
    }
  };

  // Calculate position for each level milestone
  const getLevelPosition = (level: number) => {
    // Level 1 at 0px, Level 10 at 1000px, others evenly distributed
    return ((level - 1) / 9) * maxWidth;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-8">
      {/* XP Display */}
      <div className="text-center space-y-2 mb-20">
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-[#3E5DAB]">{currentXp}</span>
          <span className="text-gray-500">/ {maxXp} XP</span>
        </div>
        <p className="text-sm text-gray-600">Tổng kinh nghiệm tích lũy</p>
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Main Progress Bar */}
        <div
          className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner"
          style={{ width: `${maxWidth}px` }}
        >
          {/* Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-[#3E5DAB] to-blue-500 transition-all duration-1000 ease-out rounded-full relative"
            style={{ width: `${progressWidth}px` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Level Milestones */}
        <div className="absolute -top-12 w-full">
          {levels.map((level) => {
            const position = getLevelPosition(level);
            const status = getLevelStatus(level);

            return (
              <div
                key={level}
                className="absolute flex flex-col items-center transform -translate-x-1/2"
                style={{ left: `${position}px` }}
              >
                {/* Milestone Marker */}
                <div
                  className={`
                    w-10 h-10 rounded-full border-3 flex items-center justify-center
                    transition-all duration-300 transform hover:scale-110
                    ${getLevelColor(level)}
                    ${status === "current" ? "animate-pulse" : ""}
                  `}
                >
                  {level === 10 ? (
                    <Crown className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-sm">{level}</span>
                  )}
                </div>

                {/* Level Label */}
                {/* <div className="mt-2 text-center">
                  <Badge
                    variant={status === "current" ? "default" : "secondary"}
                    className={`
                      text-xs px-2 py-1
                      ${status === "current" ? "bg-[#FFC40D] text-black" : ""}
                      ${status === "completed" ? "bg-[#3E5DAB] text-white" : ""}
                    `}
                  >
                    Level {level}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{level * 100} XP</p>
                </div> */}

                {/* Current Level Indicator */}
                {status === "current" && (
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#FFC40D] text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                      Hiện tại
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-20">
        {/* <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3E5DAB]"></div>
          <span className="text-sm text-gray-600">Đã hoàn thành</span>
        </div> */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FFC40D]"></div>
          <span className="text-sm text-gray-600">Hiện tại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-300"></div>
          <span className="text-sm text-gray-600">Chưa đạt</span>
        </div>
      </div>
    </div>
  );
};
