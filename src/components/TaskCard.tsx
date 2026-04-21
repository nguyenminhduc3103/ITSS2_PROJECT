import { Check, Clock, Trash2, CircleDot, Circle } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import type { Task } from "@/lib/tasks";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCycleStatus: (id: string) => void;
  featured?: boolean;
}

export function TaskCard({ task, onToggle, onDelete, onCycleStatus, featured }: Props) {
  const completed = task.status === "completed";
  const overdue = !completed && isPast(new Date(task.deadline));
  const deadline = new Date(task.deadline);

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 rounded-2xl border bg-card p-4 transition-all duration-300 animate-fade-in",
        "hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5",
        featured && "border-primary/30 bg-primary-soft/40",
        completed && "opacity-60",
      )}
    >
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
            )}
          >
            {task.name}
          </h3>
          <PriorityBadge priority={task.priority} />
          <button
            onClick={() => onCycleStatus(task.id)}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            {task.status === "in_progress" ? (
              <CircleDot className="h-3 w-3 text-primary" />
            ) : task.status === "completed" ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
            {task.status === "in_progress"
              ? "In progress"
              : task.status === "completed"
                ? "Done"
                : "Not started"}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className={cn("inline-flex items-center gap-1.5", overdue && "text-destructive font-medium")}>
            <Clock className="h-3.5 w-3.5" />
            {overdue ? "Overdue · " : ""}
            {formatDistanceToNow(deadline, { addSuffix: true })}
            <span className="text-muted-foreground/60">· {format(deadline, "MMM d, h:mm a")}</span>
          </span>
          {task.duration && <span>~{task.duration} min</span>}
        </div>
      </div>

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
  );
}
