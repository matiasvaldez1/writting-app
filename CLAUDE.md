# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # dev server on localhost:3000
npm run build            # production build
npm run lint             # eslint (next/core-web-vitals + typescript-eslint + prettier)
npm run type-check       # tsc --noEmit
npm run format           # prettier --write
npm run format:check     # prettier --check
npm run migrate:generate # generate drizzle migrations
npm run migrate:push     # push migrations to postgres
npm run db:studio        # drizzle-kit studio
```

No test runner is configured yet.

## Architecture

Next.js 14 App Router with a layered architecture:

```
Server Actions (src/app/_actions/)
  → Use Cases (src/use-cases/)
    → Data Access (src/data-access/)
      → Drizzle ORM (src/drizzle/)
```

- **Auth**: Clerk (`clerkMiddleware` in `src/middleware.ts`). Clerk webhook at `/api/webhooks` syncs users to PostgreSQL.
- **Database**: PostgreSQL via Vercel Postgres + Drizzle ORM. Schema in `src/drizzle/schema.ts`. Tables: `users`, `books`, `chapters`, `user_analytics`. All foreign keys have `ON DELETE CASCADE` and indexes.
- **Ownership checks**: Every server action verifies the authenticated user owns the book/chapter being accessed via `verifyBookOwnership()` in data-access layer.
- **Editor**: Tiptap rich text editor with extensions (StarterKit, Color, TextStyle, Typography, Underline, CharacterCount, Placeholder, Link, Image, TextAlign). Medium-like UX with `BubbleMenu` (inline formatting on text selection), `FloatingMenu` (block insertion on empty lines), and a slim `EditorTopBar` (undo/redo, save status, word count, fullscreen, help). 2-second debounce auto-save. Writing session duration tracked via `useWritingSession` hook and stored in `user_analytics`.
- **UI**: shadcn/ui (new-york style) + Tailwind CSS. Dark/light mode via `next-themes`. Shared UI components in `src/components/ui/`.
- **PDF export**: `@react-pdf/renderer` + `react-pdf-html` generates book PDFs with comprehensive HTML stylesheet for headings, lists, blockquotes, code, images, links, and text formatting.
- **PWA**: `@ducanh2912/next-pwa` for offline support and install prompt. Manifest at `public/manifest.json`, icons at `public/icons/`.
- **i18n**: `next-intl` without URL routing. Locale determined by cookie → Accept-Language → default `"en"`. Config at `src/i18n/request.ts`, message files at `messages/{en,es}.json`. Locale toggle in header sets cookie and refreshes.
- **Drag-and-drop**: `@hello-pangea/dnd` for chapter reordering with `useOptimistic` for instant UI feedback.
- **Environment validation**: `src/lib/env.ts` validates required env vars at startup via Zod.

## Route Structure

```
/                                          → Landing page
/dashboard                                 → Analytics dashboard
/dashboard/books                           → Book list with search/filter/sort
/dashboard/books/[id]/edit                 → Chapter management + PDF export + book metadata editing
/dashboard/books/[id]/edit/[chapter_id]/editor → Tiptap rich text editor
```

Protected routes (`/dashboard/*`, `/books/*`) are enforced by Clerk middleware. Landing page components live in `src/app/_components/`, dashboard components are colocated under their route's `_components/` directory.

## Key Conventions

- Path alias: `@/*` maps to `src/*`
- Server actions use Zod schemas (`src/types/zodSchemas.ts`) for form validation
- `cn()` utility from `src/lib/utils.ts` for merging Tailwind classes
- Pages are async server components; client interactivity uses `"use client"` directive
- Cache invalidation via `revalidatePath()` after mutations
- Pre-commit hooks via Husky + lint-staged (Prettier + ESLint on staged files)

## Environment Variables

See `.env.example` for all required variables:

- `POSTGRES_URL` — Vercel Postgres connection string
- `WEBHOOK_SECRET` — Clerk webhook verification secret
- Clerk keys (publishable + secret) as configured by Clerk SDK
