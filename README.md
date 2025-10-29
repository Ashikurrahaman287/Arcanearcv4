Arcane Arc Program
Overview
Arcane Arc is a personal transformation platform designed around seasonal self-improvement, specifically focused on an 8-week "Winter Arc" program. The platform combines goal-setting, daily journaling, weekly challenges, and gamification elements to guide users through a structured personal growth journey. Users track their progress across seven life pillars (Self, Skill, Body, Mind, Spirit, Career, Relationship), while administrators manage content, challenges, and monitor user engagement through a dedicated admin panel.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework & Build System:

React with TypeScript running in ESM module mode
Vite as the build tool providing fast HMR and optimized production builds
Wouter for lightweight client-side routing (replacing React Router)
Path aliases configured for clean imports (@/, @shared/, @assets/)
UI Component System:

Shadcn UI component library built on Radix UI primitives for accessibility
Tailwind CSS for styling with custom design tokens defined in CSS variables
Component configuration follows "New York" style variant with neutral base color
Design system inspired by Notion (dashboards), Linear (progress viz), Headspace/Calm (wellness), and Duolingo (gamification)
Typography Strategy:

Inter font for all functional UI elements (body text, forms, buttons)
Playfair Display for emotional impact elements (heroes, section headers, quotes)
Progressive disclosure pattern to gradually reveal complexity
Celebration-focused UX with rewarding achievement animations
State Management:

TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity)
Local authentication state stored in localStorage (JWT token + serialized user object)
Form state managed through React Hook Form with Zod schema validation
Query invalidation patterns trigger UI updates after mutations
Layout Patterns:

Public pages: Header/Footer layout with centered max-width containers (max-w-7xl)
Dashboard: Sidebar layout using SidebarProvider context with 16rem width
Admin panel: Full-width layout with persistent left sidebar navigation
Responsive breakpoints following Tailwind's mobile-first methodology
Backend Architecture
Server Framework:

Express.js with TypeScript in ESM mode
Custom middleware pipeline: JSON parsing with raw body capture, request logging with duration tracking, JWT authentication
RESTful API design with /api prefix for all endpoints
Session management using JWT tokens (configurable secret via SESSION_SECRET env var)
Authentication & Authorization:

bcryptjs for password hashing (10 salt rounds)
JWT tokens for stateless authentication
Two-tier role system: "user" (default) and "admin"
Protected routes enforced via authenticateToken middleware
Admin-only endpoints enforced via requireAdmin middleware
Token passed via Authorization header (Bearer <token>)
Database Layer:

Drizzle ORM as the database abstraction layer
Neon serverless PostgreSQL as the database provider
WebSocket support configured for Neon's serverless architecture
Schema-first approach with TypeScript types generated from Drizzle schema
Migration system using Drizzle Kit (npm run db:push)
Data Models:

Users: Authentication, role management, progress tracking (currentWeek, streak, totalJournals)
Weeks: 8-week program structure with themes, icons, and colors
Challenges: Weekly/daily tasks linked to specific program weeks
UserChallenges: Many-to-many relationship tracking challenge completion
Journals: Daily reflection entries with mood tracking and structured prompts
Resources: Learning materials categorized by topic with external URLs
Announcements: Admin-created updates visible to all users
Achievements: Gamification system with unlockable badges
UserProgress: Historical tracking of user milestones
API Design Patterns:

Query endpoints return enriched data (e.g., challenges with week info)
Mutation endpoints return updated entities for optimistic UI updates
Consistent error handling with descriptive JSON responses
Request/response logging truncated to 80 characters for readability
External Dependencies
Database:

Neon Serverless PostgreSQL (accessed via DATABASE_URL environment variable)
Connection pooling via @neondatabase/serverless
WebSocket transport for serverless compatibility
Authentication:

JWT (jsonwebtoken package) for token generation and verification
bcryptjs for secure password hashing
UI Libraries:

Radix UI component primitives (20+ components: accordion, dialog, dropdown, etc.)
Tailwind CSS with custom configuration (custom border radius, color system)
Lucide React for consistent iconography throughout the app
Development Tools:

tsx for TypeScript execution in development mode
esbuild for server-side bundling in production
Replit-specific plugins for runtime error overlays and dev banners (development only)
Form & Validation:

React Hook Form for performant form state management
Zod for runtime type validation and schema definition
@hookform/resolvers for bridging React Hook Form with Zod schemas
Build & Deployment:

Production build creates two outputs: Vite-bundled client in dist/public, esbuild-bundled server in dist
Static assets served from public directory in production
Environment-aware configuration (NODE_ENV, REPL_ID for Replit-specific features)
Design Assets:

Custom fonts via Google Fonts CDN (Inter, Playfair Display, DM Sans, Fira Code, Geist Mono)
Generated images stored in attached_assets/ directory
Favicon and metadata configured for Winter Arc branding
Admin System
Admin Login
Dedicated admin login page at /admin/login with professional dark-themed UI
Admin-specific branding with shield icon and amber color scheme
Security warning banner indicating restricted access
Role verification enforces admin-only access to admin routes
Link to regular user login for non-admin users
Access link available in footer of public pages
Admin Authentication
Admin users share the same login endpoint as regular users (/api/auth/login)
JWT token includes user role ("user" or "admin")
Admin routes protected by ProtectedRoute component with requireAdmin prop
Non-admin users attempting admin access are redirected to /dashboard
Admin panel accessible at /admin with sidebar navigation
Admin Routes
/admin - Dashboard with stats overview (total users, active users, journals, challenges)
/admin/users - User management interface
/admin/challenges - Challenge creation and management
/admin/announcements - Create and manage announcements
/admin/resources - Learning resource management
Database Seeding
Seed script creates default admin user (username: "admin", password: "admin123")
IMPORTANT: Change admin password immediately in production
Seed command: npx tsx server/seed.ts
Also creates: 8 program weeks, sample challenges, resources, and welcome announcement
Replit Environment Setup
Vite Configuration
Host configured as 0.0.0.0 to bind to all interfaces
Allowed hosts include .replit.dev and .repl.co for Replit's proxy
HMR client port set to 443 for secure WebSocket connections
Critical for app visibility through Replit's iframe proxy
Development Workflow
Single workflow serves both frontend and backend on port 5000
Command: cd Arcanearcv2 && npm run dev
Server binds to 0.0.0.0:5000 with port reuse enabled
Vite dev server runs in parallel via Express middleware
Deployment Configuration
Build: npm run build (creates Vite client bundle + esbuild server bundle)
Run: npm run start (production mode)
Deployment target: Autoscale (stateless website)
Port 5000 is the only non-firewalled port on Replit
Environment Variables
DATABASE_URL - Neon PostgreSQL connection string (pre-configured)
NODE_ENV - Set to "development" or "production"
SESSION_SECRET - Optional JWT secret (defaults to hardcoded value)
PORT - Server port (defaults to 5000)
