import type { Task } from "@/lib/tasks";
import { weeklyProgress } from "@/lib/tasks";
import { CheckCircle2, CircleDot, Circle, AlertCircle } from "lucide-react";

export function ProgressOverview({ tasks }: { tasks: Task[] }) {
  const { completed, total, percent } = weeklyProgress(tasks);
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const notStarted = tasks.filter((t) => t.status === "not_started").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const done = tasks.filter((t) => t.status === "completed").length;

  const stats = [
    { label: "Done", value: done, icon: CheckCircle2, color: "text-success" },
    { label: "In progress", value: inProgress, icon: CircleDot, color: "text-primary" },
    { label: "To do", value: notStarted, icon: Circle, color: "text-muted-foreground" },
    { label: "Overdue", value: overdue, icon: AlertCircle, color: "text-destructive" },
  ];

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">This week</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{percent}%</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {completed} of {total} completed
          </p>
        </div>
        <RingProgress percent={percent} />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-secondary/50 p-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              </div>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RingProgress({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}
