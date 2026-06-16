import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format, isToday } from "date-fns";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { AppShell } from "@/components/AppShell";
import { WeekCalendar } from "@/components/WeekCalendar";
import { RescheduleDialog } from "@/components/RescheduleDialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — FocusFlow" },
      { name: "description", content: "Plan your week, time-block tasks, and reschedule with ease." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { t } = useT();
  const { tasks, updateTask } = useTasks();
  const [reschedule, setReschedule] = useState<Task | null>(null);

  const overlapping = useMemo(() => {
    const sched = tasks
      .filter((x) => x.scheduledFor)
      .map((x) => ({
        t: x,
        start: new Date(x.scheduledFor!).getTime(),
        end: new Date(x.scheduledFor!).getTime() + x.workload * 60 * 1000,
      }));
    const conflicts: string[] = [];
    for (let i = 0; i < sched.length; i++) {
      for (let j = i + 1; j < sched.length; j++) {
        if (sched[i].start < sched[j].end && sched[j].start < sched[i].end) {
          conflicts.push(sched[i].t.id, sched[j].t.id);
        }
      }
    }
    return new Set(conflicts);
  }, [tasks]);

  const todaysSchedule = tasks
    .filter((x) => x.scheduledFor && isToday(new Date(x.scheduledFor)))
    .sort((a, b) => +new Date(a.scheduledFor!) - +new Date(b.scheduledFor!));

  const overdue = tasks.filter(
    (x) => x.status !== "completed" && new Date(x.deadline).getTime() < Date.now(),
  );

  return (
    <AppShell title={t("calendar.title")} subtitle={t("calendar.subtitle")}>
      {overdue.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-[oklch(0.45_0.13_75)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {overdue.length} {t("calendar.overdue")}
              </p>
              <p className="text-xs text-muted-foreground">{t("calendar.overdue.sub")}</p>
            </div>
          </div>
          <Button onClick={() => setReschedule(overdue[0])} variant="default" size="sm">
            <CalendarClock className="mr-1 h-4 w-4" /> {t("calendar.rescheduleFirst")}
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <WeekCalendar tasks={tasks} />

          {overlapping.size > 0 && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-semibold text-destructive">{t("calendar.overlap")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("calendar.overlap.sub")}</p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)]">
            <h3 className="text-sm font-semibold text-foreground">{t("calendar.today")}</h3>
            <p className="text-xs text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</p>
            <div className="mt-4 space-y-2">
              {todaysSchedule.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("calendar.noPlan")}</p>
              )}
              {todaysSchedule.map((tk) => (
                <div
                  key={tk.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-secondary/40 p-3",
                    overlapping.has(tk.id) && "border-destructive/40 bg-destructive/5",
                  )}
                >
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">
                      {format(new Date(tk.scheduledFor!), "h:mm")}
                    </p>
                    <p className="text-[10px] uppercase text-muted-foreground">
                      {format(new Date(tk.scheduledFor!), "a")}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{tk.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {tk.workload} {t("task.mins")} · {t(`category.${tk.category}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-br from-primary-soft to-accent/40 p-5">
            <p className="text-sm font-semibold text-foreground">{t("calendar.alloc")}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round(tasks.reduce((s, x) => s + (x.scheduledFor ? x.workload : 0), 0) / 60)}h{" "}
              {t("calendar.alloc.sub")}
            </p>
            <div className="mt-3 space-y-1.5">
              {(["School", "Work"] as const).map((c) => {
                const mins = tasks
                  .filter((x) => x.category === c && x.scheduledFor)
                  .reduce((s, x) => s + x.workload, 0);
                const max = 600;
                return (
                  <div key={c}>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{t(`category.${c}`)}</span>
                      <span className="text-muted-foreground">{Math.round(mins / 60)}h</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-card/60">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.min(100, (mins / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {overdue.length > 0 && (
            <div className="rounded-3xl border bg-card p-5 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold text-foreground">{t("calendar.needReschedule")}</p>
              <div className="mt-3 space-y-2">
                {overdue.map((tk) => (
                  <button
                    key={tk.id}
                    onClick={() => setReschedule(tk)}
                    className="flex w-full items-center justify-between rounded-xl border bg-secondary/40 p-3 text-left transition-colors hover:bg-secondary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{tk.name}</p>
                      <p className="text-xs text-destructive">
                        {t("calendar.due")} {format(new Date(tk.deadline), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <RescheduleDialog
        task={reschedule}
        open={!!reschedule}
        onOpenChange={(v) => !v && setReschedule(null)}
        onConfirm={(id, newDeadline) =>
          updateTask(id, { deadline: newDeadline, status: "not_started" })
        }
      />
    </AppShell>
  );
}
