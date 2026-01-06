# Task Assignments - Two Agent Teams

**Created**: January 6, 2026  
**Purpose**: Divide Phase 2 implementation between Backend Agent and Frontend Agent  
**Total Tasks**: 25 (split for parallel work)  

---

## 🏗️ BACKEND AGENT - Infrastructure & APIs

**Responsible for**: Database, Authentication, All API Endpoints, Integrations  
**Tech Stack**: Supabase (PostgreSQL), Next.js API Routes, TypeScript  
**Estimated Duration**: 4-5 days  

### Setup Phase (Days 1-1.5)
```
- [ ] T001: Setup Supabase & Database Schema
- [ ] T002: Implement RLS Policies  
- [ ] T003: Create Seed Data & Test Accounts
- [ ] T004: Create Public Calendar View
```

### API Development Phase (Days 2-4)
```
- [ ] T005: Auth endpoints (signup/login/logout)
- [ ] T006: [P] GET /api/public/calendar (no auth)
- [ ] T007: [P] GET /api/requests (list with filters)
- [ ] T008: [P] POST /api/requests (create)
- [ ] T009: [P] PATCH /api/requests/:id (update status)
- [ ] T010: [P] WhatsApp Link API
- [ ] T011: [P] User Profile API
```

### Integration & Testing Phase (Day 5)
```
- [ ] T021a: API Integration (ensure all endpoints working)
- [ ] T022: Unit tests for API routes
- [ ] T024: Deployment prep (Supabase config)
```

### Key Deliverables
- Production-ready Supabase project (database, triggers, policies)
- All 9+ API endpoints documented & tested
- API response formats match spec (JSON schemas)
- Test data seeded
- Ready for Frontend team to call

### Files to Create/Modify
```
app/api/
├── auth/
│   ├── signup/route.ts
│   ├── login/route.ts
│   └── logout/route.ts
├── requests/
│   ├── route.ts           (GET, POST)
│   └── [id]/route.ts      (GET, PATCH)
├── user/
│   └── profile/route.ts   (GET, PATCH)
├── public/
│   └── calendar/route.ts  (GET, no auth)
└── whatsapp/
    └── link/route.ts      (GET)

lib/
├── supabase/
│   └── client.ts          (Client initialization)
├── types/
│   └── index.ts           (TypeScript types - SHARED with Frontend)
└── validation/
    └── schemas.ts         (Zod schemas)
```

### Success Criteria
- All API endpoints respond correctly
- RLS policies enforce security
- Authentication works (JWT tokens)
- Public calendar works without auth
- Tests passing (>80% coverage)

---

## 🎨 FRONTEND AGENT - UI Components & Pages

**Responsible for**: All React Components, Pages, Forms, Styling  
**Tech Stack**: Next.js (App Router), React 18+, Tailwind CSS, React Hook Form, Zod  
**Estimated Duration**: 4-5 days  

### Foundation Phase (Days 1-1.5)
```
- [ ] T012: Project Setup & Layout Components
```

### Form Development Phase (Days 2-2.5)
```
- [ ] T013: [P] 2-Step Form (Step 1: Event Info)
- [ ] T014: [P] 2-Step Form (Step 2: Material & Contact)
- [ ] T015: [P] Request Confirmation Page
```

### Dashboard Development Phase (Days 3-4)
```
- [ ] T016: [P] Request List View (table/cards)
- [ ] T017: [P] Calendar Month View
- [ ] T018: [P] Request Detail Page
- [ ] T019: [P] Public Calendar (no auth)
- [ ] T020: [P] DECOM Admin Reports
```

### Testing & Integration Phase (Day 5)
```
- [ ] T021b: Frontend Integration (connect to Backend API)
- [ ] T022: Component unit tests
- [ ] T023: E2E tests (Playwright)
- [ ] T025: Production deploy
```

### Key Deliverables
- Responsive, mobile-first UI (375px+)
- All forms working with validation
- Dashboard with list & calendar views
- Public calendar (accessible without auth)
- Admin panel for DECOM
- Tests passing

### Files to Create/Modify
```
app/
├── page.tsx                      (Home/landing)
├── layout.tsx                    (Root layout)
├── components/
│   ├── Navigation.tsx
│   ├── RequestForm/
│   │   ├── Step1.tsx
│   │   ├── Step2.tsx
│   │   └── index.tsx
│   ├── RequestConfirmation.tsx
│   ├── Dashboard/
│   │   ├── RequestList.tsx
│   │   ├── CalendarView.tsx
│   │   └── AdminReports.tsx
│   └── RequestDetail.tsx
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── dashboard/
│   └── page.tsx
├── calendar/
│   └── page.tsx
├── requests/
│   └── [id]/page.tsx
└── admin/
    └── page.tsx

lib/
├── hooks/
│   ├── useRequests.ts     (Fetch requests)
│   ├── useAuth.ts         (Auth context)
│   └── useForm.ts         (Form handling)
└── utils/
    └── formatting.ts      (Date formatting, etc.)

__tests__/
├── components/            (Jest tests)
└── ...

e2e/
└── tests.spec.ts          (Playwright tests)
```

