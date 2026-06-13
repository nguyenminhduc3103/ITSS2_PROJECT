import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { sortTasks, type Category, type Status, type Priority } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "@/components/PriorityBadge";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — FocusFlow" },
      { name: "description", content: "Manage all your tasks in one calm, organized list." },
    ],
  }),
  component: TasksPage,
});

type Filter = "all" | "active" | "completed" | "overdue";
type Sort = "smart" | "deadline" | "priority" | "workload";
type View = "list" | "grid";

const CATEGORIES: (Category | "All")[] = ["All", "School", "Project", "Internship", "Work", "Personal"];

function nextStatus(s: Status): Status {
  return s === "not_started" ? "in_progress" : s === "in_progress" ? "completed" : "not_started";
}

function TasksPage() {
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
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("list");
  const [sort, setSort] = useState<Sort>("smart");
  const [cat, setCat] = useState<Category | "All">("All");
  const [q, setQ] = useState("");

  const visible = useMemo(() => {
    let list = [...tasks];
    if (filter === "active") list = list.filter((t) => t.status !== "completed");
    if (filter === "completed") list = list.filter((t) => t.status === "completed");
    if (filter === "overdue")
      list = list.filter(
        (t) => t.status !== "completed" && new Date(t.deadline).getTime() < Date.now(),
      );
    if (cat !== "All") list = list.filter((t) => t.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s),
      );
    }
    if (sort === "smart") return sortTasks(list);
    if (sort === "deadline")
      return list.sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline));
    if (sort === "priority") {
      const w: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
      return list.sort((a, b) => w[b.priority] - w[a.priority]);
    }
    return list.sort((a, b) => b.workload - a.workload);
  }, [tasks, filter, cat, q, sort]);

  const cycle = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    if (t) updateTask(id, { status: nextStatus(t.status) });
  };

  return (
    <AppShell
      title="All tasks"
      subtitle="Your full workload in one place."
      action={<AddTaskDialog onAdd={addTask} />}
    >
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks..."
            className="border-0 bg-secondary/60 pl-9"
          />
        </div>

        <Select value={cat} onValueChange={(v) => setCat(v as Category | "All")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smart">Smart priority</SelectItem>
            <SelectItem value="deadline">Soonest deadline</SelectItem>
            <SelectItem value="priority">Importance</SelectItem>
            <SelectItem value="workload">Workload</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-lg bg-secondary p-0.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setView("list")}
            className={cn("h-7 w-7 p-0", view === "list" && "bg-card shadow")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setView("grid")}
            className={cn("h-7 w-7 p-0", view === "grid" && "bg-card shadow")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
          <span>Priority:</span>
          <PriorityBadge priority="high" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="low" />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-card/40 p-12 text-center text-sm text-muted-foreground">
          Nothing here. Add your first task to get started.
        </div>
      ) : view === "list" ? (
        <div className="space-y-3">
          {visible.map((t) => (
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
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((t) => (
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
      )}
    </AppShell>
  );
}
