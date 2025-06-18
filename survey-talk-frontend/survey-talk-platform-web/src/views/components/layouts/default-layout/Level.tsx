import React from "react";
import "./styleLevel.scss";

interface Props {
  xp: number | null;
  level: number | null;
}

export const Level: React.FC<Props> = ({ xp, level }) => {
  // Hàm tính toán phần trăm tiến độ của XP so với max XP
  const calVisualizeXP = (xp: number | null, level: number | null): number => {
    if (xp && level) {
      const levelToHundred = level * 100; // Cộng level với 100
      return Math.min(xp - levelToHundred, 100);
    } else {
      return 0;
    }
  };

  const progress = calVisualizeXP(xp, level); // Tính phần trăm thanh tiến độ
  return (
    <div className="level-container relative">
      <div className="level-number absolute left-0 z-10 flex items-center justify-center">
        {level}
      </div>

      {xp !== 0 && (
        <div
          className="progress-bar-active"
          style={{ width: `${progress + 23}px` }}
        >
          <span className="progress-text">{`${progress}/100`}</span>
        </div>
      )}
    </div>
  );
};
