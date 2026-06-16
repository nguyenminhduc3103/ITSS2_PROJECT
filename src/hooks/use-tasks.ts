import { useCallback, useEffect, useState } from "react";
import type { Task, Subtask } from "@/lib/tasks";
import { MOCK_TASKS } from "@/lib/mock-data";

const KEY = "student-tasks-v3";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const addTask = useCallback(
    (t: Omit<Task, "id" | "createdAt" | "status" | "progress" | "subtasks"> & {
      subtasks?: Subtask[];
    }) => {
      setTasks((prev) => [
        ...prev,
        {
          ...t,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: "not_started",
          progress: 0,
          subtasks: t.subtasks ?? [],
        },
      ]);
    },
    [],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [],
  );

  const deleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const toggleComplete = useCallback(
    (id: string) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: t.status === "completed" ? "in_progress" : "completed",
                progress: t.status === "completed" ? t.progress : 100,
              }
            : t,
        ),
      ),
    [],
  );

  const toggleSubtask = useCallback((taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const subs = t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s));
        const pct =
          subs.length === 0
            ? t.progress
            : Math.round((subs.filter((s) => s.done).length / subs.length) * 100);
        return {
          ...t,
          subtasks: subs,
          progress: pct,
          status: pct === 100 ? "completed" : pct > 0 ? "in_progress" : t.status,
        };
      }),
    );
  }, []);

  const addSubtask = useCallback((taskId: string, name: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: [...t.subtasks, { id: crypto.randomUUID(), name, done: false }] }
          : t,
      ),
    );
  }, []);

  const deleteSubtask = useCallback((taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subId) } : t,
      ),
    );
  }, []);

  const updateSubtask = useCallback((taskId: string, subId: string, name: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, name } : s)) }
          : t,
      ),
    );
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    updateSubtask,
  };
}
