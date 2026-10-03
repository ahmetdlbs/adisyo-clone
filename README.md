# Adisyon Merkezi

A restaurant point-of-sale and back-office web app (Next.js 16 / React 19 / TypeScript / Tailwind v4). See
[CLAUDE.md](./CLAUDE.md) for the architecture, conventions and the checks to run before committing.

Authentication, the App Store catalog and billing are served by the sibling [`api/`](../api) NestJS
backend — it must be running for login and the Uygulama Mağazası screen to work. See `api/README.md` to
start it (Postgres via Docker, `prisma migrate dev`, `prisma db seed`, then `npm run start:dev`).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in NEST_API_URL (defaults to http://localhost:3001) and SESSION_SECRET
npm run dev
```

Start `api/` first (see above), then open [http://localhost:3000](http://localhost:3000) and sign in with
the seeded demo account: `demo@adisyonmerkezi.com` / `demo1234`.

## Checks

```bash
npm run typecheck     # next typegen && tsc --noEmit
npm run test:run       # Vitest + Testing Library
npm run test:coverage  # 80% coverage gate
npm run lint
npm run build
```
