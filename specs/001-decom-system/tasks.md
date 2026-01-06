# Phase 2: Implementation Tasks - DECOM System

**Generated**: January 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`  
**Status**: Ready for Development  

---

## 📋 Overview

This document breaks down the DECOM system specification into **25 granular implementation tasks**, organized by user story and phase. Each task is:
- **Independently completable** (can be assigned to different developers)
- **Testable** (includes acceptance criteria)
- **Trackable** (clear deliverables)
- **Parallelizable** where indicated with `[P]` flag

**Total Estimated Effort**: 80-100 hours (4-5 developer weeks)  
**Recommended Team**: 1 Backend (Supabase) + 1 Frontend (React/Next.js)

---

## 🎯 Task Organization Strategy

```
Phase 2A: Infrastructure & Setup (Blocking) - 2 days
├── Database + Supabase setup
├── Authentication configuration
└── Project scaffolding

Phase 2B: Backend API (Parallel with Frontend) - 3-4 days
├── Authentication endpoints
├── Request management API
├── Committee & user management
└── WhatsApp integration

Phase 2C: Frontend UI (Parallel with Backend) - 3-4 days
├── Layout & navigation
├── Forms (2-step process)
├── Dashboard pages (list + calendar)
└── Public calendar

Phase 2D: Integration & Polish - 1-2 days
├── Connect frontend ↔ backend
├── End-to-end testing
└── Deployment preparation
```

---

## 🔄 Dependency Graph

```
Database Schema (T001)
    ↓
RLS Policies (T002) ──→ Auth API (T005) ──→ Protected Endpoints
    ↓
Seed Data (T003)
    ↓
Public Calendar View (T004) ──→ GET /public/calendar (T006)
    ↓
Requests API (T007-T010)
    ↓
Frontend Components (T011-T020) ← depends on API contracts
    ↓
Integration Tests (T021-T023)
    ↓
Deployment (T024-T025)
```

---

## 📊 Parallel Execution Plan

**Can work SIMULTANEOUSLY**:
- Backend team: T001 → T002 → T005-T010 (Database → Auth → API)
- Frontend team: T011-T020 (Components using mock data initially)
- They sync on: API contracts (already documented)

**Must wait for**:
- T001 (Database) before T002, T003, T005+
- T005 (Auth API) before protected endpoints work
- T007-T010 (API) before frontend can integrate

---

# 🚀 PHASE 2A: INFRASTRUCTURE & SETUP

## T001: Setup Supabase Project & Database Schema

- [ ] T001 Setup Supabase project and run database-schema.sql in SQL Editor

**File Path**: `specs/001-decom-system/contracts/database-schema.sql`

**Acceptance Criteria**:
- [ ] Supabase project created (free tier ok for development)
- [ ] All 4 tables exist: committees, users, requests, request_history
- [ ] All indexes created (committee_id, status, event_date, priority_score)
- [ ] All 3 triggers active (updated_at sync, status change logging)
- [ ] Seed data inserted (5 predefined committees)
- [ ] Tables visible in Supabase UI

**Testing**: Connect with Supabase CLI: `supabase status`

---

## T002: Implement Row-Level Security (RLS) Policies

- [ ] T002 Enable RLS and implement 6 security policies in Supabase

**File Path**: `specs/001-decom-system/contracts/database-schema.sql` (lines 188-260)

**Acceptance Criteria**:
- [ ] RLS enabled on all 4 tables
- [ ] Policy "Public read committees" allows all authenticated users
- [ ] Policy "Users can view own profile" works
- [ ] Policy "DECOM can view all users" works
- [ ] Policy "Comité members can view own requests" works
- [ ] Policy "DECOM admins can view all requests" works
- [ ] Policy "Public calendar access" allows unauthenticated SELECT on v_requests_public
- [ ] Test: Query as different auth levels returns correct rows

**Testing**: Use Supabase UI to test policies with test JWT tokens

---

## T003: Create Seed Data & Test Accounts

- [ ] T003 Insert test data: committees, users, sample requests

**File Path**: Script to insert in Supabase SQL Editor

**Acceptance Criteria**:
- [ ] 5 committees exist (Jóvenes, Damas, Alabanza, Adoración, Diaconía)
- [ ] 2 test users created (1 decom_admin, 1 comite_member)
- [ ] 5-10 test requests with varied dates and states
- [ ] Test requests have realistic dates (some past planning date, some upcoming)

**Testing**: Verify via Supabase table editor

---

## T004: Create Public Calendar View

- [ ] T004 Create v_requests_public view for public calendar access

**File Path**: `specs/001-decom-system/contracts/database-schema.sql`

**Acceptance Criteria**:
- [ ] View `v_requests_public` created successfully
- [ ] View shows only: id, event_date, material_type, status, priority_score, days_since_created, days_until_delivery
- [ ] View DOES NOT show: committee_id, event_name, contact_whatsapp, bible_verse_text, created_by
- [ ] View ordered by event_date ASC
- [ ] Test query: `SELECT * FROM v_requests_public` returns results without sensitive data

**Testing**: Query view and verify data is anonymized

---

# 🔐 PHASE 2B: BACKEND API

## T005: Implement Authentication Endpoints (Auth)

- [ ] T005 Create /api/auth endpoints (signup, login, logout)

**File Path**: `app/api/auth/[action]/route.ts`

**Acceptance Criteria**:
- [ ] POST /api/auth/signup: Creates Supabase Auth user + profile in users table
- [ ] POST /api/auth/login: Returns JWT token (stored in httpOnly cookie)
- [ ] POST /api/auth/logout: Clears session
- [ ] Email validation working
- [ ] Password strength enforced (min 8 chars, 1 uppercase, 1 number, 1 special)
- [ ] Duplicate email prevention
- [ ] JWT token expires properly
- [ ] Session persists across page reloads

**Testing**: Test with curl or Postman

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"decom@iglesia.com","password":"SecurePass123!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"decom@iglesia.com","password":"SecurePass123!"}'
```

