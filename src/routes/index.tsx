import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, GraduationCap } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { sortTasks, type Status, type Task } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ProgressOverview } from "@/components/ProgressOverview";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusFlow — Calm task manager for students" },
      {
        name: "description",
        content:
          "Prioritize deadlines, track progress, and stay calm during busy academic weeks with FocusFlow.",
      },
      { property: "og:title", content: "FocusFlow — Calm task manager for students" },
      {
        property: "og:description",
        content: "Prioritize deadlines, track progress, and reduce stress.",
      },
    ],
  }),
  component: Dashboard,
});

type Filter = "all" | "active" | "completed";

function nextStatus(s: Status): Status {
  return s === "not_started" ? "in_progress" : s === "in_progress" ? "completed" : "not_started";
}

function Dashboard() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);
  const topPriority = useMemo(
    () => sorted.find((t) => t.status !== "completed"),
    [sorted],
  );
  const todaysFocus = useMemo(
    () => sorted.filter((t) => t.status !== "completed").slice(0, 3),
    [sorted],
  );

  const filtered = sorted.filter((t) => {
    if (filter === "active") return t.status !== "completed";
    if (filter === "completed") return t.status === "completed";
    return true;
  });

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-[var(--shadow-soft)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">FocusFlow</h1>
              <p className="text-xs text-muted-foreground">Calm task manager</p>
            </div>
          </div>
          <AddTaskDialog onAdd={addTask} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Greeting */}
        <div className="mb-8 animate-fade-in">
          <p className="text-sm font-medium text-primary">{greeting} 👋</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Let's make today manageable.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: focus + list */}
          <div className="space-y-6 lg:col-span-2">
            {/* Today's Focus */}
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Today's Focus
                </h3>
              </div>

              {topPriority ? (
                <div className="space-y-3">
                  <TaskCard
                    task={topPriority}
                    onToggle={toggleComplete}
                    onDelete={deleteTask}
                    onCycleStatus={cycle}
                    featured
                  />
                  {todaysFocus.slice(1).map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={toggleComplete}
                      onDelete={deleteTask}
                      onCycleStatus={cycle}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState message="You're all caught up. Time to breathe. 🌿" />
              )}
            </section>

            {/* Full task list */}
            <section className="animate-slide-up">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  All tasks
                </h3>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="active" className="text-xs">Active</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {filtered.length === 0 ? (
                <EmptyState message="Nothing here yet." />
              ) : (
                <div className="space-y-3">
                  {filtered.map((t: Task) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onToggle={toggleComplete}
                      onDelete={deleteTask}
                      onCycleStatus={cycle}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column: progress */}
          <aside className="space-y-6">
            <ProgressOverview tasks={tasks} />
            <div className="rounded-3xl border bg-gradient-to-br from-primary-soft to-accent/50 p-6">
              <h4 className="font-semibold text-foreground">A gentle reminder</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                You don't have to do everything today. Pick the top task, give it 25 focused
                minutes, then take a real break.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/40 p-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
