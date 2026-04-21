import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/tasks";

const styles: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/15 text-warning-foreground border-warning/30",
  low: "bg-accent text-accent-foreground border-accent",
};

const labels: Record<Priority, string> = { high: "High", medium: "Medium", low: "Low" };

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[priority],
        className,
      )}
    >
      {labels[priority]}
    </span>
  );
}
