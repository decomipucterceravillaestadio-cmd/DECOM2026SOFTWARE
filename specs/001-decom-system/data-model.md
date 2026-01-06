# Phase 1: Data Model - DECOM System

**Created**: Enero 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`

---

## Overview

Phase 1 defines the complete data model, database schema, validation rules, and relationships for the DECOM system. This document serves as the source of truth for database design.

---

## Entity Relationship Diagram

```
┌──────────────┐         ┌────────────┐
│    users     │         │ committees │
├──────────────┤    *──0..1           │
│ id (PK)      │            ├────────────┤
│ email        │            │ id (PK)    │
│ password     │            │ name       │
│ role         │            │ created_at │
│ committee_id │────────────┘            │
│ created_at   │                        │
└──────────────┘                        │
       │                                │
       │         ┌──────────────────────┴────┐
       │         │                           │
       │    ┌────┴──────┐            ┌──────┴─────┐
       │    │ requests  │            │   request  │
       │    ├───────────┤            │  _history  │
       │    │ id (PK)   │────0..* ───┼────────────┤
       │    │committee_ │            │ id (PK)    │
       │    │  id (FK)  │            │ request_id │
       │    │ created_by│────────────┤  (FK)      │
       │    │created_at │            │ old_status │
       │    │ status    │            │ new_status │
       │    │ ...other  │            │ changed_by │
       │    │ fields    │            │ changed_at │
       └────┴───────────┘            └────────────┘
            │
            │ audit trail / state transitions
            │
```

---

## Data Model Entities

### 1. users Table

**Purpose**: Store authenticated users (committee members + DECOM admins)

**Schema**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('comite_member', 'decom_admin')),
  preferred_committee_id UUID REFERENCES committees(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Fields**:
| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PK | Auto-generated |
| `email` | TEXT | UNIQUE, NOT NULL | Lowercased, validated |
| `password_hash` | TEXT | NOT NULL | Never store plain password |
| `full_name` | TEXT | - | Optional, user's display name |
| `role` | TEXT | IN ('comite_member', 'decom_admin') | Access control |
| `preferred_committee_id` | UUID | FK → committees | Nullable, member's main committee |
| `is_active` | BOOLEAN | DEFAULT true | Soft delete flag |
| `created_at` | TIMESTAMP | DEFAULT now() | Audit trail |
| `updated_at` | TIMESTAMP | DEFAULT now() | Audit trail |

**Validations**:
- Email: Valid email format, unique, lowercased
- Password: Minimum 8 characters (enforced by app, not DB)
- Role: Only 'comite_member' or 'decom_admin'
- preferred_committee_id: Must exist in committees table OR NULL

**Notes**:
- Managed by Supabase Auth (email/password)
- password_hash is handled by auth system, not directly by app
- Foreign key to committees is soft (nullable) to allow creation before committee assignment

---

### 2. committees Table

**Purpose**: Store predefined committees that can request material

**Schema**:
```sql
CREATE TABLE committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_badge TEXT DEFAULT 'bg-blue-500',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_committees_name ON committees(name);
```

**Fields**:
| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PK | Auto-generated |
| `name` | TEXT | UNIQUE, NOT NULL | Committee name (e.g., "Jóvenes") |
| `description` | TEXT | - | Optional details about committee |
| `color_badge` | TEXT | DEFAULT 'bg-blue-500' | Tailwind color for UI badges |
| `created_at` | TIMESTAMP | DEFAULT now() | Audit trail |
| `updated_at` | TIMESTAMP | DEFAULT now() | Audit trail |

**Predefined Data** (seed):
```sql
INSERT INTO committees (name, description, color_badge) VALUES
  ('Jóvenes', 'Ministerio de jóvenes', 'bg-blue-500'),
  ('Damas', 'Ministerio de damas', 'bg-pink-500'),
  ('Alabanza', 'Equipo de alabanza y música', 'bg-purple-500'),
  ('Adoración', 'Equipo de adoración', 'bg-indigo-500'),
  ('Diaconía', 'Ministerio de asistencia social', 'bg-green-500');
