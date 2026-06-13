import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, Flame } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { sortTasks, type Status } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ProgressOverview } from "@/components/ProgressOverview";
import { Recommendations } from "@/components/RecommendationCard";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed } from "@/components/ActivityFeed";

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
    () => sorted.filter((t) => t.status !== "completed").slice(0, 3),
    [sorted],
  );
  const urgent = useMemo(
    () =>
      sorted.filter((t) => {
        const h = (new Date(t.deadline).getTime() - Date.now()) / 3600000;
        return t.status !== "completed" && h < 24 && h > -24;
      }),
    [sorted],
  );

  const cycle = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (t) updateTask(id, { status: nextStatus(t.status) });
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <AppShell
      title={`${greeting}, Alex 👋`}
      subtitle="Here's a calm overview of your day."
      action={<AddTaskDialog onAdd={addTask} />}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Top Priority */}
          {todaysFocus[0] && (
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center gap-2">
                <Flame className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Top priority
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

          {/* Urgent */}
          {urgent.length > 0 && (
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Urgent · next 24h
                </h3>
                <span className="text-xs text-muted-foreground">{urgent.length} tasks</span>
              </div>
              <div className="space-y-3">
                {urgent.slice(0, 4).map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
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

          {/* Upcoming */}
          <section className="animate-slide-up">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Upcoming this week
              </h3>
            </div>
            <div className="space-y-3">
              {sorted
                .filter((t) => {
                  const h = (new Date(t.deadline).getTime() - Date.now()) / 3600000;
                  return t.status !== "completed" && h >= 24;
                })
                .slice(0, 4)
                .map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={toggleComplete}
                    onDelete={deleteTask}
                    onCycleStatus={cycle}
                    onToggleSubtask={toggleSubtask}
                  />
                ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <ProgressOverview tasks={tasks} />
          <Recommendations />
          <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Recent activity</h3>
            <ActivityFeed limit={4} />
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
