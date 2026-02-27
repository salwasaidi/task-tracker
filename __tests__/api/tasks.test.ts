import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock prisma before importing the route handlers
vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { GET, POST } from "@/app/api/tasks/route";
import { prisma } from "@/lib/prisma";

const mockTask = {
  id: "clx123abc",
  title: "Test Task",
  description: "Test description",
  status: "TODO",
  priority: "MEDIUM",
  createdAt: new Date("2026-02-27"),
  updatedAt: new Date("2026-02-27"),
};

describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all tasks successfully", async () => {
    (prisma.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      mockTask,
    ]);

    const request = new NextRequest("http://localhost:3000/api/tasks");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].title).toBe("Test Task");
  });

  it("filters tasks by status query param", async () => {
    (prisma.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/tasks?status=DONE"
    );
    await GET(request);

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "DONE" }),
      })
    );
  });

  it("filters tasks by priority query param", async () => {
    (prisma.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/tasks?priority=HIGH"
    );
    await GET(request);

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ priority: "HIGH" }),
      })
    );
  });

  it("searches tasks by search query param", async () => {
    (prisma.task.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const request = new NextRequest(
      "http://localhost:3000/api/tasks?search=login"
    );
    await GET(request);

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({
              title: { contains: "login", mode: "insensitive" },
            }),
          ]),
        }),
      })
    );
  });

  it("handles database errors gracefully", async () => {
    (prisma.task.findMany as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("DB connection failed")
    );

    const request = new NextRequest("http://localhost:3000/api/tasks");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to fetch tasks");
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a task with valid data", async () => {
    const newTask = { ...mockTask, id: "clx456def", title: "New Task" };
    (prisma.task.create as ReturnType<typeof vi.fn>).mockResolvedValue(
      newTask
    );

    const request = new NextRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Task",
        status: "TODO",
        priority: "HIGH",
      }),
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.title).toBe("New Task");
  });

  it("returns 400 for invalid data (empty title)", async () => {
    const request = new NextRequest("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "" }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
