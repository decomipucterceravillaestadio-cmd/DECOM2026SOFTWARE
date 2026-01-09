# 🚀 Análisis de Preparación para Producción - Sistema DECOM
## Panel de Administración y Lógica de Negocio

**Fecha de Análisis:** Enero 9, 2026  
**Ingeniero Líder:** Análisis de Sistema Completo  
**Estado Actual:** 🟡 Fase de Desarrollo Avanzada - Requiere Optimizaciones  
**Objetivo:** Preparar sistema para producción con seguridad, rendimiento y confiabilidad empresarial

---

## 📊 RESUMEN EJECUTIVO

### Estado General del Proyecto
- ✅ **Funcionalidad Core:** Implementada (80%)
- 🟡 **Seguridad:** Requiere mejoras críticas
- 🟡 **Rendimiento:** Requiere optimizaciones
- ❌ **Monitoreo:** No implementado
- ❌ **Testing:** Cobertura insuficiente
- 🟡 **Documentación:** Parcial

### Nivel de Preparación para Producción: **65%**

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **SEGURIDAD - ALTO RIESGO** 🚨

#### 1.1 RLS (Row Level Security) No Habilitado en Tabla `users`
**Severidad:** CRÍTICA  
**Impacto:** Exposición total de datos de usuarios

**Problema actual:**
```sql
-- La tabla users tiene políticas RLS pero RLS no está habilitado
-- Esto significa que las políticas NO se están aplicando
Table `public.users` has RLS policies but RLS is not enabled on the table.
```

**Solución requerida:**
```sql
-- Habilitar RLS en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

**Referencias de advisors:**
- `policy_exists_rls_disabled` - ERROR
- `rls_disabled_in_public` - ERROR

---

#### 1.2 Vistas con SECURITY DEFINER
**Severidad:** ALTA  
**Impacto:** Las vistas ejecutan con permisos del creador, no del usuario que consulta

**Vistas afectadas:**
- `v_requests_detailed`
- `v_requests_public`
- `v_requests_urgent`

**Problema:**
Estas vistas bypassean RLS y ejecutan con permisos elevados, potencialmente exponiendo datos sensibles.

**Solución:**
```sql
-- Recrear vistas sin SECURITY DEFINER
CREATE OR REPLACE VIEW v_requests_detailed AS
  SELECT 
    r.*,
    c.name as committee_name,
    c.color_badge,
    u.full_name as created_by_name
  FROM requests r
  LEFT JOIN committees c ON r.committee_id = c.id
  LEFT JOIN users u ON r.created_by = u.id;
-- Sin agregar SECURITY DEFINER

-- O usar SECURITY INVOKER explícitamente
CREATE OR REPLACE VIEW v_requests_detailed 
WITH (security_invoker=true) AS
  SELECT ...;
```

---

#### 1.3 Políticas RLS Demasiado Permisivas
**Severidad:** ALTA  
**Impacto:** Bypass de seguridad en operaciones de inserción

**Políticas problemáticas:**
- `Public can insert history` en `request_history`
- `Public can create requests` en `requests`

**Problema actual:**
```sql
-- Estas políticas usan WITH CHECK (true)
-- Lo que permite cualquier inserción sin validación
CREATE POLICY "Public can insert history" ON request_history
  FOR INSERT WITH CHECK (true);
```

**Solución requerida:**
```sql
-- Políticas más restrictivas
CREATE POLICY "Public can create requests" ON requests
  FOR INSERT 
  WITH CHECK (
    -- Validar que el comité existe
    EXISTS (SELECT 1 FROM committees WHERE id = committee_id)
    AND
    -- Validar datos mínimos
    event_name IS NOT NULL 
    AND event_info IS NOT NULL
    AND event_date > CURRENT_DATE
  );

CREATE POLICY "Authenticated can insert history" ON request_history
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    -- Solo usuarios autenticados pueden insertar
    auth.uid() IS NOT NULL
    AND
    -- Verificar que la solicitud existe
    EXISTS (SELECT 1 FROM requests WHERE id = request_id)
  );
