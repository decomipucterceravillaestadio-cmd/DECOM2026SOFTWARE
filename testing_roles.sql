-- Script para Testing del Sistema de Roles
-- Este script crea usuarios de prueba con los 5 niveles de roles
-- IMPORTANTE: Solo para uso en DESARROLLO, NO ejecutar en producción

-- ======================================================
-- PASO 1: Crear usuarios en auth.users (simulado)
-- ======================================================
-- NOTA: Los usuarios de auth.users deben crearse mediante Supabase Auth
-- Este script solo inserta en public.users asumiendo que los auth_user_ids existen

-- ======================================================
-- PASO 2: Insertar usuarios de prueba en public.users
-- ======================================================

-- Limpiar usuarios de prueba existentes (CUIDADO en producción)
-- DELETE FROM public.users WHERE email LIKE '%test-role%';

-- Usuario 1: Admin (nivel 5)
INSERT INTO public.users (
  auth_user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- UUID de prueba
  'admin@test-role.com',
  'Admin de Prueba',
  'admin',
  true,
  NOW()
) ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Usuario 2: Presidente (nivel 4)
INSERT INTO public.users (
  auth_user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'presidente@test-role.com',
  'Presidente de Prueba',
  'presidente',
  true,
  NOW()
) ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'presidente',
  updated_at = NOW();

-- Usuario 3: Tesorero (nivel 3)
INSERT INTO public.users (
  auth_user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'tesorero@test-role.com',
  'Tesorero de Prueba',
  'tesorero',
  true,
  NOW()
) ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'tesorero',
  updated_at = NOW();

-- Usuario 4: Secretario (nivel 2)
INSERT INTO public.users (
  auth_user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'secretario@test-role.com',
  'Secretario de Prueba',
  'secretario',
  true,
  NOW()
) ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'secretario',
  updated_at = NOW();

-- Usuario 5: Vocal (nivel 1)
INSERT INTO public.users (
  auth_user_id,
  email,
  full_name,
  role,
  is_active,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000005',
  'vocal@test-role.com',
  'Vocal de Prueba',
  'vocal',
  true,
  NOW()
) ON CONFLICT (auth_user_id) DO UPDATE SET
  role = 'vocal',
  updated_at = NOW();

-- ======================================================
-- PASO 3: Verificar que role_level se asignó correctamente
-- ======================================================
SELECT 
  full_name,
  email,
  role,
  role_level,
  is_active,
  created_at
FROM public.users
WHERE email LIKE '%test-role%'
ORDER BY role_level DESC;

-- ======================================================
-- PASO 4: Verificar políticas RLS
-- ======================================================

-- Probar que un usuario puede ver su propio perfil
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000005"}';
SELECT * FROM public.users WHERE auth_user_id = '00000000-0000-0000-0000-000000000005';

-- Probar que Admin puede ver todos los usuarios
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001"}';
SELECT email, role, role_level FROM public.users ORDER BY role_level DESC;

-- Reset
RESET "request.jwt.claims";

-- ======================================================
-- PASO 5: Crear solicitudes de prueba para test
-- ======================================================

-- Solicitud creada por Admin
INSERT INTO public.requests (
  user_id,
  comite_name,
  title,
  description,
  status,
  event_date,
  created_at
) 
SELECT 
  id,
  'DECOM',
  'Solicitud de prueba - Admin',
  'Esta es una solicitud creada por el admin para testing',
  'pending',
  NOW() + INTERVAL '7 days',
  NOW()
FROM public.users 
WHERE email = 'admin@test-role.com'
LIMIT 1;

-- Solicitud creada por Vocal
INSERT INTO public.requests (
  user_id,
  comite_name,
  title,
  description,
  status,
  event_date,
  created_at
) 
SELECT 
  id,
  'Ministerio de Alabanza',
  'Solicitud de prueba - Vocal',
  'Esta es una solicitud creada por un vocal para testing',
  'pending',
  NOW() + INTERVAL '14 days',
  NOW()
FROM public.users 
WHERE email = 'vocal@test-role.com'
LIMIT 1;

-- ======================================================
-- PASO 6: Verificar permisos en cascade
-- ======================================================

-- Mostrar resumen de configuración
SELECT 
  'Total usuarios' as metric,
  COUNT(*)::text as value
FROM public.users
WHERE email LIKE '%test-role%'

UNION ALL

SELECT 
  'Usuarios Admin/Presidente',
  COUNT(*)::text
FROM public.users
WHERE email LIKE '%test-role%' AND role_level >= 4

UNION ALL

SELECT 
  'Solicitudes de prueba',
  COUNT(*)::text
FROM public.requests
WHERE user_id IN (
  SELECT id FROM public.users WHERE email LIKE '%test-role%'
);

-- ======================================================
-- LIMPIEZA (Descomentar solo cuando se quiera eliminar)
-- ======================================================

-- Eliminar solicitudes de prueba
-- DELETE FROM public.requests 
-- WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%test-role%');

-- Eliminar usuarios de prueba
-- DELETE FROM public.users WHERE email LIKE '%test-role%';

-- ======================================================
-- NOTAS IMPORTANTES
-- ======================================================
-- 1. Los auth_user_id son UUIDs de prueba y NO existen en auth.users
-- 2. Para testing real, crear usuarios mediante Supabase Auth Dashboard
-- 3. Contraseña sugerida para todos: TestRole123!
-- 4. Después de crear en Auth, actualizar role en public.users
-- 5. El trigger set_role_level se ejecutará automáticamente
