# 📋 Plan de Implementación - 10 Fases
## Nuevas Funcionalidades Sistema DECOM

**Fecha de Creación:** Enero 9, 2026  
**Versión:** 1.0  
**Objetivo:** Implementar sistema completo de gestión de usuarios, roles, calendario unificado, notificaciones y mejoras UX

---

## 🎯 RESUMEN EJECUTIVO

### Funcionalidades a Implementar:
1. ✅ Gestión completa de usuarios (CRUD)
2. ✅ Sistema de roles (Admin, Presidente, Tesorero, Secretario, Vocal)
3. ✅ Calendario público/admin unificado con visibilidad configurable
4. ✅ CRUD completo en detalle de solicitud + campo hora del evento
5. ✅ Página "Solicitudes" independiente con búsqueda avanzada
6. ✅ Sistema de mensajes predeterminados para WhatsApp
7. ✅ Notificaciones Push Web
8. ✅ Log de actividad/auditoría
9. ✅ Mejoras responsive para móviles pequeños
10. ✅ Mejora de paleta de colores y componentes

### Timeline Estimado: **10-12 semanas**

---

## 🔴 NOTA IMPORTANTE - METODOLOGÍA DE TRABAJO

**OBLIGATORIO AL INICIO DE CADA FASE:**

Antes de escribir una sola línea de código en cada fase, se DEBE:

1. 🔍 **Investigar código actual:**
   - Leer y analizar archivos relevantes del proyecto
   - Identificar patrones existentes
   - Revisar componentes relacionados

2. 🗄️ **Analizar base de datos:**
   - Usar `mcp_mcpsupabase_list_tables` para ver estructura actual
   - Usar `mcp_mcpsupabase_execute_sql` para consultar datos existentes
   - Planificar migraciones necesarias

3. 📚 **Buscar mejores prácticas:**
   - Usar `mcp_mcpcontext7_query-docs` para Next.js, React, Supabase
   - Investigar patrones de diseño recomendados
   - Revisar documentación oficial

4. ✅ **Validar enfoque:**
   - Confirmar que la solución propuesta sigue mejores prácticas
   - Asegurar compatibilidad con código existente
   - Documentar decisiones técnicas

5. ✅ **Build y Validación (OBLIGATORIO AL TERMINAR CADA FASE):**
   - Ejecutar `npm run build` para detectar errores de compilación
   - Resolver todos los errores de TypeScript
   - Verificar que el build pase sin warnings críticos
   - **NO crear documentos de resumen** - el build exitoso es la validación
   - Marcar la fase como completada solo si el build pasa

---

# FASE 1: SISTEMA DE ROLES Y PERMISOS ✅ COMPLETADA
**Duración Estimada:** 1.5 semanas  
**Prioridad:** CRÍTICA
**Estado:** ✅ COMPLETADA

## 📊 Resumen de Implementación
- ✅ Migración de base de datos con `role_level` y constraints
- ✅ Sistema de 5 roles jerárquicos implementado
- ✅ 15 permisos granulares definidos en enum
- ✅ Middleware/proxy actualizando validando role_level
- ✅ AuthContext con hooks useAuth y useHasPermission
- ✅ RoleBadge UI component con colores jerárquicos
- ✅ Admin dashboard con renderizado condicional
- ✅ RLS policies con SECURITY DEFINER function (sin recursión)
- ✅ Test users creados para todos los roles

---

# FASE 2: GESTIÓN DE USUARIOS (CRUD) ✅ COMPLETADA
**Duración Estimada:** 1.5 semanas  
**Prioridad:** CRÍTICA
**Estado:** ✅ COMPLETADA - Enero 9, 2026

## 📊 Resumen de Implementación

### API Endpoints Implementados ✅
- ✅ `POST /api/admin/users` - Crear usuario con Supabase Admin API
- ✅ `GET /api/admin/users` - Listar usuarios con filtros (rol, estado, búsqueda)
- ✅ `GET /api/admin/users/[id]` - Obtener detalle de usuario
- ✅ `PATCH /api/admin/users/[id]` - Actualizar usuario (incluye cambio de contraseña)
- ✅ `DELETE /api/admin/users/[id]` - Soft delete (is_active = false)

### Páginas y Componentes ✅
- ✅ `/admin/users` - Tabla de usuarios con búsqueda y filtros
  - Vista responsive: cards (móvil) y tabla (desktop)
  - Filtros: rol, estado activo/inactivo, búsqueda por texto
  - Acciones: editar, desactivar, reactivar
- ✅ `/admin/users/new` - Formulario de creación con React Hook Form + Zod
  - Validación en tiempo real
  - Selector de rol con 7 opciones
  - Selector de comité preferido (opcional)
  - Campo contraseña con toggle show/hide
  - Prevención de auto-desactivación

### Validaciones y Seguridad ✅
- ✅ Schemas Zod: `createUserSchema` y `updateUserSchema`
- ✅ Permisos basados en role_level (≥4 para gestionar usuarios)
- ✅ Soft delete implementado (no eliminación permanente)
- ✅ Usuarios inactivos bloqueados en proxy.ts
- ✅ No se puede desactivar a sí mismo
- ✅ Creación atómica: si falla public.users, rollback en auth.users

### Características Adicionales
- ✅ Link "Gestión de Usuarios" en sidebar (solo admin/presidente)
- ✅ Integración con RoleBadge para visualización de roles
- ✅ Botones de activar/desactivar según estado del usuario
- ✅ Mensajes de error descriptivos
- ✅ Loading states durante operaciones

### Build Status
✅ **Build exitoso** - 32 rutas compiladas sin errores