```

---

#### 1.4 Funciones sin `search_path` Fijo
**Severidad:** MEDIA-ALTA  
**Impacto:** Vulnerabilidad a ataques de inyección de schema

**Funciones afectadas:**
- `test_password`
- `update_requests_updated_at`
- `calculate_request_dates`
- `log_request_status_change`
- `update_users_updated_at`

**Solución:**
```sql
-- Agregar search_path a todas las funciones
CREATE OR REPLACE FUNCTION update_requests_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, pg_temp  -- AGREGAR ESTO
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

#### 1.5 Headers de Seguridad No Configurados
**Severidad:** MEDIA  
**Impacto:** Aplicación vulnerable a ataques XSS, clickjacking, etc.

**Problema:** `next.config.ts` no tiene headers de seguridad

**Solución requerida:**
```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
          }
        ],
      },
    ]
  },
  // Configuración adicional recomendada
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
```

---

#### 1.6 Protección de Contraseñas Filtradas No Habilitada
**Severidad:** MEDIA  
**Impacto:** Usuarios pueden usar contraseñas comprometidas

**Solución:** Habilitar en Dashboard de Supabase:
```
Authentication > Policies > Password Policies > 
☑️ Enable Leaked Password Protection (HaveIBeenPwned)
```

---

### 2. **RENDIMIENTO - OPTIMIZACIONES REQUERIDAS** ⚡

#### 2.1 Políticas RLS No Optimizadas (Performance)
**Severidad:** ALTA  
**Impacto:** Queries lentos a escala, re-evaluación innecesaria de `auth.uid()`

**Problema identificado:**
```
6 políticas RLS re-evalúan auth.uid() por cada fila
```

**Solución:**
```sql
-- ❌ ANTES (lento)
CREATE POLICY "DECOM admins can view all requests" ON requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE auth.uid() = auth_user_id 
      AND role = 'decom_admin'
    )
  );

-- ✅ DESPUÉS (rápido)
CREATE POLICY "DECOM admins can view all requests" ON requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE (SELECT auth.uid()) = auth_user_id  -- Envolver en SELECT
      AND role = 'decom_admin'
    )
  );
```

**Políticas a actualizar:**
1. `Comité members can view own requests`
2. `DECOM admins can view all requests`
3. `Comité members can update own non-final requests`
4. `DECOM admins can update request status`
5. `View history of accessible requests`
6. `Admins can insert history entries`

---

#### 2.2 Índices No Utilizados (Candidatos a Eliminación)
**Severidad:** BAJA-MEDIA  
**Impacto:** Overhead innecesario en escrituras

**Índices sin uso:**
- `idx_requests_committee` en `requests`
- `idx_request_history_changed_at` en `request_history`
- `idx_users_role` en `users`

**Acción recomendada:**
```sql
-- Monitorear por 2-4 semanas en producción
-- Si siguen sin uso, eliminar:
DROP INDEX IF EXISTS idx_requests_committee;
DROP INDEX IF EXISTS idx_request_history_changed_at;
DROP INDEX IF EXISTS idx_users_role;
```

**Nota:** Es posible que estos índices sean útiles una vez que aumente el tráfico. Evaluar después del lanzamiento.

---

#### 2.3 Foreign Keys Sin Índices
**Severidad:** MEDIA  
**Impacto:** JOINs lentos

**Foreign keys afectados:**
- `request_history.changed_by`
- `users.preferred_committee_id`

**Solución:**
```sql
-- Crear índices para foreign keys
CREATE INDEX IF NOT EXISTS idx_request_history_changed_by 
  ON request_history(changed_by);

CREATE INDEX IF NOT EXISTS idx_users_preferred_committee_id 
  ON users(preferred_committee_id);
```

---

#### 2.4 Múltiples Políticas Permisivas
**Severidad:** MEDIA  
**Impacto:** Ejecución de múltiples políticas por query

**Problema:** Tablas con múltiples políticas permisivas para la misma operación:
- `requests` tiene 3 políticas SELECT simultáneas
- `requests` tiene 2 políticas UPDATE simultáneas
- `request_history` tiene 2 políticas INSERT simultáneas

