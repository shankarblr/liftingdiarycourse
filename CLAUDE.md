# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Docs-First Rule

**Before writing ANY code, you MUST first read every relevant file in the `/docs` directory.**

This is a hard requirement — not a suggestion. For every piece of code you generate:

1. Review the docs index below and identify every doc relevant to what you are about to implement.
2. Read each relevant doc in full before writing a single line of code.
3. Follow the guidance in those docs exactly. Do not deviate from the patterns and rules they define.

This applies to all code — new files, edits to existing files, and inline snippets.

### Available Docs

| File | Covers |
|------|--------|
| [`docs/ui.md`](docs/ui.md) | UI standards — shadcn/ui components only (no custom components), date formatting with date-fns using `do MMM yyyy` |
| [`docs/data-fetching.md`](docs/data-fetching.md) | Data fetching — Server Components only, all queries in `/data` helper functions, Drizzle ORM (no raw SQL), every query scoped to authenticated userId |
| [`docs/data-mutations.md`](docs/data-mutations.md) | Data mutations — Server Actions only (no API routes), colocated `actions.ts` files, typed params (no FormData), Zod validation, all mutations in `/data` helpers scoped to authenticated userId |
| [`docs/auth.md`](docs/auth.md) | Authentication — Clerk is the only auth provider, get userId via `auth()` server-side, protect routes via middleware, use Clerk UI components, never expose secret key client-side |
| [`docs/server-components.md`](docs/server-components.md) | Server Components — `params` and `searchParams` are Promises in Next.js 15 and must be awaited before accessing properties |
| [`docs/routing.md`](docs/routing.md) | Routing — all app routes under `/dashboard`, protected via Clerk middleware, no manual auth checks in page components |

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.2** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)

## Architecture

This is a fresh Next.js App Router project. Pages live under `src/app/` using the file-based routing convention. The root layout (`src/app/layout.tsx`) sets up Geist fonts and a full-height flex column body. Global styles are in `src/app/globals.css`.

> **Important:** This project uses Next.js 16 and React 19, which have breaking changes from prior versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.
