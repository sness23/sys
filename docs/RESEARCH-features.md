# Feature Research & Breakdown

## Overview

Detailed breakdown of features for Sell Yourself, organized by phase. Each feature includes user stories, requirements, and implementation notes.

---

## MVP Features (Phase 1)

### 1. Authentication

#### User Stories
- As a new user, I can sign up with my email and password
- As a returning user, I can log in to my account
- As a user, I can log out
- As a user, I can reset my password if I forget it

#### Requirements
- Email/password registration
- Email verification (optional for MVP, recommended)
- Login with email/password
- Password reset via email
- Session management with JWT

#### Data Model
```
User {
  id
  email (unique)
  passwordHash
  name
  bio
  avatarUrl
  venmoHandle
  cashAppHandle
  paypalHandle
  createdAt
  updatedAt
}
```

#### Implementation Notes
- Use bcrypt for password hashing
- JWT access tokens (15 min) + refresh tokens (7 days)
- Refresh token rotation for security
- Rate limiting on auth endpoints

---

### 2. User Profile

#### User Stories
- As a user, I can view my profile
- As a user, I can edit my name, bio, and avatar
- As a user, I can add my payment handles (Venmo, Cash App, PayPal)
- As a user, I can view other users' profiles

#### Requirements
- Profile page with user info
- Edit profile form
- Avatar upload (or URL for MVP)
- Payment handles displayed on profile
- Public profile view for other users

#### Screens
- `/profile` - My profile (editable)
- `/profile/:userId` - Other user's profile (view only)
- `/settings` - Account settings

---

### 3. Skills (Offerings)

#### User Stories
- As a user, I can create a skill listing
- As a user, I can edit my skill listings
- As a user, I can delete my skill listings
- As a user, I can view all my skills
- As a user, I can pause/unpause a skill

#### Requirements
- Skill creation form
- Skill listing with title, description, price
- Price types: per hour, per session, flat rate
- Category/tags for skills
- Active/paused status
- Edit and delete functionality

#### Data Model
```
Skill {
  id
  userId (foreign key)
  title
  description
  price (cents)
  priceType (hourly | session | flat)
  category
  tags[]
  isActive
  createdAt
  updatedAt
}
```

#### Categories (Initial Set)
- Home & Moving
- Beauty & Wellness
- Tech & Digital
- Creative & Design
- Tutoring & Learning
- Fitness & Sports
- Food & Cooking
- Transportation
- Events & Entertainment
- Other

#### Implementation Notes
- Store price in cents to avoid floating point issues
- Tags as array or separate table
- Consider full-text search for later

---

### 4. Needs (Requests)

#### User Stories
- As a user, I can post a need
- As a user, I can edit my needs
- As a user, I can delete my needs
- As a user, I can mark a need as fulfilled
- As a user, I can view all my needs

#### Requirements
- Need creation form
- Need listing with title, description, budget (optional)
- Open/fulfilled status
- Edit and delete functionality

#### Data Model
```
Need {
  id
  userId (foreign key)
  title
  description
  budget (cents, nullable)
  category
  isFulfilled
  createdAt
  updatedAt
}
```

---

### 5. Feed / Discovery

#### User Stories
- As a user, I can browse skills from people in my network
- As a user, I can browse needs from people in my network
- As a user, I can search for skills
- As a user, I can filter by category

#### Requirements
- Feed of skills from connections
- Feed of needs from connections
- Search functionality (title, description)
- Category filtering
- Sort by: newest, price (low/high)

#### Screens
- `/` or `/home` - Combined feed
- `/skills` - Browse skills
- `/needs` - Browse needs

#### Implementation Notes
- For MVP without connections: show all skills/needs
- Add connection filtering in Phase 2
- Pagination (infinite scroll or pages)

---

### 6. Service Requests

#### User Stories
- As a user, I can request someone's skill
- As a skill owner, I can see requests for my skills
- As a skill owner, I can approve or decline a request
- As a requester, I can see my sent requests and their status
- As a user, I can cancel a pending request

#### Requirements
- Request creation from skill page
- Request inbox for skill owners
- Approve/decline actions
- Request states: pending, approved, declined, cancelled, completed
- Optional message with request

