-- Nombre: 003-update-committees-permissions-for-president
-- Descripción: Permitir que presidentes también gestionen comités (nivel 4 y superiores)
-- Fecha: 2026-01-16
-- Estado: ✅ Aplicada exitosamente

-- PROBLEMA RESUELTO:
-- Las políticas RLS anteriores solo permitían a usuarios con role_level = 5 (admin)
-- gestionar comités. Esto impedía que los presidentes (role_level = 4) pudieran
-- crear, editar o eliminar comités, a pesar de tener los permisos correspondientes
-- en el sistema de frontend.

-- SOLUCIÓN:
-- Se modifican las políticas RLS para permitir a usuarios con role_level >= 4
-- (admin Y presidente) realizar operaciones CRUD en comités.

-- 1. Eliminar políticas restrictivas actuales para comités (solo admin nivel 5)
DROP POLICY IF EXISTS "committees_insert_admin" ON public.committees;
DROP POLICY IF EXISTS "committees_update_admin" ON public.committees;
DROP POLICY IF EXISTS "committees_delete_admin" ON public.committees;

-- 2. Crear nuevas políticas que permitan a admin Y presidente gestionar comités

-- INSERT: Permitir crear comités a usuarios con role_level >= 4 (Admin y Presidente)
CREATE POLICY "committees_insert_admin_presidente" ON public.committees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_user_id = auth.uid()
      AND users.role_level >= 4
      AND users.is_active = true
    )
  );

-- UPDATE: Permitir editar comités a usuarios con role_level >= 4 (Admin y Presidente)
CREATE POLICY "committees_update_admin_presidente" ON public.committees
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_user_id = auth.uid()
      AND users.role_level >= 4
      AND users.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_user_id = auth.uid()
      AND users.role_level >= 4
      AND users.is_active = true
    )
  );

-- DELETE: Permitir eliminar comités a usuarios con role_level >= 4 (Admin y Presidente)
CREATE POLICY "committees_delete_admin_presidente" ON public.committees
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_user_id = auth.uid()
      AND users.role_level >= 4
      AND users.is_active = true
    )
  );

-- NOTAS:
-- - Las políticas de SELECT ya permiten lectura a todos los usuarios autenticados,
--   por lo que no es necesario modificarlas.
-- - Se verifica también que el usuario esté activo (is_active = true) para mayor seguridad.
-- - Esta migración sincroniza las políticas RLS con los permisos definidos en el frontend.

-- CAMBIOS RELACIONADOS EN FRONTEND:
-- - app/lib/permissions.ts: Se agregó Permission.EDIT_COMMITTEES al rol 'presidente'
-- - app/components/Dashboard/DashboardLayout.tsx: Ya usa canManageCommittees correctamente

-- VERIFICACIÓN:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'committees';
-- Se deben ver las nuevas políticas: committees_insert_admin_presidente,
-- committees_update_admin_presidente, committees_delete_admin_presidente
