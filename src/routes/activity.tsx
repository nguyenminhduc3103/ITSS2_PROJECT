import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ActivityFeed } from "@/components/ActivityFeed";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — FocusFlow" },
      { name: "description", content: "Chronological history of task updates and progress." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { t } = useT();
  return (
    <AppShell title={t("activity.title")} subtitle={t("activity.subtitle")}>
      <div className="mx-auto max-w-3xl">
        <ActivityFeed />
      </div>
    </AppShell>
  );
}
