# Arcane Arc Program

## Overview

Arcane Arc is a personal transformation platform designed around seasonal self-improvement, starting with a "Winter Arc" program. The platform enables users to embark on an 8-week guided journey of personal growth through goal setting, daily reflection, weekly challenges, and community engagement. The application features a public-facing website for program information and user acquisition, an authenticated user dashboard for tracking progress and journaling, and an admin panel for content management and user oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript as the primary frontend framework
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and data fetching

**UI Component System:**
- Shadcn UI components built on Radix UI primitives for accessibility
- Tailwind CSS for styling with custom design tokens
- Component path aliases configured via TypeScript (`@/components`, `@/lib`, etc.)
- Design system based on "New York" style variant with custom color scheme

**Design Philosophy:**
- Reference-based design drawing from Notion (dashboards), Linear (progress visualization), Headspace/Calm (wellness aesthetics), and Duolingo (gamification)
- Typography system using Inter for UI/functional elements and Playfair Display for emotional impact (heroes, quotes)
- Progressive disclosure pattern to reveal complexity gradually
- Celebration-focused UX to make achievements feel rewarding

**State Management:**
- Local authentication state stored in localStorage (JWT token + user object)
- Server state managed through TanStack Query with query invalidation patterns
- Form state handled by React Hook Form with Zod validation

**Layout Patterns:**
- Public pages: Header/Footer layout with max-width containers
- Dashboard: Sidebar layout with SidebarProvider context
- Admin panel: Full-width with left sidebar navigation
- Responsive breakpoints following Tailwind's mobile-first approach

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript running in ESM module mode
- Custom middleware for JSON parsing, request logging, and authentication
- RESTful API design with `/api` prefix for all endpoints

**Authentication & Authorization:**
- JWT-based authentication using jsonwebtoken library
- BCrypt for password hashing
- Token-based middleware (`authenticateToken`) for protected routes
- Role-based access control with admin privilege checking (`requireAdmin`)
- Tokens stored client-side and sent via Authorization header

**API Structure:**
- Public routes: `/api/auth/login`, `/api/auth/signup`
- User routes: Dashboard data, journals, challenges, resources, profile
- Admin routes: User management, challenge creation, announcements, resources, analytics
- All routes return JSON responses with consistent error handling

**Request/Response Flow:**
- Request logging middleware tracks method, path, status, duration, and response body
- JSON body verification with rawBody preservation for webhook support
- Error responses standardized with status codes and descriptive messages

### Data Storage

**Database:**
- PostgreSQL via Neon serverless (WebSocket-based connection)
- Drizzle ORM for type-safe database operations and migrations
- Connection pooling through `@neondatabase/serverless`

**Schema Design:**
- **Users:** Authentication, role (user/admin), progress tracking (currentWeek, streak, totalJournals)
- **Weeks:** 8-week program structure with theme, description, icon, and color
- **Challenges:** Weekly/daily challenges linked to specific weeks, created by admins
- **UserChallenges:** Junction table tracking user completion status
- **Journals:** Daily reflection entries with achievement, challenge, gratitude, and mood
- **Resources:** Learning materials categorized by topic and type (video/article/pdf)
- **Announcements:** Admin posts visible to all users
- **Achievements:** Gamification system with unlock criteria
- **UserAchievements:** User achievement tracking with unlock timestamps
- **UserProgress:** Weekly goal and progress tracking

**Data Access Layer:**
- Storage abstraction layer (`server/storage.ts`) provides interface for all database operations
- Drizzle queries with type inference and relation loading
- Aggregate queries for analytics (user stats, activity metrics)

### External Dependencies

**Core Dependencies:**
- `@neondatabase/serverless`: PostgreSQL database connection via Neon
- `drizzle-orm`: TypeScript ORM with schema definition and query building
- `express`: Web server framework
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication tokens
- `@tanstack/react-query`: Server state management
- `wouter`: Client-side routing
- `react-hook-form` + `@hookform/resolvers`: Form handling with validation
- `zod`: Schema validation (used with Drizzle and form validation)

**UI Component Libraries:**
- `@radix-ui/*`: Unstyled accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Component variant styling
- `lucide-react`: Icon system

**Development Dependencies:**
- `vite`: Build tool and dev server with HMR
- `tsx`: TypeScript execution for development
- `esbuild`: Production server bundling
- `drizzle-kit`: Database migration tooling

