# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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
