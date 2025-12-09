# Sell Yourself (sys)

A peer-to-peer skills marketplace for friends. Share your talents, find help from people you trust.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment:**

```bash
# Copy the example env file
cp apps/api/.env.example apps/api/.env

# Edit apps/api/.env with your database URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sys?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
```

3. **Set up the database:**

```bash
pnpm db:push
```

4. **Start development servers:**

```bash
pnpm dev
```

This starts:
- API server at http://localhost:3001
- Web app at http://localhost:5173

## Project Structure

```
sys/
├── apps/
│   ├── api/          # Express.js backend
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── middleware/  # Auth middleware
│   │   │   └── lib/         # Database, auth utilities
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── web/          # React frontend
│       └── src/
│           ├── components/  # UI components
│           ├── pages/       # Page components
│           ├── lib/         # API client, auth context
│           └── hooks/       # Custom hooks
│
├── docs/             # Documentation
└── packages/         # Shared code (future)
```

## Features

- **Skills**: Post what you can do with pricing
- **Needs**: Post what help you need
- **Requests**: Send/receive service requests
- **Connections**: Invite friends via link
- **Profiles**: Payment handles (Venmo, Cash App, PayPal)

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query
- **Backend**: Express.js, TypeScript, Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh tokens)

## Scripts

```bash
pnpm dev          # Start all dev servers
pnpm dev:api      # Start API only
pnpm dev:web      # Start web only
pnpm build        # Build all
pnpm db:push      # Push schema to database
pnpm db:generate  # Generate Prisma client
pnpm db:studio    # Open Prisma Studio
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:id` - Get user profile

### Skills
- `GET /api/skills` - List skills
- `GET /api/skills/mine` - My skills
- `POST /api/skills` - Create skill
- `GET /api/skills/:id` - Get skill
- `PATCH /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Needs
- `GET /api/needs` - List needs
- `GET /api/needs/mine` - My needs
- `POST /api/needs` - Create need
- `GET /api/needs/:id` - Get need
- `PATCH /api/needs/:id` - Update need
- `DELETE /api/needs/:id` - Delete need

### Requests
- `GET /api/requests` - List requests
- `POST /api/requests` - Create request
- `PATCH /api/requests/:id` - Update status

### Connections
- `GET /api/connections` - List friends
- `POST /api/connections/invite` - Create invite
- `POST /api/connections/accept/:code` - Accept invite
- `DELETE /api/connections/:id` - Remove friend

## License

MIT
