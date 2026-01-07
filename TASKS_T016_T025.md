# Phase 2: Implementation Tasks - DECOM System (T016-T025)

**Generated**: January 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`  
**Status**: Frontend T012-T015 COMPLETE | Ready for T016-T020  

---

## 🎯 Frontend Remaining Tasks Summary

**Completed**: T012, T013, T014, T015  
**Remaining**: T016, T017, T018, T019, T020, T021-T025  
**Estimated Effort**: 40-50 hours (2-3 developer weeks)

---

## 🚀 PHASE 3: DASHBOARDS & PAGES (T016-T020)

### T016: Dashboard - Request List View

- [ ] T016 Create dashboard request list component with filtering and pagination

**File Path**: `app/components/Dashboard/RequestList.tsx`

**Acceptance Criteria**:
- [ ] Display requests in card or table format
- [ ] Columns/Info per item:
  - Committee name
  - Event name
  - Event date with days remaining
  - Status badge (color-coded)
  - Material type with icon
  - Priority score (visual indicator)
- [ ] Filters (chips):
  - All (default)
  - Pendiente (orange)
  - En_planificacion (blue)
  - En_diseño (purple)
  - Lista (green)
  - Entregada (gray)
- [ ] Sorting options:
  - By event_date
  - By priority_score
  - By created_at
- [ ] Pagination: "Load more" button or next/prev
- [ ] Empty state: "No requests yet" with CTA
- [ ] Clickable cards that navigate to detail page
- [ ] Mobile responsive (375px+)
- [ ] Loading skeleton states while fetching

**Data Source**: `GET /api/requests` (from backend)

**Dependencies**: 
- Layout component
- Card, Badge, Button UI components
- useEffect hook for data fetching
- useState for filters/sorting

---

### T017: Dashboard - Calendar View (Month)

- [ ] T017 Create calendar month view for requests visualization

**File Path**: `app/components/Dashboard/CalendarView.tsx`

**Acceptance Criteria**:
- [ ] Month grid display (7 columns = days of week)
- [ ] Navigation controls:
  - Previous month button (<)
  - Month and year display (January 2026)
  - Next month button (>)
- [ ] Color-coded indicators on dates:
  - Dot or badge per event
  - Colors match status (pending=orange, planning=blue, design=purple, ready=green, delivered=gray)
- [ ] Interactive features:
  - Click/tap a date to see requests for that day
  - Show count if multiple events on same date
  - Today highlighted with circle outline
  - Selected date highlighted with background
- [ ] Legend showing status colors
- [ ] Responsive grid that adapts to mobile
- [ ] Show request summary panel on date selection:
  - List of requests for selected date
  - Each item shows: event name, status, material type
  - Click to navigate to detail

**Data Source**: `GET /api/requests` (filtered by month)

**Dependencies**:
- date-fns for date calculations
- useState for selected date
- Card component for date details panel

---

### T018: Request Detail Page

- [ ] T018 Create detail page for single request (/requests/:id)

**File Path**: `app/pages/requests/[id]/page.tsx`

**Acceptance Criteria**:
- [ ] Display full request details:
  - Event name and description
  - Committee name
  - Event date with formatted display
  - Material type with icon
  - Contact WhatsApp number (DECOM only)
  - Bible verse if included
  - Current status with large badge
  - Planning start date
  - Delivery date (with highlight if urgent)
  - Days remaining calculator
  - Priority score with visual bar
  - Created date
  - Last updated date
- [ ] Timeline of status changes (if available from history):
  - Show who changed status (if available)
  - When status changed
  - Visual timeline layout
- [ ] DECOM-only features:
  - Status dropdown to change state
  - Valid state transitions enforced:
    - Pendiente → En_planificacion, En_diseño, Lista, Entregada
    - En_planificacion → En_diseño, Lista, Entregada, Pendiente
    - En_diseño → Lista, Entregada, En_planificacion, Pendiente
    - Lista → Entregada, En_diseño, Pendiente
    - Entregada → En_diseño (reopen)
  - "Contact via WhatsApp" button (visible only if status = "Lista")
  - "Save Changes" button with loading state
  - Success/error alerts
- [ ] Comité member features:
  - Read-only view
  - Can view own request details
  - Cannot modify
- [ ] Back button navigation
- [ ] Mobile responsive with proper spacing

**Data Source**: 
- `GET /api/requests/:id` (get request)
- `PATCH /api/requests/:id` (update status - DECOM only)
- `GET /api/whatsapp/link?requestId=:id` (get WhatsApp link)

**Dependencies**:
- Layout component
- Card, Badge, Button, Select UI components
- useRouter for navigation
- useEffect for data fetching
- useState for form state and loading

---

### T019: Public Calendar Page (No Auth)

- [ ] T019 Create public calendar page (/calendar - accessible without login)

**File Path**: `app/pages/calendar/page.tsx`

**Acceptance Criteria**:
- [ ] NO authentication required (public access)
- [ ] Display controls:
  - Month/year selector: < January 2026 >
  - Status filter chips: All | Pendiente | En_proceso | Entregada
  - Material type filter: All | Flyer | Banner | Video | Redes | Otro
- [ ] Summary cards:
  - Total requests this month
  - Breakdown by status (count for each)
  - Breakdown by material type (count for each)
- [ ] Request display (cannot show sensitive info):
  - Calendar grid showing request indicators
  - Request cards showing:
    - Event date (large, prominent)
    - Material type (badge/icon)
    - Status (badge with color)
    - Priority level (1-10 scale)
    - "Hace X días" (time since created)
    - "Falta X días" (days until event)
  - NO visible: committee name, event details, contact info, bible verses, names
- [ ] Educational message:
  - "This calendar shows current workload to help you plan your requests better"
- [ ] Responsive design (mobile first)
- [ ] Light footer with info about DECOM

**Data Source**: `GET /api/public/calendar` (no auth required)

**Parameters**: 
- ?month=1&year=2026
- ?status=Pendiente
- ?materialType=flyer
- ?limit=50&offset=0

**Dependencies**:
- No authentication context needed
- Card component
- Badge component
- date-fns for formatting

---

### T020: DECOM Admin Dashboard (Reports)

- [ ] T020 Create DECOM admin panel for reporting and analytics

**File Path**: `app/components/AdminDashboard/Reports.tsx`  
**Page**: `app/pages/admin/dashboard.tsx`

**Acceptance Criteria**:
- [ ] Access control: Only decom_admin role (enforce with middleware)
- [ ] Key metrics cards:
  - Total requests this month
  - Average time to complete (days)
  - Current backlog count (Pendiente + En_planificacion + En_diseño)
  - Completion rate (%) = Entregada / Total
  - On-time rate (%) = delivered_before_date / total_delivered
- [ ] Charts/Graphs:
  - Requests by status (pie chart or bar)
  - Requests by committee (bar chart)
  - Requests over time (line chart - week view)
  - Material type distribution (horizontal bar)
- [ ] Filters section:
  - Date range picker (from/to)
  - Committee multi-select
  - Status filter
- [ ] Quick actions:
  - View overdue requests
  - View urgent requests
  - Export reports button (optional for MVP)
- [ ] Responsive layout (stacked on mobile)
- [ ] Only visible to decom_admin users

**Data Source**:
- `GET /api/requests?role=decom_admin` (get all requests)
- Computed metrics from request data

**Dependencies**:
- Charts library (recharts or chart.js)
- date-fns for date filtering
- Layout component
- Card component
- Select/DatePicker components

---

## 🧪 PHASE 4: INTEGRATION & TESTING (T021-T025)

### T021: Frontend ↔ Backend Integration

- [ ] T021 Connect all frontend forms and pages to backend API endpoints

**File Path**: Multiple (all data fetching)

**Acceptance Criteria**:
- [ ] Form submission hits correct endpoints:
  - `POST /api/requests` for new request creation ✅
  - Response: { data: Request, status: 201 }
- [ ] List fetches from correct endpoint:
  - `GET /api/requests` with auth token
  - Response: { data: Request[], pagination: {...} }
- [ ] Detail page loads from correct endpoint:
  - `GET /api/requests/:id`
  - Response: { data: Request }
- [ ] Status changes hit correct endpoint:
  - `PATCH /api/requests/:id` with { status: "..." }
  - Only DECOM users can call
- [ ] Public calendar fetches from correct endpoint:
  - `GET /api/public/calendar` (no auth)
  - Response: { data: Request[], pagination: {...} }
- [ ] WhatsApp link endpoint:
  - `GET /api/whatsapp/link?requestId=:id`
  - Response: { phoneNumber, message, whatsappUrl, shortCode }
- [ ] Error handling:
  - Display user-friendly error messages for API errors
  - Handle 401 (unauthorized) - redirect to login
  - Handle 403 (forbidden) - show "you don't have permission"
  - Handle 422 (validation) - show field errors
  - Handle 500 (server error) - show "try again later"
- [ ] Loading states:
  - Show loading spinner/skeleton while fetching
  - Disable buttons during submission
  - Show success toast/alert after action
- [ ] Token management:
  - Include auth token in requests (if needed)
  - Refresh token if expired
  - Logout if 401 persistent

**Testing**: Full user journey from form → submission → confirmation → list → detail → status change

---

### T022: Unit & Component Tests

- [ ] T022 Write unit and component tests (Jest + React Testing Library)

**File Path**: `app/**/*.test.tsx` or `__tests__` folders

**Acceptance Criteria**:
- [ ] Test UI components:
  - Button renders with correct variant
  - Badge displays correct color for status
  - Input validates on blur
  - Form validation shows errors
  - ProgressBar updates correctly
- [ ] Test custom hooks:
  - useForm hook with validation
  - useEffect data fetching
- [ ] Test utility functions:
  - calculateDeliveryDate() returns correct date
  - formatDate() returns correct format
  - validateWhatsApp() accepts/rejects formats
  - validateEventName() length validation
- [ ] Test form components:
  - Step1 form validation works
  - Step2 form shows conditional fields
  - Confirmation page displays summary
- [ ] Test dashboard components:
  - RequestList filters work
  - CalendarView renders month correctly
  - Clicking date updates selection
- [ ] Minimum coverage: 70%

**Test Framework**: Jest + React Testing Library

---

### T023: E2E Tests

- [ ] T023 Write end-to-end tests (Playwright)

**File Path**: `e2e/**/*.spec.ts`

**Acceptance Criteria**:
- [ ] Test complete user journeys:
  - Comité member creates request (form → confirmation)
  - Comité views dashboard
  - DECOM views all requests
  - DECOM changes request status
  - DECOM contacts via WhatsApp
  - Public user views calendar
- [ ] Test critical flows:
  - Form validation prevents submission
  - Date calculations are correct
  - Filters work on list view
  - Calendar navigation works
- [ ] Test accessibility:
  - Form labels associated with inputs
  - Buttons are keyboard accessible
  - Color contrast sufficient

**Test Framework**: Playwright

---

### T024: Deployment Preparation

- [ ] T024 Prepare for production deployment

**Acceptance Criteria**:
- [ ] Build optimization:
  - `npm run build` succeeds with no errors
  - Bundle size analyzed and acceptable
  - Images optimized
- [ ] Environment variables:
  - `.env.local` configured for local dev
  - `.env.production` configured for prod
  - Supabase URL and key set correctly
- [ ] SEO & Meta:
  - metadata in layout.tsx correct
  - Open Graph tags set (optional)
- [ ] Security:
  - Sensitive data not logged
  - CORS configured correctly
  - CSP headers set (optional)
  - Rate limiting in place (backend)
- [ ] Monitoring setup:
  - Error tracking ready (Sentry optional)
  - Analytics ready (GA optional)
- [ ] Deployment script:
  - `npm run build && npm run start` works locally
  - Vercel deployment configured (if using)
  - Database migrations applied

---

### T025: Performance Optimization & Polish

- [ ] T025 Optimize performance and polish UI/UX

**Acceptance Criteria**:
- [ ] Performance:
  - Lighthouse score > 80
  - FCP < 1.5s
  - LCP < 2.5s
  - CLS < 0.1
  - TTI < 3s
- [ ] Code optimization:
  - Unnecessary re-renders eliminated
  - Images lazy-loaded
  - Code splitting where appropriate
  - Unused CSS removed
- [ ] UX Polish:
  - Animations smooth (no jank)
  - Loading states clear
  - Error messages helpful
  - Success feedback visible
  - Mobile experience refined
  - Accessibility audit passed
- [ ] Documentation:
  - README updated with deployment instructions
  - Contribution guidelines added (optional)
  - Environment setup documented

---

## 📊 Summary Table

| Task | Title | Status | Files | Effort |
|------|-------|--------|-------|--------|
| T016 | Dashboard List | ⏳ | Dashboard/RequestList.tsx | 6h |
| T017 | Dashboard Calendar | ⏳ | Dashboard/CalendarView.tsx | 8h |
| T018 | Request Detail | ⏳ | pages/requests/[id]/page.tsx | 6h |
| T019 | Public Calendar | ⏳ | pages/calendar/page.tsx | 5h |
| T020 | Admin Dashboard | ⏳ | pages/admin/dashboard.tsx | 8h |
| T021 | API Integration | ⏳ | Multiple | 4h |
| T022 | Unit Tests | ⏳ | __tests__/** | 8h |
| T023 | E2E Tests | ⏳ | e2e/** | 6h |
| T024 | Deployment | ⏳ | Config files | 3h |
| T025 | Polish & Perf | ⏳ | Multiple | 4h |

**Total**: 58 hours (3-4 developer weeks)

---

## 🎯 Execution Strategy

### Phase 3A: Dashboards (Parallel Development)
- **T016 + T017** (Dashboard components) can be done in parallel
- Both fetch from same API endpoint
- Share common components (Card, Badge, etc.)
- Estimated: 14 hours total

### Phase 3B: Detail & Public Pages (Sequential)
- **T018** (Detail page) depends on API structure
- **T019** (Public calendar) independent
- Can start T019 while finishing T018
- Estimated: 11 hours

### Phase 3C: Admin Panel
- **T020** (Admin dashboard) depends on metrics computation
- Can start once T016-T018 done
- Estimated: 8 hours

### Phase 4: Integration & Polish
- **T021** connects everything (4 hours)
- **T022-T023** tests follow (14 hours)
- **T024-T025** deployment & polish (7 hours)

---

## 🔄 Dependencies

```
T016 ──┐
       ├─→ T021 (Integration) ──→ T022 (Unit Tests)
T017 ──┤                             ↓
       └─→ T019                      T023 (E2E Tests)
       
T018 ──┐                             ↓
       ├─→ T020 (Admin) ────────→ T024 (Deployment)
       
T021-T023 ────────────────────→ T025 (Polish)
```

---

## ✅ Checklist Before Starting

- [x] Backend API endpoints implemented (T001-T011 complete)
- [x] Frontend components created (T012-T015 complete)
- [x] Database seeded with test data
- [x] Authentication working
- [x] Tailwind CSS configured
- [x] Build compiles without errors

---

**Status**: Ready to proceed with T016-T020  
**Approved by**: Backend & Infrastructure team  
**Next Review**: After T016-T017 completion

---

*Document Version: 1.0*  
*Last Updated: January 6, 2026*  
*Prepared for: Frontend Developer (UI/UX)*