### Pendiente (Opcional para Fase 2)
⏸️ Gestión de avatar con Supabase Storage (puede hacerse en fase posterior)
⏸️ Página de edición `/admin/users/[id]/edit` (funcionalidad básica ya en tabla)

## 🎯 Objetivo
Implementar sistema jerárquico de roles con 5 niveles de usuario y control de permisos basado en rol.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/types/auth.ts (tipo UserRole actual)
- app/types/database.ts (estructura de tabla users)
- app/api/auth/login/route.ts (lógica de autenticación)
- app/lib/supabase/server.ts (cliente Supabase)
- middleware.ts (si existe, verificar protección de rutas)
```

**Preguntas a responder:**
- ¿Cómo se valida actualmente el rol del usuario?
- ¿Dónde se almacena el rol en la sesión?
- ¿Qué checks de permisos existen actualmente?

### 2. Base de Datos a Analizar:
```sql
-- Ejecutar para ver estructura actual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Ver roles actuales
SELECT DISTINCT role FROM users;

-- Ver políticas RLS actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'users';
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "supabase role based access control RLS policies best practices"
2. "next.js authentication middleware role authorization"
3. "react context api role permissions management"
4. "typescript enum vs union types for roles"
```

## 🎨 Concepto de Implementación

### Jerarquía de Roles:
```
ADMIN (nivel 5)
  └── Gestión de usuarios ✓
  └── Gestión de comités ✓
  └── Configuración del sistema ✓
  └── Todos los permisos de niveles inferiores ✓

PRESIDENTE (nivel 4)
  └── Gestión de usuarios ✓
  └── CRUD completo de solicitudes ✓
  └── Ver todas las estadísticas ✓
  └── Cambiar estados ✓

TESORERO (nivel 3)
  └── CRUD completo de solicitudes ✓
  └── Ver estadísticas ✓
  └── Cambiar estados ✓

SECRETARIO (nivel 2)
  └── CRUD completo de solicitudes ✓
  └── Ver estadísticas ✓
  └── Cambiar estados ✓

VOCAL (nivel 1)
  └── CRUD completo de solicitudes ✓
  └── Ver estadísticas ✓
  └── Cambiar estados ✓
```

**NOTA:** Tesorero, Secretario y Vocal tienen los mismos permisos funcionales, solo se diferencian por el nombre del rol para fines organizacionales.

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Migración de Base de Datos
- Actualizar tipo de dato `role` en tabla `users` para incluir los 5 nuevos roles
- Crear campo `role_level` (integer) para jerarquía
- Migrar usuarios existentes al nuevo sistema
- Actualizar políticas RLS para considerar niveles de rol

### 2. Sistema de Tipos TypeScript
- Actualizar tipo `UserRole` con los 5 roles
- Crear tipo `RolePermissions` con matriz de permisos
- Crear utilidades type-safe para validación de permisos

### 3. Middleware y Protección de Rutas
- Implementar middleware que valide rol en cada request
- Proteger rutas específicas según rol
- Crear HOC (Higher Order Component) para protección de componentes

### 4. Context API o Estado Global
- Crear contexto de usuario con rol actual
- Proveer hooks para verificar permisos (`useHasPermission`)
- Cachear información de permisos para rendimiento

### 5. UI Condicional
- Mostrar/ocultar botones según rol
- Deshabilitar funcionalidades no permitidas
- Mostrar badge visual del rol del usuario

## 📊 Criterios de Éxito
- [ ] Los 5 roles están definidos en base de datos
- [ ] RLS policies actualizadas y funcionando
- [ ] Middleware valida roles correctamente
- [ ] UI muestra/oculta elementos según rol
- [ ] Tests unitarios para validación de permisos
- [ ] ADMIN puede hacer todo
- [ ] PRESIDENTE puede gestionar usuarios
- [ ] Otros roles tienen permisos correctos

---

# FASE 2: GESTIÓN DE USUARIOS (CRUD)
**Duración Estimada:** 1.5 semanas  
**Prioridad:** CRÍTICA

## 🎯 Objetivo
Crear interfaz completa para que ADMIN y PRESIDENTE puedan gestionar usuarios del sistema (crear, leer, actualizar, desactivar).

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/admin/profile/page.tsx (página actual de perfil)
- app/admin/profile/edit/page.tsx (edición de perfil)
- app/api/auth/setup-test-users/route.ts (cómo se crean usuarios)
- app/components/Forms/* (componentes de formulario existentes)
- app/lib/validations.ts (validaciones actuales)
```

