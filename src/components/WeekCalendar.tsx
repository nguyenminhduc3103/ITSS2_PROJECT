import { useMemo } from "react";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import type { Task, Category } from "@/lib/tasks";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8);
const CATEGORY_COLOR: Record<Category, string> = {
  School: "bg-primary/15 border-primary/40 text-primary",
  Work: "bg-success/15 border-success/40 text-[oklch(0.35_0.1_160)]",
};

export function WeekCalendar({ tasks }: { tasks: Task[] }) {
  const weekStart = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [
    weekStart,
  ]);

  const scheduled = tasks.filter((t) => t.scheduledFor);

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-[var(--shadow-soft)]">
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b bg-secondary/40">
        <div />
        {days.map((d) => {
          const today = isSameDay(d, new Date());
          return (
            <div
              key={d.toISOString()}
              className={cn("border-l px-3 py-3 text-center", today && "bg-primary-soft/50")}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {format(d, "EEE")}
              </p>
              <p
                className={cn(
                  "mt-1 text-lg font-semibold",
                  today ? "text-primary" : "text-foreground",
                )}
              >
                {format(d, "d")}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[60px_repeat(7,1fr)]">
        <div>
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex h-16 items-start justify-end border-b border-r pr-2 pt-1 text-[10px] text-muted-foreground"
            >
              {h}:00
            </div>
          ))}
        </div>
        {days.map((d) => (
          <div key={d.toISOString()} className="relative border-l">
            {HOURS.map((h) => (
              <div key={h} className="h-16 border-b" />
            ))}

            {scheduled
              .filter((t) => isSameDay(new Date(t.scheduledFor!), d))
              .map((t) => {
                const start = new Date(t.scheduledFor!);
                const hour = start.getHours() + start.getMinutes() / 60;
                const top = (hour - 8) * 64;
                const height = Math.max(28, (t.workload / 60) * 64);
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "absolute left-1 right-1 rounded-lg border px-2 py-1.5 text-xs shadow-sm transition-all hover:z-10 hover:-translate-y-0.5 hover:shadow-md",
                      CATEGORY_COLOR[t.category],
                    )}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <p className="truncate font-semibold">{t.name}</p>
                    <p className="truncate text-[10px] opacity-80">
                      {format(start, "h:mm a")} · {t.workload}m
                    </p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