---

## T006: [P] Implement GET /api/public/calendar Endpoint

- [ ] T006 [P] Create public calendar endpoint (no auth required)

**File Path**: `app/api/public/calendar/route.ts`

**Acceptance Criteria**:
- [ ] Endpoint accessible WITHOUT authentication
- [ ] Query params: ?month=1&year=2026&materialType=flyer&status=Pendiente&limit=50&offset=0
- [ ] Returns: { data: [], pagination: {}, meta: {} }
- [ ] meta includes totalByStatus and totalByMaterialType counts
- [ ] Pagination works correctly (limit, offset, total pages)
- [ ] Filters work (by month, year, material_type, status)
- [ ] Response includes: id, eventDate, materialType, status, priorityScore, daysSinceCreated, daysUntilDelivery

**Testing**: 
```bash
curl http://localhost:3000/api/public/calendar?month=1&year=2026
```

---

## T007: [P] Implement Request Management API - GET

- [ ] T007 [P] Create GET /api/requests (list with filters)

**File Path**: `app/api/requests/route.ts`

**Acceptance Criteria**:
- [ ] Requires authentication (JWT token)
- [ ] DECOM sees ALL requests
- [ ] Comité members see ONLY their own requests
- [ ] Filters: ?status=Pendiente&priority=5&committee=uuid
- [ ] Pagination: ?limit=20&offset=0
- [ ] Returns full request details including committee name, priority, dates
- [ ] Sorting: by event_date, priority_score, created_at

**Testing**: Test with DECOM token (sees all) vs comité token (sees own only)

---

## T008: [P] Implement Request Management API - POST

- [ ] T008 [P] Create POST /api/requests (create new request)

**File Path**: `app/api/requests/route.ts`

**Acceptance Criteria**:
- [ ] Validates request body with Zod schema
- [ ] Creates request with all required fields
- [ ] Calculates planning_start_date and delivery_date automatically
- [ ] Calculates priority_score based on event_date
- [ ] Sets status to "Pendiente"
- [ ] Returns created request with 201 status
- [ ] Respects RLS: only creates for authenticated user's committee

**Request Body**:
```json
{
  "committee_id": "uuid",
  "event_name": "Retiro anual 2026",
  "event_info": "Descripción del evento...",
  "event_date": "2026-02-15",
  "material_type": "flyer",
  "contact_whatsapp": "+573001234567",
  "include_bible_verse": false
}
```

---

## T009: [P] Implement Request Management API - PATCH

- [ ] T009 [P] Create PATCH /api/requests/:id (update request status)

**File Path**: `app/api/requests/[id]/route.ts`

**Acceptance Criteria**:
- [ ] Only DECOM admins can update status
- [ ] Comité members can edit own request IF status ≠ "Entregada"
- [ ] Valid status transitions enforced
- [ ] Auto-logs change to request_history table
- [ ] Returns updated request
- [ ] Timestamp updated automatically

**Request Body**:
```json
{
  "status": "En_planificacion"
}
```

