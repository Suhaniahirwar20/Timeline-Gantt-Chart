// src/components/Timeline/TaskBar.tsx
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import type { TimelineTask } from "@/types/timeline.types";

interface TaskBarProps {
  task: TimelineTask;
  left: number;
  width: number;
  top: number;
  rowHeight: number;
  onClick?: (task: TimelineTask) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  left,
  width,
  top,
  rowHeight,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const { setNodeRef: setLeftHandleRef, listeners: leftListeners } =
    useDraggable({ id: task.id + "-left" });
  const { setNodeRef: setRightHandleRef, listeners: rightListeners } =
    useDraggable({ id: task.id + "-right" });

  const isMilestone = task.startDate.toDateString() === task.endDate.toDateString();

  const style: React.CSSProperties = {
    position: "absolute",
    top,
    left: left + (transform?.x ?? 0),
    width: isMilestone ? 12 : width,
    height: rowHeight * 0.5,
    borderRadius: isMilestone ? "50%" : 8,
    background: isDragging ? "#2563eb" : task.color || "#3b82f6",
    color: "white",
    fontSize: 12,
    padding: isMilestone ? 0 : "4px 8px",
    boxShadow: isDragging
      ? "0 4px 12px rgba(0,0,0,0.2)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    cursor: "grab",
    transition: "background 0.15s",
    opacity: isDragging ? 0.8 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={(e) => {
        e.stopPropagation(); 
        console.log("✅ Task clicked:", task.title); // Prevent nested click issues
        onClick?.(task);
      }}
    >
      {isMilestone ? (
        <span className="text-white text-xs font-bold">★</span>
      ) : (
        <>
          <span className="text-white text-sm font-medium truncate">
            {task.title}
          </span>

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 h-1 bg-white/50 rounded"
            style={{ width: `${task.progress}%` }}
          />

          {/* Left resize handle */}
          <div
            ref={setLeftHandleRef}
            {...leftListeners}
            className="absolute left-0 top-0 h-full w-2 bg-blue-700 cursor-ew-resize rounded-l-md"
          />

          {/* Right resize handle */}
          <div
            ref={setRightHandleRef}
            {...rightListeners}
            className="absolute right-0 top-0 h-full w-2 bg-blue-700 cursor-ew-resize rounded-r-md"
          />
        </>
      )}
    </div>
  );
};
