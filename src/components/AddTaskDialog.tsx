import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Category, Task, Subtask } from "@/lib/tasks";
import { useT, DEFAULT_SUBTASKS } from "@/lib/i18n";

interface Props {
  onAdd: (
    t: Omit<Task, "id" | "createdAt" | "status" | "progress" | "subtasks"> & {
      subtasks?: Subtask[];
    },
  ) => void;
  trigger?: React.ReactNode;
}

function defaultDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function AddTaskDialog({ onAdd, trigger }: Props) {
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(defaultDeadline());
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("School");
  const [workload, setWorkload] = useState<string>("45");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const subtaskNames = DEFAULT_SUBTASKS[lang][category];
    const subtasks: Subtask[] = subtaskNames.map((n) => ({
      id: crypto.randomUUID(),
      name: n,
      done: false,
    }));
    onAdd({
      name: name.trim(),
      description: description.trim() || undefined,
      deadline: new Date(deadline).toISOString(),
      priority,
      category,
      workload: Number(workload) || 30,
      subtasks,
    });
    setName("");
    setDescription("");
    setWorkload("45");
    setPriority("medium");
    setCategory("School");
    setDeadline(defaultDeadline());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg" className="rounded-full shadow-[var(--shadow-soft)]">
            <Plus className="mr-1 h-5 w-5" /> {t("task.addBtn")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("task.new")}</DialogTitle>
          <DialogDescription>{t("task.new.desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("task.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("task.name.placeholder")}
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">{t("task.description")}</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("task.description.placeholder")}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">{t("task.deadline")}</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>{t("task.priority")}</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("priority.low")}</SelectItem>
                  <SelectItem value="medium">{t("priority.medium")}</SelectItem>
                  <SelectItem value="high">{t("priority.high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("task.category")}</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="School">{t("category.School")}</SelectItem>
                  <SelectItem value="Work">{t("category.Work")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workload">{t("task.workload")}</Label>
              <Input
                id="workload"
                type="number"
                min={5}
                step={5}
                value={workload}
                onChange={(e) => setWorkload(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            ✨ {DEFAULT_SUBTASKS[lang][category].join(" · ")}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("task.cancel")}
            </Button>
            <Button type="submit">{t("task.add")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
