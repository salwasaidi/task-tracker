"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Pencil, Trash2, Calendar, Clock, Flag, Tag } from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  type Task,
} from "@/lib/types";
import { deleteTask } from "@/actions/tasks";
import { EditTaskDialog } from "./edit-task-dialog";
import { toast } from "sonner";

interface TaskDetailCardProps {
  task: Task;
}

export function TaskDetailCard({ task }: TaskDetailCardProps) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteTask(task.id);
        toast.success("Task deleted!");
      } catch {
        toast.error("Failed to delete task");
      }
    });
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-pink-600 rounded-full">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden shadow-lg rounded-2xl border-2 border-pink-200 dark:border-pink-800/40">
        {/* Colored top bar */}
        <div className={`h-3 ${
          task.status === "TODO" ? "bg-gradient-to-r from-purple-400 to-violet-400" :
          task.status === "IN_PROGRESS" ? "bg-gradient-to-r from-sky-400 to-blue-400" :
          "bg-gradient-to-r from-pink-400 to-rose-400"
        }`} />

        <CardHeader className="pb-4 pt-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">{task.title}</h1>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="gap-2 rounded-full border-pink-200 dark:border-pink-800/30"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="gap-2 rounded-full"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge className={`${STATUS_COLORS[task.status]} gap-1 rounded-full font-bold`}>
              <Tag className="h-3 w-3" />
              {STATUS_LABELS[task.status]}
            </Badge>
            <Badge className={`${PRIORITY_COLORS[task.priority]} gap-1 rounded-full font-bold`}>
              <Flag className="h-3 w-3" />
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          </div>
        </CardHeader>

        <Separator className="bg-pink-100 dark:bg-pink-800/30" />

        <CardContent className="pt-6 px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Description
            </h2>
            {task.description ? (
              <div className="rounded-xl bg-pink-50/50 dark:bg-pink-900/10 p-4 border border-pink-100 dark:border-pink-800/20">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-800/30 p-4 text-center">
                <p className="text-sm text-muted-foreground italic">
                  No description provided~
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4 bg-pink-100 dark:bg-pink-800/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 p-3 border border-purple-100 dark:border-purple-800/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50 text-base">
                {"\u{1F4C5}"}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Created</p>
                <p className="text-sm font-medium">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-sky-50/50 dark:bg-sky-900/10 p-3 border border-sky-100 dark:border-sky-800/20">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/50 text-base">
                {"\u{23F0}"}
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold">Updated</p>
                <p className="text-sm font-medium">
                  {new Date(task.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog task={task} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
