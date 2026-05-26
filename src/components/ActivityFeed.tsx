import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, PlusCircle, Pencil, CalendarClock, TrendingUp } from "lucide-react";
import { MOCK_ACTIVITY, type ActivityItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const META: Record<
  ActivityItem["type"],
  { icon: typeof CheckCircle2; label: string; color: string; tint: string }
> = {
  completed: { icon: CheckCircle2, label: "Completed", color: "text-success", tint: "bg-success/10" },
  created: { icon: PlusCircle, label: "Created", color: "text-primary", tint: "bg-primary/10" },
  updated: { icon: Pencil, label: "Updated", color: "text-foreground", tint: "bg-secondary" },
  rescheduled: {
    icon: CalendarClock,
    label: "Rescheduled",
    color: "text-[oklch(0.45_0.13_75)]",
    tint: "bg-warning/15",
  },
  progress: { icon: TrendingUp, label: "Progress", color: "text-primary", tint: "bg-primary/10" },
};

export function ActivityFeed({ limit }: { limit?: number }) {
  const items = limit ? MOCK_ACTIVITY.slice(0, limit) : MOCK_ACTIVITY;
  return (
    <div className="space-y-3">
      {items.map((a, idx) => {
        const m = META[a.type];
        const Icon = m.icon;
        return (
          <div
            key={a.id}
            className="relative flex gap-4 rounded-2xl border bg-card p-4 transition-all hover:shadow-[var(--shadow-soft)] animate-fade-in"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                m.tint,
              )}
            >
              <Icon className={cn("h-4 w-4", m.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                <span className={m.color}>{m.label}</span> · {a.taskName}
              </p>
              {a.detail && (
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              )}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(a.time), { addSuffix: true })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