```

**Validations**:
- Name: Unique, not empty, max 100 characters
- color_badge: Valid Tailwind class string

**Notes**:
- Predefined list (no user creation in MVP)
- Future enhancement: Allow admins to add committees
- color_badge used for visual distinction in UI

---

### 3. requests Table

**Purpose**: Store all material requests submitted by committees

**Schema**:
```sql
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request content
  event_name TEXT NOT NULL,
  event_info TEXT NOT NULL,
  event_date DATE NOT NULL,
  material_type TEXT NOT NULL,
  contact_whatsapp TEXT NOT NULL,
  include_bible_verse BOOLEAN DEFAULT false,
  bible_verse_text TEXT,
  
  -- Calculated fields
  planning_start_date DATE GENERATED ALWAYS AS (event_date - INTERVAL '7 days') STORED,
  delivery_date DATE GENERATED ALWAYS AS (event_date - INTERVAL '2 days') STORED,
  priority_score INT GENERATED ALWAYS AS (
    CASE 
      WHEN event_date > CURRENT_DATE + INTERVAL '7 days' THEN 1
      WHEN event_date > CURRENT_DATE + INTERVAL '2 days' THEN 5
      ELSE 10
    END
  ) STORED,
  
  -- State management
  status TEXT NOT NULL DEFAULT 'Pendiente' 
    CHECK (status IN ('Pendiente', 'En planificación', 'En diseño', 'Lista para entrega', 'Entregada')),
  
  -- Audit
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_event_date CHECK (event_date > CURRENT_DATE),
  CONSTRAINT valid_whatsapp CHECK (contact_whatsapp ~ '^\+?57\d{10}$'),
  CONSTRAINT valid_event_info CHECK (char_length(event_info) >= 5)
);

