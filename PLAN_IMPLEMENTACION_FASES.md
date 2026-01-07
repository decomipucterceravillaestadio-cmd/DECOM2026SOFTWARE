# Plan de Implementación por Fases - Sistema DECOM
**Proyecto**: Sistema de Gestión de Solicitudes de Comunicación - IPUC Villa Estadio  
**Fecha de creación**: Enero 6, 2026  
**Versión**: 1.0  
**Stack**: Next.js 16 + React 19 + TypeScript 5 + Supabase + Tailwind CSS 4

---

## 📋 Resumen Ejecutivo

Este documento define el plan de implementación completo del Sistema DECOM, organizado en **5 fases incrementales** con tareas específicas para dos roles principales:

- **👨‍💻 Backend Developer**: Supabase, API Routes, autenticación, base de datos
- **🎨 Frontend Developer**: Componentes UI, formularios, vistas, integración

Cada fase es **independiente y desplegable**, siguiendo las mejores prácticas de Next.js App Router, Supabase SSR Auth, y desarrollo ágil.

---

## 📊 Estado Actual del Proyecto

### ✅ Completado
- ✅ Estructura base de Next.js 16 con App Router
- ✅ Configuración de Tailwind CSS 4 con paleta IPUC
- ✅ Base de datos Supabase creada (tablas: `committees`, `users`, `requests`, `request_history`)
- ✅ Migración inicial aplicada: `20260106193557_001_create_decom_schema`
- ✅ Componentes UI base: `Button`, `Card`, `Badge`, `Skeleton`
- ✅ Layout principal con navegación
- ✅ Pantalla de Login con integración Auth funcional
- ✅ Dashboard placeholder (sin datos reales)
- ✅ Utilidades: `dateUtils.ts`, constantes
- ✅ **FASE 1 COMPLETADA**: Autenticación Supabase SSR
  - ✅ Supabase Client (SSR) configurado
  - ✅ Middleware de autenticación
  - ✅ API Routes: POST /api/auth/login, POST /api/auth/logout
  - ✅ Admin Client con service_role key
  - ✅ RLS policies actualizadas
  - ✅ LoginForm integrado con validaciones

### 🚧 Pendiente
- ⏳ AuthProvider Context (T1.7)
- ⏳ Botón Logout en Layout (T1.8)
- ⏳ API Routes para solicitudes
- ⏳ Formulario de nueva solicitud (2 pasos)
- ⏳ Panel DECOM con filtros y calendario
- ⏳ Calendario público sin autenticación
- ⏳ Sistema de gestión de estados
- ⏳ Integración WhatsApp
- ⏳ Testing e2e

---

## 🎯 Arquitectura y Mejores Prácticas

### Principios de Diseño
1. **Mobile-first**: Diseño adaptado para 375px mínimo
2. **Server Components por defecto**: Client Components solo cuando sea necesario
3. **Type-safe**: TypeScript estricto en todo el código
4. **RLS (Row-Level Security)**: Seguridad a nivel de base de datos
5. **No eliminar datos**: Auditoría completa con `request_history`

### Estructura de Carpetas (Next.js App Router)
```
app/
├── (auth)/              # Rutas de autenticación
│   ├── login/
│   └── layout.tsx
├── (public)/            # Rutas públicas sin auth
│   ├── calendar/
│   └── layout.tsx
├── dashboard/           # Dashboard comités
├── admin/               # Panel DECOM
│   ├── dashboard/
│   ├── requests/
│   └── calendar/
├── api/                 # API Routes
│   ├── requests/
│   ├── committees/
│   └── public/
├── components/          # Componentes compartidos
│   ├── Auth/
│   ├── Dashboard/
│   ├── Forms/
│   ├── Layout/
│   └── UI/
├── lib/                 # Utilidades y configuración
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── utils/
│   └── types/
└── types/               # TypeScript types
```

### Convenciones de Código
- **Nombres de archivos**: kebab-case para páginas, PascalCase para componentes
- **Componentes Server**: Por defecto, sin directiva
- **Componentes Client**: Usar `"use client"` solo cuando sea necesario
- **Validación**: Zod para esquemas, validación en cliente y servidor
- **Estilos**: Tailwind CSS con clases personalizadas en `globals.css`

### 🎨 Sistema de Componentes UI Existentes

#### Componentes Base Disponibles
**Button**: Componente flexible con variantes y tamaños
```tsx
<Button variant="primary" size="lg" fullWidth>Texto</Button>
<Button variant="outline" size="sm">Secundario</Button>
```
- **Variantes**: `primary`, `secondary`, `outline`, `ghost`
- **Tamaños**: `sm`, `md`, `lg`
- **Opciones**: `fullWidth`, gradientes IPUC automáticos

**Card**: Contenedor con padding y efectos
```tsx
<Card padding="lg" hover interactive>Contenido</Card>
```
- **Padding**: `sm`, `md`, `lg`
- **Efectos**: `hover`, `interactive`

**Badge**: Estados de solicitud con colores IPUC
```tsx
<Badge variant="pending">Pendiente</Badge>
<Badge variant="ready">Lista para entrega</Badge>
```
- **Variantes**: `pending`, `planning`, `design`, `ready`, `delivered`
- **Tamaños**: `sm`, `md`, `lg`

**Skeleton**: Estados de carga
```tsx
<Skeleton height={20} width="100%" />
```

#### Layout y Navegación
**Layout**: Estructura consistente con header/footer
```tsx
<Layout title="Mi Página" showBackButton rightElement={<Button>Acción</Button>}>
  Contenido principal
</Layout>
```

