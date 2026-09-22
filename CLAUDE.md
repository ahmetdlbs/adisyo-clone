@AGENTS.md

# Architecture

```
src/
  app/                 Routing only: thin page.tsx (Server Components) that set `metadata` and render a screen.
    (auth)/            Public screens: login, register, forgot-password, onboarding.
    (app)/             Signed-in screens. layout.tsx checks the session and wraps them in <AppShell>.
    error.tsx / loading.tsx / not-found.tsx / global-error.tsx are the boundaries.
  proxy.ts             Optimistic auth gate (cookie only). Data access must still check the session itself.
  components/
    ui/                shadcn primitives (Base UI, preset "nova"). Add with `npx shadcn@latest add <name>`.
    kit/               App-level compositions built from ui/: PageContainer/PageCard/PageBody/PageToolbar, PageHeader, Panel,
                       StatCard, DataTable, RowActions, SearchInput, FormDialog, FormSheet, ConfirmDialog,
                       form-fields (TextField, SelectField, SwitchField, ...), PasswordInput, ErrorState.
    shell/             AppShell, TopBar, NavDrawer.
  features/<name>/     A screen family: components/ (client UI), model/ (types, zod schemas, pure rules),
                       server/ (server-only code, Server Actions), hooks/, data/ (mocks). All screens are migrated to this
                       structure; `src/components/` holds only `ui/`, `kit/`, `shell/` and `AdisyoLogo.tsx` now.
  hooks/               Shared hooks (useEntityDialog).
  config/              routes.ts (ROUTES), navigation.ts (drawer menu), demo-identity.ts
  lib/                 utils (cn), format (formatTRY), collection (upsertById/removeById), notify, env (server-only)
tests/                 All tests, mirroring src/ one to one. Nothing test-related lives inside src/.
```

A screen is a `features/<name>/` package with a thin `page.tsx` in front of it, per the tree above — there is no other shape left in the codebase; a new one follows the same layout from the start.

## Conventions

- Tests never sit inside `src/`. They live in `tests/`, mirroring the source tree (`src/lib/format.ts` is tested by
  `tests/lib/format.test.ts`), and import the code under test through the `@/...` alias, never a relative path.
- New files are kebab-case (matching shadcn); components are PascalCase exports.
- Pages stay Server Components; `"use client"` belongs on the interactive leaf. Every page exports `metadata` with just its own
  name (`title: "KDV Oranları"`); the root layout's template adds " | Adisyo".
- Providers sit as deep as possible (`PosProvider`/`ShellProvider` in `(app)/layout.tsx`, not the root).
- Colour comes from semantic tokens only (`bg-primary`, `text-muted-foreground`, `bg-canvas`, `bg-section`, `bg-success`, ...), defined
  once in `src/app/globals.css`. No raw hex or `text-[#...]` in components.
- Money is formatted with `formatTRY`, never `toFixed(2).replace(".", ",")`.
- Links are built from `ROUTES`. `tests/config/routes.test.ts` fails when a route or nav entry has no `page.tsx`.
- No `alert()` / `confirm()` / `prompt()`: use `toast` (sonner), `notifyUnavailable`, and `ConfirmDialog`. Deleting always confirms
  (`RowActions` does it for tables).
- Forms: react-hook-form + a zod schema in `model/`, bound with the kit's fields. A schema that transforms (`"10"` -> `10`) needs
  `useForm<z.input, unknown, z.output>`. Reset a CRUD dialog per opening with `key={dialog.session}` from `useEntityDialog`, not an effect.
- Domain rules are pure functions in `model/` and unit-tested (e.g. `saveVat`, `createUnitFormSchema`); components only call them.
- `components/ui/*` is vendored: change tokens and variants, not behaviour, so future `shadcn add` upgrades stay clean.
- Base UI callbacks (`onOpenChange`, ...) receive event details as an extra argument; do not assert their arity in tests.

## POS (features/pos)

- Money is an integer number of kuruş (`Kurus`), never a float lira. `toKurus` / `parseLira` come in, `formatKurus` goes out; splits use
  `splitEvenly` so shares always add back up to the total.
- Everything the POS knows is one `PosState` (areas, tables, categories, products, open orders, history). Rules are pure functions in
  `model/` (`order.ts`, `pos-state.ts`, `floor-plan.ts`, `menu.ts`, `stats.ts`) that throw `Error` with a Turkish message; screens call them
  through `usePosActions().change(...)` and show the message on the form field or as a toast.
- The store (`store/pos-provider.tsx`) is `useSyncExternalStore` over `localStorage` key `adisyo.pos.v2`, zod-validated on read. The server
  snapshot is the seed, so hydration never mismatches. Time-dependent text uses `useNow()`, which is `null` until mounted.
- Only cash may overpay (change is returned); a cancelled bill is kept in `history` with outcome `"cancelled"` so voids stay visible on the
  dashboard.

## Auth

- `features/auth/server/session.ts`: HS256 JWT in an httpOnly, SameSite=Lax cookie (12h). `getSession()` is what data code calls.
- Login/logout are Server Actions (`features/auth/server/actions.ts`); the login form works without JavaScript.
- The post-login `next` URL is validated by `safeRedirectPath` (no open redirects). Keep it that way.
- Env (`.env.local`, see `.env.example`): `DEMO_LOGIN_USER`, `DEMO_LOGIN_PASSWORD`, `SESSION_SECRET` (>= 32 chars). `lib/env.ts` fails
  fast and never echoes a value.
- Not built yet: registration/reset e-mail backend, login rate limiting, CSP with nonces.

## Checks (run before committing)

- `npm run typecheck` (regenerates route types, then `tsc`; stale `.next/types` otherwise cause phantom errors)
- `npm run test:run` (Vitest + Testing Library; server modules and filesystem checks use `// @vitest-environment node`)
- `npm run test:coverage` (80% gate on `lib`, `hooks`, `config`, `components/kit`, `components/shell`, `features`, `proxy.ts`)
- `npm run lint` (legacy views still have errors; code under the paths above must be clean)
