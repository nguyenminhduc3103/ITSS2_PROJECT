export type Priority = "low" | "medium" | "high";
export type Status = "not_started" | "in_progress" | "completed" | "overdue";
export type Category = "School" | "Work";

export interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  deadline: string; // ISO
  priority: Priority;
  workload: number; // minutes
  duration?: number;
  status: Status;
  progress: number; // 0-100
  category: Category;
  subtasks: Subtask[];
  scheduledFor?: string; // ISO start time
  createdAt: string;
}

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export function priorityScore(t: Task): number {
  const hoursLeft = Math.max(
    1,
    (new Date(t.deadline).getTime() - Date.now()) / (1000 * 60 * 60),
  );
  const urgency = 100 / hoursLeft;
  const importance = PRIORITY_WEIGHT[t.priority] * 10;
  const workload = t.workload / 30;
  return Math.round(urgency * 5 + importance * 3 + workload);
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    return priorityScore(b) - priorityScore(a);
  });
}

export function weeklyProgress(tasks: Task[]) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recent = tasks.filter((t) => new Date(t.createdAt).getTime() >= weekAgo);
  const completed = recent.filter((t) => t.status === "completed").length;
  const total = recent.length;
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function subtaskProgress(t: Task): number {
  if (t.subtasks.length === 0) return t.progress;
  return Math.round((t.subtasks.filter((s) => s.done).length / t.subtasks.length) * 100);
}
