import { WEEKLY_COMPLETION } from "@/lib/mock-data";

export function WeeklyChart() {
  const max = Math.max(...WEEKLY_COMPLETION.map((d) => d.planned));
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Weekly productivity</h3>
          <p className="text-xs text-muted-foreground">Tasks completed vs planned</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-secondary" /> Planned
          </span>
        </div>
      </div>
      <div className="flex h-44 items-end gap-3">
        {WEEKLY_COMPLETION.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-3 rounded-t-md bg-secondary transition-all duration-500"
                style={{ height: `${(d.planned / max) * 100}%` }}
              />
              <div
                className="w-3 rounded-t-md bg-gradient-to-t from-primary to-accent transition-all duration-500"
                style={{ height: `${(d.completed / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
