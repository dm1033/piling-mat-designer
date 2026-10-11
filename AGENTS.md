# AGENTS.md

This file provides guidance for coding agents when working with the
Piling Mat Designer repository.

## Project Overview

Piling Mat Designer is a public-facing web app for designing working platforms
(piling mats and crane mats) to BRE 470. Designing on screen is free; the paid
deliverable is an Official Design Pack PDF (drawings, interpretive
calculations, working platform risk assessment and check certificate) generated
server-side on Stripe payment and emailed to the customer. The on-screen output
is a draft only. The product is operated by Temporary Works Consulting Ltd.

It is a single TypeScript codebase: a React client, an Express + tRPC server and
a MySQL database managed with Drizzle. There is no separate services repository.

## Project Structure

```
piling-mat-designer/
├── client/
│   ├── index.html                 # Vite entry; registers PWA manifest and service worker
│   ├── public/                    # Static assets, manifest.json, sw.js, robots, sitemap
│   └── src/
│       ├── App.tsx                # wouter routes; providers (theme, tRPC, tooltips)
│       ├── _core/                 # Platform hooks (auth) — avoid editing
│       ├── components/            # App components (CrossSection, PlanView, RigSelector, Map…)
│       ├── components/ui/         # shadcn/ui primitives — generated, edit sparingly
│       ├── contexts/              # React contexts (ThemeContext)
│       ├── data/                  # Static content (blog articles)
│       ├── hooks/                 # Shared React hooks
│       ├── lib/                   # bre470-calc.ts, rig-database.ts, export-report.ts, trpc client
│       └── pages/                 # One file per route; admin pages under pages/admin/
├── server/
│   ├── _core/                     # Platform plumbing: express bootstrap, tRPC, context,
│   │                              #   cookies, env, OAuth, Vite dev server — avoid editing
│   ├── routers.ts                 # appRouter: auth, design, cpd, promo, admin sub-routers
│   ├── db.ts                      # All Drizzle queries; the only module that touches the DB
│   ├── products.ts                # Product definitions, prices (pence) and certificate metadata
│   ├── pdf.ts                     # Official Design Pack PDF generator (pdfkit)
│   ├── email.ts                   # Nodemailer delivery of the design pack
│   ├── stripe-webhook.ts          # Stripe webhook; fulfils paid designs
│   ├── storage.ts                 # Object storage helpers
│   └── *.test.ts                  # Vitest suites alongside the code they test
├── shared/
│   ├── const.ts                   # Constants used by both client and server
│   ├── types.ts                   # Single entry point for shared types
│   ├── risk-assessment.ts         # Risk assessment generator (client preview + server PDF)
│   └── _core/errors.ts            # Shared error types
├── drizzle/
│   ├── schema.ts                  # MySQL tables: users, designs, cpd_requests
│   ├── relations.ts
│   ├── 000N_*.sql + meta/         # Generated migrations and snapshots — never hand-edit
├── patches/                       # pnpm patches (wouter)
├── .claude/agents/                # Agent persona definitions
├── drizzle.config.ts              # Reads DATABASE_URL
├── vite.config.ts                 # React, Tailwind v4, Manus runtime plugins
├── vitest.config.ts               # Node environment; picks up *.test.ts in client and server
├── todo.md                        # Feature log by phase; tick items as they ship
└── ideas.md                       # Design direction notes
```

Path aliases: `@/*` maps to `client/src/*` and `@shared/*` maps to `shared/*`.
Use them instead of long relative imports.

Keep `client/src/_core/`, `server/_core/` and `client/public/__manus__/`
untouched unless the task is specifically about platform plumbing. Do not
hand-edit anything under `drizzle/` except `schema.ts` and `relations.ts`;
regenerate migrations with `pnpm db:push`. Never commit `.env*` files or
secrets. The `pnpm-lock.yaml` file is tracked and must be committed when
dependencies change.

## Commands

| Command        | Purpose                                                      |
| -------------- | ------------------------------------------------------------ |
| `pnpm dev`     | Run the server with tsx watch; Vite is mounted in dev mode   |
| `pnpm check`   | TypeScript type check (`tsc --noEmit`)                       |
| `pnpm test`    | Run the Vitest suites                                        |
| `pnpm format`  | Prettier over the whole repo                                 |
| `pnpm build`   | Vite client build plus esbuild server bundle into `dist/`    |
| `pnpm db:push` | Generate and apply Drizzle migrations (needs `DATABASE_URL`) |

