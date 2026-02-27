"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createTask } from "@/actions/tasks";
import { toast } from "sonner";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/types";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createTask(formData);
        toast.success("\uD83C\uDF80 Task created!");
        setOpen(false);
      } catch {
        toast.error("Failed to create task");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-pink-600 hover:bg-pink-50 font-bold shadow-sm rounded-full px-5">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your board~
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold">Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="What needs to be done?"
              required
              maxLength={100}
              className="rounded-xl border-pink-200 dark:border-pink-800/30 focus-visible:ring-pink-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add more details..."
              rows={3}
              maxLength={500}
              className="rounded-xl border-pink-200 dark:border-pink-800/30 focus-visible:ring-pink-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="font-bold">Status</Label>
              <Select name="status" defaultValue="TODO">
                <SelectTrigger className="rounded-xl border-pink-200 dark:border-pink-800/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="font-bold">Priority</Label>
              <Select name="priority" defaultValue="MEDIUM">
                <SelectTrigger className="rounded-xl border-pink-200 dark:border-pink-800/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-pink-100 dark:border-pink-800/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full border-pink-200 dark:border-pink-800/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 font-bold"
            >
              {isPending ? "Creating..." : "\uD83C\uDF80 Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
