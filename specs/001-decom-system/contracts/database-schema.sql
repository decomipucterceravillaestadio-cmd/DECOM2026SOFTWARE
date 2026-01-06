-- Database Schema for DECOM System
-- File: specs/001-decom-system/contracts/database-schema.sql
-- Created: 2026-01-06
-- Purpose: Supabase PostgreSQL DDL for complete data model

-- Execute this file in Supabase SQL Editor to create all tables, indexes, policies, and triggers

---
-- ============================================================================
-- 1. COMMITTEES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color_badge TEXT DEFAULT 'bg-blue-500',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_committees_name ON committees(name);

-- Insert predefined committees
INSERT INTO committees (name, description, color_badge) VALUES
  ('Jóvenes', 'Ministerio de jóvenes', 'bg-blue-500'),
  ('Damas', 'Ministerio de damas', 'bg-pink-500'),
  ('Alabanza', 'Equipo de alabanza y música', 'bg-purple-500'),
  ('Adoración', 'Equipo de adoración', 'bg-indigo-500'),
  ('Diaconía', 'Ministerio de asistencia social', 'bg-green-500')
ON CONFLICT (name) DO NOTHING;  -- Idempotent: won't fail if already exists

---
-- ============================================================================
-- 2. USERS TABLE (App profiles linked to Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'comite_member' CHECK (role IN ('comite_member', 'decom_admin')),
  preferred_committee_id UUID REFERENCES committees(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

---
-- ============================================================================
-- 3. REQUESTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  committee_id UUID NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Request content
  event_name TEXT NOT NULL,
  event_info TEXT NOT NULL,
  event_date DATE NOT NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('flyer', 'banner', 'video', 'redes_sociales', 'otro')),
  contact_whatsapp TEXT NOT NULL,
  include_bible_verse BOOLEAN DEFAULT false,
  bible_verse_text TEXT,
  
  -- Calculated fields (generated, stored)
  planning_start_date DATE GENERATED ALWAYS AS (event_date - INTERVAL '7 days') STORED,
  delivery_date DATE GENERATED ALWAYS AS (event_date - INTERVAL '2 days') STORED,
  priority_score INT GENERATED ALWAYS AS (
    CASE 
      WHEN (event_date - CURRENT_DATE) > 7 THEN 1
      WHEN (event_date - CURRENT_DATE) > 2 THEN 5
      ELSE 10
    END
  ) STORED,
  
  -- State management
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN (
    'Pendiente', 'En planificación', 'En diseño', 'Lista para entrega', 'Entregada'
  )),
  
  -- Audit
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_event_date CHECK (event_date > CURRENT_DATE),
  CONSTRAINT valid_whatsapp CHECK (contact_whatsapp ~ '^\+?57\d{10}$'),
  CONSTRAINT valid_event_info CHECK (char_length(event_info) >= 5 AND char_length(event_info) <= 500),
  CONSTRAINT valid_bible_verse CHECK (
    (include_bible_verse = false) OR (include_bible_verse = true AND char_length(bible_verse_text) > 0)
  )
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_requests_committee ON requests(committee_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_event_date ON requests(event_date);
CREATE INDEX IF NOT EXISTS idx_requests_priority ON requests(priority_score);
CREATE INDEX IF NOT EXISTS idx_requests_created_by ON requests(created_by);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at DESC);