**Solución:**
```sql
-- Consolidar políticas usando OR
CREATE POLICY "requests_select_all" ON requests
  FOR SELECT
  USING (
    -- Comité members can view own
    (EXISTS (
      SELECT 1 FROM users 
      WHERE (SELECT auth.uid()) = auth_user_id 
      AND preferred_committee_id = requests.committee_id
    ))
    OR
    -- DECOM admins can view all
    (EXISTS (
      SELECT 1 FROM users 
      WHERE (SELECT auth.uid()) = auth_user_id 
      AND role = 'decom_admin'
    ))
    OR
    -- Public calendar (sin datos sensibles)
    (true)  -- Pero controlar en la vista de aplicación
  );

-- Eliminar las 3 políticas antiguas
DROP POLICY IF EXISTS "Comité members can view own requests" ON requests;
DROP POLICY IF EXISTS "DECOM admins can view all requests" ON requests;
DROP POLICY IF EXISTS "Public calendar view select" ON requests;
```

---

### 3. **MIDDLEWARE Y AUTENTICACIÓN** 🔐

#### 3.1 No Existe Middleware de Next.js
**Severidad:** CRÍTICA  
**Impacto:** No hay validación de sesión en rutas protegidas

**Problema:** Las rutas `/admin/*` no están protegidas a nivel de middleware

**Solución:** Crear `middleware.ts` en la raíz:

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Verificar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas protegidas que requieren autenticación
  const protectedPaths = ['/admin', '/new-request']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Redirigir a login si no está autenticado
  if (isProtectedPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Verificar que sea admin DECOM para rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin') && user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()

    if (!userData || userData.role !== 'decom_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

#### 3.2 Rate Limiting No Implementado
**Severidad:** ALTA  
**Impacto:** Vulnerable a ataques de fuerza bruta y DDoS

**Solución:** Implementar rate limiting en endpoints críticos

**Opción 1: Usar Upstash Redis (Recomendado para Vercel)**
```bash
npm install @upstash/ratelimit @upstash/redis
```

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Crear instancia de rate limiter
export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests por minuto
  analytics: true,
})

// Para endpoints de login más restrictivos
export const loginRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 intentos cada 15 min
  analytics: true,
})
```

```typescript
// app/api/auth/login/route.ts
import { loginRatelimit } from '@/app/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting por IP
  const ip = request.ip ?? '127.0.0.1'
  const { success, limit, reset, remaining } = await loginRatelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { 
        error: 'Demasiados intentos de login. Intenta de nuevo más tarde.',
        reset: new Date(reset).toISOString()
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }

  // ... resto del código de login
}
```

**Variables de entorno:**
```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

### 4. **MANEJO DE ERRORES Y LOGGING** 📝

#### 4.1 Logging Insuficiente
**Severidad:** ALTA  
**Impacto:** Difícil debugging en producción

**Problema:** Solo hay `console.error` básicos

**Solución:** Implementar logging estructurado

**Opción 1: Usar Sentry (Recomendado)**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**Opción 2: Logging estructurado con Winston**
```bash
npm install winston
```

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'decom-system' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

export default logger

// Uso en API routes
import logger from '@/lib/logger'

logger.error('Failed to fetch requests', {
  error: error.message,
  userId: user.id,
  timestamp: new Date().toISOString()
})
```

---

#### 4.2 Manejo de Errores No Estandarizado
**Severidad:** MEDIA  
**Impacto:** Respuestas de error inconsistentes

**Solución:** Crear utilidad de respuesta de error estándar

```typescript
// lib/api-response.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      },
      { status: error.statusCode }
    )
  }

  // Error inesperado
  console.error('Unexpected error:', error)
  return NextResponse.json(
    {
      success: false,
      error: {
        message: 'Error interno del servidor',
        code: 'INTERNAL_SERVER_ERROR',
      },
    },
    { status: 500 }
  )
}

// Uso
import { ApiError, errorResponse } from '@/lib/api-response'

