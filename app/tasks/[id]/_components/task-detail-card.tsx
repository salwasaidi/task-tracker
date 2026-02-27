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
        toast.success("Task deleted");
      } catch {
        toast.error("Failed to delete task");
      }
    });
  };

  return (
    <>
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden shadow-lg">
        {/* Colored top bar based on status */}
        <div className={`h-2 ${
          task.status === "TODO" ? "bg-gradient-to-r from-slate-400 to-slate-500" :
          task.status === "IN_PROGRESS" ? "bg-gradient-to-r from-blue-500 to-indigo-600" :
          "bg-gradient-to-r from-emerald-500 to-green-600"
        }`} />

        <CardHeader className="pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold leading-tight">{task.title}</h1>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
                className="gap-2"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="gap-2"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge className={`${STATUS_COLORS[task.status]} gap-1`}>
              <Tag className="h-3 w-3" />
              {STATUS_LABELS[task.status]}
            </Badge>
            <Badge className={`${PRIORITY_COLORS[task.priority]} gap-1`}>
              <Flag className="h-3 w-3" />
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Description
            </h2>
            {task.description ? (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground italic">
                  No description provided
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Created</p>
                <p className="text-sm font-medium">
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Updated</p>
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