---

## T010: [P] Implement WhatsApp Link Generation API

- [ ] T010 [P] Create GET /api/whatsapp/link endpoint

**File Path**: `app/api/whatsapp/link/route.ts`

**Acceptance Criteria**:
- [ ] Query params: ?requestId=uuid&message=optional
- [ ] Returns: { phoneNumber, message, whatsappUrl, shortCode }
- [ ] WhatsApp URL format: `https://wa.me/[phone]?text=[encoded message]`
- [ ] Safe message encoding (URL encoding)
- [ ] Only DECOM can see phone numbers
- [ ] Supports custom messages

**Testing**:
```bash
curl "http://localhost:3000/api/whatsapp/link?requestId=abc123"
```

---

## T011: [P] Implement User Profile API

- [ ] T011 [P] Create GET /api/user/profile and PATCH /api/user/profile

**File Path**: `app/api/user/profile/route.ts`

**Acceptance Criteria**:
- [ ] GET returns current user's profile
- [ ] PATCH updates non-admin fields only
- [ ] Can't change role to decom_admin
- [ ] Returns: { id, email, fullName, role, preferredCommitteeId, createdAt }

---

# 🎨 PHASE 2C: FRONTEND UI & COMPONENTS

## T012: Project Setup & Layout Components

- [ ] T012 Create Next.js app structure and layout components

**File Path**: `app/layout.tsx`, `app/components/Navigation.tsx`

