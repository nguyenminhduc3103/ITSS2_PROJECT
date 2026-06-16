import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Task } from "@/lib/tasks";
import { ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { useT } from "@/lib/i18n";

export function RescheduleDialog({
  task,
  open,
  onOpenChange,
  onConfirm,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (taskId: string, newDeadline: string) => void;
}) {
  const { t } = useT();
  const initial = task
    ? new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16)
    : "";
  const [newDeadline, setNewDeadline] = useState(initial);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("reschedule.title")}</DialogTitle>
          <DialogDescription>{t("reschedule.desc")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-secondary/50 p-4">
          <p className="text-sm font-semibold text-foreground">{task.name}</p>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex-1 rounded-lg bg-destructive/10 p-2.5">
              <p className="text-xs font-medium text-destructive">{t("reschedule.was")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {format(new Date(task.deadline), "MMM d, h:mm a")}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 rounded-lg bg-primary/10 p-2.5">
              <p className="text-xs font-medium text-primary">{t("reschedule.new")}</p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {newDeadline ? format(new Date(newDeadline), "MMM d, h:mm a") : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reschedule">{t("reschedule.pick")}</Label>
          <Input
            id="reschedule"
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-accent/40 p-3 text-xs text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          {t("reschedule.note")}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("task.cancel")}
          </Button>
          <Button
            onClick={() => {
              onConfirm(task.id, new Date(newDeadline).toISOString());
              onOpenChange(false);
            }}
          >
            {t("reschedule.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
