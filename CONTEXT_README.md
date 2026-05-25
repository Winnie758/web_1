# Context README

## Project Overview

- **Project Name:** ResilienceIQ (package name: `accrcc-resilienceiq`)
- **Version:** 1.0.0
- **Type:** Single-page React application (Vite + TypeScript)
- **Purpose:** Unified climate and mental health Monitoring & Evaluation (M&E) SaaS platform providing real-time, role-based operational intelligence dashboards for NGOs and government organizations
- **Stage:** Active build (mock-first data mode — no live database connected)
- **Deployment Mode:** Digital-only; no ecommerce, no Stripe checkout flows, no payment tables present despite Stripe/Supabase env vars appearing in `.env` (these appear to be scaffold placeholders; no Stripe or Supabase integration code is present in any source file)
- **Conversion Goal:** Lead generation via public homepage
- **Design Vibe:** Corporate

---

## End-to-End Features List

- **Public Homepage** with marketing content, feature highlights, contact info, and dark/light mode toggle
- **Login Modal** with role-based login (role selector dropdown + credential fields) and error state handling
- **Role-Based Dashboard Routing** — four distinct dashboards rendered based on authenticated user role
- **Senior Dashboard** — executive-level KPIs, area/bar/radar charts, alerts, activity overview, map integration
- **Employee Dashboard** — personal KPIs, task tracking, report filing, bar charts, meetings module
- **Field Officer Dashboard** — task list, field submissions, GIS map, notifications, camera/upload actions
- **Mental Health Dashboard** — mental health KPIs, line/bar/area charts, program tracking, resource library indicators
- **Attendance Module** — full attendance lifecycle: form submission, dashboard view, KPI charts, tabular records, participation summary, and verification workflow
- **Attendance Verification Panel** — filter and approve/reject attendance records with status badges
- **GIS Map Component** — mock geographic resilience data visualization with vulnerability color coding, zoom/layer controls
- **KPI Cards** — animated, icon-mapped metric cards with trend indicators (up/down)
- **Meetings Module** — shared meeting list with status indicators, expandable detail, and add-meeting UI
- **Dark Mode** — class-based dark mode toggle available globally
- **Auth State Management** — Zustand store managing user session and role

---

## Business DNA

- **Category:** Operational intelligence and M&E SaaS platform
- **Target Audience:** Formal sector — NGO program managers, government field officers, senior leadership, mental health program staff
- **USP:** Unified climate and mental health M&E with real-time, role-based operational intelligence dashboards
- **Dual Domain Focus:** Climate resilience + mental health programming tracked under one platform
- **Location Model:** Digital-only (no physical location features beyond GIS field data)
- **Conversion Goal:** Lead generation — public homepage drives interest; login gates the platform
- **Naming:** ResilienceIQ (branded, confirmed name)
- **No ecommerce, no payments, no subscriptions** are implemented in the codebase

---

## Project/App Capabilities

- Role-gated dashboard system with four roles: Senior, Employee, Field Officer, Mental Health
- Mock-first data architecture — all data sourced from `src/data/mockData.ts`
- Recharts-powered data visualization (bar, line, area, radar, pie charts)
- Attendance tracking with multi-step form, record table, KPI charts, and a verification/approval workflow
- GIS map visualization using mock resilience/vulnerability data points
- Shared component library (KPICard, MeetingsModule, GISMap) reused across role dashboards
- Zustand-based auth store for login state and role management
- Tailwind CSS with custom color palette (`forest`, `mind`, `earth`, `sky` token families inferred from config)
- Dark mode support via Tailwind `darkMode: 'class'`
- Lucide React icons used throughout
- No routing library (React Router or similar) detected — view switching is likely state-driven within `App.tsx`

---

## Page-by-Page Breakdown

> Note: No file-based routing is present. Views are conditionally rendered based on auth state and role stored in Zustand.

### Public Homepage (`src/components/PublicHomepage.tsx`)
- Marketing landing page visible to unauthenticated users
- Sections: hero, feature highlights (climate + mental health), stats/KPIs, contact info
- Navigation with dark/light mode toggle and mobile menu (hamburger)
- CTA triggers `LoginModal` open state
- Icons: Leaf, Brain, Users, Globe, BarChart2, Shield, MapPin, Phone, Mail, Activity

### Login Modal (`src/components/LoginModal.tsx`)
- Overlay modal with email, password, and role selector (dropdown)
- Roles available: mapped from `UserRole` type — at minimum Senior, Employee, Field Officer, Mental Health roles
- Show/hide password toggle
- Error state display (`AlertCircle`)
- On success: updates Zustand auth store, closes modal, renders appropriate dashboard