try {
  if (!user) {
    throw new ApiError(401, 'No autorizado', 'UNAUTHORIZED')
  }
  // ...
} catch (error) {
  return errorResponse(error)
}
```

---

### 5. **VARIABLES DE ENTORNO Y CONFIGURACIÓN** ⚙️

#### 5.1 Variables de Entorno Incompletas
**Severidad:** MEDIA  
**Impacto:** Configuración insuficiente para producción

**Actualizar `.env.example`:**
```env
# ================================
# SUPABASE CONFIGURATION
# ================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ================================
# APPLICATION CONFIGURATION
# ================================
NEXT_PUBLIC_APP_URL=https://decom.ipucvillaestadio.com
NODE_ENV=production

# ================================
# SECURITY
# ================================
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://decom.ipucvillaestadio.com

# ================================
# MONITORING & LOGGING
# ================================
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# ================================
# RATE LIMITING (Upstash Redis)
# ================================
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ================================
# ANALYTICS (Optional)
# ================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=
VERCEL_ANALYTICS_ID=

# ================================
# EMAIL (Future - for notifications)
# ================================
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=decom@ipucvillaestadio.com
```

---

#### 5.2 Validación de Variables de Entorno
**Severidad:** MEDIA  
**Impacto:** Fallos silenciosos en producción

**Solución:** Crear validador de env vars

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Security
  JWT_SECRET: z.string().min(32).optional(),
  
  // Monitoring
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    throw new Error('Invalid environment variables')
  }
}

// Llamar al iniciar la app
// app/layout.tsx
validateEnv()
```

---

### 6. **TESTING Y CALIDAD** 🧪

#### 6.1 Cobertura de Tests Insuficiente
**Severidad:** ALTA  
**Impacto:** Bugs no detectados antes de producción

**Estado actual:**
- ✅ Tests E2E con Playwright (3 tests básicos)
- ❌ No hay tests unitarios
- ❌ No hay tests de integración para APIs
- ❌ No hay tests de componentes

**Acción requerida:**

**1. Agregar tests unitarios para utils/validaciones:**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/lib/validations.test.ts
import { loginSchema, requestSchema } from '@/app/lib/validations'

describe('loginSchema', () => {
  it('should validate correct email and password', () => {
    const result = loginSchema.parse({
      email: 'admin@test.com',
      password: 'password123'
    })
    expect(result.email).toBe('admin@test.com')
  })

  it('should reject invalid email', () => {
    expect(() => {
      loginSchema.parse({
        email: 'not-an-email',
        password: 'password123'
      })
    }).toThrow()
  })
})
```

**2. Tests de integración para APIs:**
```typescript
// __tests__/api/admin/requests.test.ts
import { GET } from '@/app/api/admin/requests/route'
import { NextRequest } from 'next/server'

describe('GET /api/admin/requests', () => {
  it('should return 401 when not authenticated', async () => {
    const request = new NextRequest('http://localhost:3000/api/admin/requests')
    const response = await GET(request)
    expect(response.status).toBe(401)
  })

  // Mock autenticación y probar con usuario válido
  // ...
})
```

**3. Tests de componentes críticos:**
```typescript
// __tests__/components/RequestCard.test.tsx
import { render, screen } from '@testing-library/react'
import RequestCard from '@/app/components/Dashboard/RequestCard'

describe('RequestCard', () => {
  it('should render request information', () => {
    const mockRequest = {
      id: '1',
      event_name: 'Evento de Prueba',
      status: 'Pendiente',
      // ...
    }
    
    render(<RequestCard request={mockRequest} />)
    expect(screen.getByText('Evento de Prueba')).toBeInTheDocument()
  })
})
```

**Meta de cobertura:** 70% mínimo antes de producción

---

#### 6.2 Tests E2E Limitados
**Severidad:** MEDIA  
**Impacto:** Flujos críticos no validados

**Tests E2E adicionales requeridos:**
```typescript
// tests/admin-dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'admin@test.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/admin')
  })

  test('should display statistics', async ({ page }) => {
    await expect(page.locator('text=Total Solicitudes')).toBeVisible()
  })

  test('should filter requests by status', async ({ page }) => {
    await page.click('button:has-text("Pendientes")')
    // Verificar que solo se muestran pendientes
  })

  test('should update request status', async ({ page }) => {
    await page.click('a:has-text("Ver Detalle")').first()
    await page.selectOption('select[name="status"]', 'En diseño')
    await page.click('button:has-text("Guardar")')
    await expect(page.locator('text=Estado actualizado')).toBeVisible()
  })
})

