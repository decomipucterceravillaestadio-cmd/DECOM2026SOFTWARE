# Tasks: Sistema de Gestión de Solicitudes de Comunicación - DECOM

**Input**: Design documents from `/specs/001-decom-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize Next.js project with TypeScript dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Setup Supabase database schema and migrations
- [ ] T005 [P] Implement authentication/authorization framework with Supabase Auth
- [ ] T006 [P] Setup API routing and middleware structure in app/api/
- [ ] T007 Create base types/interfaces that all stories depend on in lib/types/
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Comité solicita material publicitario (Priority: P1) 🎯 MVP

**Goal**: Allow committee members to submit material requests through a structured form instead of WhatsApp

**Independent Test**: A committee member can complete the multi-step form, see calculated dates, and receive confirmation of submission

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create committees table and seed data in database-schema.sql
- [ ] T011 [P] [US1] Create users table with auth integration in database-schema.sql
- [ ] T012 [P] [US1] Create requests table with validation rules in database-schema.sql
- [ ] T013 [P] [US1] Create request_history table for audit trail in database-schema.sql
- [ ] T014 [US1] Implement committees API endpoint in app/api/committees/route.ts
- [ ] T015 [US1] Implement request creation API endpoint in app/api/requests/route.ts
- [ ] T016 [US1] Create request form components in components/forms/RequestForm.tsx
- [ ] T017 [US1] Add form validation using Zod schemas in lib/validation/schemas.ts
- [ ] T018 [US1] Implement date calculation utilities in lib/utils/dateCalculations.ts
- [ ] T019 [US1] Create confirmation page after form submission in app/solicitar/confirmacion/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - DECOM gestiona solicitudes (Priority: P1)

**Goal**: Allow DECOM admins to view all requests, filter by status, and change request states manually

**Independent Test**: A DECOM admin can view the requests list, filter by status, change a request status, and see the history of changes

### Implementation for User Story 2

- [ ] T020 [P] [US2] Implement requests list API endpoint in app/api/requests/route.ts
- [ ] T021 [P] [US2] Implement request detail API endpoint in app/api/requests/[id]/route.ts
- [ ] T022 [P] [US2] Implement request status update API endpoint in app/api/requests/[id]/route.ts
- [ ] T023 [US2] Create DECOM dashboard components in components/dashboard/RequestsList.tsx
- [ ] T024 [US2] Create request detail view in components/admin/RequestDetail.tsx
- [ ] T025 [US2] Implement status transition logic in lib/utils/requestStates.ts
- [ ] T026 [US2] Add request history display in components/admin/RequestHistory.tsx
- [ ] T027 [US2] Create WhatsApp contact button in components/admin/WhatsAppButton.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - DECOM visualiza en calendario (Priority: P2)

**Goal**: Allow DECOM admins to view requests in a monthly calendar format to visualize workload

**Independent Test**: A DECOM admin can switch between list and calendar views, select a day, and see requests for that day

### Implementation for User Story 3

- [ ] T028 [P] [US3] Implement public calendar API endpoint in app/api/public/calendar/route.ts
- [ ] T029 [US3] Create calendar view component in components/dashboard/CalendarView.tsx
- [ ] T030 [US3] Add calendar filtering by status and material type in components/dashboard/FilterBar.tsx
- [ ] T031 [US3] Implement calendar day selection and detail panel in components/dashboard/CalendarDay.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Comité visualiza calendario de solicitudes (Priority: P2)

**Goal**: Allow committee members to view a public calendar of requests before and after submitting their own

**Independent Test**: Without authentication, a committee member can view the calendar, see workload, submit a request, and receive a link to view the calendar again

### Implementation for User Story 4

- [ ] T032 [P] [US4] Implement public calendar API endpoint in app/api/public/calendar/route.ts (reuse from US3)
- [ ] T033 [US4] Create public calendar component in components/PublicCalendar.tsx
- [ ] T034 [US4] Add calendar link in request form in components/forms/RequestForm.tsx
- [ ] T035 [US4] Add calendar link in confirmation page in app/solicitar/confirmacion/page.tsx
- [ ] T036 [US4] Implement calendar filtering by month/year in components/PublicCalendar.tsx

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T037 [P] Documentation updates in README.md and docs/
- [ ] T038 Code cleanup and refactoring across all components
- [ ] T039 Performance optimization for calendar loading
- [ ] T040 Security hardening with RLS policies
- [ ] T041 Run quickstart.md validation and update if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US3 for calendar API but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create committees table and seed data in database-schema.sql"
Task: "Create users table with auth integration in database-schema.sql"
Task: "Create requests table with validation rules in database-schema.sql"
Task: "Create request_history table for audit trail in database-schema.sql"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Stories 3 & 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
