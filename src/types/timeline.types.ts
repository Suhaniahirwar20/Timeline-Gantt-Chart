export interface TimelineTask {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  assignee?: string;
  rowId: string;
  dependencies?: string[];
  color?: string;
  isMilestone?: boolean;
  description?: string; 
}

export interface TimelineRow {
  id: string;
  label: string;
  avatar?: string;
  tasks: string[];
}

export interface TimelineViewProps {
  rows: TimelineRow[];
  tasks: Record<string, TimelineTask>;
  startDate: Date;
  endDate: Date;
  viewMode: 'day' | 'week' | 'month';
  onTaskUpdate?: (taskId: string, updates: Partial<TimelineTask>) => void;
  onTaskMove?: (taskId: string, newRowId: string, newStartDate: Date) => void;
  onTaskClick?: (task: TimelineTask) => void;
}