Run `pnpm check` and `pnpm test` before every push. Tests do not need a
database, Stripe or SMTP; keep it that way by stubbing at module boundaries.

## Engineering Content Rules

This app produces temporary works design output that people may rely on.
Treat the calculation and document layers with corresponding care.

- `client/src/lib/bre470-calc.ts` implements BR 470 Appendix A (A2 cohesive,
  A3 granular, optional geosynthetic reinforcement). Do not change formulas,
  lookup tables or partial factors without citing the source table or clause
  in a code comment and adding or updating a test with a worked example.
- `client/src/lib/rig-database.ts` holds EN 996 track dimensions and bearing
  pressures. New rigs need a manufacturer data sheet reference in the entry.
- Keep calculation steps auditable: every `CalculationStep` must carry the
  formula, the substituted values and the result with units.
- Use SI units in code and UI: kPa, kN/m³, m, mm. Store money in pence.
- Never soften limitation, inspection or "draft only" wording in the PDF, the
  certificate or the on-screen result to make the product read better. The
  official record is the emailed PDF, not the screen.
- Do not add text that claims approval, certification or accreditation by HSE,
  CITB, NASC or any other body. "Checked by" and "designed by" wording must
  match `CERTIFICATE` in `server/products.ts`.
- Prices, product names and certificate metadata live in `server/products.ts`
  only. Do not duplicate them in client copy; read them through tRPC.

## Code Style

- TypeScript throughout, `strict` on. Prefer explicit types on exported
  functions and on anything crossing the client/server boundary.
- Formatting is owned by Prettier (`.prettierrc`): two spaces, semicolons,
  double quotes, 80 columns, trailing commas where ES5 allows, `arrowParens`
  avoid. Do not fight it; run `pnpm format`.
- Client: React 19 function components, wouter for routing, TanStack Query via
  tRPC for data, react-hook-form + zod for forms, Tailwind v4 with shadcn/ui
  primitives from `client/src/components/ui/`. Prefer existing primitives to
  new ones.
- Server: Express + tRPC 11 with superjson. Add procedures under the matching
  sub-router in `server/routers.ts` and validate every input with zod. Use
  `publicProcedure`, `protectedProcedure` or `adminProcedure` deliberately;
  anything that reads or writes a user's designs is at least protected.
- Database access goes through `server/db.ts` with Drizzle. Export one
  function per query and keep SQL out of routers. Handle a missing `DATABASE_URL`
  gracefully, as the existing helpers do.
- Anything that must not fail a Stripe webhook (PDF generation, email) is
  wrapped so it never throws; log and notify the owner instead.
- Server logging uses `console.*` with a bracketed module prefix, for example
  `[Fulfilment]` or `[Database]`. Do not leave debugging logs in the client.
- Shared code between client and server belongs in `shared/`; it must not
  import from `server/` or from React.
- Imports: external packages first, then `@shared/*` and `@/*` aliases, then
  relative imports. Prefer named imports.
- Tests use Vitest with `describe`/`it`/`expect`, live next to the code as
  `*.test.ts`, and cover the calculation engine, rig database, routers and
  design pack generation. A change to a formula or a procedure ships with a
  test.

### File Layout

Organise for top-to-bottom reading. Important things first, details later.

- File-level JSDoc comment stating what the module is and its source basis
- Imports
- **Constants** and lookup tables (with the source table named in a comment)
- **Types and interfaces**; outer types above the inner types they use
- **Exported functions** in the order a reader would call them
- Private helpers _below_ the functions that call them
- Among helpers: meatier logic above leaf-level formatters
- Use `// ─── Section ───` dividers between groups in longer files, as
  `bre470-calc.ts` and `db.ts` do
- **In test files**: fixtures and constants first, then test cases grouped in
  `describe` blocks, then helper functions last

## Markdown

- **Tables must be space-padded so columns align in plain text.** Markdown
  tables are read raw (terminals, diffs, editors) at least as often as
  rendered, and condensed tables are unreadable there. Pad every cell to its
  column width:

  ```markdown
  | Rig           | W (m) | L1 (m) | q1k (kPa) |
  | ------------- | ----- | ------ | --------- |
  | Liebherr LB16 | 0.70  | 3.60   | 140       |
  | Bauer BG 28   | 0.80  | 4.40   | 190       |
  ```

  Not: `| Rig | W (m) | L1 (m) | q1k (kPa) |` packed tight with varying
  widths per row.

- Keep `todo.md` current: add a section per feature and tick items as they
  ship.
