import React from "react";
import { generateTimeScale } from "@/utils/position.utils";

interface TimelineGridProps {
  startDate: Date;
  endDate: Date;
  viewMode: "day" | "week" | "month";
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({
  startDate,
  endDate,
  viewMode,
}) => {
  const scale = generateTimeScale(startDate, endDate, viewMode);
  const cellWidth = viewMode === "day" ? 40 : viewMode === "week" ? 80 : 120;

  // 🔹 Calculate today's position (for optional red "today" line)
  const today = new Date();
  const isTodayInRange = today >= startDate && today <= endDate;
  const todayIndex = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const todayLeft = todayIndex * cellWidth;

  return (
    <div className="relative">
      {/* Header Row */}
      <div className="flex sticky top-0 bg-neutral-50 z-10 border-b border-neutral-300">
        {scale.map((unit, i) => (
          <div
            key={i}
            style={{ width: cellWidth }}
            className="text-xs text-neutral-600 border-r border-neutral-200 text-center py-1"
          >
            {unit.label}
          </div>
        ))}
      </div>

      {/* Grid Lines */}
      <div className="absolute top-0 bottom-0 w-full">
        {scale.map((_, i) => (
          <div
            key={i}
            style={{ left: i * cellWidth }}
            className="absolute top-0 bottom-0 border-r border-neutral-200"
          />
        ))}

        {/* 🔴 Optional "Today" Line */}
        {isTodayInRange && (
          <div
            style={{ left: todayLeft }}
            className="absolute top-0 bottom-0 border-l-2 border-red-500 pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};
