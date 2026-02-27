# Task Tracker Dashboard

A modern task management dashboard built with Next.js 15, TypeScript, and Tailwind CSS. Create, view, update, and delete tasks organized by status columns (To Do, In Progress, Done) with search and filtering capabilities.

## Live Demo

[Deployed link here after Vercel deployment]

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | App Router, Server Components, Server Actions |
| **TypeScript** | Strict mode for type safety |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible UI components |
| **Prisma** | Type-safe ORM |
| **Neon** | Serverless PostgreSQL database |
| **Zod** | Schema validation (shared between client and server) |
| **react-hook-form** | Form state management |
| **Vitest** | Unit and integration testing |

## Features

- **Kanban board** - Tasks grouped by status (To Do, In Progress, Done)
- **CRUD operations** - Create, read, update, and delete tasks
- **Search & filter** - Filter tasks by status, priority, or search text
- **URL-based filtering** - Filter state stored in URL params (shareable, bookmarkable)
- **Task detail pages** - Dynamic routes at `/tasks/[id]`
- **Loading states** - Skeleton UIs via `loading.tsx`
- **Error boundaries** - Graceful error handling via `error.tsx`
- **Responsive design** - Works on mobile, tablet, and desktop
- **Dark mode** - Toggle between light and dark themes
- **Middleware logging** - Request logging for all routes
- **Toast notifications** - Success/error feedback on all operations
- **24 passing tests** - Validation, API, and component tests

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+) or Node.js 18+
- A [Neon](https://neon.tech/) database (free tier available)

### Installation

```bash
git clone <repo-url>
cd task-tracker
bun install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Neon connection strings:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
```

You can find these in your Neon dashboard under **Connection Details**.

### Database Setup

```bash
bunx prisma db push    # Push schema to database
bunx prisma generate   # Generate Prisma client
```

### Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
bunx vitest run
```

## Architecture Decisions

### Server Components by Default

Pages (`dashboard/page.tsx`, `tasks/[id]/page.tsx`) are Server Components that fetch data directly via Prisma. This eliminates client-side data fetching for initial page loads, resulting in faster Time to First Byte and no loading spinners for initial data.

### Server Actions for Mutations

Create, update, and delete operations use Next.js Server Actions instead of manual `fetch()` calls from the client. Benefits:

- **Automatic revalidation** via `revalidatePath()` -- no manual cache invalidation needed
- **Type safety** end-to-end from form to database
- **Progressive enhancement** -- forms work without JavaScript enabled

### URL-Based Filtering

Filters are stored in URL search params (`?status=TODO&priority=HIGH&search=login`). This makes filter state:

- **Shareable** -- copy the URL to share a filtered view
- **Bookmarkable** -- save specific filtered views
- **Preserved** on browser back/forward navigation

### Zod Validation (Single Source of Truth)

Zod schemas in `lib/validations.ts` are shared between Server Actions and API routes. This ensures consistent validation regardless of whether data comes through a form submission or a direct API call.

### API Routes AND Server Actions

Both exist intentionally:

- **Server Actions** -- primary mutation path from the UI (used by forms)
- **API Routes** -- RESTful endpoints for programmatic access (e.g., integrations, testing)

### Prisma Singleton Pattern

The Prisma client uses a singleton pattern with `globalThis` caching in development to prevent connection pool exhaustion from hot module reloading.

## Trade-offs

1. **No authentication** -- Deliberately omitted per assessment guidelines. In production, would add Clerk or NextAuth for user authentication and per-user task isolation.

2. **No pagination** -- With a reasonably small dataset, `findMany` is sufficient. For production scale, would implement cursor-based pagination with infinite scroll.

3. **No optimistic updates** -- Chose simplicity. Server Action revalidation is fast enough on Vercel edge. Could add `useOptimistic()` for perceived instant updates.

4. **No drag-and-drop** -- Would enhance the kanban UX but adds significant complexity (dnd-kit or similar). Focused on core CRUD functionality.

5. **Simple dark mode** -- Uses `localStorage` with a class-based toggle. A more robust approach would use `next-themes` with system preference detection.

## Project Structure

```
task-tracker/
├── app/
│   ├── layout.tsx              # Root layout with fonts, theme, toaster
│   ├── page.tsx                # Redirects to /dashboard
│   ├── not-found.tsx           # Custom 404 page
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard (Server Component)
│   │   ├── loading.tsx         # Skeleton loading state
│   │   ├── error.tsx           # Error boundary with retry
│   │   └── _components/       # Dashboard-specific components
│   ├── tasks/[id]/
│   │   ├── page.tsx            # Task detail (Server Component)
│   │   ├── loading.tsx         # Detail skeleton
│   │   ├── error.tsx           # Detail error boundary
│   │   └── _components/       # Detail-specific components
│   └── api/tasks/              # REST API endpoints
├── actions/tasks.ts            # Server Actions for mutations
├── lib/
│   ├── prisma.ts               # Database client singleton
│   ├── validations.ts          # Zod schemas
│   ├── types.ts                # Shared TypeScript types
│   └── utils.ts                # Utility functions
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── theme-provider.tsx      # Dark mode context
├── middleware.ts                # Request logging middleware
├── __tests__/                  # Test files (24 tests)
└── prisma/schema.prisma        # Database schema
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | List tasks (supports `?status`, `?priority`, `?search`) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/[id]` | Get a single task |
| `PATCH` | `/api/tasks/[id]` | Update a task |
| `DELETE` | `/api/tasks/[id]` | Delete a task |

### Response Format

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Error message" }
```

## Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` -- Neon pooled connection string
   - `DIRECT_URL` -- Neon direct connection string
4. Deploy
