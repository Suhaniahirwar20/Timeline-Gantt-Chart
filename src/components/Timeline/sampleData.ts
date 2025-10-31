import type { TimelineRow, TimelineTask } from "@/types/timeline.types";

export const sampleRows: TimelineRow[] = [
  { id: "frontend", label: "Frontend Team", tasks: ["task-1", "task-2"] },
  { id: "backend", label: "Backend Team", tasks: ["task-3"] },
];

export const sampleTasks: Record<string, TimelineTask> = {
  "task-1": {
    id: "task-1",
    title: "UI Design",
    startDate: new Date(2024, 0, 2),
    endDate: new Date(2024, 0, 5),
    progress: 60,
    rowId: "frontend",
    color: "#3b82f6",
    
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
};