**Fonts:**
- Google Fonts: Inter (primary UI font) and Playfair Display (accent font for emotional content)

**Asset Management:**
- Static assets stored in `attached_assets/` directory
- Vite alias configuration for `@assets` path resolution
- Generated images for hero sections and mentor portraits

**Session Management:**
- Client-side JWT storage (no server-side session store)
- Token refresh not implemented (tokens are long-lived)

## Recent Updates (October 29, 2025)

### New Features Implemented

**Database Schema Enhancements:**
- Added user profile fields: profile picture URL, bio, phone, date of birth, location, occupation, goals, emergency contact information
- Added Tasks table for admin-created assignments with weekly associations and due dates
- Added TaskSubmissions table with star ratings (1-5) and admin feedback
- Added UserTasks table for individual task assignments
- Added Messages table for admin-to-user and group messaging

**Backend API Enhancements:**
- Profile management: Update user profile endpoint (PATCH /api/profile)
- Task management: Task listing, submission, and status tracking for users
- Admin task management: Create, update, delete tasks, view all submissions
- Task rating system: Admin can rate submissions with stars and detailed feedback
- Messaging system: Admin can send messages to individual users, all users, or groups by week
- All new routes include proper authentication and authorization

**Frontend Enhancements:**
- **Enhanced User Dashboard:** Now displays user statistics, assigned tasks with submission status, and completion tracking
- **Updated Profile Page:** Users can edit their profile, add bio, contact information, goals, and profile picture URL
- **New Admin Messages Page:** Send messages to users individually or in groups, view sent messages
- **New Admin Tasks Page:** View task submissions, rate submissions with star ratings and feedback
- Added navigation links in admin sidebar for Messages and Tasks

**Deployment Configuration:**
- Added vercel.json for Vercel deployment compatibility
- Added .vercelignore to exclude development files
- Added .env.example with environment variable documentation
- Configured Replit deployment with autoscale mode

### Test Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Access: Full admin panel with user management, messaging, task rating, and content management

**Test User Accounts:**
- Username: `testuser1` / Password: `user123`
  - Profile: John Doe, Week 1, 3-day streak, 5 journal entries
  - Has sample task assignments and welcome message

- Username: `testuser2` / Password: `user123`
  - Profile: Jane Smith, Week 2, 7-day streak, 10 journal entries
  - Has sample task assignments and welcome message

### Testing the Application

1. **User Login Flow:**
   - Navigate to `/login`
   - Login with testuser1 credentials
   - Access dashboard at `/dashboard` - view stats, tasks, and announcements
   - Navigate to profile at `/dashboard/profile` - edit profile information
   - Submit tasks and view feedback when rated by admin

2. **Admin Login Flow:**
   - Navigate to `/admin/login` for admin-specific login page
   - Or use regular `/login` with admin credentials (auto-redirects to admin panel)
   - Access admin dashboard at `/admin`
   - Manage users at `/admin/users`
   - Create and manage tasks at `/admin/tasks`
   - Send messages at `/admin/messages`
   - Rate task submissions at `/admin/tasks`
   - Create challenges and resources at `/admin/challenges` and `/admin/resources`

### Deployment Instructions

**For Vercel Deployment:**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: Random secure string for JWT signing
3. Deploy - Vercel will automatically use the build configuration from vercel.json

**For Replit Deployment:**
1. Click the "Publish" button in Replit
2. The project is configured with autoscale deployment
3. Build command: `npm run build`
4. Run command: `npm start`
5. Environment variables are automatically configured from Replit Secrets

### Database Management

- To push schema changes: `npm run db:push`
- To force push (if needed): `npm run db:push --force`
- To seed database: `npx tsx server/seed.ts`
- Database tables are automatically created from the Drizzle schema

### Production Readiness

**Completed:**
✅ Full-stack authentication with JWT and role-based access control
✅ Complete CRUD operations for all entities
✅ User profile management with extended fields
✅ Task assignment and rating system
✅ Admin messaging system (individual and group)
✅ Vercel and Replit deployment configuration
✅ Production database (PostgreSQL via Neon)
✅ Responsive UI with Shadcn components
✅ Form validation with React Hook Form and Zod

**Security Features:**
- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- CSRF protection ready
- Secure headers configured in Vercel
- Environment variables properly managed

**Performance Optimizations:**
- Database connection pooling
- TanStack Query for efficient data fetching and caching
- Optimized Vite build configuration
- Code splitting and lazy loading ready