### Success Criteria
- All pages responsive (mobile-first)
- Forms validate before submission
- Dashboard filters & sorts working
- Calendar shows events correctly
- Public calendar doesn't show sensitive data
- Tests passing (>80% coverage)
- Connected to Backend API

---

## 🔗 SHARED / Coordination Points

### Files Both Can Access/Read
```
specs/001-decom-system/
├── spec.md              (Read: User stories, requirements)
├── data-model.md        (Read: Database schema, validations)
├── contracts/api-contracts.md  (Read: API response formats)
└── quickstart.md        (Read: Setup guide)

contexto/
├── contexto.md          (Read: Overall requirements)
└── UI.md                (Read: Design specs)

lib/types/index.ts       (SHARED: TypeScript interfaces)
lib/validation/schemas.ts (SHARED: Zod schemas)
```

### API Contract (Backend → Frontend Interface)
Backend commits to this contract; Frontend depends on it:

```typescript
// Example from contracts/api-contracts.md
interface RequestResponse {
  id: string;
  committeeId: string;
  committeeName: string;
  eventName: string;
  eventDate: string;
  materialType: string;
  status: 'Pendiente' | 'En_planificacion' | 'En_diseño' | 'Lista_para_entrega' | 'Entregada';
  priorityScore: number;
  planningStartDate: string;
  deliveryDate: string;
  createdAt: string;
}
```

### Synchronization Points

| Day | Backend | Frontend | Sync |
|-----|---------|----------|------|
| 1 | T001-T004 (DB) | T012 (Layout) | Share design decisions |
| 2 | T005-T011 (APIs) | T013-T015 (Forms) | Frontend uses mock data |
| 3 | Testing APIs | T016-T020 (Pages) | Frontend connects to API |
| 4 | Integration | Testing integration | Fix API/Frontend issues |
| 5 | Deploy prep | Deploy to production | Both deploy together |

### Blockers & Dependencies

**Backend must finish BEFORE Frontend can:**
- T005 (Auth) → T013+ (Need auth for protected pages)
- T007 (GET /api/requests) → T016 (Need list endpoint)
- T006 (GET /api/public/calendar) → T019 (Public calendar)

**Frontend can start PARALLEL with Backend:**
- T012-T015 (Layout, Forms) - Can use mock data
- T016-T020 (Components) - Can use mock API responses

### Communication & Code Review

**Daily Standups** (15 min):
```
Frontend: "I'm building the form, need API schema confirmation"
Backend: "Auth endpoint done, ready for integration"
Both: "Any blockers?"
```

**Code Review Process**:
1. Backend commits API changes → Frontend reviews response format
2. Frontend commits components → Backend reviews if they call APIs correctly
3. Both test integration → Merge to main branch

### Git Workflow

**Backend Branch**: `001-backend/feature-name`
```bash
git checkout -b 001-backend/auth-endpoints
# Work on auth...
git commit -m "feat: auth endpoints"
git push origin 001-backend/auth-endpoints
# Create PR → Code review → Merge to 001-decom-system
```

**Frontend Branch**: `001-frontend/feature-name`
```bash
git checkout -b 001-frontend/request-form
# Work on form...
git commit -m "feat: request form component"
git push origin 001-frontend/request-form
# Create PR → Code review → Merge to 001-decom-system
```

**Merge Strategy**:
```bash
# After both teams are done
git checkout 001-decom-system
git merge origin/001-backend/all-features
git merge origin/001-frontend/all-features
git push origin 001-decom-system
```

---

## 🎯 Success Criteria (Both Teams)

**Phase 2 Complete When**:
- ✅ All 25 tasks done
- ✅ Backend: All APIs tested & documented
- ✅ Frontend: All pages responsive & accessible
- ✅ Integration: Full user journey working end-to-end
- ✅ Testing: Unit tests + E2E tests passing
- ✅ Deployed: Production ready

---

## 📞 Quick Checklist

### Backend Agent - Start Here
```
[ ] Clone repo & read specs/001-decom-system/
[ ] Setup Supabase account (free tier)
[ ] Run contracts/database-schema.sql
[ ] Start on T001 → T002 → T003 → T004
[ ] Commit frequently to 001-backend/[feature] branches
```

### Frontend Agent - Start Here
```
[ ] Clone repo & read specs/001-decom-system/
[ ] Read contexto/UI.md for design specs
[ ] Run: npm install && npm run dev
[ ] Create mock API responses in lib/
[ ] Start on T012 → T013 → T014 → T015
[ ] Commit frequently to 001-frontend/[feature] branches
```

### Both Teams
```
[ ] Join standup meetings (15 min daily)
[ ] Review each other's PRs
[ ] Flag blockers early
[ ] Keep API contract in sync
[ ] Test integration daily after Day 3
```

---

**Ready to implement? Let's go! 🚀**
