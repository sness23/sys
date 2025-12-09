# Tech Stack Research

## Overview

Building Sell Yourself with **Node.js** backend and **React** frontend. This document outlines the specific technology choices, architecture decisions, and rationale.

---

## Frontend

### React (with Vite)

**Choice:** React 18+ with Vite as the build tool

**Why Vite over Create React App:**
- CRA is effectively deprecated (no updates since 2022)
- Vite is 10-100x faster in development
- Better hot module replacement
- Smaller production bundles
- Modern ESM-first approach

**Why React over alternatives:**
- You specified React
- Largest ecosystem and community
- Easy to hire for / find help
- Smooth path to React Native later (mobile apps)

### UI Framework Options

**Option A: Tailwind CSS (Recommended)**
- Utility-first, highly customizable
- Fast development once learned
- Great for unique designs
- Works perfectly with React
- Easy to maintain consistency

**Option B: shadcn/ui + Tailwind**
- Pre-built accessible components
- Copy-paste, not a dependency
- Full customization control
- Modern, clean aesthetic
- Built on Radix UI primitives

**Option C: Material UI**
- Most popular React component library
- Comprehensive component set
- Google's design language
- Can feel generic

**Recommendation:** Tailwind CSS + shadcn/ui for components. Gives us speed without sacrificing uniqueness.

### State Management

**For MVP:** React's built-in useState + useContext

**Why not Redux/Zustand/etc:**
- MVP is simple enough
- Avoid premature complexity
- Can add later if needed

**Data fetching:** TanStack Query (React Query)
- Caching, refetching, loading states handled
- Much cleaner than manual useEffect
- Industry standard

### Routing

**React Router v6**
- Standard choice
- File-based routing available via plugins
- Works well with our architecture

---

## Backend

### Node.js Runtime

**Choice:** Node.js 20 LTS

**Why Node.js:**
- You specified it
- JavaScript everywhere (frontend + backend)
- Excellent for I/O-heavy applications
- Massive ecosystem (npm)
- Easy deployment options

### Framework Options

**Option A: Express.js (Recommended for MVP)**
- Simple, minimal, flexible
- Massive ecosystem
- Well-documented
- Easy to understand
- Perfect for MVP speed

**Option B: Fastify**
- Faster than Express
- Better TypeScript support
- Schema validation built-in
- More opinionated

**Option C: NestJS**
- Full framework (like Spring/Django for Node)
- TypeScript-first
- Dependency injection
- Overkill for MVP

**Recommendation:** Express.js for MVP. Simple, fast to build, easy to iterate. Can migrate to Fastify/Nest later if needed.

### API Design

**REST API** for MVP
- Simple and well-understood
- Easy to debug
- Works with any client

**GraphQL consideration:**
- Better for complex data requirements
- Overkill for MVP
- Consider for Phase 2 when data relationships get complex

### Authentication

**Option A: Passport.js + JWT (Recommended)**
- Industry standard for Node.js auth
- Supports many strategies
- JWT for stateless auth
- Easy to add OAuth later (TikTok, Google, etc.)

**Option B: Auth0 / Clerk**
- Managed auth service
- Faster to implement
- Costs money at scale
- Less control

**Recommendation:** Passport.js + JWT. More control, no vendor lock-in, good learning experience.

**JWT Strategy:**
- Access tokens (short-lived, 15min)
- Refresh tokens (long-lived, 7 days)
- HTTP-only cookies for refresh token security

---

## Database

### Primary Database

**Option A: PostgreSQL (Recommended)**
- Rock-solid relational database
- Excellent for structured data
- JSONB for flexible fields
- Great ecosystem (Prisma, Drizzle)
- Free tiers available (Supabase, Neon, Railway)

**Option B: MongoDB**
- Document-based, flexible schema
- Good for rapid prototyping
- Can get messy without discipline
- Less ideal for relational data (users, skills, requests)

**Option C: SQLite**
- Zero configuration
- File-based
- Great for MVP
- Limited scalability

**Recommendation:** PostgreSQL. Our data is relational (users have skills, skills have requests, etc.). Postgres handles this beautifully.

### ORM / Query Builder

**Option A: Prisma (Recommended)**
- Type-safe database client
- Auto-generated types
- Excellent migration system
- Great developer experience
- Visual studio (Prisma Studio)

**Option B: Drizzle ORM**
- Lighter weight than Prisma
- SQL-like syntax
- Newer, less mature

**Option C: Raw SQL / pg**
- Maximum control
- More boilerplate
- No type safety

**Recommendation:** Prisma. Best developer experience, great for moving fast.

---

## Infrastructure

