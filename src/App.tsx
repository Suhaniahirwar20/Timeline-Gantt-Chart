import React, { useState } from "react";
import { TimelineView } from "./components/Timeline/TimelineView";
import type { TimelineRow, TimelineTask } from "./components/Timeline/types";

const App: React.FC = () => {
  const startDate = new Date(2024, 0, 1);
  const endDate = new Date(2024, 0, 31);

  const [rows, setRows] = useState<TimelineRow[]>([
    { id: "frontend", label: "Frontend Team", tasks: ["task-1", "task-2"] },
    { id: "backend", label: "Backend Team", tasks: ["task-3"] },
  ]);

  const [tasks, setTasks] = useState<Record<string, TimelineTask>>({
    "task-1": {
      id: "task-1",
      title: "UI Design",
      startDate: new Date(2024, 0, 2),
      endDate: new Date(2024, 0, 5),
      progress: 60,
      rowId: "frontend",
      color: "#3b82f6",
      description: "Design the main UI screens for the project",
    },
    "task-2": {
      id: "task-2",
      title: "React Setup",
      startDate: new Date(2024, 0, 6),
      endDate: new Date(2024, 0, 12),
      progress: 30,
      rowId: "frontend",
      color: "#10b981",
      dependencies: ["task-1"],
    },
    "task-3": {
      id: "task-3",
      title: "API Integration",
      startDate: new Date(2024, 0, 10),
      endDate: new Date(2024, 0, 18),
      progress: 50,
      rowId: "backend",
      color: "#f59e0b",
    },
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskMove = (
    taskId: string,
    newRowId: string,
    newStartDate: Date
  ) => {
    setTasks((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], startDate: newStartDate, rowId: newRowId },
    }));
    setRows((prevRows) => {
      let updatedRows = prevRows.map((row) =>
        row.tasks.includes(taskId)
          ? { ...row, tasks: row.tasks.filter((id) => id !== taskId) }
          : row
      );
      return updatedRows.map((row) =>
        row.id === newRowId && !row.tasks.includes(taskId)
          ? { ...row, tasks: [...row.tasks, taskId] }
          : row
      );
    });
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<TimelineTask>) => {
    setTasks((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
  };
  

  return (
    <div className="relative h-screen bg-neutral-100 flex">
      <TimelineView
        rows={rows}
        tasks={tasks}
        startDate={startDate}
        endDate={endDate}
        viewMode="day"
        onTaskMove={handleTaskMove}
        onTaskUpdate={handleTaskUpdate}
        onTaskClick={(task) => setSelectedTaskId(task.id)}
      />

      {/* Sidebar / Modal */}
      {selectedTaskId && (
        <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6 overflow-auto">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={() => setSelectedTaskId(null)}
          >
            ✕
          </button>
          <h2 className="text-xl font-bold mb-4">
            {tasks[selectedTaskId].title}
          </h2>
          <p>
            <strong>Start:</strong>{" "}
            {tasks[selectedTaskId].startDate.toDateString()}
          </p>
          <p>
            <strong>End:</strong> {tasks[selectedTaskId].endDate.toDateString()}
          </p>
          <p>
            <strong>Progress:</strong> {tasks[selectedTaskId].progress}%
          </p>
          <p>
            <strong>Row:</strong> {tasks[selectedTaskId].rowId}
          </p>
          {/* Add more details if needed */}
        </div>
      )}
    </div>
  );
};

export default App;