#### Patrones de Diseño UI
1. **Cards con borde superior coloreado**: Para destacar información importante
2. **Gradientes IPUC**: `#16233B` a `#15539C` para headers, `#F49E2C` para acentos
3. **Espaciado consistente**: `space-y-6` entre secciones, `gap-3` entre elementos
4. **Sombras sutiles**: `shadow-card` para cards, `shadow-lg` para elementos destacados
5. **Border radius**: `rounded-lg` (8px) para elementos, `rounded-full` para badges
6. **Tipografía**: `font-bold` para títulos, `font-semibold` para botones y labels

#### Mejores Prácticas Frontend
1. **Reutilizar componentes existentes**: Todos los nuevos componentes deben usar Button, Card, Badge, Skeleton
2. **Props consistentes**: Seguir patrones de `variant`, `size`, `className` extensible
3. **Responsive design**: Usar clases Tailwind `sm:`, `md:`, `lg:` para breakpoints
4. **Loading states**: Implementar skeletons en todas las páginas con data fetching
5. **Error handling**: Mostrar errores de API de forma amigable con retry options
6. **Accessibility**: Labels en inputs, focus states, contrast suficiente
7. **Performance**: Lazy loading para componentes pesados, optimización de imágenes

---

## 📅 FASE 1: Configuración de Autenticación y Supabase ✅ COMPLETADA
**Objetivo**: Implementar autenticación completa con Supabase, configurar clientes para Server/Client Components

### 🔧 Backend Tasks (Backend Developer)

#### T1.1: Configurar Supabase Client para SSR ✅
**Estimación**: 3 horas  
**Prioridad**: P0 (Bloqueante)  
**Archivo**: `app/lib/supabase/client.ts`, `app/lib/supabase/server.ts`
**Estado**: ✅ COMPLETADO