// tests/request-creation-full-flow.spec.ts
test('should create request and see it in admin panel', async ({ page }) => {
  // 1. Crear solicitud como comité
  await page.goto('/new-request')
  // Llenar formulario...
  await page.click('button:has-text("Enviar")')
  
  // 2. Login como admin
  await page.goto('/login')
  // ...
  
  // 3. Verificar que aparece la solicitud
  await expect(page.locator('text=Mi Evento de Prueba')).toBeVisible()
})
```

---

### 7. **OPTIMIZACIONES DE BASE DE DATOS** 🗄️

#### 7.1 Campos de Auditoría Incompletos
**Severidad:** BAJA-MEDIA  
**Impacto:** Trazabilidad limitada

**Recomendaciones:**
```sql
-- Agregar columnas de auditoría a tablas críticas
ALTER TABLE requests 
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);

-- Soft delete en lugar de hard delete
CREATE OR REPLACE FUNCTION soft_delete_request(request_id UUID, user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE requests 
  SET 
    deleted_at = NOW(),
    deleted_by = user_id
  WHERE id = request_id;
END;
$$;
```

---

#### 7.2 Backups y Disaster Recovery
**Severidad:** CRÍTICA  
**Impacto:** Pérdida de datos en caso de desastre

**Acciones requeridas en Supabase:**
1. ✅ Verificar que los backups automáticos están habilitados
2. ⚠️ Configurar backups adicionales con Point-in-Time Recovery (PITR)
3. ⚠️ Establecer política de retención (mínimo 7 días)
4. ⚠️ Probar proceso de restauración antes de producción

**Comandos útiles:**
```bash
# Backup manual
supabase db dump -f backup-$(date +%Y%m%d).sql

# Restaurar desde backup
supabase db reset --db-url postgresql://...
```

---

#### 7.3 Encriptación de Datos Sensibles
**Severidad:** ALTA  
**Impacto:** WhatsApp numbers almacenados en texto plano

**Problema:** Campo `contact_whatsapp` no está encriptado

**Solución:**
```sql
-- Instalar extensión pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear función para encriptar
CREATE OR REPLACE FUNCTION encrypt_whatsapp(phone_number TEXT)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(
      phone_number, 
      current_setting('app.encryption_key')
    ),
    'base64'
  );
END;
$$;

-- Función para desencriptar
CREATE OR REPLACE FUNCTION decrypt_whatsapp(encrypted_phone TEXT)
RETURNS TEXT
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_phone, 'base64'),
    current_setting('app.encryption_key')
  );
END;
$$;

-- Usar en trigger o en aplicación
```

**Variables de configuración:**
```sql
-- En Supabase Dashboard > Database > Settings > Custom Postgres Config
ALTER DATABASE postgres SET app.encryption_key TO 'your-encryption-key-32-chars-min';
```

---

### 8. **DEPLOYMENT Y CI/CD** 🚀

#### 8.1 No Existe Pipeline de CI/CD
**Severidad:** ALTA  
**Impacto:** Deployments manuales propensos a errores

**Solución:** Configurar GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npx tsc --noEmit
      
      - name: Run unit tests
        run: npm run test
      
      - name: Run E2E tests
        run: npx playwright test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

#### 8.2 Variables de Entorno en Vercel
**Acción requerida:** Configurar todas las variables en Vercel Dashboard

**Pasos:**
1. Ir a Vercel Project Settings > Environment Variables
2. Agregar todas las variables de `.env.example`
3. Configurar por entorno: Production, Preview, Development
4. **CRÍTICO:** No exponer `SUPABASE_SERVICE_ROLE_KEY` en variables con prefijo `NEXT_PUBLIC_`

---

### 9. **MONITOREO Y OBSERVABILIDAD** 📊

#### 9.1 No Existe Monitoreo en Producción
**Severidad:** CRÍTICA  
**Impacto:** No sabremos si la aplicación falla en producción

**Solución integral:**

**1. Uptime Monitoring**
- Usar BetterUptime o UptimeRobot
- Configurar checks cada 1-5 minutos
- Alertas por email/SMS/Slack

**2. Application Performance Monitoring (APM)**
```typescript
// lib/monitoring.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