### Dashboard Shell (`src/components/DashboardLayout.tsx`)
- Persistent layout wrapping all authenticated views
- Sidebar navigation with icons: LayoutDashboard, BarChart2, FolderOpen, Users, FileText, Calendar, CheckSquare, Map, Settings, ClipboardList, Activity
- Top bar: Bell (notifications), Sun/Moon (dark mode), LogOut
- Mobile-responsive with Menu/X hamburger toggle
- Renders role-specific dashboard content in main area

### Senior Dashboard (`src/components/dashboards/SeniorDashboard.tsx`)
- Executive overview: KPI cards, area charts, bar charts, radar chart
- Alert/warning indicators (AlertTriangle, CheckCircle, Clock)
- Activity feed and map pin references
- Uses `KPICard`, `GISMap`, mock data

### Employee Dashboard (`src/components/dashboards/EmployeeDashboard.tsx`)
- Personal KPI cards, task checklist, report filing indicators
- Bar chart for performance/activity data
- Integrates `MeetingsModule` and `KPICard`

### Field Officer Dashboard (`src/components/dashboards/FieldOfficerDashboard.tsx`)
- Task list with completion states
- Field submission log
- Notification feed
- GIS map for field location context
- Action buttons: Camera, Upload, Navigation, FileText
- Integrates `MeetingsModule` and `GISMap`

### Mental Health Dashboard (`src/components/dashboards/MentalHealthDashboard.tsx`)
- KPI cards: Brain, Shield, Users, BookOpen, TrendingUp icons
- Line, bar, and area charts for program metrics
- Program tracking and resource library indicators
- Integrates `KPICard`

### Attendance Module (`src/components/attendance/AttendanceModule.tsx`)
- Tab/section switcher: Form, Dashboard, Charts (ClipboardList, UserCheck, BarChart2)
- Composes `AttendanceForm`, `AttendanceDashboard`
- Pulls from `MOCK_ATTENDANCE_RECORDS`, `MOCK_ATTENDANCE_ACTIVITIES`

### Attendance Dashboard (`src/components/attendance/AttendanceDashboard.tsx`)
- Combines `AttendanceTable`, `ParticipationSummary`, `AttendanceKPIChart`, `VerificationPanel`
- Accepts `AttendanceRecord[]` and `AttendanceRole` props

### Attendance Form (`src/components/attendance/AttendanceForm.tsx`)
- Fields: activity selector, date, time, location (MapPin), tags
- Validates against existing records
- Submits new `AttendanceRecord`

---

## Component-Level Signals

| Component | Key Props / Behavior |
|---|---|
| `KPICard` | Accepts `KPI` type; animated counter; icon mapped by string key; trend up/down indicator |
| `MeetingsModule` | Reads `MEETINGS` from mockData; status-styled rows; expandable detail; add-meeting UI |
| `GISMap` | Reads `RESILIENCE_DATA` from mockData; vulnerability color map (`low/medium/high`); zoom + layer controls (mock) |
| `AttendanceTable` | Sortable columns (ChevronUp/Down); optional `showVerification` prop; renders `VerificationBadge` |
| `VerificationBadge` | Props: `status: AttendanceVerificationStatus`, `verifiedBy`, `compact`; icons: Clock, CheckCircle, XCircle |
| `VerificationPanel` | Filter by status; approve/reject actions; renders list of `AttendanceRecord` with badges |
| `ParticipationSummary` | Aggregates records into present/absent/pending/alert counts; icon-mapped stat cards |
| `AttendanceKPIChart` | Multi-chart type toggle (bar, line, pie); uses Recharts; accepts `AttendanceRecord[]` |
| `AttendanceForm` | Props: `activities`, `existingRecords`, `role`; controlled form with submission handler |
| `LoginModal` | Role dropdown from `UserRole` enum; credential fields; error display; calls `useAuthStore` |
| `DashboardLayout` | Sidebar + topbar shell; dark mode class toggle; logout via `useAuthStore` |

---

## Code Structure Map