#### Data Model
```
ServiceRequest {
  id
  skillId (foreign key)
  requesterId (foreign key)
  providerId (foreign key, denormalized)
  message
  status (pending | approved | declined | cancelled | completed)
  createdAt
  updatedAt
}
```

#### Screens
- `/requests` - My requests (sent and received)
- `/requests/sent` - Requests I've sent
- `/requests/received` - Requests for my skills

#### Implementation Notes
- Notification system needed (email for MVP)
- Consider adding scheduled time later

---

### 7. Connections (Simplified for MVP)

#### User Stories
- As a user, I can invite friends via link
- As a user, I can see my connections
- As a user, I can remove a connection
- As a user, I can accept/decline connection requests

#### Requirements
- Invite link generation
- Connection request system
- Mutual connections (both must accept)
- Connection list

#### Data Model
```
Connection {
  id
  userId1
  userId2
  status (pending | accepted)
  createdAt
}
```

#### Implementation Notes
- For MVP: invite links that auto-connect
- Later: import from TikTok/Instagram

---

### 8. Notifications (MVP - Email Only)

#### User Stories
- As a user, I receive an email when someone requests my skill
- As a user, I receive an email when my request is approved/declined
- As a user, I can unsubscribe from emails

#### Requirements
- Transactional email system
- Email templates for key events
- Unsubscribe functionality

#### Email Triggers
- New service request received
- Request approved
- Request declined
- New connection request
- Connection request accepted

#### Implementation Notes
- Use Resend, SendGrid, or Postmark
- Keep templates simple
- In-app notifications in Phase 2

---

## MVP Screen Summary

| Route | Screen | Description |
|-------|--------|-------------|
| `/` | Home/Feed | Browse skills and needs |
| `/login` | Login | Sign in |
| `/signup` | Sign Up | Create account |
| `/skills` | Skills Browse | All skills |
| `/skills/new` | Create Skill | Add a skill |
| `/skills/:id` | Skill Detail | View skill, request it |
| `/skills/:id/edit` | Edit Skill | Edit your skill |
| `/needs` | Needs Browse | All needs |
| `/needs/new` | Create Need | Post a need |
| `/needs/:id` | Need Detail | View need |
| `/needs/:id/edit` | Edit Need | Edit your need |
| `/requests` | Requests | Sent and received |
| `/profile` | My Profile | View/edit profile |
| `/profile/:id` | User Profile | View someone else |
| `/settings` | Settings | Account settings |
| `/invite` | Invite | Get invite link |

---

## Phase 2 Features

### Social Authentication
- TikTok OAuth login
- Import TikTok followers as connections
- Display TikTok handle on profile

### In-App Messaging
- Direct messages between users
- Message threads per request
- Real-time with Socket.io

### Reviews & Ratings
- Rate completed services (1-5 stars)
- Written reviews
- Average rating on profiles
- Review moderation

### Enhanced Notifications
- In-app notification center
- Push notifications (web)
- Notification preferences

### Availability & Scheduling
- Set available times
- Calendar integration
- Booking specific time slots

---

## Phase 3 Features

### Video Content
- Video introductions for skills
- TikTok-style vertical video feed
- Video upload and processing
- Thumbnail generation

### Live Sessions
- Go live to demonstrate skills
- Live Q&A
- Tip during live

### Enhanced Search
- Full-text search
- Location-based filtering
- Advanced filters

---

## Phase 4 Features

### In-App Payments
- Stripe Connect integration
- Platform fee (5-10%)
- Payment protection/escrow
- Payout management

### Mobile Apps
- iOS app (React Native)
- Android app (React Native)
- Push notifications

### Advanced Features
- Recurring bookings
- Packages (bundle of sessions)
- Gift cards
- Referral program
- Verified badges

---

## MVP User Flows

### Flow 1: New User Signup
```
1. Land on homepage
2. Click "Sign Up"
3. Enter email, password, name
4. Verify email (optional)
5. Complete profile (bio, payment handles)
6. See onboarding prompts:
   - "Add your first skill"
   - "Post what you need"
   - "Invite friends"
```

### Flow 2: Post a Skill
```
1. Click "Add Skill" button
2. Enter title
3. Enter description
4. Set price and type (hourly/session/flat)
5. Select category
6. Add tags (optional)
7. Submit
8. Skill appears in feed and profile
```

