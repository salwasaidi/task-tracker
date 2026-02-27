"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import { PRIORITY_COLORS, PRIORITY_LABELS, type Task, type TaskPriority } from "@/lib/types";
import { deleteTask } from "@/actions/tasks";
import { toast } from "sonner";
import { useTransition } from "react";

interface TaskCardProps {
  task: Task;
}

const PRIORITY_BORDER: Record<TaskPriority, string> = {
  LOW: "border-l-slate-300 dark:border-l-slate-600",
  MEDIUM: "border-l-blue-400 dark:border-l-blue-500",
  HIGH: "border-l-orange-400 dark:border-l-orange-500",
  URGENT: "border-l-red-500 dark:border-l-red-500",
};

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

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
    <div
      className={`group relative rounded-lg border border-l-4 ${PRIORITY_BORDER[task.priority]} bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="flex-1 min-w-0"
        >
          <h3 className="font-semibold text-sm leading-snug truncate hover:text-primary transition-colors">
            {task.title}
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/tasks/${task.id}`}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
        <Badge variant="secondary" className={`text-[11px] font-medium ${PRIORITY_COLORS[task.priority]}`}>
          {PRIORITY_LABELS[task.priority]}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