```text
accrcc-resilienceiq/
├── index.html                        # Vite HTML entry
├── icon.svg                          # App icon
├── .env                              # Env vars (Supabase/Stripe placeholders — unused in code)
├── package.json
├── postcss.config.js
├── tailwind.config.ts                # Custom color tokens (forest, mind, earth, sky families)
├── tsconfig.json
├── vite.config.ts
│
└── src/
    ├── main.tsx                      # React DOM render entry
    ├── App.tsx                       # Root component — auth-gated view switching
    ├── index.css                     # Global styles / Tailwind base
    ├── types.ts                      # Shared TypeScript types (UserRole, KPI, Meeting,
    │                                 #   AttendanceRecord, AttendanceActivity,
    │                                 #   AttendanceRole, AttendanceVerificationStatus,
    │                                 #   ResilienceData, etc.)
    │
    ├── store/
    │   └── authStore.ts              # Zustand store — user session, role, login/logout
    │
    ├── data/
    │   └── mockData.ts               # All mock data: MEETINGS, TASKS, FIELD_SUBMISSIONS,
    │                                 #   NOTIFICATIONS, RESILIENCE_DATA, KPIs,
    │                                 #   MOCK_ATTENDANCE_RECORDS, MOCK_ATTENDANCE_ACTIVITIES
    │
    ├── components/
    │   ├── PublicHomepage.tsx        # Marketing landing page
    │   ├── LoginModal.tsx            # Auth modal with role selector
    │   ├── DashboardLayout.tsx       # Authenticated shell (sidebar + topbar)
    │   │
    │   ├── dashboards/
    │   │   ├── SeniorDashboard.tsx
    │   │   ├── EmployeeDashboard.tsx
    │   │   ├── FieldOfficerDashboard.tsx
    │   │   └── MentalHealthDashboard.tsx
    │   │
    │   ├── attendance/
    │   │   ├── AttendanceModule.tsx  # Tab controller for attendance section
    │   │   ├── AttendanceDashboard.tsx
    │   │   ├── AttendanceForm.tsx
    │   │   ├── AttendanceTable.tsx
    │   │   ├── AttendanceKPIChart.tsx
    │   │   ├── ParticipationSummary.tsx
    │   │   ├── VerificationBadge.tsx
    │   │   └── VerificationPanel.tsx
    │   │
    │   └── shared/
    │       ├── KPICard.tsx           # Reusable animated metric card
    │       ├── MeetingsModule.tsx    # Reusable meetings list
    │       └── GISMap.tsx            # Mock GIS map with vulnerability data
```

---

## Code Style & Guidelines

- **Language:** TypeScript (strict mode, `noEmit: true`, ES2020 target)
- **Framework:** React 18 with functional components and hooks only
- **State Management:** Zustand (`useAuthStore`) for global auth state; local `useState` for UI state
- **Styling:** Tailwind CSS utility classes exclusively; no CSS modules or styled-components
- **Dark Mode:** Tailwind `darkMode: 'class'` — toggled by adding/removing `dark` class on root
- **Conditional Classes:** `clsx` used throughout for dynamic class composition
- **Icons:** Lucide React — imported individually per component
- **Charts:** Recharts — ResponsiveContainer wrapping all chart instances
- **Component Pattern:** Props interfaces defined inline above each component; named exports for shared components, default exports for page-level components
- **Data Access:** All components import directly from `../../data/mockData` or receive data via props — no API calls present
- **No routing library** — view switching handled via conditional rendering in `App.tsx` based on auth store state
- **Module type:** ESM (`"type": "module"` in package.json)
- **Build tool:** Vite with `@vitejs/plugin-react`
- **Naming conventions:** PascalCase for components and types; camelCase for variables and functions; SCREAMING_SNAKE_CASE for mock data constants

---

## Database Structure

- **No database is connected.** The project operates in `mock_first` mode.
- All data is sourced from `src/data/mockData.ts` as in-memory TypeScript constants.
- No Supabase client, no database schema files, no migration files, and no ORM configuration are present in the codebase.
- **`.env` contains Supabase and Stripe function namespace variables** (`VITE_SUPABASE_FUNCTION_NAMESPACE`, `VITE_STRIPE_CHECKOUT_FUNCTION`, etc.) but none of these are referenced in any source file — they are unused scaffold placeholders.
- When a real database is introduced, the following entities are implied by `src/types.ts` and mock data:
  - `users` — with `role: UserRole` (Senior, Employee, Field Officer, Mental Health)
  - `meetings` — with status, date, time, attendees
  - `tasks` — with completion state, assignee
  - `field_submissions` — field officer data submissions
  - `notifications` — user-scoped alerts
  - `resilience_data` — geographic points with vulnerability level
  - `attendance_records` — with `AttendanceVerificationStatus` (pending/verified/rejected), activity reference, role, location, tags
  - `attendance_activities` — activity definitions for the attendance form
  - `kpis` — metric definitions with trend, icon key, value