**Descripción**:
- Crear función `createClient()` para Client Components usando `@supabase/ssr`
- Crear función `createServerClient()` para Server Components
- Configurar cookies handler para Next.js App Router
- Agregar variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Referencias**:
- [Supabase SSR Auth with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js App Router Authentication](https://nextjs.org/docs/app/building-your-application/authentication)

**Criterios de aceptación**:
- [x] Archivo `client.ts` exporta `createClient()` funcional
- [x] Archivo `server.ts` exporta `createServerClient()` funcional
- [x] Variables de entorno configuradas en `.env.local`
- [x] No errores de TypeScript

**Código base**:
```typescript
// app/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

#### T1.2: Implementar Middleware de Autenticación ✅
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `middleware.ts`
**Estado**: ✅ COMPLETADO

**Descripción**:
- Crear middleware para refrescar sesión en cada request
- Proteger rutas `/dashboard/*` y `/admin/*`
- Redirigir no autenticados a `/login`
- Redirigir autenticados desde `/login` a su dashboard

**Referencias**:
- [Supabase Auth Middleware](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=environment&environment=middleware)

**Criterios de aceptación**:
- [x] Middleware actualiza sesión automáticamente
- [x] Rutas protegidas redirigen correctamente
- [x] No loop de redirección

---
 ✅
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `app/api/auth/login/route.ts`
**Estado**: ✅ COMPLETADO
**Archivo**: `app/api/auth/login/route.ts`

**Descripción**:
- Endpoint para login con email + password
- Validar credenciales con Supabase Auth
- Verificar que usuario existe en tabla `users` con rol `decom_admin`
- Retornar session y user data

**Validaciones**:
- Email válido (Zod schema)
- Password no vacío
- Usuario debe estar en tabla `users` y `is_active = true`

**Criterios de aceptación**:
- [x] Endpoint responde 200 con session válida
- [x] Endpoint responde 401 si credenciales inválidas
- [x] Solo usuarios con rol `decom_admin` pueden loguear
- [x] Errores devuelven mensajes descriptivos

---
 ✅
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/api/auth/logout/route.ts`
**Estado**: ✅ COMPLETADO
**Archivo**: `app/api/auth/logout/route.ts`

**Descripción**:
- Endpoint para cerrar sesión
- Invalidar session en Supabase
- Limpiar cookies

**Criterios de aceptación**:
- [x] Endpoint responde 200
- [x] Session invalidada correctamente
- [x] Cookies eliminadas

--- ✅
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/types/auth.ts`
**Estado**: ✅ COMPLETADO
**Prioridad**: P1  
**Archivo**: `app/types/auth.ts`

**Descripción**:
- Definir interfaces para User, Session, AuthResponse
- Usar tipos generados de Supabase cuando sea posible

**Criterios de aceptación**:
- [x] Tipos exportados y reutilizables
- [x] Compatible con tipos de Supabase

---
 ✅
**Estimación**: 3 horas  
**Prioridad**: P0 (Bloqueante)  
**Archivo**: `app/components/Auth/LoginForm.tsx`
**Estado**: ✅ COMPLETADO
**Estimación**: 3 horas  
**Prioridad**: P0 (Bloqueante)  
**Archivo**: `app/components/Auth/LoginForm.tsx`

**Dependencias**: T1.1, T1.3

**Descripción**:
- Conectar formulario existente con `POST /api/auth/login`
- Agregar validación con React Hook Form + Zod
- Manejar estados: loading, error, success
- Redirigir a `/admin/dashboard` después de login exitoso

**Validaciones**:
- Email: formato válido
- Password: mínimo 6 caracteres

**Criterios de aceptación**:
- [x] Formulario funciona con API
- [x] Errores se muestran en UI
- [x] Loading state visible
- [x] Redirección automática funcional

**Código referencia**:
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
})
```

**Implementación específica**:
- Reutilizar `Button` existente con `variant="primary"` y `fullWidth`
- Mantener diseño actual con gradiente IPUC
- Agregar estado de error con `text-red-600` bajo inputs
- Usar `isLoading` para deshabilitar botón y mostrar spinner
 ⏸️
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: `app/components/Auth/AuthProvider.tsx`
**Estado**: ⏸️ PENDIENTE (Opcional para Fase 2)
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: `app/components/Auth/AuthProvider.tsx`

**Descripción**:
- Context para manejar estado de autenticación global
- Hook `useAuth()` para acceder a user, session, logout
- Verificar sesión al cargar app

**Criterios de aceptación**:
- [x] Context funcional en toda la app
- [x] Hook `useAuth()` disponible
- [x] Estado sincronizado con Supabase

**Implementación específica**:
- Usar `createClient()` de `app/lib/supabase/client.ts`
- Proporcionar `user`, `session`, `logout()` function
- Integrar con `app/layout.tsx` para ⏸️
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/components/Layout/index.tsx`
**Estado**: ⏸️ PENDIENTE (Opcional para Fase 2)
#### T1.8: Botón de Logout en Layout
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/components/Layout/index.tsx`

**Dependencias**: T1.4, T1.7

**Descripción**:
- Agregar botón de cerrar sesión en header/menú
- Llamar a `POST /api/auth/logout`
- Redirigir a `/login`

**Criterios de aceptación**:
- [x] Botón visible en layout autenticado
- [x] Logout funcional
- [x] Redirección correcta

**Implementación específica**:
- Usar `Button` con `variant="ghost"` para logout
- Posicionar en `rightElement` del Layout
- Usar `useAuth()` hook para logout function
 ⏸️
**Estimación**: 2 horas  
**Prioridad**: P2  
**Archivo**: `tests/e2e/auth.spec.ts`
**Estado**: ⏸️ POSPUESTO (Fase 5)

#### T1.9: Tests E2E - Login Flow
**Estimación**: 2 horas  
**Prioridad**: P2  
**Archivo**: `tests/e2e/auth.spec.ts`

**Descripción**:
- Test de login exitoso
- Test de login con credenciales inválidas
- Test de logout
- Test de redirección de rutas protegidas

**Herramienta**: Playwright

---

**Total Fase 1**: ~18 horas (Backend: 9h, Frontend: 7h, Testing: 2h)

---

## 📅 FASE 2: Formulario de Nueva Solicitud (Semana 2)
**Objetivo**: Implementar formulario público de 2 pasos para que comités envíen solicitudes

### 🔧 Backend Tasks

#### T2.1: API Route - POST /api/requests
**Estimación**: 4 horas  
**Prioridad**: P0  
**Archivo**: `app/api/requests/route.ts`

**Descripción**:
- Endpoint para crear solicitud (sin autenticación)
- Validar datos con Zod
- Calcular fechas automáticas (planning_start_date, delivery_date, priority_score)
- Insertar en tabla `requests` con `created_by = NULL` (público)
- Crear entrada en `request_history` con estado inicial

**Validaciones**:
- `committee_id`: UUID válido, existe en tabla `committees`
- `event_name`: 5-200 caracteres
- `event_info`: 5-500 caracteres
- `event_date`: Debe ser fecha futura (> today)
- `material_type`: Enum ['flyer', 'banner', 'video', 'redes_sociales', 'otro']
- `contact_whatsapp`: Regex `^\+?57\d{10}$`
- `bible_verse_text`: Requerido si `include_bible_verse = true`

**Criterios de aceptación**:
- [x] Endpoint responde 201 con solicitud creada
- [x] Fechas calculadas correctamente
- [x] Validaciones funcionan
- [x] Errores retornan 400 con mensajes descriptivos

**Código base**:
```typescript
import { z } from 'zod'

const requestSchema = z.object({
  committee_id: z.string().uuid(),
  event_name: z.string().min(5).max(200),
  event_info: z.string().min(5).max(500),
  event_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'La fecha debe ser futura'
  }),
  material_type: z.enum(['flyer', 'banner', 'video', 'redes_sociales', 'otro']),
  contact_whatsapp: z.string().regex(/^\+?57\d{10}$/),
  include_bible_verse: z.boolean(),
  bible_verse_text: z.string().optional()
}).refine((data) => {
  if (data.include_bible_verse) {
    return data.bible_verse_text && data.bible_verse_text.length > 0
  }
  return true
}, {
  message: 'La cita bíblica es requerida',
  path: ['bible_verse_text']
})
```

---

#### T2.2: API Route - GET /api/committees
**Estimación**: 1 hora  
**Prioridad**: P0  
**Archivo**: `app/api/committees/route.ts`

**Descripción**:
- Endpoint público para listar comités disponibles
- Sin autenticación requerida
- Retornar: id, name, description, color_badge

**Criterios de aceptación**:
- [x] Endpoint responde 200 con lista de comités
- [x] Datos correctos desde tabla `committees`

---

#### T2.3: Crear Función de Cálculo de Fechas
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `app/lib/utils/dateCalculations.ts`

**Descripción**:
- Función `calculatePlanningDate(eventDate: Date): Date` → event_date - 7 días
- Función `calculateDeliveryDate(eventDate: Date): Date` → event_date - 2 días
- Función `calculatePriorityScore(eventDate: Date): number` → 1-10 según proximidad

**Criterios de aceptación**:
- [x] Funciones exportadas y testeadas
- [x] Usar `date-fns` para manipulación de fechas

**Código base**:
```typescript
import { subDays, differenceInDays } from 'date-fns'

export function calculatePlanningDate(eventDate: Date): Date {
  return subDays(eventDate, 7)
}

export function calculateDeliveryDate(eventDate: Date): Date {
  return subDays(eventDate, 2)
}

export function calculatePriorityScore(eventDate: Date): number {
  const daysUntilEvent = differenceInDays(eventDate, new Date())
  if (daysUntilEvent > 7) return 1
  if (daysUntilEvent > 2) return 5
  return 10
}
```

---

### 🎨 Frontend Tasks

### 🎨 Frontend Tasks

#### T2.4: Componente FormStep1 (Información del Evento)
**Estimación**: 4 horas  
**Prioridad**: P0  
**Archivo**: `app/components/Forms/RequestForm/FormStep1.tsx`

**Descripción**:
- Formulario con React Hook Form + Zod
- Campos: committee_id (select), event_name, event_info (textarea), event_date (date picker)
- Mostrar fechas calculadas automáticamente en cards destacados
- Botón "Continuar" para siguiente paso

**Diseño**: Según prompts 3 de UI.md

**Criterios de aceptación**:
- [x] Validaciones en tiempo real
- [x] Fechas calculadas visibles
- [x] UI responsive mobile-first
- [x] Paleta IPUC aplicada

**Implementación específica**:
- Usar `Card` con `padding="lg"` para contenedor principal
- Select para comité: opciones desde `GET /api/committees`
- Date picker: input tipo `date` con validación futura
- Cards de fechas calculadas: `Card` con borde superior `#F49E2C` de 4px
- Botón "Continuar": `Button` con `variant="primary"` y `fullWidth`
- Labels en `font-semibold` con `text-decom-text-dark`

---

#### T2.5: Componente FormStep2 (Detalles del Material)
**Estimación**: 4 horas  
**Prioridad**: P0  
**Archivo**: `app/components/Forms/RequestForm/FormStep2.tsx`

**Descripción**:
- Campos: material_type (chips), contact_whatsapp, include_bible_verse (toggle), bible_verse_text (textarea condicional)
- Botones: "Atrás", "Enviar Solicitud"
- Enviar a `POST /api/requests`

**Diseño**: Según prompt 4 de UI.md

**Criterios de aceptación**:
- [x] Chips seleccionables funcionales
- [x] Toggle muestra/oculta campo condicional
- [x] Envío a API funcional
- [x] Loading state durante envío

**Implementación específica**:
- Chips de material: botones con `variant="outline"` cuando no seleccionado, `variant="secondary"` cuando activo
- Toggle cita bíblica: switch custom con colores IPUC
- Campo WhatsApp: input con prefijo `+57` y formato automático
- Botones: "Atrás" (`variant="outline"`), "Enviar" (`variant="primary"`, `fullWidth`)
- Loading state: deshabilitar botones y mostrar spinner

---

#### T2.6: Página /new-request
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `app/new-request/page.tsx`

**Dependencias**: T2.4, T2.5

**Descripción**:
- Página pública (sin autenticación)
- Integrar FormStep1 y FormStep2 con state management
- Indicador de progreso (Paso 1 de 2, Paso 2 de 2)
- Redirigir a `/confirmation` después de envío exitoso

**Criterios de aceptación**:
- [x] Navegación entre pasos funcional
- [x] Datos persisten entre pasos
- [x] Redirección correcta

**Implementación específica**:
- Usar `Layout` con `title="Nueva Solicitud"`
- Indicador de progreso: barra horizontal con gradiente IPUC
- State management: `useState` para `currentStep` y `formData`
- Validación por paso antes de continuar

---

#### T2.7: Página /confirmation
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: `app/confirmation/page.tsx`

**Descripción**:
- Pantalla de confirmación exitosa
- Mostrar resumen: event_name, event_date, delivery_date, número de solicitud
- Botones: "Ver Calendario Público", "Crear Nueva Solicitud"

**Diseño**: Según prompt 8 de UI.md

**Criterios de aceptación**:
- [x] UI celebratoria con icono de éxito
- [x] Datos de resumen correctos
- [x] Botones funcionales

**Implementación específica**:
- Icono de check: círculo grande con gradiente IPUC y check blanco
- Card de resumen: `Card` con borde superior `#F49E2C`
- Botones: primario para "Ver Calendario", outline para "Crear Nueva"
- Layout minimalista sin header navigation

---

### 📝 Testing Tasks

#### T2.8: Tests E2E - Formulario de Solicitud
**Estimación**: 3 horas  
**Prioridad**: P2  
**Archivo**: `tests/e2e/request-form.spec.ts`

**Descripción**:
- Test de flujo completo (2 pasos)
- Test de validaciones
- Test de fechas calculadas
- Test de campo condicional (cita bíblica)

---

**Total Fase 2**: ~22 horas (Backend: 7h, Frontend: 12h, Testing: 3h)

---

## 📅 FASE 3: Panel DECOM - Gestión de Solicitudes (Semana 3)
**Objetivo**: Implementar panel administrativo para DECOM con vista lista, detalle y cambio de estados

### 🔧 Backend Tasks

#### T3.1: API Route - GET /api/admin/requests
**Estimación**: 3 horas  
**Prioridad**: P0  
**Archivo**: `app/api/admin/requests/route.ts`

**Descripción**:
- Endpoint protegido (solo DECOM admins)
- Listar todas las solicitudes con JOIN a `committees` y `users`
- Soportar query params: `status`, `committee_id`, `priority`, `date_from`, `date_to`
- Ordenar por `priority_score DESC`, `created_at DESC`
- Paginación: `limit`, `offset`

**Criterios de aceptación**:
- [x] Solo usuarios autenticados con rol `decom_admin`
- [x] Filtros funcionales
- [x] Retorna datos completos (incluyendo nombre de comité)
- [x] Paginación funcional

---

#### T3.2: API Route - GET /api/admin/requests/[id]
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `app/api/admin/requests/[id]/route.ts`

**Descripción**:
- Endpoint protegido
- Obtener detalle completo de solicitud por ID
- Incluir historial de cambios (`request_history`)

**Criterios de aceptación**:
- [x] Retorna solicitud con todos los campos
- [x] Incluye historial ordenado por `changed_at DESC`
- [x] Retorna 404 si no existe

---

#### T3.3: API Route - PATCH /api/admin/requests/[id]
**Estimación**: 3 horas  
**Prioridad**: P0  
**Archivo**: `app/api/admin/requests/[id]/route.ts`

**Descripción**:
- Endpoint protegido
- Actualizar estado de solicitud
- Validar transiciones de estado
- Trigger automático crea entrada en `request_history`

**Validaciones**:
- Solo cambiar campo `status`
- Estados válidos: Pendiente, En planificación, En diseño, Lista para entrega, Entregada

**Criterios de aceptación**:
- [x] Estado actualizado correctamente
- [x] Historial registrado automáticamente
- [x] Retorna solicitud actualizada

---

#### T3.4: API Route - GET /api/admin/stats
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: `app/api/admin/stats/route.ts`

**Descripción**:
- Endpoint protegido
- Retornar estadísticas agregadas:
  - Total solicitudes por estado
  - Total por tipo de material
  - Total por comité
  - Solicitudes urgentes (priority_score >= 8)

**Criterios de aceptación**:
- [x] Datos agregados correctos
- [x] Query optimizada (usar COUNT, GROUP BY)

---

### 🎨 Frontend Tasks

#### T3.5: Página /admin/dashboard
**Estimación**: 4 horas  
**Prioridad**: P0  
**Archivo**: `app/admin/dashboard/page.tsx`

**Dependencias**: T3.1, T3.4

**Descripción**:
- Vista lista de solicitudes con filtros
- Chips de filtro rápido: Todas, Pendientes, En proceso, Urgentes
- Cards de solicitud según diseño

**Diseño**: Según prompt 5 de UI.md

**Criterios de aceptación**:
- [x] Lista renderiza correctamente
- [x] Filtros funcionales
- [x] Badges de prioridad con colores correctos
- [x] Rutas protegidas (solo DECOM)

**Implementación específica**:
- Usar `Layout` con gradiente header IPUC
- Chips de filtro: `Button` con `variant="outline"` cuando inactivo, `variant="secondary"` cuando activo
- Lista de `RequestCard` con `space-y-3`
- Loading: `Skeleton` para cada card mientras carga
- Error handling: mostrar mensaje de error con retry button

---

#### T3.6: Componente RequestCard
**Estimación**: 3 horas  
**Prioridad**: P0  
**Archivo**: `app/components/Dashboard/RequestCard.tsx`

**Descripción**:
- Card individual de solicitud
- Props: request (objeto completo)
- Mostrar: comité, evento, fecha, estado, tipo material, prioridad, días restantes
- Click redirige a `/admin/requests/[id]`

**Criterios de aceptación**:
- [x] UI según diseño IPUC
- [x] Badge de prioridad dinámico
- [x] Responsive

**Implementación específica**:
- Usar `Card` con `hover` e `interactive`
- Borde superior de 4px según prioridad: `#F49E2C` para alta, `#15539C` para media, `#4CAF50` para baja
- `Badge` para estado con variante correspondiente
- Iconos de Material Design para tipo de material
- Días restantes: badge con color condicional (< 2 días: warning)

---

#### T3.7: Página /admin/requests/[id]
**Estimación**: 5 horas  
**Prioridad**: P0  
**Archivo**: `app/admin/requests/[id]/page.tsx`

**Dependencias**: T3.2, T3.3

**Descripción**:
- Vista detalle completa de solicitud
- Cards: Información del Evento, Timeline, Cita Bíblica (condicional)
- Selector de estado (dropdown)
- Botón "Guardar Cambios" llama a `PATCH /api/admin/requests/[id]`
- Botón WhatsApp (visible si estado = "Lista para entrega")

**Diseño**: Según prompt 7 de UI.md

**Criterios de aceptación**:
- [x] Datos completos visibles
- [x] Cambio de estado funcional
- [x] Botón WhatsApp abre chat correctamente
- [x] Timeline visual implementada

**Implementación específica**:
- Header con gradiente IPUC y badge de estado grande
- Cards separadas con `space-y-4`
- `StatusSelector` para cambio de estado
- Botón WhatsApp: `Button` verde (#25D366) con icono
- Timeline: `TimelineView` con línea vertical y círculos

---

#### T3.8: Componente TimelineView
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: `app/components/Dashboard/TimelineView.tsx`

**Descripción**:
- Línea de tiempo visual con hitos:
  - Solicitud creada
  - Inicio planificación
  - Entrega sugerida
  - Fecha evento
- Indicadores de completado/pendiente

**Criterios de aceptación**:
- [x] UI clara y visual
- [x] Estados dinámicos según fechas

**Implementación específica**:
- Línea vertical continua de 2px en `#F49E2C`
- Círculos de 12px: completado (`#4CAF50`), pendiente (`#F49E2C`), futuro (gris)
- Texto con fechas y descripciones
- Iconos para cada hito

---

#### T3.9: Componente StatusSelector
**Estimación**: 2 horas  
**Prioridad**: P0  
**Archivo**: `app/components/Dashboard/StatusSelector.tsx`

**Descripción**:
- Dropdown personalizado con estados
- Props: currentStatus, onChange
- Opciones con iconos

**Criterios de aceptación**:
- [x] Dropdown funcional
- [x] UI según diseño IPUC

**Implementación específica**:
- Select custom con opciones de estado
- Iconos para cada estado (Material Design)
- Estilo consistente con otros form controls
- Hover states y focus rings

---

### 📝 Testing Tasks

#### T3.10: Tests E2E - Panel DECOM
**Estimación**: 3 horas  
**Prioridad**: P2  
**Archivo**: `tests/e2e/admin-dashboard.spec.ts`

**Descripción**:
- Test de acceso protegido
- Test de filtros
- Test de cambio de estado
- Test de botón WhatsApp

---

**Total Fase 3**: ~29 horas (Backend: 10h, Frontend: 16h, Testing: 3h)

---

## 📅 FASE 4: Vista Calendario y Calendario Público (Semana 4)
**Objetivo**: Implementar calendario mensual para DECOM y calendario público para comités

### 🔧 Backend Tasks

#### T4.1: API Route - GET /api/admin/calendar
**Estimación**: 3 horas  
**Prioridad**: P1  
**Archivo**: `app/api/admin/calendar/route.ts`

**Descripción**:
- Endpoint protegido (solo DECOM)
- Retornar solicitudes agrupadas por fecha de evento
- Query params: `month`, `year`
- Formato optimizado para calendario

**Criterios de aceptación**:
- [x] Datos agrupados por fecha
- [x] Incluye counts por día
- [x] Filtro por mes/año funcional

---

#### T4.2: API Route - GET /api/public/calendar
**Estimación**: 3 horas  
**Prioridad**: P1  
**Archivo**: `app/api/public/calendar/route.ts`

**Descripción**:
- Endpoint público (sin autenticación)
- Retornar vista pública de solicitudes (sin datos sensibles)
- Campos permitidos: event_date, material_type, status, priority_score, created_at
- Campos prohibidos: committee_id, event_name, event_info, contact_whatsapp, bible_verse_text

**Criterios de aceptación**:
- [x] Sin autenticación requerida
- [x] Solo datos públicos expuestos
- [x] Query optimizada

**Código base**:
```typescript
// Usar vista v_requests_public de la base de datos
const { data, error } = await supabase
  .from('v_requests_public')
  .select('*')
  .gte('event_date', startDate)
  .lte('event_date', endDate)
  .order('event_date', { ascending: true })
```

---

#### T4.3: Crear Vista v_requests_public en DB
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: Nueva migración Supabase

**Descripción**:
- Crear vista SQL que expone solo campos públicos
- Sin JOIN a `users` o `committees`

**SQL**:
```sql
CREATE OR REPLACE VIEW v_requests_public AS
SELECT 
  id,
  event_date,
  material_type,
  status,
  priority_score,
  planning_start_date,
  delivery_date,
  created_at
FROM requests
WHERE status != 'Entregada'
ORDER BY event_date ASC;
```

---

### 🎨 Frontend Tasks

#### T4.4: Página /admin/calendar
**Estimación**: 6 horas  
**Prioridad**: P1  
**Archivo**: `app/admin/calendar/page.tsx`

**Dependencias**: T4.1

**Descripción**:
- Vista calendario mensual completo
- Selector de mes/año con navegación
- Dots indicadores de eventos por día
- Panel inferior deslizable con eventos del día seleccionado

**Diseño**: Según prompt 6 de UI.md

**Criterios de aceptación**:
- [x] Calendario renderiza correctamente
- [x] Navegación mes/año funcional
- [x] Dots de colores según estado
- [x] Panel de detalle del día funcional

---

#### T4.5: Componente CalendarGrid
**Estimación**: 4 horas  
**Prioridad**: P1  
**Archivo**: `app/components/Calendar/CalendarGrid.tsx`

**Descripción**:
- Grid de días del mes
- Props: selectedDate, events, onDaySelect
- Renderizar dots según eventos del día

**Criterios de aceptación**:
- [x] Grid correcto (7 columnas)
- [x] Día actual destacado
- [x] Eventos visibles como dots

---

#### T4.6: Página /calendar (Público)
**Estimación**: 5 horas  
**Prioridad**: P1  
**Archivo**: `app/calendar/page.tsx`

**Dependencias**: T4.2, T4.3

**Descripción**:
- Calendario público sin autenticación
- Resumen de estado en chips horizontales
- Grid/lista de solicitudes sin información sensible
- Card informativa educativa

**Diseño**: Según prompt 11 de UI.md

**Criterios de aceptación**:
- [x] Acceso sin login
- [x] Solo datos públicos visibles
- [x] UI educativa y transparente
- [x] Responsive

---

#### T4.7: Agregar Botón "Ver Calendario" en FormStep1
**Estimación**: 1 hora  
**Prioridad**: P2  
**Archivo**: `app/components/Forms/RequestForm/FormStep1.tsx`

**Descripción**:
- Link a `/calendar` antes de continuar
- Texto educativo: "Ver carga de trabajo actual"

**Criterios de aceptación**:
- [x] Link visible y funcional
- [x] Abre en misma pestaña

---

#### T4.8: Agregar Link a Calendario en /confirmation
**Estimación**: 0.5 horas  
**Prioridad**: P2  
**Archivo**: `app/confirmation/page.tsx`

**Descripción**:
- Botón "Ver Calendario de Solicitudes"
- Link a `/calendar`

---

### 📝 Testing Tasks

#### T4.9: Tests E2E - Calendarios
**Estimación**: 2 horas  
**Prioridad**: P2  
**Archivo**: `tests/e2e/calendar.spec.ts`

**Descripción**:
- Test de calendario admin
- Test de calendario público (sin auth)
- Test de navegación mes/año

---

**Total Fase 4**: ~25.5 horas (Backend: 7h, Frontend: 16.5h, Testing: 2h)

---

## 📅 FASE 5: Integración WhatsApp, Optimización y Testing (Semana 5)
**Objetivo**: Finalizar integración WhatsApp, optimizar performance, testing completo

### 🔧 Backend Tasks

#### T5.1: Crear Función generateWhatsAppLink()
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/lib/utils/whatsapp.ts`

**Descripción**:
- Función para generar enlace de WhatsApp
- Formato: `https://wa.me/[número]?text=[mensaje]`
- Mensaje predefinido: "Hola, tu material para [evento] está listo para entrega."

**Criterios de aceptación**:
- [x] Función exportada y testeada
- [x] Número formateado correctamente (sin +, sin espacios)

**Código base**:
```typescript
export function generateWhatsAppLink(
  phoneNumber: string,
  eventName: string
): string {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '')
  const message = encodeURIComponent(
    `Hola, tu material para "${eventName}" está listo para entrega. ¡Bendiciones!`
  )
  return `https://wa.me/${cleanNumber}?text=${message}`
}
```

---

#### T5.2: Optimizar Queries con Indexes
**Estimación**: 2 horas  
**Prioridad**: P1  
**Archivo**: Nueva migración Supabase

**Descripción**:
- Verificar indexes existentes
- Agregar indexes faltantes según queries más frecuentes
- Analizar performance con EXPLAIN

**Criterios de aceptación**:
- [x] Queries rápidas (< 100ms)
- [x] No full table scans

---

#### T5.3: Implementar Rate Limiting en API Routes
**Estimación**: 3 horas  
**Prioridad**: P2  
**Archivo**: `app/lib/middleware/rateLimit.ts`

**Descripción**:
- Rate limiting para endpoints públicos
- Limitar a 10 requests por minuto por IP
- Usar Redis o Upstash

**Criterios de aceptación**:
- [x] Rate limiting funcional
- [x] Retorna 429 Too Many Requests

---

### 🎨 Frontend Tasks

#### T5.4: Integrar Botón WhatsApp en Detalle de Solicitud
**Estimación**: 1 hora  
**Prioridad**: P1  
**Archivo**: `app/admin/requests/[id]/page.tsx`

**Dependencias**: T5.1

**Descripción**:
- Mostrar botón WhatsApp si `status === 'Lista para entrega'`
- Usar función `generateWhatsAppLink()`
- Botón verde con icono WhatsApp

**Criterios de aceptación**:
- [x] Botón visible solo en estado correcto
- [x] Link abre WhatsApp correctamente

---

#### T5.5: Implementar Loading Skeletons
**Estimación**: 2 horas  
**Prioridad**: P2  
**Archivo**: Varios componentes

**Descripción**:
- Agregar Skeleton en páginas con loading
- Componente `Skeleton` ya existe

**Criterios de aceptación**:
- [x] Skeletons visibles durante carga
- [x] UI fluida sin "saltos"

---

#### T5.6: Optimizar Imágenes y Assets
**Estimación**: 1 hora  
**Prioridad**: P2  
**Archivo**: `public/`

**Descripción**:
- Optimizar logo IPUC
- Usar `next/image` con prioridad

**Criterios de aceptación**:
- [x] Imágenes optimizadas
- [x] LCP < 2.5s

---

#### T5.7: Implementar Error Boundaries
**Estimación**: 2 horas  
**Prioridad**: P2  
**Archivo**: `app/components/ErrorBoundary.tsx`

**Descripción**:
- Error boundary global
- Página de error amigable

**Criterios de aceptación**:
- [x] Errores capturados
- [x] UI de error amigable

---

### 📝 Testing Tasks

#### T5.8: Tests Unitarios - Utilidades
**Estimación**: 3 horas  
**Prioridad**: P2  
**Archivo**: `tests/unit/utils/*.test.ts`

**Descripción**:
- Test de `dateCalculations.ts`
- Test de `whatsapp.ts`
- Test de validaciones Zod

**Herramienta**: Jest

---

#### T5.9: Tests de Integración - API Routes
**Estimación**: 4 horas  
**Prioridad**: P2  
**Archivo**: `tests/integration/api/*.test.ts`

**Descripción**:
- Test de cada endpoint
- Mock de Supabase client

---

#### T5.10: Tests E2E - Flujo Completo
**Estimación**: 4 horas  
**Prioridad**: P1  
**Archivo**: `tests/e2e/full-flow.spec.ts`

**Descripción**:
- Test de flujo completo:
  1. Comité crea solicitud
  2. DECOM se loguea
  3. DECOM cambia estado
  4. DECOM contacta por WhatsApp
- Seed database con datos de prueba

**Herramienta**: Playwright

---

#### T5.11: Performance Testing
**Estimación**: 2 horas  
**Prioridad**: P2

**Descripción**:
- Lighthouse CI
- Verificar Core Web Vitals
- Optimizar según reporte

---

**Total Fase 5**: ~25 horas (Backend: 6h, Frontend: 6h, Testing: 13h)

---

## 📊 Resumen de Estimaciones

| Fase | Backend | Frontend | Testing | Total |
|------|---------|----------|---------|-------|
| Fase 1 | 9h | 7h | 2h | **18h** |
| Fase 2 | 7h | 12h | 3h | **22h** |
| Fase 3 | 10h | 16h | 3h | **29h** |
| Fase 4 | 7h | 16.5h | 2h | **25.5h** |
| Fase 5 | 6h | 6h | 13h | **25h** |
| **TOTAL** | **39h** | **57.5h** | **23h** | **119.5h** |

**Distribución por Rol**:
- **Backend Developer**: ~39 horas (33%)
- **Frontend Developer**: ~57.5 horas (48%)
- **Testing (Ambos)**: ~23 horas (19%)

**Tiempo estimado con 2 desarrolladores trabajando en paralelo**: ~4-5 semanas

---

## 🚀 Dependencias Críticas

### Path Crítico (Bloqueantes)
1. **T1.1** → T1.3 → T1.6 (Auth setup)
2. **T2.1** → T2.4, T2.5 → T2.6 (Formulario)
3. **T3.1** → T3.5 (Panel DECOM)
4. **T3.2, T3.3** → T3.7 (Detalle solicitud)

### Trabajo Paralelo Posible
- Backend puede trabajar en APIs mientras Frontend trabaja en UI mockups
- Testing puede comenzar en paralelo una vez hay endpoints funcionales

---

## 📦 Paquetes Adicionales a Instalar

```bash
# Fase 1
npm install @supabase/supabase-js @supabase/ssr

# Fase 2
npm install react-hook-form @hookform/resolvers zod

# Fase 3
npm install date-fns

# Fase 5 (Testing)
npm install -D @playwright/test jest @testing-library/react @testing-library/jest-dom
```

---

## 🔐 Variables de Entorno Requeridas

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (solo backend)

# Production
NEXT_PUBLIC_SITE_URL=https://decom.ipuc-villaestadio.com
```

---

## 📝 Notas Finales

### Mejores Prácticas Aplicadas
1. **Separation of Concerns**: Backend y Frontend claramente separados
2. **Type Safety**: TypeScript estricto en todo el código
3. **Server-First**: Server Components por defecto, Client Components solo cuando sea necesario
4. **Progressive Enhancement**: Funcionalidad básica sin JavaScript
5. **Security**: RLS en Supabase, validación en cliente y servidor
6. **Performance**: Optimización de queries, lazy loading, code splitting

### Riesgos Identificados
1. **Aprendizaje de Supabase SSR**: Primera vez implementando, puede tomar más tiempo
2. **Calendario complejo**: UI de calendario puede requerir ajustes iterativos
3. **Testing E2E**: Configuración de Playwright puede ser compleja

### Recomendaciones
1. Completar Fase 1 completamente antes de avanzar (autenticación es crítica)
2. Hacer code review después de cada fase
3. Deployar a staging después de cada fase para testing temprano
4. Mantener README.md actualizado con instrucciones de setup

---

## 🎨 Guía Específica para Frontend Developer

### Componentes Base a Reutilizar
Todos los nuevos componentes deben usar los existentes del sistema UI:

- **Botones**: Siempre usar `<Button>` con variantes apropiadas
- **Contenedores**: `<Card>` para secciones, con padding consistente
- **Estados**: `<Badge>` para estados de solicitud y prioridades
- **Loading**: `<Skeleton>` durante carga de datos
- **Layout**: `<Layout>` para páginas consistentes

### Patrones de Diseño Consistentes
1. **Headers con gradiente**: `#16233B` to `#15539C` para páginas admin
2. **Bordes superiores coloreados**: 4px en `#F49E2C` para destacar información
3. **Espaciado**: `space-y-6` entre secciones principales, `gap-3` entre elementos
4. **Sombras**: `shadow-card` para cards, `shadow-lg` para elementos destacados
5. **Border radius**: `rounded-lg` (8px) para consistencia

### Formularios y Validación
- **React Hook Form + Zod**: Para todos los formularios
- **Validación en tiempo real**: Mensajes de error bajo campos
- **Estados de carga**: Deshabilitar botones durante envío
- **Campos condicionales**: Toggle para mostrar/ocultar campos opcionales

### Manejo de Estado
- **Server Components**: Por defecto para páginas
- **Client Components**: Solo cuando se necesita interactividad (useState, useEffect)
- **Context**: Para estado global (AuthProvider)
- **Local state**: Para formularios multi-paso

### Responsive Design
- **Mobile-first**: 375px mínimo
- **Breakpoints**: `sm:`, `md:`, `lg:` para tablets/desktop
- **Full-width buttons**: Para acciones principales en mobile

### Colores IPUC Consistentes
- **Primario oscuro**: `#16233B` (navy)
- **Primario claro**: `#15539C` (azul corporativo)
- **Secundario**: `#F49E2C` (naranja/dorado)
- **Texto**: `#16233B` para títulos, `#666` para body
- **Fondos**: `#F5F5F5` para páginas, `#FFFFFF` para cards

### Iconografía
- **Material Design Icons**: Para consistencia
- **Colores contextuales**: Iconos en `#15539C` normalmente, `#F49E2C` para acentos

### Performance
- **Lazy loading**: Para componentes pesados
- **Skeletons**: Durante carga de datos
- **Optimización de imágenes**: `next/image` con priority para hero images

---

**Documento actualizado por**: GitHub Copilot  
**Fecha**: Enero 6, 2026  
**Versión**: 1.1  
**Estado**: Mejorado con detalles de implementación Frontend ✅
