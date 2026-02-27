"use client";

import { CreateTaskDialog } from "./create-task-dialog";
import { Sun, Moon, Heart, Star, Clock, CheckCircle2, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface DashboardHeaderProps {
  counts: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
}

export function DashboardHeader({ counts }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="mb-8">
      {/* Kawaii Hero */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-400 via-rose-300 to-pink-300 p-5 sm:p-8 text-white shadow-xl shadow-pink-200/50 dark:shadow-pink-900/30 mb-6">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 text-4xl opacity-20 animate-pulse">&#9829;</div>
        <div className="absolute top-12 right-24 text-2xl opacity-15 animate-pulse" style={{ animationDelay: "0.5s" }}>&#9733;</div>
        <div className="absolute bottom-4 left-8 text-3xl opacity-15 animate-pulse" style={{ animationDelay: "1s" }}>&#9829;</div>
        <div className="absolute bottom-8 right-16 text-xl opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}>&#10047;</div>
        <div className="absolute top-6 left-1/2 text-2xl opacity-10 animate-pulse" style={{ animationDelay: "0.8s" }}>&#9733;</div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm text-xl sm:text-2xl">
              &#127800;
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm">
                Task Tracker
              </h1>
              <p className="text-pink-100 text-xs sm:text-sm flex items-center gap-1">
                Stay organized, stay kawaii &#127872;
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white hover:bg-white/20 hover:text-white rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            <CreateTaskDialog />
          </div>
        </div>
      </div>

      {/* Cute Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-pink-200 dark:border-pink-800/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 text-lg">
            &#127799;
          </div>
          <div>
            <p className="text-2xl font-extrabold text-pink-600 dark:text-pink-400">{counts.total}</p>
            <p className="text-xs text-muted-foreground font-medium">Total</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-purple-200 dark:border-purple-800/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/50 dark:to-violet-900/50 text-lg">
            &#128221;
          </div>
          <div>
            <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{counts.todo}</p>
            <p className="text-xs text-muted-foreground font-medium">To Do</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-sky-200 dark:border-sky-800/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/50 dark:to-blue-900/50 text-lg">
            &#9203;
          </div>
          <div>
            <p className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">{counts.inProgress}</p>
            <p className="text-xs text-muted-foreground font-medium">In Progress</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 text-lg">
            &#127775;
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{counts.done}</p>
            <p className="text-xs text-muted-foreground font-medium">Done</p>
          </div>
        </div>
      </div>
    </div>
  );
}
