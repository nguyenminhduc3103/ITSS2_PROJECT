import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Trash2,
  CircleDot,
  Circle,
  ChevronRight,
  Plus,
  Hourglass,
  Pencil,
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import type { Task, Status } from "@/lib/tasks";
import { priorityScore, subtaskProgress } from "@/lib/tasks";
import { PriorityBadge } from "./PriorityBadge";
import { EditTaskDialog } from "./EditTaskDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCycleStatus: (id: string) => void;
  onToggleSubtask?: (taskId: string, subId: string) => void;
  onAddSubtask?: (taskId: string, name: string) => void;
  onDeleteSubtask?: (taskId: string, subId: string) => void;
  onUpdateTask?: (id: string, patch: Partial<Task>) => void;
  onUpdateSubtask?: (taskId: string, subId: string, name: string) => void;
  featured?: boolean;
}

function nextStatus(s: Status): Status {
  return s === "not_started" ? "in_progress" : s === "in_progress" ? "completed" : "not_started";
}

const CATEGORY_TINT: Record<string, string> = {
  School: "bg-primary/10 text-primary",
  Project: "bg-accent text-accent-foreground",
  Internship: "bg-warning/15 text-[oklch(0.45_0.13_75)]",
  Work: "bg-success/15 text-[oklch(0.4_0.1_160)]",
  Personal: "bg-secondary text-secondary-foreground",
};

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onCycleStatus,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateTask,
  onUpdateSubtask,
  featured,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [newSub, setNewSub] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const completed = task.status === "completed";
  const overdue = !completed && isPast(new Date(task.deadline));
  const deadline = new Date(task.deadline);
  const progress = subtaskProgress(task);

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card p-4 transition-all duration-300 animate-fade-in",
        "hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5",
        featured && "border-primary/30 bg-gradient-to-br from-primary-soft/60 to-card",
        completed && "opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          aria-label="Toggle complete"
          className={cn(
            "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            completed
              ? "border-success bg-success text-success-foreground"
              : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5",
          )}
        >
          {completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "font-semibold text-foreground",
                featured && "text-lg",
                completed && "line-through",
                onUpdateTask && "cursor-pointer hover:text-primary transition-colors",
              )}
              onClick={() => onUpdateTask && setEditOpen(true)}
              title={onUpdateTask ? "Click to edit" : undefined}
            >
              {task.name}
            </h3>
            <PriorityBadge priority={task.priority} />
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                CATEGORY_TINT[task.category] ?? "bg-secondary text-secondary-foreground",
              )}
            >
              {task.category}
            </span>
            <button
              onClick={() => onCycleStatus(task.id)}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              {task.status === "in_progress" ? (
                <CircleDot className="h-3 w-3 text-primary" />
              ) : task.status === "completed" ? (
                <Check className="h-3 w-3 text-success" />
              ) : task.status === "overdue" ? (
                <Hourglass className="h-3 w-3 text-destructive" />
              ) : (
                <Circle className="h-3 w-3" />
              )}
              {task.status === "in_progress"
                ? "In progress"
                : task.status === "completed"
                  ? "Done"
                  : task.status === "overdue"
                    ? "Overdue"
                    : "Not started"}
            </button>
          </div>

          {task.description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                overdue && "font-medium text-destructive",
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {overdue ? "Overdue · " : ""}
              {formatDistanceToNow(deadline, { addSuffix: true })}
              <span className="text-muted-foreground/60">
                · {format(deadline, "MMM d, h:mm a")}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hourglass className="h-3.5 w-3.5" />
              {task.workload} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Score {priorityScore(task)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  completed ? "bg-success" : "bg-gradient-to-r from-primary to-accent",
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-9 text-right text-xs font-medium tabular-nums text-muted-foreground">
              {progress}%
            </span>
          </div>

          {task.subtasks.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <ChevronRight
                className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")}
              />
              {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {onUpdateTask && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditOpen(true)}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 space-y-1.5 border-t pt-3 animate-fade-in">
          {task.subtasks.map((s) => (
            <div
              key={s.id}
              className="group/sub flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/50"
            >
              <button
                onClick={() => onToggleSubtask?.(task.id, s.id)}
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
                  s.done
                    ? "border-success bg-success text-success-foreground"
                    : "border-muted-foreground/30 hover:border-primary",
                )}
              >
                {s.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </button>
              {renamingId === s.id && onUpdateSubtask ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (renameValue.trim()) {
                      onUpdateSubtask(task.id, s.id, renameValue.trim());
                    }
                    setRenamingId(null);
                  }}
                  className="flex flex-1 items-center gap-1"
                >
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => setRenamingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    autoFocus
                    className="h-6 flex-1 border-0 bg-card px-1 text-sm shadow-none focus-visible:ring-1"
                  />
                </form>
              ) : (
                <span
                  className={cn(
                    "flex-1 text-sm",
                    s.done ? "text-muted-foreground line-through" : "text-foreground",
                    onUpdateSubtask && "cursor-text",
                  )}
                  onDoubleClick={() => {
                    if (onUpdateSubtask) {
                      setRenamingId(s.id);
                      setRenameValue(s.name);
                    }
                  }}
                  title={onUpdateSubtask ? "Double-click to rename" : undefined}
                >
                  {s.name}
                </span>
              )}
              {onUpdateSubtask && renamingId !== s.id && (
                <button
                  type="button"
                  onClick={() => {
                    setRenamingId(s.id);
                    setRenameValue(s.name);
                  }}
                  className="opacity-0 transition-opacity group-hover/sub:opacity-100"
                  aria-label="Rename subtask"
                >
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
              {onDeleteSubtask && (
                <button
                  onClick={() => onDeleteSubtask(task.id, s.id)}
                  className="opacity-0 transition-opacity group-hover/sub:opacity-100"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
          {onAddSubtask && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newSub.trim()) {
                  onAddSubtask(task.id, newSub.trim());
                  setNewSub("");
                }
              }}
              className="flex items-center gap-2 pt-1"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                placeholder="Add a subtask..."
                className="h-7 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
              />
            </form>
          )}
        </div>
      )}

      {onUpdateTask && (
        <EditTaskDialog
          task={task}
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdate={onUpdateTask}
          onToggleSubtask={(tid, sid) => onToggleSubtask?.(tid, sid)}
          onAddSubtask={(tid, name) => onAddSubtask?.(tid, name)}
          onDeleteSubtask={(tid, sid) => onDeleteSubtask?.(tid, sid)}
          onUpdateSubtask={(tid, sid, name) => onUpdateSubtask?.(tid, sid, name)}
        />
      )}
    </div>
  );
}

export { nextStatus };
