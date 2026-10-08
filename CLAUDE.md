# Table Notes — Food Journal (front end only)

A mobile-first personal journal for eating out well: log visits, save places to try, keep the story behind local spots. Persona: Amelia, a designer on a tight budget who gets overwhelmed by information. Calm, quick, never guilt-inducing.

## Stack

React 19 + TypeScript (strict) + Vite · React Router · Tailwind CSS v3 (tokens in `tailwind.config.ts`) · TanStack Query · React Hook Form + Zod · lucide-react (icons) · ESLint + Prettier.
Do not add dependencies beyond this list without asking. **No Supabase code yet** (no client, auth, or migrations).

## Commands

- `npm run dev` — dev server · `npm run build` — typecheck + production build
- `npm run typecheck` · `npm run lint` · `npm run format` / `format:check`

## THE rule: data access goes only through the data layer

- All reads/writes go through the interfaces in `src/data/repositories.ts`, consumed **only** by the hooks in `src/hooks/queries/`.
- Components and pages call those hooks. They never import from `src/data/mock/*`, never touch `localStorage`, and never import seed data. ESLint enforces this (`no-restricted-globals`, `no-restricted-imports`).
- The mock implementation (`src/data/mock/`) is backed by localStorage + seed data. `src/data/index.ts` is the single swap point: to adopt Supabase, add `src/data/supabase/*` implementing the same interfaces and change that one export. No component changes should be needed.
- Types in `src/types/` use string UUID ids, ISO date strings, and snake_case fields that mirror future table columns.

## Folder structure

```
src/types/            domain types (Place, Visit, WishlistItem, PlaceList, PlaceListItem, Profile)
src/data/             repository interfaces, DataProvider, mock/ implementation + seed
src/hooks/queries/    TanStack Query hooks (only consumers of the data service) + queryKeys.ts
src/components/       layout/ ui/ visit/ place/ lists/ explore/
src/pages/            one file per route; routes in src/routes.tsx
src/lib/              cn, formatting, Zod schemas, constants (tags, ratings, feelings), nav
src/styles/index.css  Tailwind layers, focus ring, reduced-motion
```

## Conventions

- Path alias `@/` → `src/`. Named exports; one component per file; PascalCase files for components, camelCase for hooks/utils.
- Style with Tailwind **token names** (`bg-canvas`, `text-ink-muted`, `text-h2`, `rounded-xl`), not raw hex or arbitrary values. Add new tokens to the Tailwind config.
- Touch targets ≥ 44px (`min-h-touch`/`min-w-touch`). Respect safe areas (`pb-safe`, etc.). No horizontal scroll at 375px.
- Every data-driven screen needs loading (skeleton), empty, and error (with retry) states.
- Forms: React Hook Form + Zod schema in `src/lib/schemas.ts`; every input has a visible label.
- Accessibility: semantic HTML, visible `:focus-visible` ring, meaningful `alt` on photos, AA contrast.
- Run `npm run build`, `npm run lint`, and check 375 / 768 / 1280px widths after each change.

## Health-content rules

- Health tags and "how I felt" are **self-reported labels**, not nutrition claims. No calories, medical/diet advice, or scores implying good/bad food.
- Warm, neutral language. No guilt, shame, or weight-loss framing anywhere.

## Out of scope for now

Auth, Supabase, real maps (Explore uses a `MapView` stub), real place search, server image upload, push, PWA/offline, analytics.