### 2. Base de Datos a Analizar:
```sql
-- Ver campos actuales de users
SELECT * FROM users LIMIT 1;

-- Ver si hay campo is_active
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'is_active';

-- Verificar foreign keys
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'users';
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "supabase admin create user with password programmatically"
2. "react hook form with zod validation user management"
3. "next.js api routes user CRUD best practices"
4. "supabase storage avatar upload secure"
5. "soft delete vs hard delete users database"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Nueva Ruta de Gestión
- Crear página `/admin/users` con tabla de usuarios
- Implementar búsqueda y filtros (por rol, estado activo/inactivo)
- Paginación o scroll infinito

### 2. API Endpoints
- `POST /api/admin/users` - Crear nuevo usuario
- `GET /api/admin/users` - Listar usuarios con filtros
- `GET /api/admin/users/[id]` - Obtener detalle de usuario
- `PATCH /api/admin/users/[id]` - Actualizar usuario
- `DELETE /api/admin/users/[id]` - Desactivar usuario (soft delete)

### 3. Formulario de Creación/Edición
- Campo: Email (único, validación)
- Campo: Nombre completo
- Campo: Rol (selector con los 5 roles)
- Campo: Comité preferido (opcional)
- Campo: Contraseña (solo en creación)
- Campo: Foto de perfil (opcional, upload a Supabase Storage)
- Validaciones robustas con Zod

### 4. Gestión de Contraseñas
- Al crear usuario, generar contraseña segura o permitir que admin la defina
- Enviar credenciales de alguna forma (email futuro, o mostrar modal con contraseña)
- Opción para resetear contraseña de usuario

### 5. Soft Delete / Desactivación
- No eliminar usuarios de BD (auditoría)
- Campo `is_active` controla acceso
- Usuario desactivado no puede hacer login
- Opción para reactivar usuario

### 6. Subida de Avatar
- Integrar con Supabase Storage
- Validar tamaño y tipo de archivo (jpg, png, webp)
- Comprimir imagen en cliente si es muy grande
- Mostrar preview antes de guardar

## 📊 Criterios de Éxito
- [ ] ADMIN puede crear usuarios desde el panel
- [ ] PRESIDENTE puede crear usuarios desde el panel
- [ ] Tabla de usuarios muestra todos los usuarios correctamente
- [ ] Búsqueda y filtros funcionan
- [ ] Formulario valida datos correctamente
- [ ] Usuario puede subir foto de perfil
- [ ] Desactivar usuario impide su login
- [ ] Reactivar usuario restaura su acceso
- [ ] No se pueden eliminar usuarios permanentemente

---

# FASE 3: CALENDARIO UNIFICADO Y VISIBILIDAD
**Duración Estimada:** 2 semanas  
**Prioridad:** ALTA

## 🎯 Objetivo
Unificar calendario público y admin en una sola implementación, añadir campo de visibilidad por solicitud y permitir CRUD desde el calendario.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/calendar/page.tsx (calendario público actual)
- app/admin/calendar/page.tsx (calendario admin actual)
- app/components/Calendar/CalendarGrid.tsx (componente de calendario)
- app/api/public/calendar/route.ts (endpoint público)
- app/api/admin/calendar/route.ts (endpoint admin)
```

### 2. Base de Datos a Analizar:
```sql
-- Ver estructura de requests
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'requests';

-- Ver si existe campo de visibilidad
SELECT * FROM requests WHERE visible_in_public_calendar IS NOT NULL LIMIT 1;

-- Ver vista pública actual
SELECT * FROM v_requests_public LIMIT 5;
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "react calendar component drag drop events best practices"
2. "next.js shared components client server rendering"
3. "supabase real-time subscriptions calendar events"
4. "accessibility calendar navigation keyboard support"
5. "mobile calendar UX best practices touch gestures"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Migración de Base de Datos
- Agregar campo `visible_in_public_calendar` (boolean, default true) a tabla `requests`
- Actualizar vista `v_requests_public` para filtrar por visibilidad
- Mantener políticas RLS que permitan acceso público a solicitudes visibles

### 2. Refactorizar Componente de Calendario
- Crear componente base reutilizable que sirva para ambos casos
- Props: `isPublic` (boolean) para determinar comportamiento
- Componente debe adaptarse según contexto (público vs admin)

### 3. Toggle de Visibilidad
- Añadir botón/switch en detalle de solicitud
- Disponible para todos los usuarios autenticados
- Actualizar estado en tiempo real
- Mostrar indicador visual de solicitud oculta en vista admin

### 4. CRUD desde Calendario
- Click en evento abre modal con detalle completo
- Desde modal permitir editar solicitud
- Opción para cambiar fecha arrastrando evento (drag & drop)
- Validar que nueva fecha sea válida (futura, no conflictos)

### 5. Vista Unificada con Contexto
- Misma ruta `/calendar` para público
- Ruta `/admin/calendar` usa mismo componente pero con más funciones
- Usuario autenticado ve controles adicionales
- Usuario público solo ve información limitada

### 6. Sincronización en Tiempo Real
- Usar Supabase Realtime para actualizar calendario cuando cambian solicitudes
- Optimistic updates en UI
- Manejo de conflictos si dos admins editan simultáneamente

## 📊 Criterios de Éxito
- [ ] Campo `visible_in_public_calendar` existe en BD
- [ ] Calendario público solo muestra solicitudes visibles
- [ ] Calendario admin muestra todas las solicitudes
- [ ] Toggle de visibilidad funciona correctamente
- [ ] CRUD desde modal del calendario funciona
- [ ] Drag & drop para cambiar fechas funciona (si implementado)
- [ ] Actualizaciones en tiempo real funcionan
- [ ] Responsive en móviles pequeños

---

# FASE 4: DETALLE DE SOLICITUD - CRUD COMPLETO + HORA
**Duración Estimada:** 1 semana  
**Prioridad:** ALTA

## 🎯 Objetivo
Convertir página de detalle en editor completo, agregar campo de hora del evento, arreglar cambio de estado y permitir edición de todos los campos.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/requests/[id]/page.tsx (página actual de detalle)
- app/components/Dashboard/RequestDetailModal.tsx (modal de detalle)
- app/api/admin/requests/[id]/route.ts (endpoint de actualización)
- app/lib/validations.ts (esquema de validación actual)
```

