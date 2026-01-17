-- Migration: Add Soft Delete to Requests Table
-- Date: 2026-01-16
-- Purpose: Implement logical deletion for audit and recovery purposes

-- 1. Add Soft Delete Columns
ALTER TABLE requests
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS deletion_reason TEXT DEFAULT NULL;

-- 2. Create Index for Performance
CREATE INDEX IF NOT EXISTS idx_requests_deleted_at ON requests(deleted_at) WHERE deleted_at IS NULL;

-- 3. Add RLS Policy for Soft Delete
-- Allow DECOM admins to perform soft delete by updating the soft delete columns
CREATE POLICY "DECOM admins can soft delete requests"
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
    AND (
      -- Allow updating soft delete columns
      (deleted_at IS NOT NULL AND deleted_by IS NOT NULL AND deletion_reason IS NOT NULL)
      OR
      -- Allow normal updates if not setting soft delete
      (deleted_at IS NULL)
    )
  );

-- 4. Drop existing views first to avoid conflicts
DROP VIEW IF EXISTS v_requests_detailed;
DROP VIEW IF EXISTS v_requests_urgent;
DROP VIEW IF EXISTS v_requests_public;

-- 4. Recreate V_REQUESTS_DETAILED view with soft delete support
CREATE VIEW v_requests_detailed AS
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
  r.deleted_at,
  r.deletion_reason,
  (SELECT COUNT(*) FROM request_history WHERE request_id = r.id) as status_change_count
FROM requests r
LEFT JOIN committees c ON r.committee_id = c.id
LEFT JOIN users u ON r.created_by = u.id
WHERE r.deleted_at IS NULL; -- Only show non-deleted requests

-- 5. Recreate V_REQUESTS_URGENT view
CREATE VIEW v_requests_urgent AS
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
  AND r.deleted_at IS NULL -- Exclude deleted
ORDER BY r.priority_score DESC, r.delivery_date ASC;

-- 6. Recreate V_REQUESTS_PUBLIC view
CREATE VIEW v_requests_public AS
SELECT
  r.id,
  r.event_date,
  r.material_type,
  r.status,
  r.priority_score,
  (CURRENT_DATE - r.created_at::date) as days_since_created,
  (r.delivery_date - CURRENT_DATE) as days_until_delivery
FROM requests r
WHERE r.status IN ('Pendiente', 'En_planificacion', 'En_diseño', 'Lista_para_entrega', 'Entregada')
  AND r.visible_in_public_calendar = true
  AND r.deleted_at IS NULL -- Exclude deleted
ORDER BY r.event_date ASC;
