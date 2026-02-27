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

const PRIORITY_EMOJI: Record<TaskPriority, string> = {
  LOW: "\u{1F33F}",
  MEDIUM: "\u{1F499}",
  HIGH: "\u{1F525}",
  URGENT: "\u{1F6A8}",
};

const PRIORITY_BORDER: Record<TaskPriority, string> = {
  LOW: "border-l-green-300 dark:border-l-green-600",
  MEDIUM: "border-l-sky-300 dark:border-l-sky-500",
  HIGH: "border-l-amber-300 dark:border-l-amber-500",
  URGENT: "border-l-red-400 dark:border-l-red-500",
};

export function TaskCard({ task }: TaskCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

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
    <div
      className={`group relative rounded-xl border-2 border-l-4 ${PRIORITY_BORDER[task.priority]} border-pink-100 dark:border-pink-800/30 bg-card p-4 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-pink-200 dark:hover:border-pink-700/50 ${isPending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="flex-1 min-w-0"
        >
          <h3 className="font-bold text-sm leading-snug truncate hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
            {task.title}
          </h3>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
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

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-pink-100 dark:border-pink-800/30">
        <Badge variant="secondary" className={`text-[11px] font-bold rounded-full px-2.5 ${PRIORITY_COLORS[task.priority]}`}>
          <span className="mr-1">{PRIORITY_EMOJI[task.priority]}</span>
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
