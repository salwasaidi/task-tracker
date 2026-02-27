"use client";

import { TaskCard } from "./task-card";
import { STATUS_LABELS, type Task, type TaskStatus } from "@/lib/types";

interface TaskBoardProps {
  tasks: Task[];
}

const COLUMNS: {
  status: TaskStatus;
  emoji: string;
  gradient: string;
  bg: string;
  border: string;
}[] = [
  {
    status: "TODO",
    emoji: "\u{1F338}",
    gradient: "from-purple-400 to-violet-400",
    bg: "bg-purple-50/60 dark:bg-purple-900/10",
    border: "border-purple-200 dark:border-purple-800/40",
  },
  {
    status: "IN_PROGRESS",
    emoji: "\u{1F4AB}",
    gradient: "from-sky-400 to-blue-400",
    bg: "bg-sky-50/60 dark:bg-sky-900/10",
    border: "border-sky-200 dark:border-sky-800/40",
  },
  {
    status: "DONE",
    emoji: "\u{1F31F}",
    gradient: "from-pink-400 to-rose-400",
    bg: "bg-pink-50/60 dark:bg-pink-900/10",
    border: "border-pink-200 dark:border-pink-800/40",
  },
];

export function TaskBoard({ tasks }: TaskBoardProps) {
  const grouped = COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.status),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {grouped.map((column) => (
        <div key={column.status} className="flex flex-col">
          {/* Column Header */}
          <div
            className={`flex items-center gap-2 rounded-t-2xl bg-gradient-to-r ${column.gradient} px-5 py-3.5 text-white shadow-sm`}
          >
            <span className="text-lg">{column.emoji}</span>
            <span className="font-bold text-sm">
              {STATUS_LABELS[column.status]}
            </span>
            <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-xs font-bold backdrop-blur-sm">
              {column.tasks.length}
            </span>
          </div>

          {/* Column Body */}
          <div
            className={`flex-1 rounded-b-2xl border-2 border-t-0 ${column.border} ${column.bg} p-3 space-y-3 min-h-[280px]`}
          >
            {column.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <span className="text-3xl mb-2 opacity-30">&#128516;</span>
                <p className="text-sm">No tasks here~</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
