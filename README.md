# Adisyon Merkezi

A restaurant point-of-sale and back-office web app (Next.js 16 / React 19 / TypeScript / Tailwind v4). See
[CLAUDE.md](./CLAUDE.md) for the architecture, conventions and the checks to run before committing.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in DEMO_LOGIN_USER, DEMO_LOGIN_PASSWORD, SESSION_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the credentials from `.env.local`.

## Checks

```bash
npm run typecheck     # next typegen && tsc --noEmit
npm run test:run       # Vitest + Testing Library
npm run test:coverage  # 80% coverage gate
npm run lint
npm run build
```
