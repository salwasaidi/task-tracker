import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const tasks = [
    { title: "Set up project repository", description: "Initialize Git repo, add README, and configure CI/CD pipeline", status: "DONE" as const, priority: "HIGH" as const },
    { title: "Design database schema", description: "Create ERD and define all tables, relationships, and indexes", status: "DONE" as const, priority: "HIGH" as const },
    { title: "Build authentication flow", description: "Implement login, signup, and password reset using OAuth", status: "IN_PROGRESS" as const, priority: "URGENT" as const },
    { title: "Create dashboard UI", description: "Build the main dashboard layout with sidebar navigation and stats cards", status: "IN_PROGRESS" as const, priority: "HIGH" as const },
    { title: "Implement API endpoints", description: "Build REST API for CRUD operations on tasks and users", status: "IN_PROGRESS" as const, priority: "MEDIUM" as const },
    { title: "Add search functionality", description: "Full-text search across tasks with filters for status and priority", status: "TODO" as const, priority: "MEDIUM" as const },
    { title: "Write unit tests", description: "Add tests for validation schemas, API routes, and key components", status: "TODO" as const, priority: "MEDIUM" as const },
    { title: "Set up email notifications", description: "Send email alerts when tasks are assigned or status changes", status: "TODO" as const, priority: "LOW" as const },
    { title: "Fix mobile navigation bug", description: "Hamburger menu does not close after selecting a nav item on mobile", status: "TODO" as const, priority: "URGENT" as const },
    { title: "Optimize image loading", description: "Implement lazy loading and WebP conversion for uploaded images", status: "TODO" as const, priority: "LOW" as const },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Created ${tasks.length} tasks`);
  await prisma.$disconnect();
}

seed();