### Hosting - Frontend

**Option A: Vercel (Recommended)**
- Built for React/Next.js
- Automatic deployments from Git
- Global CDN
- Generous free tier
- Easy custom domains

**Option B: Netlify**
- Similar to Vercel
- Good for static sites
- Slightly less React-optimized

**Option C: Cloudflare Pages**
- Fastest CDN
- Free tier is excellent
- Less integrated tooling

**Recommendation:** Vercel. Best React experience, free for hobby projects.

### Hosting - Backend

**Option A: Railway (Recommended for MVP)**
- Simple deployment from Git
- PostgreSQL included
- Good free tier ($5/month credit)
- Easy environment variables

**Option B: Render**
- Similar to Railway
- Free tier spins down (cold starts)
- Good documentation

**Option C: Fly.io**
- Edge deployment
- More complex setup
- Better for scale

**Option D: DigitalOcean App Platform**
- Simple, predictable pricing
- Good for slightly larger scale

**Recommendation:** Railway. Dead simple, includes Postgres, good free tier.

### Database Hosting

If using Railway: **Built-in PostgreSQL**

Alternatives:
- **Supabase** - Postgres + extras (auth, storage, realtime)
- **Neon** - Serverless Postgres, generous free tier
- **PlanetScale** - MySQL, but excellent branching

**Recommendation:** Railway's built-in Postgres, or Neon for serverless.

---

## Development Tools

### Language

**TypeScript everywhere**
- Catches bugs before runtime
- Better IDE support
- Self-documenting code
- Industry standard for serious projects

### Package Manager

**pnpm (Recommended)**
- Faster than npm/yarn
- Saves disk space
- Strict by default
- Great monorepo support

Alternative: npm (simpler, more familiar)

### Code Quality

- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

### Testing (Phase 2)

- **Vitest** - Unit tests (faster than Jest, Vite-native)
- **Playwright** - E2E tests
- **Testing Library** - React component tests

---

## Project Structure

```
sys/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities, API client
│   │   │   ├── styles/      # Global styles
│   │   │   └── main.tsx     # Entry point
│   │   ├── public/
│   │   ├── index.html
│   │   └── vite.config.ts
│   │
│   └── api/                 # Node.js backend
│       ├── src/
│       │   ├── routes/      # API route handlers
│       │   ├── middleware/  # Auth, validation, etc.
│       │   ├── services/    # Business logic
│       │   ├── lib/         # Database, utilities
│       │   └── index.ts     # Entry point
│       └── prisma/
│           └── schema.prisma
│
├── packages/                # Shared code (if needed)
│   └── shared/              # Types, utilities
│
├── docs/                    # Documentation
├── package.json             # Root package.json (workspaces)
└── turbo.json              # Turborepo config (optional)
```

### Monorepo vs Separate Repos

**Recommendation:** Monorepo with npm/pnpm workspaces

**Why:**
- Shared TypeScript types
- Atomic commits across frontend/backend
- Easier local development
- Single CI/CD pipeline

**Tools:**
- pnpm workspaces (simple)
- Turborepo (if builds get slow)

---

## MVP Tech Stack Summary

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | React 18 + Vite | Fast, modern, specified |
| Styling | Tailwind + shadcn/ui | Speed + flexibility |
| State | React Query + Context | Simple, sufficient |
| Backend | Express.js | Simple, fast iteration |
| Language | TypeScript | Type safety, DX |
| Database | PostgreSQL | Relational data, rock-solid |
| ORM | Prisma | Best DX, type-safe |
| Auth | Passport.js + JWT | Flexible, extensible |
| Frontend Host | Vercel | Best React experience |
| Backend Host | Railway | Simple, includes Postgres |
| Package Manager | pnpm | Fast, efficient |

---

## Future Considerations

### Phase 2 Additions
- **Socket.io** - Real-time notifications
- **Redis** - Session storage, caching
- **S3/Cloudflare R2** - Image uploads

### Phase 3 (Video)
- **Mux** or **Cloudflare Stream** - Video hosting
- **LiveKit** or **Daily.co** - Live video

### Phase 4 (Mobile)
- **React Native** - Mobile apps
- **Expo** - Simplified React Native

---

## Cost Estimate (MVP)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel | Yes (hobby) | $20/mo (pro) |
| Railway | $5/mo credit | ~$5-10/mo |
| Domain | - | ~$12/year |
| **Total** | **~$0/mo** | **~$15-25/mo** |

The MVP can be built and run for essentially free during development and early users.

---

*This stack optimizes for speed of development, developer experience, and cost efficiency. It's battle-tested, well-documented, and scales well beyond MVP.*
