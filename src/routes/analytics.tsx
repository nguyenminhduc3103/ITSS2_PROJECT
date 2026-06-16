import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { useTasks } from "@/hooks/use-tasks";
import { AppShell } from "@/components/AppShell";
import { ProgressOverview } from "@/components/ProgressOverview";
import { WeeklyChart } from "@/components/WeeklyChart";
import { weeklyProgress } from "@/lib/tasks";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FocusFlow" },
      { name: "description", content: "Track your productivity, workload, and completion trends." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { t } = useT();
  const { tasks } = useTasks();
  const wp = weeklyProgress(tasks);
  const overdue = tasks.filter((x) => x.status === "overdue").length;
  const inProgress = tasks.filter((x) => x.status === "in_progress").length;
  const totalWorkload = Math.round(
    tasks.filter((x) => x.status !== "completed").reduce((s, x) => s + x.workload, 0) / 60,
  );

  const stats = [
    {
      label: t("analytics.completion"),
      value: `${wp.percent}%`,
      sub: `${wp.completed}/${wp.total} ${t("analytics.thisWeek")}`,
      icon: CheckCircle2,
      color: "from-success/20 to-success/5 text-success",
    },
    {
      label: t("analytics.active"),
      value: String(inProgress),
      sub: t("analytics.activeSub"),
      icon: TrendingUp,
      color: "from-primary/20 to-primary/5 text-primary",
    },
    {
      label: t("analytics.workloadLeft"),
      value: `${totalWorkload}h`,
      sub: t("analytics.workloadSub"),
      icon: Clock,
      color: "from-accent/40 to-accent/10 text-[oklch(0.35_0.07_165)]",
    },
    {
      label: t("analytics.overdue"),
      value: String(overdue),
      sub: t("analytics.overdueSub"),
      icon: AlertTriangle,
      color: "from-destructive/20 to-destructive/5 text-destructive",
    },
  ];

  return (
    <AppShell title={t("analytics.title")} subtitle={t("analytics.subtitle")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`rounded-3xl border bg-gradient-to-br ${s.color} p-5 shadow-[var(--shadow-soft)] animate-fade-in`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <Icon className="h-4 w-4 opacity-80" />
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <ProgressOverview tasks={tasks} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-sm font-semibold text-foreground">{t("analytics.byCategory")}</h3>
          <p className="text-xs text-muted-foreground">{t("analytics.byCategory.sub")}</p>
          <div className="mt-5 space-y-3">
            {(["School", "Work"] as const).map((c) => {
              const mins = tasks
                .filter((x) => x.category === c && x.status !== "completed")
                .reduce((s, x) => s + x.workload, 0);
              const max = 400;
              return (
                <div key={c}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{t(`category.${c}`)}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {Math.round(mins / 60)}h {mins % 60}m
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                      style={{ width: `${Math.min(100, (mins / max) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h3 className="mb-4 text-sm font-semibold text-foreground">{t("analytics.recent")}</h3>
          <ActivityFeed limit={5} />
        </div>
      </div>
    </AppShell>
  );
}