### 2. Base de Datos a Analizar:
```sql
-- Ver si existe campo event_time
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'requests' AND column_name = 'event_time';

-- Ver campos actuales
SELECT * FROM requests LIMIT 1;

-- Ver trigger de actualización
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'requests';
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "react hook form edit mode inline editing best practices"
2. "next.js dynamic routes patch update api"
3. "date time picker accessible component react"
4. "optimistic ui updates react query"
5. "form validation edit vs create mode differences"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Migración de Base de Datos
- Campo `event_time` ya existe, verificar que esté siendo usado
- Actualizar validaciones de BD si es necesario
- Actualizar trigger `calculate_request_dates` si usa hora

### 2. Modo Edición en Detalle
- Añadir botón "Editar" que convierte la vista en formulario
- Modo lectura vs modo edición claramente diferenciados
- Validación en tiempo real mientras edita
- Botones "Guardar" y "Cancelar" visibles en modo edición

### 3. Campos Editables
- Nombre del evento
- Descripción/información del evento
- Fecha del evento
- **NUEVO:** Hora del evento (timepicker)
- Tipo de material
- ¿Incluir cita bíblica?
- Texto de cita bíblica (si aplica)
- Comité (solo si usuario es admin)

### 4. Selector de Hora
- Time picker nativo o componente custom
- Formato 12h (AM/PM) o 24h según preferencia
- Validar hora razonable (ej: eventos entre 6am y 11pm)
- Mostrar hora en formato legible en vista de lectura

### 5. Arreglar Cambio de Estado
- Identificar por qué no funciona actualmente (revisar endpoint)
- Asegurar que actualiza `status` en BD
- Registrar cambio en `request_history`
- Actualizar UI inmediatamente
- Notificar éxito/error al usuario

### 6. Validaciones y Reglas
- No permitir editar solicitudes "Entregadas" (excepto admin)
- Al cambiar fecha, recalcular fechas de planificación y entrega
- Al cambiar estado, validar transición válida
- Prevenir cambios simultáneos (optimistic locking)

## 📊 Criterios de Éxito
- [ ] Campo `event_time` visible y editable
- [ ] Modo edición funciona correctamente
- [ ] Todos los campos se pueden editar
- [ ] Cambio de estado funciona y se registra
- [ ] Validaciones previenen datos inválidos
- [ ] Hora se muestra en formato legible
- [ ] No se pueden editar solicitudes entregadas (excepto admin)
- [ ] UI responsive en móvil

---

# FASE 5: PÁGINA "SOLICITUDES" CON BÚSQUEDA AVANZADA
**Duración Estimada:** 1.5 semanas  
**Prioridad:** MEDIA-ALTA

## 🎯 Objetivo
Crear página dedicada de solicitudes separada del dashboard, con tabla completa, filtros avanzados, búsqueda, y acceso rápido al CRUD.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/admin/page.tsx (dashboard actual)
- app/admin/list/page.tsx (vista lista si existe)
- app/components/Dashboard/RequestsTable.tsx (tabla actual)
- app/components/Dashboard/RequestList.tsx (lista actual)
- app/api/admin/requests/route.ts (endpoint con filtros)
```

### 2. Base de Datos a Analizar:
```sql
-- Ver campos útiles para búsqueda
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'requests';

-- Probar búsqueda full-text
SELECT * FROM requests 
WHERE to_tsvector('spanish', event_name || ' ' || event_info) 
@@ to_tsquery('spanish', 'culto');

-- Ver índices existentes
SELECT indexname, indexdef FROM pg_indexes 
WHERE tablename = 'requests';
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "react table library tanstack table v8 best practices"
2. "advanced search filters UI UX patterns"
3. "next.js server side pagination vs client side"
4. "postgresql full text search spanish configuration"
5. "debounce search input react performance"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Nueva Ruta
- Crear `/admin/requests` (diferente de `/admin` que es dashboard)
- Navegación clara desde sidebar
- Breadcrumbs para orientación

### 2. Dashboard vs Solicitudes
**Dashboard (`/admin`):**
- Estadísticas y métricas
- Solicitudes recientes (últimas 5-10)
- Gráficos si aplica
- Vista rápida del estado general

**Solicitudes (`/admin/requests`):**
- Lista/tabla completa de TODAS las solicitudes
- Filtros avanzados
- Búsqueda por texto
- Paginación
- Acciones masivas (opcional)

### 3. Filtros Avanzados
- Por estado (múltiple selección)
- Por comité (múltiple selección)
- Por tipo de material
- Por rango de fechas (creación)
- Por rango de fechas (evento)
- Por prioridad
- Por visibilidad (visible/oculta)
- Filtro rápido: "Mis solicitudes"

### 4. Búsqueda de Texto
- Buscador global en nombre y descripción
- Debounce para evitar demasiadas peticiones
- Opción: búsqueda full-text en PostgreSQL
- Highlight de resultados

### 5. Vista de Tabla vs Cards
- Toggle para cambiar entre tabla y cards
- Tabla: más información compacta, ideal para desktop
- Cards: más visual, ideal para móvil
- Persistir preferencia de usuario

### 6. Acciones Rápidas
- Ver detalle (modal o nueva página)
- Editar inline algunos campos
- Cambiar estado rápidamente
- Ocultar/mostrar en calendario público
- Duplicar solicitud (opcional)
- Exportar a Excel/PDF (opcional)

### 7. Paginación y Rendimiento
- Server-side pagination
- 50-100 items por página
- Indicador de total de resultados
- Cargar más o botones de página

## 📊 Criterios de Éxito
- [ ] Ruta `/admin/requests` funciona
- [ ] Diferenciación clara con dashboard
- [ ] Todos los filtros funcionan correctamente
- [ ] Búsqueda encuentra solicitudes por texto
- [ ] Toggle tabla/cards funciona
- [ ] Paginación funciona sin problemas
- [ ] Acciones rápidas disponibles
- [ ] Performance óptima con 100+ solicitudes
- [ ] Responsive en móvil

---

# FASE 6: MENSAJES WHATSAPP PREDETERMINADOS
**Duración Estimada:** 1 semana  
**Prioridad:** MEDIA

## 🎯 Objetivo
Mejorar sistema actual de WhatsApp con plantillas de mensajes predeterminados, personalización y tracking de envíos.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/requests/[id]/page.tsx (botón actual de WhatsApp)
- app/components/Dashboard/RequestDetailModal.tsx (integración WhatsApp)
- Buscar todas las referencias a "wa.me" o "whatsapp" en el proyecto
```

