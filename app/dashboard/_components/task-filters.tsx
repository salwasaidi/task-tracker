"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/types";

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      }
      return current.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const qs = createQueryString({ search: search || null });
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, createQueryString, pathname, router]);

  const handleStatusChange = (value: string) => {
    const qs = createQueryString({
      status: value === "ALL" ? null : value,
    });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const handlePriorityChange = (value: string) => {
    const qs = createQueryString({
      priority: value === "ALL" ? null : value,
    });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  const hasFilters =
    searchParams.has("status") ||
    searchParams.has("priority") ||
    searchParams.has("search");

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 rounded-2xl border-2 border-pink-200 dark:border-pink-800/40 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mr-2 hidden sm:flex">
        <span className="text-base">{"\uD83D\uDD0D"}</span>
        <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
      </div>

      <div className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-pink-50/50 dark:bg-pink-900/10 rounded-xl border-pink-200 dark:border-pink-800/30 focus-visible:ring-pink-400"
        />
      </div>

      <Select
        value={searchParams.get("status") ?? "ALL"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[160px] bg-pink-50/50 dark:bg-pink-900/10 rounded-xl border-pink-200 dark:border-pink-800/30">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="ALL">All Statuses</SelectItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("priority") ?? "ALL"}
        onValueChange={handlePriorityChange}
      >
        <SelectTrigger className="w-full sm:w-[160px] bg-pink-50/50 dark:bg-pink-900/10 rounded-xl border-pink-200 dark:border-pink-800/30">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="ALL">All Priorities</SelectItem>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-pink-600 rounded-full"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
