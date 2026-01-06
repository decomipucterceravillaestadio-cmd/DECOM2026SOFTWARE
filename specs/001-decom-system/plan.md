# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

# Implementation Plan: Sistema de Gestión de Solicitudes de Comunicación - DECOM

**Branch**: `001-decom-system` | **Date**: Enero 6, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-decom-system/spec.md`

## Summary

Sistema web responsivo que centraliza la gestión de solicitudes de material publicitario para el comité de comunicaciones (DECOM) de una iglesia. Reemplaza el flujo caótico de WhatsApp con un proceso estructurado con autenticación, formulario de solicitud paso a paso, panel de administración con vistas de lista y calendario, gestión de estados automáticos de prioridad, e integración de contacto directo via WhatsApp. Stack: Next.js + React en frontend, Supabase para autenticación y base de datos PostgreSQL, diseño mobile-first con paleta de colores corporativa (granate #8B0000, dorado #FFD700).

## Technical Context

**Language/Version**: TypeScript 5.x (via Next.js 14+), Node.js 18+  
**Primary Dependencies**: 
- Frontend: Next.js, React 18+, TypeScript, Tailwind CSS
- Backend/Database: Supabase (PostgreSQL, Auth, Realtime API)
- UI Components: Aceternity UI (based on UI.md requirements) or custom components
- State Management: React hooks + Context API
- Date handling: date-fns or Day.js
- Form handling: React Hook Form + Zod for validation

**Storage**: PostgreSQL via Supabase (tables: committees, requests, users, request_history)  
**Testing**: Jest (unit), Playwright/Cypress (E2E), Vitest (if needed)  
**Target Platform**: Web (responsive, mobile-first, 375px+ viewport)  
**Project Type**: Web application (frontend + backend via Supabase)  
**Performance Goals**: 
- Page load < 2s (mobile 4G)
- Form submission < 500ms
- Calendar view with 100+ requests < 1s load
- API responses < 200ms p95

**Constraints**: 
- Mobile-first (iglesia usa principalmente WhatsApp/mobile)
- No multimedia storage (archivos no almacenados en sistema)
- Offline capability: NO (requiere conectividad a internet)
- Acceso geográfico: Colombia
- Languages: Spanish UI

**Scale/Scope**: 
- ~5-10 comités inicialmente (expandible)
- ~20-50 solicitudes simultáneas en peak
- ~30-50 pantallas/componentes
- MVP: 2-3 semanas, Phase 2: 4-6 semanas total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS (No constitution violations detected)

This project:
- ✅ Uses established, well-documented tech stack (Next.js + Supabase)
- ✅ Has clear, measurable success criteria
- ✅ Scope is well-defined with explicit out-of-scope items (no file storage, no push notifications)
- ✅ Follows responsive design principles (mobile-first)
- ✅ Has clear data model and relationships
- ✅ Performance goals are achievable for scale defined
- ✅ No custom infrastructure or complex DevOps required
- ✅ Testing strategy is straightforward (unit + E2E)

**No violations to report.** Proceeding with Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

## Project Structure

### Documentation (this feature)

```text
specs/001-decom-system/
├── spec.md                  # Feature specification
├── plan.md                  # This file (implementation planning)
├── research.md              # Phase 0: Research findings (to be created)
├── data-model.md            # Phase 1: Data model + validation rules (to be created)
├── contracts/               # Phase 1: API contracts / endpoint specs (to be created)
│   ├── requests-api.md      # REST/Supabase API specs
│   └── database-schema.sql  # DDL for tables
├── quickstart.md            # Phase 1: Developer getting started (to be created)
├── checklists/
│   └── requirements.md      # Specification quality checklist
└── tasks.md                 # Phase 2: Detailed tasks/epics (not created by /speckit.plan)
```

### Source Code (repository root)

```text
decom-system/                  # Existing Next.js project
├── app/                       # Next.js App Router
│   ├── (auth)/                # Auth routes (login, register, reset password)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (protected)/           # Protected routes (require auth)
│   │   ├── dashboard/         # Comité dashboard
│   │   │   └── page.tsx
│   │   ├── solicitar/         # New request form
│   │   │   └── page.tsx
│   │   ├── admin/             # DECOM admin routes
│   │   │   ├── gestionar/     # Management dashboard
│   │   │   │   └── page.tsx
│   │   │   └── solicitud/     # Request detail view
│   │   │       └── [id]/page.tsx
│   │   ├── perfil/            # User profile
│   │   │   └── page.tsx
│   │   └── layout.tsx         # Protected layout (header, nav, auth check)
│   ├── api/                   # Route handlers (Supabase client-side or custom API)
│   │   ├── requests/          # Request management endpoints
│   │   │   ├── route.ts       # POST (create), GET (list)
│   │   │   └── [id]/          # GET, PATCH (update state)
│   │   └── auth/              # Auth helpers (signup, login)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home/redirect to login or dashboard
│   └── globals.css            # Global styles
├── components/                # Reusable React components
│   ├── auth/                  # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── forms/                 # Form components
│   │   ├── RequestForm.tsx    # Multi-step request form
│   │   ├── RequestFormStep1.tsx
│   │   └── RequestFormStep2.tsx
│   ├── dashboard/             # Dashboard components
│   │   ├── RequestsList.tsx
│   │   ├── RequestCard.tsx
│   │   ├── CalendarView.tsx
│   │   └── FilterBar.tsx
│   ├── common/                # Shared components
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── admin/                 # DECOM admin components
│       ├── RequestDetail.tsx
│       ├── StateTransitionButtons.tsx
│       └── WhatsAppButton.tsx
├── lib/                       # Utility libraries
│   ├── supabase/              # Supabase client initialization
│   │   ├── client.ts          # Browser client
│   │   └── server.ts          # Server-side client
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useRequests.ts
│   │   └── useUser.ts
│   ├── utils/                 # Utility functions
│   │   ├── dateCalculations.ts   # Planning date, delivery date logic
│   │   ├── priorityScore.ts      # Priority calculation algorithm
│   │   ├── validation.ts         # Form validation rules
│   │   ├── whatsappUrl.ts        # WhatsApp link builder
│   │   └── formatting.ts         # Date, status display formatting
│   ├── types/                 # TypeScript types
│   │   ├── requests.ts        # Request, Committee types
│   │   ├── users.ts
│   │   └── database.ts        # Supabase generated types
│   └── constants/             # Application constants
│       ├── committees.ts      # Predefined committees list
│       ├── materialTypes.ts   # Material type options
│       ├── requestStates.ts   # Request states enum
│       └── colors.ts          # Design system colors
├── styles/                    # CSS/Tailwind configurations
│   └── tailwind.config.ts
├── public/                    # Static assets
│   └── images/                # Logo, icons
├── tests/                     # Test files
│   ├── unit/                  # Unit tests for utils, hooks
│   │   ├── dateCalculations.test.ts
│   │   ├── priorityScore.test.ts
│   │   └── validation.test.ts
│   ├── integration/           # Integration tests with Supabase
│   │   ├── requests.test.ts
│   │   └── auth.test.ts
│   └── e2e/                   # End-to-end tests (Playwright/Cypress)
│       ├── committee-flow.spec.ts    # Create request flow
│       └── admin-flow.spec.ts        # Admin management flow
├── .env.example               # Environment variable template
├── .env.local                 # Local environment (git-ignored)
├── .specify/                  # SpecKit configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── next.config.ts             # Next.js config
├── postcss.config.mjs          # Tailwind PostCSS
└── contexto/                  # Project context docs
    ├── contexto.md            # Requirements
    └── UI.md                  # UI/UX design specs
```

**Structure Decision**: Selected **Option 2: Web application** (frontend + backend). Using Next.js App Router with:
- Frontend: React components in `/app` and `/components`
- Backend: Supabase (no custom Node.js backend needed)
- Database: PostgreSQL via Supabase
- Authentication: Supabase Auth (email/password)
- This leverages the existing Next.js project structure and minimizes infrastructure complexity.
