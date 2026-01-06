# Phase 0: Research & Technical Decisions - DECOM System

**Created**: Enero 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`

---

## Overview

Phase 0 resolves technical unknowns and documents best practices research. This document consolidates findings that inform the design phase (Phase 1).

---

## Research Findings

### 1. Frontend Framework: Next.js 14+ with App Router

**Decision**: Use Next.js 14+ with React 18+ and App Router

**Rationale**:
- Project already uses Next.js (existing codebase detected)
- App Router is production-ready and recommended
- Built-in API routes support (no separate backend server needed)
- Server Components + Client Components hybrid approach reduces complexity
- Excellent TypeScript support
- Vercel hosting compatibility (if needed later)
- React 18 provides Suspense for better async/await patterns

**Alternatives Considered**:
- Pages Router (legacy): ✗ Less modern, not recommended for new projects
- Remix: ✗ Unnecessary complexity for this scope
- Pure React SPA + separate backend: ✗ Over-engineered for MVP

**Dependencies**:
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

---

### 2. Styling: Tailwind CSS + shadcn/ui or Aceternity UI

**Decision**: Use Tailwind CSS + component library (Aceternity UI preferred based on UI.md)

**Rationale**:
- Tailwind is fastest for responsive, mobile-first design
- Aceternity UI components match design requirements (granate #8B0000, dorado #FFD700)
- No need for custom CSS if Aceternity is used
- Dark mode support built-in if needed
- Utility-first CSS reduces context switching

**UI Components Needed** (from UI.md):
- Login screen
- Dashboard (list view)
- Calendar view
- Multi-step form (2 steps)
- Card components with states/badges
- Modal/dialogs
- Form inputs with validation feedback
- Buttons with hover/active states

**Alternatives Considered**:
- Material-UI: ✗ Too heavy, colors hard to customize for brand
- Bootstrap: ✗ Outdated approach for mobile-first
- Chakra UI: ✓ Alternative if Aceternity not available
- Plain CSS/CSS Modules: ✗ Inefficient for responsive design

**Dependencies**:
```json
{
  "tailwindcss": "^3.3.0",
  "postcss": "^8.4.0",
  "aceternity-ui": "^0.0.1" // or shadcn/ui if Aceternity unavailable
}
```

---

### 3. Form Handling: React Hook Form + Zod

**Decision**: Use React Hook Form for state + Zod for validation

**Rationale**:
- React Hook Form minimizes re-renders (critical for mobile performance)
- Zod provides TypeScript-first schema validation
- Works seamlessly with Tailwind for error display
- Excellent for multi-step forms (as needed for Request Form)
- Form state management is critical for mobile usability

**Validation Rules** (from spec FR-004, FR-005):
- Committee selection (required, enum)
- Event info (required, min 10 chars, max 500 chars)
- Event date (required, date, future only, not past)
- Material type (required, enum)
- WhatsApp number (required, validated format: +57xxxxxxxxxx or 57xxxxxxxxxx)
- Bible verse text (conditional: required only if include_bible_verse = true)

**Alternatives Considered**:
- Formik: ✗ More verbose, worse performance on mobile
- Manual useState: ✗ Error-prone, verbose, hard to scale
- Uncontrolled forms: ✗ Harder to implement real-time validation

**Dependencies**:
```json
{
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

---

### 4. Backend & Database: Supabase (PostgreSQL)

**Decision**: Use Supabase for all backend needs (Auth + Database)

**Rationale**:
- Supabase is PostgreSQL-managed backend-as-a-service (BaaS)
- Built-in authentication (email/password, OAuth if needed)
- Real-time subscriptions for live request list updates (nice-to-have)
- Row-Level Security (RLS) for access control
- Scalable, serverless, no DevOps needed
- Free tier suitable for MVP
- Client libraries for Next.js (@supabase/supabase-js)

**Data Model** (from contexto.md section 5):
- `committees` table: id, name, created_at
- `requests` table: id, committee_id, event_info, event_date, material_type, contact_whatsapp, include_bible_verse, bible_verse_text, status, planning_start_date, delivery_date, priority_score, created_at, updated_at
- `request_history` table: id, request_id, old_status, new_status, changed_by, changed_at (for audit trail)
- `users` table: (auto-managed by Supabase Auth)

**Auth Strategy**:
- Supabase Auth with email/password
- JWT tokens stored in secure httpOnly cookies
- RLS policies:
  - Comité members can only see/create their own requests
  - DECOM admins can see all requests and change states
  - Public queries: none (all require auth)

**Alternatives Considered**:
- Firebase: ✗ Different paradigm, Supabase closer to PostgreSQL
- Custom Node.js + PostgreSQL: ✗ Too much DevOps for MVP
- MongoDB + Node: ✗ Relational data better with SQL

**Dependencies**:
```json
{
  "@supabase/supabase-js": "^2.38.0",
  "@supabase/auth-helpers-nextjs": "^0.8.0"
}
```

---

### 5. Date Calculations: date-fns Library

**Decision**: Use date-fns for date arithmetic and formatting

**Rationale**:
- Required logic: event_date - 7 days (planning), event_date - 2 days (delivery)
- date-fns is modular, tree-shakeable, TypeScript-first
- Better than Day.js for this use case
- Handles timezone considerations (though not needed for MVP)
- Easy testing of date functions

**Calculation Rules** (from contexto.md section 6):
```typescript
// All dates stored in UTC in DB, displayed in user's local timezone
planning_start_date = event_date - 7 days
delivery_date = event_date - 2 days
priority_score = calculatePriority(days_to_planning_start, days_to_delivery)
  // Higher score = more urgent
  // Formula: (7 - days_to_planning) * 10 + (2 - days_to_delivery) * 5
```

**Alternatives Considered**:
- Moment.js: ✗ Deprecated, large bundle
- Temporal API: ✗ Not yet stable in browsers
- Manual calculations: ✗ Error-prone for timezone handling

**Dependencies**:
```json
{
  "date-fns": "^2.30.0"
}
```

---

### 6. State Management: React Context + Hooks (No Redux/Zustand needed)

**Decision**: Use React Context API + custom hooks for global state

**Rationale**:
- App is small enough to not need Redux/Zustand complexity
- Context for: current user, auth state, cached requests list
- Custom hooks for: useAuth(), useRequests(), useUser()
- Simpler mental model for team familiar with React
- Reduces dependencies

**Global State Needed**:
- `AuthContext`: user, isLoading, isAuthenticated
- `RequestsContext`: requestsList, selectedRequest, filters (optional)
- Local state: form data, UI modals, filters (via useState)

**Alternatives Considered**:
- Redux: ✗ Over-engineered for MVP, adds complexity
- Zustand: ✓ Good alternative if team prefers, easier than Redux
- Jotai: ✓ Also viable, more granular
- MobX: ✗ Overkill, learning curve not worth it

---

### 7. Testing Strategy: Jest + React Testing Library + Playwright

**Decision**: 
- Unit tests: Jest + React Testing Library (components, utils)
- Integration tests: Jest + Supabase test fixtures
- E2E tests: Playwright (user flows)

**Rationale**:
- Jest is built-in with Next.js
- React Testing Library focuses on user behavior (not implementation)
- Playwright is modern, cross-browser, fast
- Cost: ~70% unit, ~20% integration, ~10% E2E (typical pyramid)

**Critical Tests** (MVP):
- Form validation (utils/validation.ts)
- Date calculations (utils/dateCalculations.ts, utils/priorityScore.ts)
- Request creation flow (E2E: committee fills form → request created)
- Request state transitions (E2E: admin changes status → updates shown)
- WhatsApp button generation (unit test, no external calls)

**Alternatives Considered**:
- Cypress: ✓ Viable, but Playwright is newer and faster
- Vitest: ✓ Faster than Jest, but overkill for MVP
- No E2E tests: ✗ Risky for critical user flows

**Dependencies**:
```json
{
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.1.0",
  "@playwright/test": "^1.40.0"
}
```

---

### 8. Authentication Flow & Authorization

**Decision**: 
- Authentication: Email/password via Supabase Auth
- Authorization: Role-based access control (RBAC) via RLS policies

**Rationale**:
- Simple but secure
- No OAuth complexity for MVP (can add Google/GitHub later)
- Supabase Auth provides JWT tokens automatically
- RLS ensures data access is enforced at DB level (defense-in-depth)

**Roles**:
1. `comite_member`: Can create/view own requests
2. `decom_admin`: Can view/edit all requests, change states
3. Anonymous: No access (redirected to login)

**Implementation**:
```sql
-- RLS Policy Examples
CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  USING (committee_id = auth.uid() OR auth.jwt() ->> 'role' = 'decom_admin');

CREATE POLICY "Only DECOM admins can update status"
  ON requests FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'decom_admin');
```

**Alternatives Considered**:
- Google OAuth: ✓ Can add later, not essential for MVP
- Magic links: ✗ More complex, email/password sufficient
- Multi-factor auth: ✗ Out of scope for MVP

---

### 9. Deployment & Hosting Strategy

**Decision**: Vercel for frontend (Next.js), Supabase Cloud for backend

**Rationale**:
- Vercel: native Next.js support, free tier, automatic deployments from GitHub
- Supabase: managed PostgreSQL, scales automatically, no DevOps
- Both have free tiers suitable for MVP
- CI/CD: GitHub Actions (built-in with Vercel)

**Environment Setup**:
```
.env.local (git-ignored):
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxx...
SUPABASE_SERVICE_ROLE_KEY=eyxxx... (server-only, sensitive)
```

**Alternatives Considered**:
- Self-hosted (EC2, DigitalOcean): ✗ Requires DevOps knowledge
- Heroku: ✗ Discontinued free tier
- Railway: ✓ Viable alternative, similar to Vercel
- Netlify: ✗ Limited backend support, Supabase still needed

---

### 10. Mobile Responsiveness & Performance Optimization

**Decision**: Mobile-first design with Tailwind + image optimization + code splitting

**Rationale**:
- Target device: smartphones (375px viewport minimum)
- Church context = lower bandwidth, older devices common
- Next.js Image component for optimization
- Dynamic imports for calendar (heavy component)
- Lighthouse score target: 90+

**Optimizations**:
- `next/image` for responsive images (logo, icons)
- Code splitting: Calendar component lazy-loaded
- Minification: Next.js handles automatically
- Caching: Static routes cached, API routes revalidated
- CSS pruning: Tailwind removes unused styles automatically

**Performance Targets**:
- FCP (First Contentful Paint): < 1.5s (mobile 4G)
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1

**Testing**:
- Lighthouse CI (automated)
- Real device testing (iPhone 11/12, Android equivalents)

---

### 11. Color & Branding System

**Decision**: Implement Tailwind custom color palette based on UI.md design system

**Rationale**:
- UI.md defines specific colors for church branding
- Implement in tailwind.config.ts as custom colors
- Use semantic color tokens (success, error, warning, info)
- Consistent across all components

**Custom Colors** (tailwind.config.ts):
```javascript
colors: {
  'primary': '#8B0000',      // Granate (passion, faith)
  'secondary': '#FFD700',    // Dorado (glory, divinity)
  'accent': '#FFFFFF',       // Blanco (purity, light)
  'dark-text': '#2C1810',    // Marrón oscuro
  'light-text': '#F5F5F5',   // Blanco humo
  'bg': '#FAFAFA',           // Gris muy claro
  'success': '#4CAF50',      // Verde
  'warning': '#FF9800',      // Naranja
  'error': '#D32F2F',        // Rojo
}
```

**Status Badges** (color-coded):
- Pendiente: Naranja (#FF9800)
- En planificación: Azul (#2196F3)
- En diseño: Púrpura (#9C27B0)
- Lista para entrega: Verde (#4CAF50)
- Entregada: Gris (#757575)

---

## Clarifications Resolved

### [NEEDS CLARIFICATION] from spec.md

**Q**: ¿Los comités tendrán usuarios individuales con roles, o es lista simple? ¿Se crea comité nuevo desde formulario o solo predefinidos?

**A**: Para MVP, implementar lista simple y predefinida:
- Comités predefinidos en BD: Jóvenes, Damas, Alabanza, Adoración, Diaconía
- Usuario selecciona su comité al registrarse (no se crean comités nuevos)
- Un usuario puede ser miembro de múltiples comités (campo `preferred_committee`)
- Creación de nuevos comités: future enhancement, no MVP
- DECOM son usuarios con rol `decom_admin`, acceso a todas las solicitudes

---

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | Next.js | 14+ | Web framework, SSR/SSG |
| Frontend | React | 18+ | UI library |
| Styling | Tailwind CSS | 3.3+ | Utility-first CSS |
| Components | Aceternity UI | Latest | Pre-built components matching design |
| Forms | React Hook Form | 7.48+ | Form state management |
| Validation | Zod | 3.22+ | Schema validation |
| Backend | Supabase | Cloud | PostgreSQL + Auth + Realtime |
| Dates | date-fns | 2.30+ | Date calculations |
| Testing | Jest | 29+ | Unit tests |
| Testing | React Testing Library | 14+ | Component testing |
| Testing | Playwright | 1.40+ | E2E tests |
| Language | TypeScript | 5+ | Type safety |
| Deployment | Vercel | - | Frontend hosting |
| Deployment | Supabase Cloud | - | Backend hosting |

---

## Dependencies Checklist

**To install post-Phase 0**:
```bash
npm install next@latest react@latest react-dom@latest typescript@latest
npm install -D tailwindcss postcss autoprefixer
npm install react-hook-form zod @hookform/resolvers
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install date-fns
npm install -D jest @testing-library/react @testing-library/jest-dom @playwright/test
npm install aceternity-ui clsx class-variance-authority  # UI components
```

---

## Next Steps (Phase 1)

Phase 1 will use these research findings to create:
1. **data-model.md**: Detailed database schema with migrations
2. **contracts/database-schema.sql**: Supabase DDL
3. **contracts/api-routes.md**: Next.js API routes specification
4. **quickstart.md**: Developer setup guide
5. Update agent context with technology decisions

---

**Research Status**: ✅ COMPLETE  
**All clarifications resolved**: ✅ YES  
**Ready for Phase 1 (Design)**: ✅ YES

**Date**: Enero 6, 2026  
**Reviewed by**: Assistant (GitHub Copilot)