### 2. Base de Datos a Analizar:
```sql
-- Ver campo de WhatsApp
SELECT contact_whatsapp FROM requests LIMIT 5;

-- Planear tabla de plantillas de mensajes
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true
);

-- Planear tabla de mensajes enviados (tracking)
CREATE TABLE IF NOT EXISTS sent_messages (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES requests(id),
  template_id UUID REFERENCES message_templates(id),
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "whatsapp web api url parameters message formatting"
2. "template engine javascript variable replacement"
3. "react textarea autosize dynamic height"
4. "copy to clipboard api best practices"
5. "message preview before send UX patterns"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Migración de Base de Datos
- Crear tabla `message_templates` para plantillas
- Crear tabla `sent_messages` para tracking (opcional)
- Seed inicial con 5-7 plantillas comunes

### 2. Plantillas de Mensajes
**Ejemplos de plantillas:**
- "Solicitud recibida" - Confirmar recepción
- "En proceso de diseño" - Actualizar estado
- "Lista para entrega" - Notificar disponibilidad
- "Necesitamos información" - Solicitar detalles
- "Evento cancelado" - Confirmar cancelación
- Plantilla personalizable (usuario escribe desde cero)

### 3. Variables Dinámicas
Variables que se reemplazan automáticamente:
- `{nombre_evento}` - Nombre del evento
- `{fecha_evento}` - Fecha del evento
- `{comite}` - Nombre del comité
- `{tipo_material}` - Tipo de material solicitado
- `{estado}` - Estado actual de la solicitud
- `{nombre_admin}` - Nombre de quien envía el mensaje

### 4. Interfaz de Selección
- Modal o dropdown para elegir plantilla
- Preview del mensaje con variables reemplazadas
- Opción de editar mensaje antes de enviar
- Contador de caracteres
- Botón "Copiar mensaje" además de "Enviar por WhatsApp"

### 5. Tracking de Mensajes (Opcional)
- Registrar cuándo se envió un mensaje
- Ver historial de mensajes en detalle de solicitud
- Estadísticas: mensajes más usados

### 6. Gestión de Plantillas
- Página admin para crear/editar plantillas
- Solo ADMIN puede gestionar plantillas globales
- Plantillas predeterminadas no se pueden eliminar

## 📊 Criterios de Éxito
- [ ] Al menos 5 plantillas predefinidas funcionan
- [ ] Variables dinámicas se reemplazan correctamente
- [ ] Preview muestra mensaje final antes de enviar
- [ ] Botón abre WhatsApp con mensaje pre-llenado
- [ ] Opción de copiar mensaje al clipboard
- [ ] (Opcional) Tracking de mensajes enviados
- [ ] UI intuitiva y rápida de usar
- [ ] Funciona en móvil

---

# FASE 7: NOTIFICACIONES PUSH WEB
**Duración Estimada:** 1.5 semanas  
**Prioridad:** MEDIA

## 🎯 Objetivo
Implementar sistema de notificaciones push web para avisar a usuarios cuando cambian estados de solicitudes o hay eventos importantes.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/layout.tsx (layout principal)
- next.config.ts (configuración de Next.js)
- public/ (verificar si existe service worker)
```

### 2. Base de Datos a Analizar:
```sql
-- Crear tabla para almacenar suscripciones push
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'status_change', 'new_request', 'mention', etc.
  related_request_id UUID REFERENCES requests(id),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "web push notifications service worker next.js"
2. "push api notification permission request UX best practices"
3. "firebase cloud messaging FCM web push"
4. "notification center UI component react"
5. "push subscription management database storage"
6. "vapid keys generation web push"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Infraestructura de Push
**Opción A: Web Push API Nativa**
- Implementar Service Worker
- Generar VAPID keys
- Manejar suscripciones

**Opción B: Firebase Cloud Messaging**
- Integrar FCM SDK
- Configurar proyecto Firebase
- Usar FCM para envío

**Recomendación:** Empezar con Web Push API nativa (más simple, sin dependencias externas).

### 2. Migraciones de Base de Datos
- Tabla `push_subscriptions` para guardar endpoints
- Tabla `notifications` para historial de notificaciones
- Relación con usuarios y solicitudes

### 3. Flujo de Suscripción
- Solicitar permiso al usuario en momento apropiado
- No ser intrusivo (esperar a que complete una acción)
- Guardar suscripción en base de datos
- Permitir desuscribirse fácilmente

### 4. Eventos que Generan Notificaciones
- Cambio de estado de solicitud
- Nueva solicitud creada (para admins)
- Solicitud próxima a fecha de entrega
- Solicitud próxima a fecha de evento
- Mención o asignación a usuario

### 5. Centro de Notificaciones en UI
- Icono de campana en header con badge de contador
- Dropdown/panel con lista de notificaciones
- Marcar como leída individual o todas
- Click en notificación navega a solicitud relacionada
- Filtrar por leídas/no leídas
- Paginación si hay muchas

### 6. Edge Function para Envío
- Crear Supabase Edge Function para enviar push
- Trigger que escucha cambios en `requests.status`
- Enviar notificación a usuarios relevantes
- Manejar errores (suscripciones expiradas, etc.)

### 7. Configuración de Usuario
- Opción para habilitar/deshabilitar notificaciones
- Elegir qué tipos de notificaciones recibir
- Ver dispositivos suscritos
- Desvincular dispositivos

## 📊 Criterios de Éxito
- [ ] Service Worker registrado correctamente
- [ ] Usuario puede suscribirse a notificaciones
- [ ] Notificaciones se envían cuando cambia estado
- [ ] Centro de notificaciones funciona en UI
- [ ] Marcar como leída funciona
- [ ] Click en notificación navega correctamente
- [ ] Usuario puede desactivar notificaciones
- [ ] Funciona en Chrome, Firefox, Edge (mínimo)
- [ ] Notificaciones persistentes incluso con app cerrada

---

# FASE 8: LOG DE ACTIVIDAD Y AUDITORÍA
**Duración Estimada:** 1 semana  
**Prioridad:** MEDIA

## 🎯 Objetivo
Implementar sistema robusto de auditoría que registre todas las acciones importantes en el sistema (quién hizo qué y cuándo).

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/types/database.ts (tabla request_history actual)
- Buscar referencias a "request_history" en el proyecto
- app/api/admin/requests/[id]/route.ts (cómo se registran cambios actualmente)
```

