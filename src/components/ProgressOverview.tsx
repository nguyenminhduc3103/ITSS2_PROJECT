import type { Task } from "@/lib/tasks";
import { weeklyProgress } from "@/lib/tasks";
import { TrendingUp, CheckCircle2, ListTodo } from "lucide-react";

export function ProgressOverview({ tasks }: { tasks: Task[] }) {
  const { completed, total, percent } = weeklyProgress(tasks);
  const active = tasks.filter((t) => t.status !== "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Weekly progress</h2>
          <p className="text-sm text-muted-foreground">Tasks completed in the last 7 days</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-bold text-foreground">{percent}%</span>
        <span className="text-sm text-muted-foreground">
          {completed} of {total} done
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ListTodo className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Active</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-foreground">{active}</p>
          <p className="text-xs text-muted-foreground">{inProgress} in progress</p>
        </div>
        <div className="rounded-2xl bg-accent/60 p-4">
          <div className="flex items-center gap-2 text-accent-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Completed</span>
          </div>
          <p className="mt-1 text-2xl font-semibold text-foreground">{completed}</p>
          <p className="text-xs text-muted-foreground">this week</p>
        </div>
      </div>
    </div>
  );
}
