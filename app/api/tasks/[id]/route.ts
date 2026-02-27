import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const body = await request.json();
    const validated = updateTaskSchema.parse(body);

    const task = await prisma.task.update({
      where: { id },
      data: validated,
    });
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid task data" },
        { status: 400 }
      );
    }
    console.error("Failed to update task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Task deleted" });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