### Flow 3: Request a Service
```
1. Browse feed or search
2. Click on a skill
3. View skill details and provider profile
4. Click "Request"
5. Add optional message
6. Submit request
7. Provider receives email notification
8. Wait for approval
```

### Flow 4: Fulfill a Request
```
1. Receive email: "New request for [Skill]"
2. Click link to view request
3. See requester's profile and message
4. Click "Approve" or "Decline"
5. If approved: coordinate externally
6. Complete service
7. Receive payment via Venmo/Cash App
8. Mark request as "Completed"
```

### Flow 5: Post a Need
```
1. Click "Post Need"
2. Enter title (what you need)
3. Enter description
4. Set budget (optional)
5. Select category
6. Submit
7. Need appears in feed
8. Wait for someone to reach out
```

---

## MVP API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID

### Skills
- `GET /api/skills` - List skills (with filters)
- `POST /api/skills` - Create skill
- `GET /api/skills/:id` - Get skill
- `PATCH /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Needs
- `GET /api/needs` - List needs (with filters)
- `POST /api/needs` - Create need
- `GET /api/needs/:id` - Get need
- `PATCH /api/needs/:id` - Update need
- `DELETE /api/needs/:id` - Delete need

### Requests
- `GET /api/requests` - List my requests
- `POST /api/requests` - Create request
- `PATCH /api/requests/:id` - Update status
- `DELETE /api/requests/:id` - Cancel request

### Connections
- `GET /api/connections` - List connections
- `POST /api/connections/invite` - Generate invite
- `POST /api/connections/accept` - Accept invite
- `DELETE /api/connections/:id` - Remove connection

---

## Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String
  bio           String?
  avatarUrl     String?
  venmoHandle   String?
  cashAppHandle String?
  paypalHandle  String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  skills        Skill[]
  needs         Need[]
  sentRequests  ServiceRequest[] @relation("Requester")
  receivedRequests ServiceRequest[] @relation("Provider")
  connections1  Connection[] @relation("User1")
  connections2  Connection[] @relation("User2")
}

model Skill {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  description String
  price       Int      // cents
  priceType   PriceType
  category    String
  tags        String[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  requests    ServiceRequest[]
}

model Need {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String
  description String
  budget      Int?     // cents
  category    String
  isFulfilled Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ServiceRequest {
  id          String        @id @default(cuid())
  skillId     String
  skill       Skill         @relation(fields: [skillId], references: [id])
  requesterId String
  requester   User          @relation("Requester", fields: [requesterId], references: [id])
  providerId  String
  provider    User          @relation("Provider", fields: [providerId], references: [id])
  message     String?
  status      RequestStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Connection {
  id        String           @id @default(cuid())
  userId1   String
  user1     User             @relation("User1", fields: [userId1], references: [id])
  userId2   String
  user2     User             @relation("User2", fields: [userId2], references: [id])
  status    ConnectionStatus @default(PENDING)
  createdAt DateTime         @default(now())

  @@unique([userId1, userId2])
}

enum PriceType {
  HOURLY
  SESSION
  FLAT
}

enum RequestStatus {
  PENDING
  APPROVED
  DECLINED
  CANCELLED
  COMPLETED
}

enum ConnectionStatus {
  PENDING
  ACCEPTED
}
```

---

## MVP Success Metrics

### Primary
- **Users signed up** - Target: 50 in first month
- **Skills posted** - Target: 100 total
- **Requests made** - Target: 20 total
- **Requests completed** - Target: 10 total

### Secondary
- **Time to first skill** - How fast users post
- **Skills per user** - Engagement depth
- **Request approval rate** - Market health
- **Return visits** - Retention signal

---

## MVP Timeline Estimate

| Phase | Tasks |
|-------|-------|
| Setup | Project scaffolding, database, auth |
| Core | Skills CRUD, Needs CRUD, Feed |
| Requests | Request system, status flow |
| Polish | Profile, connections, emails |
| Deploy | Hosting, domain, launch |

---

*This feature breakdown provides the roadmap for MVP development. Each feature is scoped to be simple but complete, with clear paths for future enhancement.*
