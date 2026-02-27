import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { TaskCard } from "@/app/dashboard/_components/task-card";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/dashboard",
}));

// Mock server actions
vi.mock("@/actions/tasks", () => ({
  deleteTask: vi.fn(),
}));

// Mock sonner
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

afterEach(() => {
  cleanup();
});

const mockTask = {
  id: "test-task-1",
  title: "Implement authentication",
  description: "Add OAuth login flow for Google and GitHub",
  status: "TODO" as const,
  priority: "HIGH" as const,
  createdAt: new Date("2026-02-27"),
  updatedAt: new Date("2026-02-27"),
};

describe("TaskCard", () => {
  it("renders the task title", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Implement authentication")).toBeInTheDocument();
  });

  it("renders the task description", () => {
    render(<TaskCard task={mockTask} />);
    const descriptions = screen.getAllByText(
      "Add OAuth login flow for Google and GitHub"
    );
    expect(descriptions.length).toBeGreaterThanOrEqual(1);
  });

  it("displays the priority badge", () => {
    render(<TaskCard task={mockTask} />);
    const badges = screen.getAllByText("High");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("contains a link to the task detail page", () => {
    render(<TaskCard task={mockTask} />);
    const links = screen.getAllByRole("link");
    const detailLink = links.find(
      (link) => link.getAttribute("href") === "/tasks/test-task-1"
    );
    expect(detailLink).toBeDefined();
  });

  it("renders without description gracefully", () => {
    const taskWithoutDesc = { ...mockTask, description: null };
    render(<TaskCard task={taskWithoutDesc} />);
    expect(screen.getByText("Implement authentication")).toBeInTheDocument();
    expect(
      screen.queryByText("Add OAuth login flow for Google and GitHub")
    ).not.toBeInTheDocument();
  });

  it("displays the creation date", () => {
    render(<TaskCard task={mockTask} />);
    const dateElements = screen.getAllByText(/2\/27\/2026|27\/2\/2026|2026/);
    expect(dateElements.length).toBeGreaterThanOrEqual(1);
  });
});
