"use client";

import { TaskCard } from "./task-card";
import { STATUS_LABELS, type Task, type TaskStatus } from "@/lib/types";
import { ListTodo, Loader, CheckCircle2 } from "lucide-react";

interface TaskBoardProps {
  tasks: Task[];
}

const COLUMNS: {
  status: TaskStatus;
  icon: React.ReactNode;
  gradient: string;
  dot: string;
  bg: string;
}[] = [
  {
    status: "TODO",
    icon: <ListTodo className="h-4 w-4" />,
    gradient: "from-slate-500 to-slate-600",
    dot: "bg-slate-400",
    bg: "bg-slate-50/50 dark:bg-slate-900/20",
  },
  {
    status: "IN_PROGRESS",
    icon: <Loader className="h-4 w-4" />,
    gradient: "from-blue-500 to-indigo-600",
    dot: "bg-blue-400",
    bg: "bg-blue-50/50 dark:bg-blue-900/10",
  },
  {
    status: "DONE",
    icon: <CheckCircle2 className="h-4 w-4" />,
    gradient: "from-emerald-500 to-green-600",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50/50 dark:bg-emerald-900/10",
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
            className={`flex items-center gap-2 rounded-t-xl bg-gradient-to-r ${column.gradient} px-4 py-3 text-white shadow-sm`}
          >
            {column.icon}
            <span className="font-semibold text-sm">
              {STATUS_LABELS[column.status]}
            </span>
            <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              {column.tasks.length}
            </span>
          </div>

          {/* Column Body */}
          <div
            className={`flex-1 rounded-b-xl border border-t-0 ${column.bg} p-3 space-y-3 min-h-[280px]`}
          >
            {column.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className={`h-3 w-3 rounded-full ${column.dot} mb-3 opacity-40`} />
                <p className="text-sm">No tasks yet</p>
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
