"use server";

import { prisma } from "@/lib/prisma";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
  };

  const validated = createTaskSchema.parse(raw);
  await prisma.task.create({ data: validated });
  revalidatePath("/dashboard");
}

export async function updateTask(id: string, formData: FormData) {
  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
  };

  const validated = updateTaskSchema.parse(raw);
  await prisma.task.update({ where: { id }, data: validated });
  revalidatePath("/dashboard");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: string) {
  await prisma.task.delete({ where: { id } });
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateTaskStatus(id: string, status: string) {
  const validated = updateTaskSchema.parse({ status });
  await prisma.task.update({ where: { id }, data: validated });
  revalidatePath("/dashboard");
  revalidatePath(`/tasks/${id}`);
}
