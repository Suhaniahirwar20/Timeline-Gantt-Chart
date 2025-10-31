import React, { useState, useRef, useLayoutEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { TimelineViewProps } from "@/types/timeline.types";
import { TimelineGrid } from "./TimelineGrid";
import { TaskBar } from "./TaskBar";
import {
  calculatePosition,
  calculateDuration,
  calculateDateFromPosition,
} from "@/utils/position.utils";

const ROW_HEIGHT = 64;
const TOP_OFFSET = 24;

export const TimelineView: React.FC<TimelineViewProps> = ({
  rows,
  tasks,
  startDate,
  endDate,
  viewMode,
  onTaskMove,
  onTaskUpdate,
  onTaskClick,
}) => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(0);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);

  const pixelsPerDay =
    viewMode === "day" ? 40 : viewMode === "week" ? 80 : 120;

  // 🧭 Dynamically measure actual left panel width (responsive fix)
  useLayoutEffect(() => {
    if (leftPanelRef.current) {
      const width = leftPanelRef.current.offsetWidth;
      setLeftPanelWidth(width);
    }

    const handleResize = () => {
      if (leftPanelRef.current) {
        setLeftPanelWidth(leftPanelRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧩 Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;
    const taskId = active.id as string;

    // Resize (left or right handles)
    if (taskId.endsWith("-left") || taskId.endsWith("-right")) {
      const realTaskId = taskId.replace(/-(left|right)$/, "");
      const task = tasks[realTaskId];
      if (!task) return;

      const direction = taskId.endsWith("-left") ? "left" : "right";
      const deltaX = delta.x;
      const snappedDelta = Math.round(deltaX / pixelsPerDay) * pixelsPerDay;

      if (direction === "left") {
        const daysShift = snappedDelta / pixelsPerDay;
        const newStart = new Date(task.startDate);
        newStart.setDate(newStart.getDate() + daysShift);

        if (newStart < task.endDate) {
          onTaskUpdate?.(realTaskId, { startDate: newStart });
        }
      } else {
        const daysShift = snappedDelta / pixelsPerDay;
        const newEnd = new Date(task.endDate);
        newEnd.setDate(newEnd.getDate() + daysShift);

        if (newEnd > task.startDate) {
          onTaskUpdate?.(realTaskId, { endDate: newEnd });
        }
      }
      return;
    }

    // Normal drag-move
    const task = tasks[taskId];
    if (!task) return;

    const currentRowIndex = rows.findIndex((r) => r.id === task.rowId);
    const currentLeft = calculatePosition(
      task.startDate,
      startDate,
      pixelsPerDay
    );
    let newLeft = currentLeft + delta.x;

    const maxLeft =
      calculatePosition(endDate, startDate, pixelsPerDay) - 20;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));

    const snappedLeft =
      Math.round(newLeft / pixelsPerDay) * pixelsPerDay;
    const newStartDate = calculateDateFromPosition(
      snappedLeft,
      startDate,
      pixelsPerDay
    );

    const rowShift = Math.round(delta.y / ROW_HEIGHT);
    const newRowIndex = Math.max(
      0,
      Math.min(rows.length - 1, currentRowIndex + rowShift)
    );
    const newRowId = rows[newRowIndex].id;

    if (onTaskMove) {
      onTaskMove(taskId, newRowId, newStartDate);
    } else if (onTaskUpdate) {
      const duration =
        task.endDate.getTime() - task.startDate.getTime();
      const newEndDate = new Date(
        newStartDate.getTime() + duration
      );
      onTaskUpdate(taskId, {
        startDate: newStartDate,
        endDate: newEndDate,
        rowId: newRowId,
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex w-full h-full border rounded-lg overflow-hidden bg-gray-50">
        {/* Left Panel */}
        <div
          ref={leftPanelRef}
          className="w-48 sm:w-60 md:w-72 lg:w-80 border-r border-neutral-300 bg-neutral-50 overflow-x-auto"
        >
          {rows.map((row) => (
            <div
              key={row.id}
              className="h-16 flex items-center px-2 sm:px-3 border-b border-neutral-200 font-medium text-sm truncate"
            >
              {row.label}
            </div>
          ))}
        </div>

        {/* Timeline Area */}
        <div
          className="flex-1 relative overflow-auto w-full h-full"
          style={{ minHeight: rows.length * ROW_HEIGHT }}
        >
          <TimelineGrid
            startDate={startDate}
            endDate={endDate}
            viewMode={viewMode}
          />

          {/* Dependencies Arrows */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#f87171" />
              </marker>
            </defs>

            {Object.values(tasks).map((task) =>
              task.dependencies?.map((depId) => {
                const depTask = tasks[depId];
                if (!depTask) return null;

                const depRowIndex = rows.findIndex(
                  (r) => r.id === depTask.rowId
                );
                const taskRowIndex = rows.findIndex(
                  (r) => r.id === task.rowId
                );
                if (depRowIndex === -1 || taskRowIndex === -1)
                  return null;

                const x1 =
                  leftPanelWidth +
                  calculatePosition(
                    depTask.endDate,
                    startDate,
                    pixelsPerDay
                  ) +
                  (depTask.startDate.getTime() ===
                  depTask.endDate.getTime()
                    ? 6
                    : 0);
                const y1 =
                  depRowIndex * ROW_HEIGHT +
                  TOP_OFFSET +
                  ROW_HEIGHT * 0.25;

                const x2 =
                  leftPanelWidth +
                  calculatePosition(
                    task.startDate,
                    startDate,
                    pixelsPerDay
                  ) -
                  (task.startDate.getTime() === task.endDate.getTime()
                    ? 6
                    : 0);
                const y2 =
                  taskRowIndex * ROW_HEIGHT +
                  TOP_OFFSET +
                  ROW_HEIGHT * 0.25;

                return (
                  <line
                    key={`${depId}-${task.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#f87171"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })
            )}
          </svg>

          {/* TaskBars */}
          {rows.map((row, idx) => (
            <div
              key={row.id}
              className="relative h-16 border-b border-neutral-200"
            >
              {row.tasks.map((taskId) => {
                const task = tasks[taskId];
                if (!task) return null;

                const left = calculatePosition(
                  task.startDate,
                  startDate,
                  pixelsPerDay
                );
                const width = calculateDuration(
                  task.startDate,
                  task.endDate,
                  pixelsPerDay
                );
                const top = idx * ROW_HEIGHT + TOP_OFFSET;

                return (
                  <TaskBar
                    key={task.id}
                    task={task}
                    left={leftPanelWidth + left}
                    width={width}
                    top={top}
                    rowHeight={ROW_HEIGHT}
                    onClick={onTaskClick}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
};