CREATE INDEX idx_requests_committee ON requests(committee_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_event_date ON requests(event_date);
CREATE INDEX idx_requests_priority ON requests(priority_score);
CREATE INDEX idx_requests_created_by ON requests(created_by);
```

**Fields**:
| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PK | Auto-generated |
| `committee_id` | UUID | FK, NOT NULL | Which committee requested |
| `created_by` | UUID | FK, NOT NULL | Which user submitted |
| `event_name` | TEXT | NOT NULL | Short event title |
| `event_info` | TEXT | NOT NULL, min 5 chars | Detailed event description |
| `event_date` | DATE | NOT NULL, future only | Event date (not past) |
| `material_type` | TEXT | NOT NULL | Enum: flyer, banner, video, redes, otro |
| `contact_whatsapp` | TEXT | NOT NULL, regex validated | Format: +57XXXXXXXXXX or 57XXXXXXXXXX |
| `include_bible_verse` | BOOLEAN | DEFAULT false | Whether to include verse |
| `bible_verse_text` | TEXT | - | The actual Bible verse (if included) |
| `planning_start_date` | DATE | GENERATED, STORED | Calculated: event_date - 7 days |
| `delivery_date` | DATE | GENERATED, STORED | Calculated: event_date - 2 days |
| `priority_score` | INT | GENERATED, STORED | 1 (low) to 10 (high) based on proximity |
| `status` | TEXT | ENUM, DEFAULT 'Pendiente' | State of request |
| `created_at` | TIMESTAMP | DEFAULT now() | When created |
| `updated_at` | TIMESTAMP | DEFAULT now() | When last modified |

**Validation Rules**:
- `event_date`: Must be future (not today or past)
- `contact_whatsapp`: Must match regex `^\+?57\d{10}$` (Colombia format)
- `event_info`: Minimum 5 characters, maximum 500 characters
- `material_type`: Must be one of: 'flyer', 'banner', 'video', 'redes_sociales', 'otro'
- `bible_verse_text`: Required if include_bible_verse = true, max 200 chars
- `status`: Enum with specific allowed transitions

**Calculated Fields**:
- `planning_start_date = event_date - 7 days` (generated, stored)
- `delivery_date = event_date - 2 days` (generated, stored)
- `priority_score`: 1 if >7 days away, 5 if 2-7 days away, 10 if <2 days away

**State Transitions** (valid flows):
```
Pendiente → En planificación
         → En diseño  (skip planning)
         → Entregada  (skip both, unlikely)

En planificación → En diseño
                 → Lista para entrega

En diseño → Lista para entrega
          → En planificación  (rework)

Lista para entrega → Entregada
                   → En diseño  (rework)

Entregada → (final state, no transitions back)
```

**Notes**:
- `created_by` tracks which user submitted the request
- `committee_id` + `created_by` together form audit trail
- Cascading delete: If committee deleted, all its requests deleted (unlikely in practice)
- Indexes on frequently queried columns (status, event_date, priority_score)

---

### 4. request_history Table

**Purpose**: Audit trail of all state changes for traceability

**Schema**:
```sql
CREATE TABLE request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  change_reason TEXT,
  changed_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_request_history_request ON request_history(request_id);
CREATE INDEX idx_request_history_changed_at ON request_history(changed_at);
```

**Fields**:
| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PK | Auto-generated |
| `request_id` | UUID | FK, NOT NULL | Which request this change belongs to |
| `old_status` | TEXT | - | Previous status (NULL for creation) |
| `new_status` | TEXT | NOT NULL | New status |
| `changed_by` | UUID | FK | Which user made the change |
| `change_reason` | TEXT | - | Optional note about why (for future) |
| `changed_at` | TIMESTAMP | DEFAULT now() | When change occurred |

**Notes**:
- Created automatically on every status change (via trigger or app logic)
- Provides complete audit trail: who changed what, when
- Supports compliance/transparency requirements

---

## Validation Rules Summary

### Form-Level Validations (Client-Side)

**Committee Selection**:
- Required field
- Type: Enum (dropdown from committees table)

**Event Info**:
- Required field
- Type: Text (textarea)
- Min: 5 characters
- Max: 500 characters
- Allowed: Letters, numbers, punctuation, emojis (church context!)
- Real-time feedback: Character counter

**Event Date**:
- Required field
- Type: Date picker
- Constraint: Must be future (reject today or past dates)
- Constraint: Not more than 1 year in future (warn if too far)
- Real-time feedback: Show calculated planning_start_date and delivery_date
- Accessibility: ARIA labels for date picker

**Material Type**:
- Required field
- Type: Chip selector (radio buttons styled as chips)
- Options: Flyer, Banner, Video, Redes Sociales, Otro
- Visual feedback: Selected chip highlighted in granate/dorado

**WhatsApp Number**:
- Required field
- Type: Text input with phone format mask
- Format: +57XXXXXXXXXX or 57XXXXXXXXXX (Colombia only for MVP)
- Validation regex: `^\+?57\d{10}$`
- Real-time feedback: Format validation error message
- Prefill: "+57" if user enters "57..." or just "..."

**Bible Verse (Conditional)**:
- Conditional: Only required if "Include Bible Verse?" toggle = ON
- Type: Textarea
- Max: 200 characters
- Real-time feedback: Character counter, required if toggle ON

**Overall Form**:
- Step 1 validations must pass before "Continue" button enabled
- Step 2 validations must pass before "Submit" button enabled
- Validation errors displayed inline (below field) with red color (#D32F2F)
- Success messages on submission (green #4CAF50)

### Database-Level Validations

- CHECK constraints: Regex, date ranges, enum values
- FOREIGN KEY constraints: Referential integrity
- NOT NULL constraints: Required fields
- UNIQUE constraints: Email uniqueness

---

## Row-Level Security (RLS) Policies

**Purpose**: Enforce data access at database level (defense-in-depth)

### requests Table Policies

```sql
-- Policy 1: Comité members can view their own requests
CREATE POLICY "Users can view own requests"
  ON requests FOR SELECT
  USING (
    committee_id IN (
      SELECT preferred_committee_id FROM users WHERE id = auth.uid()
    ) 
    OR created_by = auth.uid()
  );

-- Policy 2: DECOM admins can view all requests
CREATE POLICY "DECOM admins can view all requests"
  ON requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

-- Policy 3: Comité members can insert (create) requests
CREATE POLICY "Comité members can create requests"
  ON requests FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND committee_id IN (
      SELECT preferred_committee_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy 4: Only DECOM admins can update (change status)
CREATE POLICY "Only DECOM can update requests"
  ON requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

-- Policy 5: Comité members can update their own requests (not final)
CREATE POLICY "Users can update own non-final requests"
  ON requests FOR UPDATE
  USING (
    created_by = auth.uid() 
    AND status != 'Entregada'
  );

-- Policy 6: No one can delete requests (audit trail requirement)
CREATE POLICY "No one can delete requests"
  ON requests FOR DELETE
  USING (false);
```

### request_history Table Policies

```sql
-- Policy: All authenticated users can view history of requests they have access to
CREATE POLICY "View history for accessible requests"
  ON request_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE id = request_history.request_id
      AND (
        committee_id IN (
          SELECT preferred_committee_id FROM users WHERE id = auth.uid()
        )
        OR created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
        )
      )
    )
  );
