# UI Coding Standards

## Component Library

**All UI must be built exclusively with [shadcn/ui](https://ui.shadcn.com/) components.**

- Do NOT create custom components under any circumstances.
- Do NOT write raw HTML elements styled with Tailwind as standalone components.
- If a shadcn/ui component exists for the use case, use it — no exceptions.
- If a needed component is not yet installed, add it via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Installed components live in `src/components/ui/` and must not be modified unless absolutely necessary to fix a bug.

## Date Formatting

All dates must be formatted using [date-fns](https://date-fns.org/).

### Required Format

Dates must display with an ordinal day suffix, abbreviated month, and full year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `do MMM yyyy` format token, which produces the ordinal day automatically:

```ts
import { format } from "date-fns";

format(new Date("2025-09-01"), "do MMM yyyy"); // "1st Sep 2025"
format(new Date("2025-08-02"), "do MMM yyyy"); // "2nd Aug 2025"
format(new Date("2026-01-03"), "do MMM yyyy"); // "3rd Jan 2026"
format(new Date("2024-06-04"), "do MMM yyyy"); // "4th Jun 2024"
```

Do not use `toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.
