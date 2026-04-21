export type Priority = "low" | "medium" | "high";
export type Status = "not_started" | "in_progress" | "completed";

export interface Task {
  id: string;
  name: string;
  deadline: string; // ISO
  priority: Priority;
  duration?: number; // minutes
  status: Status;
  createdAt: string;
}

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    const da = new Date(a.deadline).getTime();
    const db = new Date(b.deadline).getTime();
    if (da !== db) return da - db;
    const pw = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (pw !== 0) return pw;
    return (a.duration ?? 9999) - (b.duration ?? 9999);
  });
}

export function weeklyProgress(tasks: Task[]): { completed: number; total: number; percent: number } {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recent = tasks.filter((t) => new Date(t.createdAt) >= weekAgo);
  const completed = recent.filter((t) => t.status === "completed").length;
  const total = recent.length;
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}
