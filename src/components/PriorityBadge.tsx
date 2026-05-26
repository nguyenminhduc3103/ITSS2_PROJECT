import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/tasks";

// Spec: High = red, Medium = yellow, Low = blue
const styles: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/15 text-[oklch(0.45_0.13_75)] border-warning/30",
  low: "bg-primary/10 text-primary border-primary/20",
};

const labels: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[priority],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          priority === "high" && "bg-destructive",
          priority === "medium" && "bg-warning",
          priority === "low" && "bg-primary",
        )}
      />
      {labels[priority]}
    </span>
  );
}