### 2. Base de Datos a Analizar:
```sql
-- Ver tabla actual de historial
SELECT * FROM request_history ORDER BY changed_at DESC LIMIT 10;

-- Verificar trigger existente
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'requests';

-- Planear tabla de audit_log más completa
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_user ON audit_log(changed_by);
CREATE INDEX idx_audit_log_date ON audit_log(changed_at);
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "postgresql audit trail trigger function best practices"
2. "supabase audit log implementation"
3. "activity feed UI timeline component react"
4. "jsonb diff postgresql old new values"
5. "compliance audit requirements GDPR"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Migración de Base de Datos
- Mantener tabla `request_history` actual (específica para cambios de estado)
- Crear tabla `audit_log` más genérica (todos los cambios)
- Crear función trigger que registre automáticamente cambios
- Aplicar trigger a tablas: `requests`, `users`, `committees`

### 2. Información a Registrar
**Por cada cambio:**
- Tabla y registro afectado
- Acción (INSERT, UPDATE, DELETE)
- Valores anteriores (JSON)
- Valores nuevos (JSON)
- Usuario que hizo el cambio
- Timestamp
- IP del usuario (opcional)
- User agent (opcional)

### 3. Trigger Automático
- Función PL/pgSQL que se ejecuta AFTER INSERT/UPDATE/DELETE
- Captura valores old y new
- Inserta en audit_log automáticamente
- No requiere cambios en código de aplicación

### 4. API para Consultar Log
- `GET /api/admin/audit-log` - Log general con filtros
- `GET /api/admin/audit-log/user/[id]` - Actividad de un usuario
- `GET /api/admin/audit-log/request/[id]` - Historial de una solicitud
- Filtros: fecha, usuario, tabla, acción

### 5. UI de Visualización
**Página de Audit Log:**
- Timeline/feed de actividad
- Filtros por fecha, usuario, acción, tabla
- Búsqueda
- Paginación
- Exportar a CSV (opcional)

**En Detalle de Solicitud:**
- Sección "Historial de cambios"
- Mostrar quién cambió qué y cuándo
- Diff visual de valores anteriores vs nuevos

**En Perfil de Usuario:**
- Ver actividad reciente del usuario
- Últimas acciones realizadas

### 6. Información Humana Legible
- Convertir logs técnicos a mensajes legibles:
  - ❌ `UPDATE requests SET status='En diseño' WHERE id='...'`
  - ✅ `Juan Pérez cambió el estado de "Pendiente" a "En diseño"`
- Función helper para formatear logs
- Traducir nombres de campos técnicos

### 7. Retención y Limpieza
- Definir política de retención (ej: 1 año)
- Job que elimine logs antiguos automáticamente
- Archivar logs críticos antes de eliminar

## 📊 Criterios de Éxito
- [ ] Tabla `audit_log` creada y funcionando
- [ ] Trigger registra cambios automáticamente
- [ ] No se pierde información de cambios
- [ ] API de consulta funciona con filtros
- [ ] UI muestra historial de forma legible
- [ ] Diff de cambios es claro y entendible
- [ ] Performance no se degrada con miles de logs
- [ ] Solo ADMIN puede ver audit log completo
- [ ] Cumple requisitos de auditoría

---

# FASE 9: MEJORAS RESPONSIVE MÓVIL
**Duración Estimada:** 1 semana  
**Prioridad:** ALTA

## 🎯 Objetivo
Optimizar experiencia en dispositivos móviles pequeños (320px-414px), especialmente después del login en secciones admin.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/admin/page.tsx (dashboard admin)
- app/admin/calendar/page.tsx (calendario admin)
- app/requests/[id]/page.tsx (detalle de solicitud)
- components/ui/sidebar.tsx (sidebar actual)
- app/globals.css (breakpoints y utilities)
```

