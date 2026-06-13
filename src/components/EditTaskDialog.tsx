import { useEffect, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Priority, Category, Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onToggleSubtask: (taskId: string, subId: string) => void;
  onAddSubtask: (taskId: string, name: string) => void;
  onDeleteSubtask: (taskId: string, subId: string) => void;
  onUpdateSubtask: (taskId: string, subId: string, name: string) => void;
}

function toLocal(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onToggleSubtask,
  onAddSubtask,
  onDeleteSubtask,
  onUpdateSubtask,
}: Props) {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description ?? "");
  const [deadline, setDeadline] = useState(toLocal(task.deadline));
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState<Category>(task.category);
  const [workload, setWorkload] = useState<string>(String(task.workload));
  const [newSub, setNewSub] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    if (open) {
      setName(task.name);
      setDescription(task.description ?? "");
      setDeadline(toLocal(task.deadline));
      setPriority(task.priority);
      setCategory(task.category);
      setWorkload(String(task.workload));
      setEditingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (newSub.trim()) {
      onAddSubtask(task.id, newSub.trim());
      setNewSub("");
    }
    onUpdate(task.id, {
      name: name.trim(),
      description: description.trim() || undefined,
      deadline: new Date(deadline).toISOString(),
      priority,
      category,
      workload: Number(workload) || 30,
    });
    onOpenChange(false);
  };

  const commitRename = (subId: string) => {
    if (editingName.trim()) onUpdateSubtask(task.id, subId, editingName.trim());
    setEditingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>Update details and manage subtasks.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="e-name">Task name</Label>
            <Input id="e-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-desc">Description</Label>
            <Textarea
              id="e-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-deadline">Deadline</Label>
            <Input
              id="e-deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="e-workload">Workload (min)</Label>
              <Input
                id="e-workload"
                type="number"
                min={5}
                step={5}
                value={workload}
                onChange={(e) => setWorkload(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-xl border bg-secondary/30 p-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Subtasks ({task.subtasks.length})
            </Label>
            <div className="space-y-1.5">
              {task.subtasks.map((s) => (
                <div
                  key={s.id}
                  className="group flex items-center gap-2 rounded-lg bg-card px-2 py-1.5"
                >
                  <button
                    type="button"
                    onClick={() => onToggleSubtask(task.id, s.id)}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all",
                      s.done
                        ? "border-success bg-success text-success-foreground"
                        : "border-muted-foreground/30 hover:border-primary",
                    )}
                  >
                    {s.done && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                  </button>
                  {editingId === s.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitRename(s.id);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="h-7 flex-1"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => commitRename(s.id)}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          s.done ? "text-muted-foreground line-through" : "text-foreground",
                        )}
                      >
                        {s.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(s.id);
                          setEditingName(s.name);
                        }}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Edit subtask"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSubtask(task.id, s.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Delete subtask"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newSub.trim()) {
                      onAddSubtask(task.id, newSub.trim());
                      setNewSub("");
                    }
                  }
                }}
                placeholder="Add a subtask and press Enter..."
                className="h-8 border-0 bg-card px-2 text-sm shadow-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
