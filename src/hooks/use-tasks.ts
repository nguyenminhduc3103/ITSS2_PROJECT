import { useEffect, useState } from "react";
import type { Task } from "@/lib/tasks";

const KEY = "student-tasks-v1";

const SEED: Task[] = [
  {
    id: "1",
    name: "Finish CS101 problem set",
    deadline: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    duration: 90,
    status: "in_progress",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Read chapter 4 — Microeconomics",
    deadline: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    duration: 45,
    status: "not_started",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Internship weekly report",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "high",
    duration: 60,
    status: "not_started",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Group project — design slides",
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    priority: "medium",
    duration: 120,
    status: "not_started",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Reply to club emails",
    deadline: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    priority: "low",
    duration: 15,
    status: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw));
      else setTasks(SEED);
    } catch {
      setTasks(SEED);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const addTask = (t: Omit<Task, "id" | "createdAt" | "status">) => {
    setTasks((prev) => [
      ...prev,
      { ...t, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "not_started" },
    ]);
  };
  const updateTask = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggleComplete = (id: string) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "completed" ? "not_started" : "completed" } : t,
      ),
    );

  return { tasks, addTask, updateTask, deleteTask, toggleComplete };
}