### 2. Testing de Dispositivos
```
Dispositivos a probar:
- iPhone SE (320px)
- iPhone 12/13 (390px)
- Samsung Galaxy S20 (360px)
- Pixel 5 (393px)

Herramientas:
- Chrome DevTools
- Firefox Responsive Design Mode
- BrowserStack (opcional)
- Real devices (ideal)
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "mobile first responsive design best practices"
2. "touch target sizes accessibility guidelines"
3. "bottom navigation mobile patterns"
4. "swipe gestures react mobile"
5. "viewport meta tag mobile optimization"
6. "tailwind css mobile responsive breakpoints"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Auditoría de Problemas Actuales
**Identificar issues en:**
- Sidebar demasiado ancho o no se oculta bien
- Botones demasiado pequeños (touch targets < 44px)
- Texto demasiado pequeño (< 16px)
- Tablas con scroll horizontal difícil
- Formularios con campos mal alineados
- Modales que no caben en viewport
- Navegación poco intuitiva

### 2. Navegación Móvil
**Opciones:**
- Bottom navigation bar (recomendado para móvil)
- Hamburger menu mejorado
- Tabs horizontales con swipe
- Floating action button para acciones principales

**Elementos clave:**
- Dashboard
- Solicitudes
- Calendario
- Perfil
- Nueva solicitud (FAB)

### 3. Componentes Responsivos

**Sidebar:**
- Ocultar automáticamente en móvil
- Overlay cuando se abre
- Gesto de swipe para abrir/cerrar
- Transiciones suaves

**Tablas:**
- Convertir a cards en móvil
- Scroll horizontal con indicador visual
- Sticky headers
- Acciones en menú contextual (...)

**Formularios:**
- Inputs full-width en móvil
- Labels arriba (no a la izquierda)
- Spacing adecuado entre campos
- Teclado correcto según tipo de input

**Modales:**
- Full-screen en móvil
- Botón cerrar grande y accesible
- Header sticky
- Footer sticky con acciones

### 4. Tamaños y Espaciado
**Guías de diseño:**
- Touch targets: mínimo 44x44px
- Texto body: mínimo 16px
- Padding entre elementos: mínimo 16px
- Iconos: mínimo 24px
- Botones: height mínimo 44px

### 5. Gestos y Interacciones
- Swipe para eliminar/archivar
- Pull to refresh en listas
- Long press para acciones contextuales
- Double tap para zoom (si aplica)

### 6. Performance en Móvil
- Lazy loading de imágenes
- Code splitting por rutas
- Reducir bundle size
- Optimizar animaciones (60fps)
- Evitar re-renders innecesarios

### 7. Testing Específico
- Probar en devices reales
- Orientación portrait y landscape
- Safari iOS (importante: diferentes a Chrome)
- Navegadores móviles comunes

## 📊 Criterios de Éxito
- [ ] App usable en 320px de ancho
- [ ] Todos los touch targets son >= 44px
- [ ] Texto legible sin zoom
- [ ] Navegación intuitiva en móvil
- [ ] Sidebar funciona correctamente
- [ ] Formularios cómodos de llenar
- [ ] Modales no salen del viewport
- [ ] Tablas/listas navegables en móvil
- [ ] Performance fluida (60fps)
- [ ] Funciona en Safari iOS
- [ ] Landscape orientation funcional

---

# FASE 10: PALETA DE COLORES Y COMPONENTES
**Duración Estimada:** 1 semana  
**Prioridad:** MEDIA-BAJA

## 🎯 Objetivo
Refrescar paleta de colores actual manteniendo identidad IPUC, mejorar contraste y accesibilidad, y optimizar componentes existentes.

## 📖 Investigación Requerida ANTES de Implementar

### 1. Código Actual a Revisar:
```
Archivos obligatorios a leer:
- app/globals.css (variables CSS actuales)
- contexto/UI.md (paleta IPUC definida)
- components/ui/* (todos los componentes UI)
- tailwind.config.js (configuración de colores)
```

### 2. Análisis de Accesibilidad
```
Herramientas a usar:
- WAVE Browser Extension
- aXe DevTools
- Lighthouse Accessibility Audit
- Color Contrast Checker (webaim.org)

Verificar:
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Contraste 3:1 para elementos UI
- Colores no son único indicador (iconos + color)
```

### 3. Documentación a Consultar:
**OBLIGATORIO usar `mcp_mcpcontext7_query-docs`:**

```
Temas a investigar:
1. "WCAG 2.1 color contrast requirements"
2. "design system color palette best practices"
3. "tailwind css custom color palette configuration"
4. "semantic color naming conventions"
5. "dark mode implementation tailwind next.js"
6. "accessible color combinations generator"
```

## 💡 Qué Se Debe Hacer (Sin Especificar Cómo)

### 1. Auditoría de Colores Actuales
**Colores IPUC actuales:**
- Primary Dark: #16233B (Navy)
- Primary Light: #15539C (Blue)
- Secondary: #F49E2C (Orange/Gold)
- Background: #F5F5F5
- Text: #16233B

**Verificar:**
- ¿Contraste suficiente con WCAG AA/AAA?
- ¿Colores distinguibles para daltónicos?
- ¿Funcionan en luz directa (móviles outdoor)?

### 2. Nueva Paleta Propuesta
**Mantener identidad IPUC pero mejorar:**
- Generar escalas de 50-950 para cada color
- Definir colores semánticos: success, warning, error, info
- Asegurar accesibilidad en todas las combinaciones
- Definir colores para estados: hover, active, disabled, focus

**Herramientas recomendadas:**
- Coolors.co para paletas
- Color.review para contraste
- Huemint para generar escalas

### 3. Actualizar Variables CSS
```css
/* Ejemplo de estructura */
:root {
  /* Brand Colors */
  --color-primary-50: ...;
  --color-primary-100: ...;
  /* ... hasta 950 */
  
  /* Semantic Colors */
  --color-success: ...;
  --color-warning: ...;
  --color-error: ...;
  --color-info: ...;
  
  /* UI States */
  --color-hover: ...;
  --color-active: ...;
  --color-disabled: ...;
  --color-focus: ...;
  
  /* Backgrounds */
  --bg-primary: ...;
  --bg-secondary: ...;
  --bg-tertiary: ...;
  
  /* Borders */
  --border-default: ...;
  --border-accent: ...;
}
```

### 4. Componentes a Actualizar

**Button:**
- Variantes: primary, secondary, outline, ghost, danger
- Estados: hover, active, disabled, loading
- Tamaños: sm, md, lg, xl
- Accesible: focus visible, keyboard nav

**Badge:**
- Colores semánticos automáticos por estado
- Contraste apropiado
- Tamaños consistentes

**Card:**
- Sombras sutiles y consistentes
- Bordes opcionales
- Hover states si es clickeable

**Input/Select/Textarea:**
- Estados de validación claros
- Focus ring visible
- Error messages con color e icono

**Modal/Dialog:**
- Overlay con opacidad correcta
- Backdrop blur (opcional)
- Animaciones suaves

### 5. Modo Oscuro (Opcional)
- Definir si es necesario ahora o fase futura
- Si se implementa: usar variables CSS
- Paleta oscura con mismo nivel de contraste
- Toggle en configuración de usuario

### 6. Sistema de Spacing
- Escala consistente: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Usar en márgenes, padding, gaps
- Documentar en design system

### 7. Tipografía
- Escala tipográfica clara: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- Line heights apropiados
- Font weights: normal (400), medium (500), semibold (600), bold (700)

### 8. Documentación
- Crear página de design system (opcional)
- Storybook con todos los componentes (opcional)
- Guía de uso para desarrolladores
- Ejemplos de combinaciones válidas

## 📊 Criterios de Éxito
- [ ] Nueva paleta cumple WCAG AA mínimo
- [ ] Todas las combinaciones de texto/fondo son legibles
- [ ] Colores distinguibles para daltónicos
- [ ] Variables CSS actualizadas
- [ ] Tailwind config sincronizado
- [ ] Todos los componentes UI actualizados
- [ ] Consistencia visual en toda la app
- [ ] Documentación de design system creada
- [ ] Feedback positivo de usuarios sobre legibilidad

---

## 📊 RESUMEN DE PRIORIDADES

### 🔴 CRÍTICAS (Hacer primero)
1. **Fase 1:** Sistema de Roles (base para todo lo demás)
2. **Fase 2:** Gestión de Usuarios (necesario para roles)

### 🟡 ALTAS (Hacer después de críticas)
3. **Fase 3:** Calendario Unificado
4. **Fase 4:** CRUD en Detalle
5. **Fase 5:** Página Solicitudes
6. **Fase 9:** Mejoras Responsive

### 🟢 MEDIAS (Hacer cuando sea posible)
7. **Fase 6:** Mensajes WhatsApp
8. **Fase 7:** Notificaciones Push
9. **Fase 8:** Log de Auditoría

### 🔵 BAJA (Pulido final)
10. **Fase 10:** Paleta de Colores

---

## 📈 MÉTRICAS DE ÉXITO GLOBALES

Al finalizar las 10 fases:

### Funcionalidad
- [ ] 5 roles implementados y funcionando
- [ ] CRUD completo de usuarios
- [ ] Calendario unificado con visibilidad
- [ ] Detalle de solicitud editable
- [ ] Página de solicitudes con filtros avanzados
- [ ] Mensajes WhatsApp con plantillas
- [ ] Notificaciones push funcionando
- [ ] Log de auditoría completo

### Experiencia de Usuario
- [ ] App 100% funcional en móvil (320px+)
- [ ] Navegación intuitiva
- [ ] Feedback visual apropiado
- [ ] Tiempos de carga < 2s
- [ ] Lighthouse score > 90

### Seguridad y Calidad
- [ ] Permisos por rol funcionando
- [ ] RLS policies correctas
- [ ] Auditoría completa de acciones
- [ ] Tests E2E para flujos principales
- [ ] Zero errores críticos en producción

### Accesibilidad
- [ ] WCAG AA cumplido
- [ ] Navegación por teclado funcional
- [ ] Screen readers compatible
- [ ] Contraste apropiado

---

## 🛠️ STACK TECNOLÓGICO ADICIONAL

### Nuevas Dependencias Necesarias

```json
{
  "dependencies": {
    // Para notificaciones push
    "web-push": "^3.6.0",
    
    // Para manejo de permisos
    "@casl/ability": "^6.5.0",
    "@casl/react": "^3.1.0",
    
    // Para tablas avanzadas (Fase 5)
    "@tanstack/react-table": "^8.10.0",
    
    // Para date/time picker mejorado
    "react-datepicker": "^4.21.0",
    
    // Para gestión de estado de notificaciones
    "zustand": "^4.4.0",
    
    // Para diff de objetos (audit log)
    "deep-object-diff": "^1.1.9",
    
    // Para formateo de mensajes WhatsApp
    "template-string": "^1.0.0"
  },
  "devDependencies": {
    // Para testing de permisos
    "@testing-library/react-hooks": "^8.0.1",
    
    // Para testing de notificaciones
    "jest-mock": "^29.7.0"
  }
}
```

### Servicios Externos (Opcionales)

1. **Upstash Redis** - Para caché y rate limiting
2. **Sentry** - Error tracking y monitoring
3. **BetterUptime** - Monitoring de uptime
4. **Firebase** - Alternativa para notificaciones push

---

## 📝 CONCLUSIÓN

Este plan de 10 fases transforma el sistema DECOM actual en una aplicación empresarial completa con:

✅ Gestión robusta de usuarios y permisos  
✅ Experiencia unificada y coherente  
✅ Auditoría completa de acciones  
✅ Notificaciones en tiempo real  
✅ Interfaz optimizada para móviles  
✅ Accesibilidad y mejores prácticas

**Timeline total: 10-12 semanas** trabajando de forma secuencial.

Si se trabaja con múltiples desarrolladores, fases 1-5 pueden hacerse en 6-7 semanas.

---

**Documento creado:** Enero 9, 2026  
**Autor:** Sistema DECOM Team  
**Próxima revisión:** Después de completar Fase 1 y 2

