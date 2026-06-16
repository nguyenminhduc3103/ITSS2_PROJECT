import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  Calendar as CalendarIcon,
  BarChart3,
  History,
  GraduationCap,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/lib/i18n";

const NAV = [
  { to: "/", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/tasks", labelKey: "nav.tasks", icon: ListChecks },
  { to: "/calendar", labelKey: "nav.calendar", icon: CalendarIcon },
  { to: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
  { to: "/activity", labelKey: "nav.activity", icon: History },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  const { location } = useRouterState();
  const { t } = useT();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-card/60 backdrop-blur-sm lg:flex">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-[var(--shadow-soft)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">FocusFlow</h1>
            <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="m-3 rounded-2xl border bg-gradient-to-br from-primary-soft to-accent/40 p-4">
          <p className="text-xs font-semibold text-foreground">{t("sidebar.streak")}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{t("sidebar.streak.value")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("sidebar.streak.sub")}</p>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
            <div className="relative hidden flex-1 max-w-md md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("topbar.search")} className="rounded-full bg-secondary/60 pl-9" />
            </div>
            <div className="flex-1 md:hidden" />
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-soft)]" />
          </div>
        </header>

        <nav className="sticky top-[57px] z-20 flex gap-1 overflow-x-auto border-b bg-card/60 px-3 py-2 backdrop-blur-sm lg:hidden">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <main className="px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
          </div>
          {children}
        </main>
      </div>

      <Link
        to="/tasks"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 lg:hidden"
        aria-label="Add task"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
}