export function trackEvent(action: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// Uso en componentes
trackEvent('request_created', {
  committee_id: request.committee_id,
  material_type: request.material_type
})
```

**3. Error Tracking - Sentry**
Ya mencionado en sección 4.1

**4. Database Monitoring**
- Configurar alertas en Supabase Dashboard:
  - Database CPU > 80%
  - Database Storage > 80%
  - Slow queries > 1s
  - Connection pool exhaustion

**5. Custom Health Check Endpoint**
```typescript
// app/api/health/route.ts
import { createServerClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    const supabase = await createServerClient()
    const { error } = await supabase.from('committees').select('id').limit(1)
    
    if (error) throw error

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'up',
        api: 'up'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
```

---

### 10. **DOCUMENTACIÓN Y MANTENIBILIDAD** 📚

#### 10.1 Documentación API Faltante
**Severidad:** MEDIA  
**Impacto:** Difícil para nuevos desarrolladores

**Solución:** Documentar con OpenAPI/Swagger

```yaml
# docs/openapi.yaml
openapi: 3.0.0
info:
  title: DECOM API
  version: 1.0.0
  description: API para sistema de gestión de solicitudes DECOM

paths:
  /api/admin/requests:
    get:
      summary: Obtener todas las solicitudes
      security:
        - bearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [Pendiente, En planificación, En diseño, Lista para entrega, Entregada]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Lista de solicitudes
          content:
            application/json:
              schema:
                type: object
                properties:
                  requests:
                    type: array
                    items:
                      $ref: '#/components/schemas/Request'
```

**Alternativa:** Usar herramientas como Postman o Insomnia para documentación interactiva

---

#### 10.2 README Incompleto
**Severidad:** BAJA  
**Impacto:** Onboarding lento de nuevos desarrolladores

**Actualizar README.md con:**
1. Descripción del proyecto y propósito
2. Requisitos del sistema
3. Instalación paso a paso
4. Variables de entorno explicadas
5. Comandos de desarrollo
6. Estructura de carpetas
7. Convenciones de código
8. Proceso de deployment
9. Cómo contribuir
10. Contactos y soporte

---

## 📋 PLAN DE ACCIÓN PRIORIZADO

### 🔴 FASE 1: SEGURIDAD CRÍTICA (1-2 días)
**Debe completarse ANTES de producción**

- [ ] 1.1 Habilitar RLS en tabla `users`
- [ ] 1.2 Recrear vistas sin SECURITY DEFINER
- [ ] 1.3 Actualizar políticas RLS permisivas
- [ ] 1.4 Agregar `search_path` a funciones
- [ ] 1.5 Configurar headers de seguridad en `next.config.ts`
- [ ] 3.1 Crear middleware de autenticación
- [ ] 7.3 Encriptar números de WhatsApp

**Estimado:** 12-16 horas

---

### 🟡 FASE 2: RENDIMIENTO Y ESTABILIDAD (2-3 días)

- [ ] 2.1 Optimizar políticas RLS (envolver `auth.uid()`)
- [ ] 2.2 Crear índices para foreign keys
- [ ] 2.4 Consolidar políticas permisivas múltiples
- [ ] 3.2 Implementar rate limiting (Upstash)
- [ ] 4.1 Configurar Sentry para logging
- [ ] 4.2 Estandarizar manejo de errores
- [ ] 5.1 Completar variables de entorno
- [ ] 5.2 Validar variables de entorno

**Estimado:** 16-20 horas

---

### 🟢 FASE 3: TESTING Y CALIDAD (3-4 días)

- [ ] 6.1 Escribir tests unitarios (70% cobertura mínima)
- [ ] 6.2 Ampliar tests E2E (flujos críticos)
- [ ] 8.1 Configurar CI/CD con GitHub Actions
- [ ] 9.1 Configurar monitoreo (Sentry, Uptime, APM)
- [ ] 9.5 Crear health check endpoint

**Estimado:** 24-30 horas

---

### 🔵 FASE 4: OPTIMIZACIÓN Y PULIDO (2-3 días)

- [ ] 2.2 Evaluar índices no usados (después de 2-4 semanas)
- [ ] 7.1 Implementar auditoría completa
- [ ] 7.2 Configurar backups y DR
- [ ] 8.2 Configurar variables en Vercel
- [ ] 10.1 Documentar API
- [ ] 10.2 Actualizar README completo

**Estimado:** 16-20 horas

---

### ⚪ FASE 5: POST-LANZAMIENTO (Ongoing)

- [ ] Monitorear logs y métricas
- [ ] Ajustar rate limits según uso real
- [ ] Eliminar índices no usados si aplica
- [ ] Optimizar queries lentas identificadas
- [ ] Actualizar documentación según feedback

---

## 📊 MÉTRICAS DE ÉXITO PARA PRODUCCIÓN

### Seguridad ✅
- [ ] 100% de tablas con RLS habilitado
- [ ] 0 políticas RLS permisivas sin justificación
- [ ] Headers de seguridad configurados (A+ en securityheaders.com)
- [ ] Rate limiting activo en endpoints críticos
- [ ] Datos sensibles encriptados

### Rendimiento ⚡
- [ ] Políticas RLS optimizadas (0 re-evaluaciones innecesarias)
- [ ] Índices necesarios creados
- [ ] Tiempo de respuesta API < 200ms (p95)
- [ ] Lighthouse Performance Score > 90

### Confiabilidad 🛡️
- [ ] Uptime > 99.9%
- [ ] Error rate < 0.1%
- [ ] Backups automáticos verificados
- [ ] Health checks configurados

### Testing 🧪
- [ ] Cobertura de tests > 70%
- [ ] Tests E2E para flujos críticos (5 mínimo)
- [ ] CI/CD pipeline funcional
- [ ] Todos los tests pasan en pipeline

### Observabilidad 👁️
- [ ] Logging estructurado implementado
- [ ] Monitoreo de uptime activo
- [ ] APM configurado (Sentry/New Relic)
- [ ] Alertas configuradas para eventos críticos
- [ ] Dashboard de métricas accesible

---

## 🎯 RECOMENDACIONES ADICIONALES

### 1. Gestión de Usuarios Administradores
**Actual:** Usuarios creados manualmente en Supabase  
**Recomendación:** Crear endpoint admin para gestión

```typescript
// app/api/admin/users/route.ts (Solo para super admin)
export async function POST(request: NextRequest) {
  // Crear nuevo usuario admin
  // Validar que solo super admin puede hacerlo
}
```

### 2. Sistema de Notificaciones
**Futuro:** Notificar a comités cuando cambia estado de solicitud

**Opciones:**
- Email (SendGrid, Resend, SES)
- WhatsApp Business API
- Push notifications (OneSignal)
- SMS (Twilio)

### 3. Internacionalización (i18n)
**Actual:** Solo español  
**Futuro:** Preparar para múltiples idiomas si se expande

```bash
npm install next-intl
```

### 4. Modo Oscuro
**Recomendación:** Implementar para mejorar UX

```typescript
// Usar next-themes
npm install next-themes
```

### 5. Caché y CDN
**Optimización:** Configurar caché apropiado

```typescript
// next.config.ts
export default {
  images: {
    domains: ['your-supabase-url.supabase.co'],
    unoptimized: false,
  },
  // ... otros configs
}
```

**Vercel Edge Config:** Para datos que cambian poco (comités, configuraciones)

---

## 📈 ROADMAP POST-PRODUCCIÓN

### Semana 1-2: Estabilización
- Monitorear errores y logs intensivamente
- Hot fixes para issues críticos
- Ajustar rate limits según tráfico real

### Mes 1: Optimización
- Analizar queries lentas
- Optimizar componentes con React Profiler
- Implementar caché estratégico

### Mes 2-3: Features Faltantes
- Sistema de notificaciones
- Dashboard de estadísticas avanzado
- Exportación de reportes (PDF/Excel)
- Búsqueda avanzada de solicitudes

### Mes 4+: Escalabilidad
- Evaluar necesidad de microservicios
- Implementar cola de trabajos (BullMQ, Inngest)
- Considerar GraphQL si complejidad aumenta

---

## 🔗 RECURSOS Y DOCUMENTACIÓN

### Herramientas Recomendadas
- **Monitoreo:** Sentry, BetterUptime
- **Analytics:** Google Analytics, Vercel Analytics
- **Rate Limiting:** Upstash Redis
- **Email:** Resend, SendGrid
- **Testing:** Jest, Playwright, Vitest
- **CI/CD:** GitHub Actions, Vercel

### Documentación de Referencia
- [Next.js Production Checklist](https://nextjs.org/docs/deployment)
- [Supabase Production Best Practices](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel Security Best Practices](https://vercel.com/docs/security/security-headers)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## ✅ CHECKLIST FINAL PRE-PRODUCCIÓN

### Seguridad
- [ ] RLS habilitado en todas las tablas públicas
- [ ] Políticas RLS revisadas y sin permisividad excesiva
- [ ] Headers de seguridad configurados
- [ ] Middleware de autenticación implementado
- [ ] Rate limiting activo
- [ ] Variables de entorno seguras (sin leaks)
- [ ] Datos sensibles encriptados
- [ ] HTTPS forzado

### Rendimiento
- [ ] Políticas RLS optimizadas
- [ ] Índices apropiados creados
- [ ] Imágenes optimizadas
- [ ] Code splitting configurado
- [ ] Lighthouse score > 90

### Testing
- [ ] Tests unitarios con 70%+ cobertura
- [ ] Tests E2E para flujos críticos
- [ ] CI/CD pipeline funcional
- [ ] Tests pasando en todos los entornos

### Monitoreo
- [ ] Error tracking (Sentry) configurado
- [ ] Uptime monitoring activo
- [ ] APM configurado
- [ ] Alertas configuradas
- [ ] Health check endpoint

### Base de Datos
- [ ] Migraciones aplicadas correctamente
- [ ] Backups automáticos verificados
- [ ] Plan de disaster recovery documentado
- [ ] Políticas de retención definidas

### Documentación
- [ ] README actualizado
- [ ] API documentada
- [ ] Variables de entorno documentadas
- [ ] Runbook de operaciones creado
- [ ] Contactos de soporte definidos

### Deployment
- [ ] Variables de entorno en Vercel
- [ ] Dominio personalizado configurado
- [ ] SSL/TLS activo
- [ ] CDN configurado
- [ ] Rollback plan documentado

---

## 📞 SOPORTE Y CONTACTO

**Ingeniero Principal:** [Tu Nombre]  
**Email:** [tu-email]  
**Slack/Discord:** [canal]  

**Horas de soporte:**
- Lunes a Viernes: 8am - 6pm COT
- Urgencias: [número de emergencia]

---

## 📄 CONCLUSIÓN

El sistema DECOM tiene una base sólida con **80% de funcionalidad core implementada**. Sin embargo, requiere **trabajo crítico en seguridad y observabilidad** antes de estar listo para producción.

### Tiempo estimado total para producción: **8-12 días** (60-90 horas)

**Distribución:**
- Seguridad crítica: 2 días
- Rendimiento: 3 días
- Testing: 4 días
- Optimización: 3 días

### Inversión recomendada:
- Herramientas de monitoreo: $50-100/mes
- Upstash Redis: $0-10/mes (tier gratuito suficiente inicialmente)
- Sentry: $0/mes (tier gratuito para proyectos pequeños)
- **Total mensual:** ~$50-110

**Prioridad absoluta antes del lanzamiento:**
1. ✅ Habilitar RLS en tabla `users`
2. ✅ Crear middleware de autenticación
3. ✅ Configurar headers de seguridad
4. ✅ Implementar logging/monitoreo básico
5. ✅ Tests para flujos críticos

---

**Documento generado:** Enero 9, 2026  
**Versión:** 1.0  
**Próxima revisión:** Después de implementar Fase 1 y 2

