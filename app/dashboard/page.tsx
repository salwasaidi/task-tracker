import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DashboardHeader } from "./_components/dashboard-header";
import { TaskBoard } from "./_components/task-board";
import { TaskFilters } from "./_components/task-filters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;

  const where: Prisma.TaskWhereInput = {
    ...(params.status && { status: params.status as Prisma.EnumStatusFilter }),
    ...(params.priority && {
      priority: params.priority as Prisma.EnumPriorityFilter,
    }),
    ...(params.search && {
      OR: [
        {
          title: {
            contains: params.search,
            mode: "insensitive" as const,
          },
        },
        {
          description: {
            contains: params.search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <DashboardHeader counts={counts} />
      <TaskFilters />
      <TaskBoard tasks={tasks} />
    </div>
  );
}