---
-- ============================================================================
-- 4. REQUEST_HISTORY TABLE (Audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS request_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  change_reason TEXT,
  changed_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_request_history_request ON request_history(request_id);
CREATE INDEX IF NOT EXISTS idx_request_history_changed_at ON request_history(changed_at DESC);

---
-- ============================================================================
-- 5. TRIGGERS FOR AUTOMATIC BEHAVIORS
-- ============================================================================

-- Trigger 1: Auto-update requests.updated_at on UPDATE
CREATE OR REPLACE FUNCTION update_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS requests_updated_at_trigger ON requests;
CREATE TRIGGER requests_updated_at_trigger
BEFORE UPDATE ON requests
FOR EACH ROW
EXECUTE FUNCTION update_requests_updated_at();

-- Trigger 2: Auto-create request_history entry on status change
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

DROP TRIGGER IF EXISTS request_status_change_trigger ON requests;
CREATE TRIGGER request_status_change_trigger
AFTER UPDATE ON requests
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION log_request_status_change();

-- Trigger 3: Auto-update users.updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at_trigger ON users;
CREATE TRIGGER users_updated_at_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

---
-- ============================================================================
-- 6. ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_history ENABLE ROW LEVEL SECURITY;

---
-- COMMITTEES: Public read (all authenticated users)
CREATE POLICY "Public read committees"
  ON committees FOR SELECT
  USING (true);

---
-- USERS: Users can view their own profile + DECOM can view all
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "DECOM can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

---
-- REQUESTS: Access control based on role
CREATE POLICY "Comité members can view own requests"
  ON requests FOR SELECT
  USING (
    created_by = auth.uid()
    OR committee_id IN (
      SELECT preferred_committee_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "DECOM admins can view all requests"
  ON requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

CREATE POLICY "Comité members can create requests for their committee"
  ON requests FOR INSERT
  WITH CHECK (
    created_by = auth.uid()
    AND committee_id IN (
      SELECT preferred_committee_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "DECOM admins can update request status"
  ON requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

CREATE POLICY "Comité members can update own non-final requests"
  ON requests FOR UPDATE
  USING (
    created_by = auth.uid() AND status != 'Entregada'
  )
  WITH CHECK (
    created_by = auth.uid() AND status != 'Entregada'
  );

CREATE POLICY "No one can delete requests"
  ON requests FOR DELETE
  USING (false);

---
-- REQUEST_HISTORY: View history of accessible requests
CREATE POLICY "View history of accessible requests"
  ON request_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM requests 
      WHERE id = request_history.request_id
      AND (
        created_by = auth.uid()
        OR committee_id IN (
          SELECT preferred_committee_id FROM users WHERE id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
        )
      )
    )
  );

CREATE POLICY "Admins can insert history entries"
  ON request_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'decom_admin'
    )
  );

---
-- ============================================================================
-- 7. HELPER VIEWS (Optional, for convenience in queries)
-- ============================================================================

-- View: All requests with committee and creator info (flattened)
CREATE OR REPLACE VIEW v_requests_detailed AS
SELECT
  r.id,
  r.committee_id,
  c.name as committee_name,
  r.event_name,
  r.event_info,
  r.event_date,
  r.material_type,
  r.contact_whatsapp,
  r.include_bible_verse,
  r.bible_verse_text,
  r.planning_start_date,
  r.delivery_date,
  r.priority_score,
  r.status,
  r.created_by,
  u.full_name as created_by_name,
  u.email as created_by_email,
  r.created_at,
  r.updated_at,
  (SELECT COUNT(*) FROM request_history WHERE request_id = r.id) as status_change_count
FROM requests r
LEFT JOIN committees c ON r.committee_id = c.id
LEFT JOIN users u ON r.created_by = u.id;

-- View: Priority dashboard for DECOM (urgent requests)
CREATE OR REPLACE VIEW v_requests_urgent AS
SELECT
  r.id,
  c.name as committee_name,
  r.event_name,
  r.event_date,
  r.status,
  r.priority_score,
  r.delivery_date,
  (r.delivery_date - CURRENT_DATE) as days_until_delivery
FROM requests r
LEFT JOIN committees c ON r.committee_id = c.id
WHERE r.priority_score >= 5
  AND r.status NOT IN ('Entregada')
ORDER BY r.priority_score DESC, r.delivery_date ASC;

---
-- ============================================================================
-- 8. SEED DATA FOR TESTING (Optional, remove in production)
-- ============================================================================

-- Test users (passwords should be set via Supabase Auth UI or API)
-- These are app profile records; actual auth is handled by Supabase Auth

-- Note: In real usage, users are created via signup/auth endpoints
-- These are example records for reference

---
-- ============================================================================
-- 9. NOTES & DOCUMENTATION
-- ============================================================================

/*
IMPORTANT NOTES:

1. PASSWORD MANAGEMENT:
   - Never insert passwords directly into DB
   - Supabase Auth (auth.users table) handles password hashing
   - App should create user profile in users table when user signs up

2. AUTHENTICATION:
   - All queries use auth.uid() which gets current user's ID from JWT token
   - RLS policies are enforced automatically by Supabase
   - Bypass RLS only with Service Role Key (server-side only)

3. TIMEZONE:
   - All TIMESTAMP fields are in UTC (Postgres default)
   - Dates (DATE fields) are stored without timezone
   - App should handle timezone conversion in frontend/API

4. PERFORMANCE:
   - Indexes created on commonly filtered columns
   - Queries are optimized for list views (event_date, priority_score)
   - For millions of requests, consider partitioning by year

5. BACKUPS:
   - Supabase automatically backs up data daily
   - Manual backups available via dashboard
   - Production: Configure daily backups in settings

6. TESTING:
   - Use `INSERT INTO request_history...` manually to test audit trail
   - RLS can be tested by switching users (different auth tokens)
   - Generate test data via `INSERT...SELECT` for load testing

7. FUTURE ENHANCEMENTS (not in MVP):
   - Email notifications on status changes
   - Bulk operations (update multiple requests)
   - Advanced filtering/search on requests table
   - File attachments (separate storage bucket in Supabase Storage)
   - Request templates (allow committees to save common request types)
   - Scheduled requests (request for future dates)

*/

---
-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- File created: 2026-01-06
-- Status: Ready for Supabase
-- Last updated: 2026-01-06
