# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Sell Yourself (sys) is a peer-to-peer skills marketplace where friends can share talents and services. Users post skills they offer (with pricing), needs they have, and connect with friends via invite links to exchange services.

## Development Commands

```bash
# Install dependencies (requires pnpm)
pnpm install

# Start development servers (API + Web concurrently)
pnpm dev

# Start individual servers
pnpm dev:api      # API at http://localhost:3001
pnpm dev:web      # Web at http://localhost:5173

# Build for production
pnpm build

# Database commands (SQLite via Prisma)
pnpm db:push      # Push schema changes to database
pnpm db:generate  # Generate Prisma client
pnpm db:studio    # Open Prisma Studio GUI
```

## Architecture

**Monorepo Structure** (npm workspaces):
- `connect-app/apps/api` - Express.js backend with Prisma ORM
- `connect-app/apps/web` - React frontend with Vite

**Backend (`apps/api`)**:
- Entry: `src/index.ts` - Express server with CORS, cookie parser, route mounting
- Routes: `src/routes/` - RESTful endpoints for auth, users, skills, needs, requests, connections, categories
- Auth: JWT-based with access + refresh tokens, middleware in `src/middleware/auth.ts`
- Database: SQLite with Prisma, schema at `prisma/schema.prisma`

**Frontend (`apps/web`)**:
- Entry: `src/main.tsx` -> `src/App.tsx`
- State: React Query for server state, AuthContext for auth state
- Auth: `src/lib/auth-context.tsx` - provides user state and auth methods app-wide
- API client: `src/lib/api.ts` - typed fetch wrapper with token handling
- Routing: React Router with nested routes under Layout component

**Data Models** (Prisma):
- User - accounts with payment handles (Venmo, Cash App, PayPal)
- Skill - services users offer with pricing
- Need - requests for help users post
- ServiceRequest - transactions between users for skills
- Connection - friend relationships (bidirectional)
- Invite - shareable codes for friend invitations

## Key Patterns

- Auth tokens stored in memory (access) and httpOnly cookies (refresh)
- All API routes under `/api/*` prefix
- Frontend uses React Query for data fetching with 1-minute stale time
- Tailwind CSS for styling
- Zod for API request validation on backend
