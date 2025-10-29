# Arcane Arc Program - Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with Wellness + Productivity Hybrid

Drawing inspiration from:
- **Notion** for clean dashboards and content organization
- **Linear** for progress visualization and modern UI patterns
- **Headspace/Calm** for motivational wellness aesthetics
- **Duolingo** for gamification and streak tracking

**Design Principles:**
1. Inspirational yet functional - balance motivation with utility
2. Progressive disclosure - reveal complexity gradually
3. Celebrate progress - make achievements feel rewarding
4. Serene focus - minimize distractions during reflection

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - for UI, body text, and data
- Accent: Playfair Display - for hero headlines, section titles, and inspirational quotes

**Type Scale:**
- Hero Display: text-6xl md:text-7xl lg:text-8xl (Playfair, font-bold)
- Section Headers: text-4xl md:text-5xl (Playfair, font-semibold)
- Page Titles: text-3xl md:text-4xl (Inter, font-bold)
- Card Titles: text-xl md:text-2xl (Inter, font-semibold)
- Body Text: text-base md:text-lg (Inter, font-normal)
- Small Text/Labels: text-sm (Inter, font-medium)
- Micro Text: text-xs (Inter, font-normal)

**Hierarchy Implementation:**
- Use Playfair sparingly for emotional impact (heroes, testimonials, week themes)
- Inter for all functional UI elements
- Letter spacing: tracking-tight for large headlines, tracking-normal for body

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20, 24, 32

**Container Strategy:**
- Public Pages: max-w-7xl for full sections, max-w-4xl for text content
- Dashboard: max-w-screen-2xl with sidebar layout
- Admin Panel: Full-width with left sidebar navigation

**Grid Patterns:**
- Landing Features: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Dashboard Cards: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6
- Progress Modules: grid-cols-1 md:grid-cols-2 gap-8

**Section Padding:**
- Desktop: py-20 md:py-24 lg:py-32
- Mobile: py-12 md:py-16
- Card Internal: p-6 md:p-8

---

## Component Library

### Navigation

**Public Header:**
- Sticky top navigation (sticky top-0 z-50)
- Logo left, navigation center, CTA button right
- Transparent background with backdrop blur on scroll
- Mobile: Hamburger menu with slide-in drawer

**Dashboard Sidebar:**
- Fixed left sidebar (w-64) on desktop
- Collapsible on tablet/mobile with overlay
- Icon + label navigation items
- User profile card at bottom
- Active state with subtle left border accent

### Hero Section

**Landing Hero:**
- Full viewport height (min-h-screen)
- Background: Large atmospheric winter/mountain image with gradient overlay
- Content: Centered with max-w-4xl
- Headline + subheadline + dual CTAs (primary + secondary)
- Scroll indicator at bottom
- Image: Inspiring winter landscape, mountain peaks at dawn, or person silhouetted against aurora

### Cards & Containers

**Feature Cards (Landing):**
- Rounded corners (rounded-2xl)
- Subtle border with hover lift effect
- Icon at top (w-12 h-12)
- Title + description + optional link
- Padding: p-8

**Dashboard Progress Cards:**
- Rounded (rounded-xl)
- Shadow (shadow-md)
- Header with icon + title
- Content area with generous padding (p-6)
- Footer with action buttons if needed

**Challenge Cards:**
- Full-bleed for active challenge
- Compact list view for upcoming
- Checkbox left, content center, status badge right
- Expandable for details

### Progress Visualization

**Progress Bars:**
- Height: h-3 for main progress, h-2 for mini
- Rounded full (rounded-full)
- Animated fill with transition-all duration-500
- Percentage label outside or overlaid

**Circular Progress (Week Modules):**
- SVG-based circular indicators
- Diameter: 120px for primary, 80px for compact
- Stroke width: 8px
- Animated arc with percentage in center

**Streak Counter:**
- Flame icon + number combo
- Badge style (rounded-full px-4 py-2)
- Pulsing animation for active streak

### Forms & Inputs

**Text Inputs:**
- Height: h-12
- Rounded: rounded-lg
- Border: border-2
- Focus: ring-4 with offset
- Padding: px-4

**Textarea (Journal):**
- Min height: min-h-48
- Rounded: rounded-lg
- Resize vertical only
- Auto-save indicator (small text below)

**Buttons:**
- Primary: Large (h-12 px-8), rounded-lg, font-semibold
- Secondary: Same size, outline variant
- Icon buttons: w-10 h-10, rounded-md
- On hero images: Backdrop blur background (backdrop-blur-sm)

### Badges & Tags

**Achievement Badges:**
- Circular with icon (w-16 h-16)
- Glow effect for unlocked
- Grayscale for locked
- Tooltip on hover

**Status Tags:**
- Small (text-xs px-3 py-1)
- Rounded-full
- Various semantic states (active, completed, pending)

### Data Display

**Weekly Theme Cards:**
- Large icon at top (w-20 h-20)
- Week number + theme name
- Progress ring around card
- "Start Week" / "Continue" button at bottom
- Grid layout: 4 cards per row on desktop

**Journal Entries List:**
- Timeline-style with left border
- Date header + entry preview
- Expandable to full text
- Max 5 visible, "Load more" button

**Analytics Charts (Admin):**
- Clean line/bar charts
- Minimal gridlines
- Tooltips on hover
- Legend at bottom

### Community Elements

**Member Avatars:**
- Circular (rounded-full)
- Sizes: w-8 h-8 (mini), w-12 h-12 (standard), w-24 h-24 (profile)
- Initials fallback for no image

**Reflection Share Cards:**
- User avatar + name header
- Reflection text (line-clamp-3)
- Like/comment counts
- Timestamp

---

## Page-Specific Layouts

### Landing Page Structure

1. **Hero** (full viewport): Image background + centered CTA
2. **Program Overview** (py-24): 8-week grid with icons
3. **How It Works** (py-20): 3-step process, alternating image-text
4. **Testimonials** (py-24): 3-column grid with quotes + avatars
5. **Meet the Mentor** (py-20): 2-column split (image left, bio right)
6. **Final CTA** (py-32): Centered with gradient background
7. **Footer**: 4-column grid (About, Program, Resources, Social)

### User Dashboard Layout

**Left Sidebar** (fixed, w-64):
- Logo + navigation + profile

**Main Content Area** (flex-1):
- Welcome header with greeting + progress
- "Today's Focus" card (prominent)
- 3-column grid: This Week's Challenge | Journal Prompt | Quick Stats
- Recent Activity timeline
- Upcoming milestones

### Admin Panel Layout

**Left Sidebar** (w-64): Admin navigation

**Top Bar**: Search + notifications + admin profile

**Main Area**:
- Stats overview (4 cards in row)
- Recent activity table
- Quick actions section

---

## Animations

**Sparingly Applied:**
- Progress bar fills (transition-all duration-500)
- Card hover lift (translate-y-1 transition-transform)
- Badge unlock (scale-in with glow)
- Page transitions (fade)

---

## Images

**Hero Image:** Large, high-quality winter landscape - mountain range at sunrise with subtle aurora hints, atmospheric mist. Position: background-cover with gradient overlay (dark to transparent).

**About Section Image:** Portrait of mentor in thoughtful pose, warm lighting. Position: Left side of 2-column layout.

**How It Works:** Simple illustrative icons or abstract imagery for each step - no photography needed, focus on clarity.

**Testimonials:** User avatars (circular, professional headshots if available, initials fallback).

**Admin Panel:** No decorative images - focus on data visualization and charts.