**Acceptance Criteria**:
- [ ] Tailwind CSS working (color palette: #16233B, #15539C, #F49E2C)
- [ ] Navigation component for authenticated users (header + footer)
- [ ] Logo + IPUC branding
- [ ] Responsive mobile-first (tested at 375px)
- [ ] Dark/light mode setup (optional, can skip for MVP)

**Testing**: `npm run dev` → Open http://localhost:3000 → See styled layout

---

## T013: [P] Create 2-Step Request Form (Step 1)

- [ ] T013 [P] Build RequestForm Step 1 component (event info)

**File Path**: `app/components/RequestForm/Step1.tsx`

**Acceptance Criteria**:
- [ ] Committee selector (dropdown)
- [ ] Event name input (text)
- [ ] Event info textarea (5-500 chars, counter)
- [ ] Event date picker (no past dates)
- [ ] Auto-calculated dates displayed:
  - Planning start: event_date - 7 days
  - Delivery date: event_date - 2 days
- [ ] Progress indicator shows "Step 1 of 2"
- [ ] Validation errors display inline
- [ ] "Continue" button navigates to Step 2
- [ ] Mobile-responsive (375px+)

**Testing**: Fill form, verify dates calculate, click Continue

---

## T014: [P] Create 2-Step Request Form (Step 2)

- [ ] T014 [P] Build RequestForm Step 2 component (material & contact)

**File Path**: `app/components/RequestForm/Step2.tsx`

**Acceptance Criteria**:
- [ ] Material type chips (flyer, banner, video, redes, otro) - selectable
- [ ] WhatsApp input with +57 format validation
- [ ] Toggle: "Include Bible Verse?" (yes/no)
- [ ] Conditional field: Bible verse textarea (appears if toggle ON)
- [ ] Progress indicator shows "Step 2 of 2" at 100%
- [ ] "Back" button returns to Step 1 (preserves data)
- [ ] "Submit Request" button sends to /api/requests
- [ ] Success: Shows confirmation page
- [ ] Error handling: Displays error message if submission fails

**Testing**: Fill both steps, submit, see confirmation

---

## T015: [P] Request Confirmation Page

- [ ] T015 [P] Create confirmation page after form submission

**File Path**: `app/components/RequestConfirmation.tsx`

**Acceptance Criteria**:
- [ ] Shows success icon (animated checkmark)
- [ ] Displays: "Request #SOL-001 submitted successfully"
- [ ] Summary card with:
  - Event name
  - Event date
  - Delivery date
  - Request ID
- [ ] Two buttons:
  - "View My Requests" → /dashboard
  - "Create Another" → /new-request (reset form)
- [ ] Link to public calendar: "Ver carga de trabajo"

**Testing**: Submit form → See confirmation with request ID

---

## T016: [P] Dashboard - Request List View

- [ ] T016 [P] Create dashboard with request list (table/cards)

**File Path**: `app/components/Dashboard/RequestList.tsx`

**Acceptance Criteria**:
- [ ] Display all user's requests in card/table format
- [ ] Columns/Info per card:
  - Committee name
  - Event name
  - Event date
  - Status (badge with color)
  - Material type (icon)
  - Days remaining
  - Priority score (1-10 bar or number)
- [ ] Clickable cards: Opens detail page
- [ ] Filters (chips): All | Pendiente | En_planificacion | En_diseño | Lista | Entregada
- [ ] Sort: by event_date, priority, created_at
- [ ] Empty state: "No requests yet" with button to create
- [ ] Pagination: Load more / Next page
- [ ] Mobile responsive

**Testing**: See list of requests, click filters, click a request to see details

---

## T017: [P] Dashboard - Calendar View (Month)

- [ ] T017 [P] Create calendar month view for requests

**File Path**: `app/components/Dashboard/CalendarView.tsx`

**Acceptance Criteria**:
- [ ] Month grid (7 columns = days of week)
- [ ] Navigation: < Previous | January 2026 | Next >
- [ ] Color-coded dots/badges on dates with requests
- [ ] Hover/click date: Shows requests for that day
- [ ] Legend: Colors by status (Pendiente=orange, En_diseño=blue, Lista=green)
- [ ] Today highlighted (circle outline)
- [ ] Multi-events per day: Show count or small dots
- [ ] Responsive: Stack properly on mobile

**Testing**: Navigate months, click dates, see request details

---

## T018: [P] Request Detail Page

- [ ] T018 [P] Create detail page for single request (/requests/:id)

**File Path**: `app/pages/requests/[id]/page.tsx`

**Acceptance Criteria**:
- [ ] Show full request details:
  - Event name, description, date
  - Committee (if DECOM viewing)
  - Material type, contact name (if DECOM)
  - Bible verse (if included)
  - Current status (large badge)
  - All calculated dates (planning, delivery, days remaining)
  - Priority score with visual indicator
  - Change history (timeline of status changes if DECOM)
- [ ] For DECOM only:
  - Status dropdown (change status)
  - "Contact via WhatsApp" button (if status = "Lista")
  - Save changes button
- [ ] Back button

**Testing**: Navigate to detail page from list, see full info, try status change (DECOM)

---

## T019: [P] Public Calendar Page (No Auth)

- [ ] T019 [P] Create public calendar page (/calendar)

**File Path**: `app/pages/calendar/page.tsx`

**Acceptance Criteria**:
- [ ] NO authentication required (public)
- [ ] Month/year selector: < January 2026 >
- [ ] Status summary: "Pendientes: 15 | En_planificacion: 22 | ..."
- [ ] Material type summary: "Flyers: 22 | Banners: 15 | ..."
- [ ] Request cards showing:
  - Event date (large)
  - Material type (badge/icon)
  - Status (badge)
  - Priority (1-10)
  - "Hace X días" (how long ago created)
- [ ] NO sensitive info: No committee name, no event details, no contact info
- [ ] Educational message: "This shows current workload to help you plan better"
- [ ] Mobile responsive

**Testing**: Visit /calendar without logging in, see public data

---

## T020: [P] DECOM Admin Dashboard (Reports)

- [ ] T020 [P] Create DECOM admin panel for reporting/analytics

**File Path**: `app/components/AdminDashboard/Reports.tsx`

**Acceptance Criteria**:
- [ ] Key metrics:
  - Total requests this month
  - Average time to complete
  - Backlog (Pendiente + En_planificacion + En_diseño)
  - Completion rate
- [ ] Charts/Graphs:
  - Requests by status (pie or bar)
  - Requests by committee (bar)
  - Timeline: requests over time
- [ ] Filters: By date range, committee
- [ ] Only accessible to decom_admin role

**Testing**: Login as DECOM, view analytics

---

# 🧪 PHASE 2D: INTEGRATION & TESTING

## T021: Frontend ↔ Backend Integration

- [ ] T021 Connect frontend forms & pages to backend API

**Acceptance Criteria**:
- [ ] Form submission hits /api/requests POST ✅
- [ ] List fetches from /api/requests GET ✅
- [ ] Status changes hit /api/requests/:id PATCH ✅
- [ ] Public calendar fetches from /api/public/calendar ✅
- [ ] WhatsApp link uses /api/whatsapp/link ✅
- [ ] Auth flows work end-to-end ✅
- [ ] Error handling: Display API errors to users ✅

**Testing**: Full user journey: signup → form → list → detail → status change

---

## T022: [P] Unit & Component Tests

- [ ] T022 [P] Write Jest tests for components & API routes

**File Path**: `__tests__/` directory

**Acceptance Criteria**:
- [ ] Component tests: RequestForm, RequestList, Calendar (80%+ coverage)
- [ ] API route tests: /api/requests, /api/auth, /api/public/calendar
- [ ] Validation tests: Zod schemas, form validation
- [ ] Run: `npm test` → All tests pass

---

## T023: [P] End-to-End Tests (E2E)

- [ ] T023 [P] Write Playwright tests for critical user flows

**File Path**: `e2e/` directory

**Acceptance Criteria**:
- [ ] Test: Comité creates request (signup → form → confirmation)
- [ ] Test: DECOM views requests (login → filter → detail → status change)
- [ ] Test: Public calendar access (no login required)
- [ ] Test: WhatsApp link generation
- [ ] Run: `npx playwright test` → All pass

---

## T024: Deployment Preparation

- [ ] T024 Prepare environment setup for Vercel + Supabase

**Acceptance Criteria**:
- [ ] `.env.local` configured with Supabase keys
- [ ] `.env.example` created (no secrets)
- [ ] Vercel project linked
- [ ] Build: `npm run build` → No errors
- [ ] Deploy to staging environment

**File Path**: `.env.local`, `vercel.json`

---

## T025: Production Deployment

- [ ] T025 Deploy to production (Vercel + Supabase Cloud)

**Acceptance Criteria**:
- [ ] Frontend deployed to Vercel
- [ ] Backend (Supabase) in production
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Monitoring setup (optional)
- [ ] Database backups enabled
- [ ] Ready for user testing

---

# 📊 Task Summary by Assignee

## 👤 Backend Developer Tasks
```
T001: Setup Supabase
T002: RLS Policies
T003: Seed Data
T004: Public Calendar View
T005: Auth endpoints
T006: [P] GET /api/public/calendar
T007: [P] GET /api/requests
T008: [P] POST /api/requests
T009: [P] PATCH /api/requests/:id
T010: [P] WhatsApp Link API
T011: [P] User Profile API
T021: Integration (API side)
T024: Deployment Prep
```

## 👤 Frontend Developer Tasks
```
T012: Layout & Navigation
T013: [P] Form Step 1
T014: [P] Form Step 2
T015: [P] Confirmation Page
T016: [P] Request List
T017: [P] Calendar View
T018: [P] Request Detail
T019: [P] Public Calendar
T020: [P] Admin Reports
T021: Integration (Frontend side)
T022: [P] Unit Tests
T023: [P] E2E Tests
T024: Deployment Prep
T025: Production Deploy
```

---

# 🔄 Implementation Flow

### Week 1 (Days 1-2): Foundation
```
Backend: T001 → T002 → T003 → T004
Frontend: T012 (parallel)
```

### Week 1 (Days 3-4): Core APIs
```
Backend: T005 → T006 → T007 → T008 → T009 → T010 → T011
Frontend: T013 → T014 (using mock data)
```

### Week 2 (Days 1-3): Frontend Components
```
Frontend: T015 → T016 → T017 → T018 → T019 → T020
Backend: T021 (integration)
```

### Week 2 (Days 4-5): Testing & Deploy
```
Both: T021 → T022 → T023
Backend: T024 → T025
```

---

# ✅ Acceptance Criteria Summary

Each task MUST:
- [ ] Have code in a feature branch (`001-feature/name`)
- [ ] Be mergeable without conflicts
- [ ] Have passing tests (or explicit test plan)
- [ ] Be documented (README/comments if complex)
- [ ] Be demoed/tested manually
- [ ] Get code review before merge

---

# 📞 Communication & Coordination

**Daily Sync Points**:
1. **Morning**: Check blockers (T001 ready? APIs documented?)
2. **Midday**: Share updates on parallel tasks
3. **EOD**: Commit code, document what's done

**Integration Points**:
- After T005 (Auth API): Frontend can start authenticated requests
- After T007-T010 (CRUD APIs): Frontend can integrate fully
- Before T021: Agree on API response formats (already documented in contracts)

---

# 🎯 Success Metrics

Phase 2 is complete when:
- ✅ All 25 tasks done
- ✅ All tests passing
- ✅ Full user journey working (form → list → detail → calendar)
- ✅ Public calendar accessible without auth
- ✅ DECOM admin panel functional
- ✅ Deployed to production
- ✅ Ready for user testing

---

**Status**: Ready for implementation  
**Next Step**: Assign tasks to Frontend & Backend teams  
**Questions**: Refer to specs/001-decom-system/ for detailed requirements