```

---

## Default/Predefined Data

### Committees (seed data)

```sql
INSERT INTO committees (name, description, color_badge) VALUES
('Jóvenes', 'Ministerio de jóvenes', 'bg-blue-500'),
('Damas', 'Ministerio de damas', 'bg-pink-500'),
('Alabanza', 'Equipo de alabanza y música', 'bg-purple-500'),
('Adoración', 'Equipo de adoración', 'bg-indigo-500'),
('Diaconía', 'Ministerio de asistencia social', 'bg-green-500');
```

### Material Types (used in form, not DB table)

```typescript
// lib/constants/materialTypes.ts
export const MATERIAL_TYPES = [
  { value: 'flyer', label: 'Flyer/Volante' },
  { value: 'banner', label: 'Banner/Pancarta' },
  { value: 'video', label: 'Video/Reel' },
  { value: 'redes_sociales', label: 'Redes Sociales' },
  { value: 'otro', label: 'Otro' },
];
```

### Request Status (enum, used everywhere)

```typescript
// lib/constants/requestStates.ts
export const REQUEST_STATES = {
  PENDING: 'Pendiente',
  PLANNING: 'En planificación',
  DESIGN: 'En diseño',
  READY: 'Lista para entrega',
  DELIVERED: 'Entregada',
};

export const STATUS_COLORS = {
  'Pendiente': 'bg-yellow-500',
  'En planificación': 'bg-blue-500',
  'En diseño': 'bg-purple-500',
  'Lista para entrega': 'bg-green-500',
  'Entregada': 'bg-gray-500',
};
```

---

## Database Triggers (Automatic Behaviors)

### Trigger: Auto-update updated_at on requests

```sql
CREATE OR REPLACE FUNCTION update_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requests_updated_at_trigger
BEFORE UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION update_requests_updated_at();
```

### Trigger: Auto-create request_history entry on status change

```sql
CREATE OR REPLACE FUNCTION log_request_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO request_history (request_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER request_status_change_trigger
AFTER UPDATE ON requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_request_status_change();
```

---

## Data Model Constraints & Assumptions

### Constraints

1. **Immutability of created_at**: Never modified after creation
2. **No duplicate submissions**: Users cannot submit identical requests (UX/app responsibility, not DB)
3. **Status final state**: Once "Entregada", no further changes allowed (enforced by RLS)
4. **Event date immutable**: Event date cannot be changed after creation (preserve original promise)
5. **Cascading deletes**: Deleting a committee deletes all its requests (rare, but safe)

### Assumptions

1. **Single continent timezone**: All dates handled in user's local time (Colombia)
2. **Email is unique identifier**: No two users with same email
3. **Committees are predefined**: No user-created committees in MVP
4. **WhatsApp numbers are valid**: Validation regex catches most invalid formats
5. **Bible verses are trusted**: No filtering/validation of religious content (church context)
6. **Passwords are hashed externally**: Supabase Auth handles hashing
7. **JWT tokens are validated**: Supabase handles token validation

---

## Migration Strategy

### For New Supabase Project (MVP)

Run migrations in order:

1. Create committees table + seed
2. Create users table (Supabase Auth handles auth_users, we create app_users/profiles)
3. Create requests table + indexes
4. Create request_history table
5. Create RLS policies
6. Create triggers

### For Existing Project With Data

Run migrations with:
- Add new tables (non-breaking)
- Add columns (with defaults for existing rows)
- Alter constraints (test in dev branch first)
- Never drop columns (archive strategy)

---

## TypeScript Types (auto-generated)

Generated from Supabase schema via `supabase gen types typescript`:

```typescript
// lib/database.types.ts
export interface Committee {
  id: string;
  name: string;
  description?: string;
  color_badge: string;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: string;
  committee_id: string;
  created_by: string;
  event_name: string;
  event_info: string;
  event_date: string;
  material_type: string;
  contact_whatsapp: string;
  include_bible_verse: boolean;
  bible_verse_text?: string;
  planning_start_date: string;
  delivery_date: string;
  priority_score: number;
  status: 'Pendiente' | 'En planificación' | 'En diseño' | 'Lista para entrega' | 'Entregada';
  created_at: string;
  updated_at: string;
}

export interface RequestHistory {
  id: string;
  request_id: string;
  old_status?: string;
  new_status: string;
  changed_by?: string;
  change_reason?: string;
  changed_at: string;
}
```

---

## Next Steps

Phase 1 will also produce:
- **contracts/database-schema.sql**: Executable SQL file for Supabase
- **contracts/api-routes.md**: REST/Supabase API specifications
- **quickstart.md**: Developer setup guide with migration steps

---

**Data Model Status**: ✅ COMPLETE  
**Ready for database schema creation**: ✅ YES  
**Ready for API contracts**: ✅ YES

**Date**: Enero 6, 2026  
**Reviewed by**: Assistant (GitHub Copilot)
