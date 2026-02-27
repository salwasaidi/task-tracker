import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { TaskDetailCard } from "./_components/task-detail-card";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <TaskDetailCard task={task} />
    </div>
  );
}
