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

## Shared building blocks (reuse before writing new ones)

- `QueryView` (`components/ui`) renders loading / error (with retry) / empty / data for any query — use it for every data-driven screen.
- `ChoiceGroup` = accessible selectable chips (native radio/checkbox in a fieldset). `Field` + `TextInput`/`TextArea` = labeled inputs with hint/error wiring. `Toggle` = labeled switch. `Dialog` = native `<dialog>` modal (mark the field to focus with `data-autofocus`).
- `PlaceCombobox` = ARIA combobox for picking a place or typing a custom name; callers create custom places at submit time, reusing an existing place when the name matches.
- `useToast()` for confirmations; `useDocumentTitle()` (PageHeader does this for you) for page titles; `copyText()` for clipboard.
- Route changes move focus to `<main>` (see `AppShell`) so keyboard/screen-reader users land on the new content.

## Accessibility notes

- Token pairs are AA-checked: body/muted text ≥ 4.5:1, form-control borders (`line-strong`) ≥ 3:1. Re-check contrast if you change a color token. Placeholder text uses `ink-muted` (not a lighter tint).
- Cards use a stretched link (`after:absolute after:inset-0`) so the whole card is the tap target; interactive children inside a card need `relative z-10`.
- Query retries pause while the tab is hidden (TanStack Query behavior) — in the in-app browser pane, error states can look like endless loading until the tab is visible.

## Health-content rules

- Health tags and "how I felt" are **self-reported labels**, not nutrition claims. No calories, medical/diet advice, or scores implying good/bad food.
- Warm, neutral language. No guilt, shame, or weight-loss framing anywhere.

## Out of scope for now

Auth, Supabase, real maps (Explore uses a `MapView` stub), real place search, server image upload, push, PWA/offline, analytics.
