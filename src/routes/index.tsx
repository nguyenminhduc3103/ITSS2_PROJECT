import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Flame } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { sortTasks, type Status } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ProgressOverview } from "@/components/ProgressOverview";
import { Recommendations } from "@/components/RecommendationCard";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusFlow — Dashboard" },
      {
        name: "description",
        content:
          "Prioritize deadlines, plan your week, and reduce stress with a calm student productivity dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

function nextStatus(s: Status): Status {
  return s === "not_started" ? "in_progress" : s === "in_progress" ? "completed" : "not_started";
}

function Dashboard() {
  const { t } = useT();
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    updateSubtask,
  } = useTasks();

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);
  const todaysFocus = useMemo(
    () => sorted.filter((x) => x.status !== "completed").slice(0, 3),
    [sorted],
  );
  const urgent = useMemo(
    () =>
      sorted.filter((x) => {
        const h = (new Date(x.deadline).getTime() - Date.now()) / 3600000;
        return x.status !== "completed" && h < 24 && h > -24;
      }),
    [sorted],
  );

  const cycle = (id: string) => {
    const tk = tasks.find((x) => x.id === id);
    if (tk) updateTask(id, { status: nextStatus(tk.status) });
  };

  // Greeting computed only on client to avoid SSR/timezone hydration mismatch.
  const [greeting, setGreeting] = useState(t("greeting.morning"));
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting(t("greeting.morning"));
    else if (h < 18) setGreeting(t("greeting.afternoon"));
    else setGreeting(t("greeting.evening"));
  }, [t]);

  return (
    <AppShell
      title={greeting}
      subtitle={t("dashboard.subtitle")}
      action={<AddTaskDialog onAdd={addTask} />}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {todaysFocus[0] && (
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("dashboard.topPriority")}
                </h3>
              </div>
              <TaskCard
                task={todaysFocus[0]}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onCycleStatus={cycle}
                onToggleSubtask={toggleSubtask}
                onAddSubtask={addSubtask}
                onDeleteSubtask={deleteSubtask}
                onUpdateTask={updateTask}
                onUpdateSubtask={updateSubtask}
                featured
              />
            </section>
          )}

          {urgent.length > 0 && (
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("dashboard.urgent")}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {urgent.length} {t("dashboard.urgent.count")}
                </span>
              </div>
              <div className="space-y-3">
                {urgent.slice(0, 4).map((tk) => (
                  <TaskCard
                    key={tk.id}
                    task={tk}
                    onToggle={toggleComplete}
                    onDelete={deleteTask}
                    onCycleStatus={cycle}
                    onToggleSubtask={toggleSubtask}
                    onAddSubtask={addSubtask}
                    onDeleteSubtask={deleteSubtask}
                    onUpdateTask={updateTask}
                    onUpdateSubtask={updateSubtask}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="animate-slide-up">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("dashboard.upcoming")}
              </h3>
            </div>
            <div className="space-y-3">
              {sorted
                .filter((x) => {
                  const h = (new Date(x.deadline).getTime() - Date.now()) / 3600000;
                  return x.status !== "completed" && h >= 24;
                })
                .slice(0, 4)
                .map((tk) => (
                  <TaskCard
                    key={tk.id}
                    task={tk}
                    onToggle={toggleComplete}
                    onDelete={deleteTask}
                    onCycleStatus={cycle}
                    onToggleSubtask={toggleSubtask}
                    onAddSubtask={addSubtask}
                    onDeleteSubtask={deleteSubtask}
                    onUpdateTask={updateTask}
                    onUpdateSubtask={updateSubtask}
                  />
                ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ProgressOverview tasks={tasks} />
          <Recommendations />
          <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("dashboard.recent")}
            </h3>
            <ActivityFeed limit={4} />
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
