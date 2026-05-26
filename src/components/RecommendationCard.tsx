import { Target, Clock, Coffee, BookOpen, Sparkles } from "lucide-react";
import { RECOMMENDATIONS } from "@/lib/mock-data";

const ICONS: Record<string, typeof Target> = {
  target: Target,
  clock: Clock,
  coffee: Coffee,
  book: BookOpen,
};

export function Recommendations() {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-primary-soft/60 to-accent/30 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Suggestions for today</h3>
      </div>
      <div className="space-y-2.5">
        {RECOMMENDATIONS.map((r) => {
          const Icon = ICONS[r.icon] ?? Target;
          return (
            <div
              key={r.id}
              className="flex items-start gap-3 rounded-2xl bg-card/80 p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
