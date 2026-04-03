# Server Components

## Rule: `params` and `searchParams` Must Be Awaited

This project uses **Next.js 15**, where `params` and `searchParams` are **Promises**. You must `await` them before accessing any properties.

```tsx
// ✅ CORRECT — await params before use
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  // use id
}

// ❌ WRONG — params is a Promise, not a plain object
interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const { id } = params; // runtime error
}
```

This applies to all dynamic route segments:

```tsx
// ✅ CORRECT — multiple params
interface PageProps {
  params: Promise<{ workoutid: string; exerciseid: string }>;
}

export default async function Page({ params }: PageProps) {
  const { workoutid, exerciseid } = await params;
}
```

`searchParams` follows the same rule:

```tsx
// ✅ CORRECT — await searchParams
interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { date } = await searchParams;
}
```

Never destructure `params` or `searchParams` directly from props without awaiting — this will cause a runtime error in Next.js 15.
