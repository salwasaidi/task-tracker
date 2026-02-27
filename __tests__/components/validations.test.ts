import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";

describe("createTaskSchema", () => {
  it("accepts valid task data with all fields", () => {
    const result = createTaskSchema.safeParse({
      title: "Fix login bug",
      description: "Users cannot log in on Safari",
      status: "TODO",
      priority: "HIGH",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Fix login bug");
      expect(result.data.status).toBe("TODO");
      expect(result.data.priority).toBe("HIGH");
    }
  });

  it("applies default values for status and priority", () => {
    const result = createTaskSchema.safeParse({ title: "Minimal task" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("TODO");
      expect(result.data.priority).toBe("MEDIUM");
    }
  });

  it("rejects empty title", () => {
    const result = createTaskSchema.safeParse({
      title: "",
      status: "TODO",
      priority: "MEDIUM",
    });
    expect(result.success).toBe(false);
  });

  it("rejects title longer than 100 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status enum value", () => {
    const result = createTaskSchema.safeParse({
      title: "Valid title",
      status: "INVALID_STATUS",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid priority enum value", () => {
    const result = createTaskSchema.safeParse({
      title: "Valid title",
      priority: "CRITICAL",
    });
    expect(result.success).toBe(false);
  });

  it("allows null description", () => {
    const result = createTaskSchema.safeParse({
      title: "Task without description",
      description: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects description longer than 500 characters", () => {
    const result = createTaskSchema.safeParse({
      title: "Valid title",
      description: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("allows partial updates", () => {
    const result = updateTaskSchema.safeParse({ title: "Updated title" });
    expect(result.success).toBe(true);
  });

  it("allows empty object (no updates)", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("still validates field constraints on partial updates", () => {
    const result = updateTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });
});
