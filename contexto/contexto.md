# Documento de Requerimientos del Sistema - VERSIÓN FINAL FASE 1
## Sistema de Gestión de Solicitudes de Comunicación - DECOM

**Última Actualización**: Enero 6, 2026  
**Estado**: Fase 1 Completa + Mejora Estratégica (Calendario Público)  
**Branch**: `001-decom-system`

---

## 1. Descripción General

Sistema web responsivo para centralizar y gestionar solicitudes de material publicitario dirigidas al comité de comunicaciones (DECOM) de la iglesia. Reemplaza el flujo informal por WhatsApp con un proceso estructurado, trazable y educativo que promueve transparencia organizacional.

**Cambio estratégico**: Se añadió un calendario público (sin autenticación) para que los comités vean la carga de trabajo actual ANTES de enviar solicitudes, reduciendo conflictos y mejorando la comunicación.

---

## 2. Stack Tecnológico Finalizado

- **Frontend**: Next.js 14+, React 18+, TypeScript 5+
- **Formularios**: React Hook Form 7.48+, Zod 3.22+ (validación)
- **Estilos**: Tailwind CSS 3.3+, Aceternity UI
- **Backend/Base de datos**: Supabase (PostgreSQL, Auth, RLS)
- **Fechas**: date-fns 2.30+ (cálculos automáticos)
- **Testing**: Jest 29+, React Testing Library 14+, Playwright 1.40+ (E2E)
- **Deployment**: Vercel (frontend) + Supabase Cloud (backend)

---

## 3. Actores del Sistema

### 3.1 Comités Solicitantes
- Jóvenes, Damas, Alabanza, Adoración, CABALLEROS (+ personalizables)
- **Sin autenticación**: Envían solicitudes via formulario público
- **Con acceso público**: Pueden ver calendario sin login (nueva funcionalidad)

### 3.2 DECOM (Administradores)
- **Rol único**: `decom_admin` (sin jerarquía de roles)
- **Requiere autenticación**: Login con email + contraseña
- **Sin recuperación de contraseña**: Gestión manual en Supabase
- **Acceso completo**: Gestión de solicitudes, usuarios, comités

---

## 4. Funcionalidades Core

### 4.1 Formulario de Solicitud (Comités - Sin Autenticación)

**Campos obligatorios:**
- Comité solicitante (selector, predefinido pero editable por DECOM)
- Nombre del evento
- Información del evento (5-500 caracteres)
- Fecha del evento (futuro solamente, no pasadas)
- Tipo de material (flyer, banner, video, redes, otro)
- Número de WhatsApp (formato: +57XXXXXXXXXX, encriptado en BD)

**Campos opcionales:**
- ¿Incluir cita bíblica? (Sí/No)
- Texto de la cita bíblica (libre, sin predefinidos)

**Reglas de negocio:**
- Fecha de entrega sugerida: 2 días antes del evento (automática, inmutable)
- Fecha de inicio de planificación: 7 días antes del evento (automática, inmutable)
- Prioridad automática: Calculada por proximidad a fechas clave (1-10)
- Confirmación visual después de envío

### 4.2 Panel de Gestión DECOM

#### Vista de Lista
- Todas las solicitudes con filtros
- Badge de prioridad (color según urgencia)
- Identificación de comité solicitante
- Nombre y fecha del evento
- Estado actual (visual con colores)
- Tipo de material (con icono)
- Botón para ver detalle completo

#### Vista de Calendario
- Solicitudes organizadas por fecha del evento
- Múltiples vistas: Mes, Semana, Estado
- Indicadores visuales de fechas clave (planificación, entrega)
- Código de colores según estado y prioridad
- Filtros: por comité, rango de fechas, estado, prioridad

#### Gestión de Estados
Estados disponibles:
1. **Pendiente** - Recién creada
2. **En planificación** - Dentro del período de 7 días antes
3. **En diseño** - Trabajo activo
4. **Lista para entrega** - Material finalizado
5. **Entregada** - Completada

Transiciones:
- DECOM cambia estados manualmente
- Solo DECOM puede cambiar estados
- Comité puede editar su solicitud si status ≠ Entregada
- No se pueden eliminar solicitudes (auditoría)

### 4.3 Integración WhatsApp

- Botón que abre chat de WhatsApp con el número registrado
- Formato: `https://wa.me/[número]?text=[mensaje]`
- **Importante**: Solo facilita contacto directo, no envía archivos
- Visible para DECOM al marcar material "Lista para entrega"

### 4.4 🆕 Calendario Público (Nueva Funcionalidad)

**Propósito**: Transparencia organizacional y educación sobre carga de trabajo

**Acceso**: 
- Sin autenticación requerida
- Accesible antes de enviar solicitud
- Link compartible después de envío

**Información visible**:
- Fecha del evento
- Tipo de material
- Estado de solicitud
- Puntuación de prioridad (1-10)
- Días desde creación
- Días hasta entrega

**Información protegida** (no visible):
- Nombre del comité
- Detalles del evento
- Número de WhatsApp
- Citas bíblicas
- Nombres de usuarios

**Endpoints**:
- `GET /api/public/calendar?month=1&year=2026` (sin auth)
- Filtros: mes, año, tipo de material, estado
- Paginación: limit=50, offset=0

**Beneficio estratégico**: 
"Liderazgo silencioso mediante UX" - Reduce conflictos permitiendo que comités entiendan realmente la carga de trabajo, no de intuición.

---

## 5. Modelo de Datos (Supabase PostgreSQL)

### Tabla: `committees` (Predefinidas pero Editables)
- id (UUID, PK)
- name (TEXT, UNIQUE, NOT NULL)
- description (TEXT)
- color_badge (TEXT, para identificar visualmente)
- created_at, updated_at (TIMESTAMP)

**Predefinidas**:
- Jóvenes
- Damas
- Alabanza
- Adoración
- Diaconía

### Tabla: `users` (Solo DECOM)
- id (UUID, PK)
- auth_user_id (UUID, referencia a Supabase Auth)
- email (TEXT, UNIQUE)
- full_name (TEXT)
- role (TEXT: "decom_admin" solamente)
- preferred_committee_id (UUID, nullable, FK)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

### Tabla: `requests` (Solicitudes)
- id (UUID, PK)
- committee_id (UUID, FK)
- created_by (UUID, FK a users)
- event_name (TEXT)
- event_info (TEXT, 5-500 chars)
- event_date (DATE, futuro solamente)
- material_type (TEXT: flyer, banner, video, redes, otro)
- contact_whatsapp (TEXT, regex validated, encriptado)
- include_bible_verse (BOOLEAN)
- bible_verse_text (TEXT, nullable)
- planning_start_date (DATE, GENERATED: event_date - 7 días)
- delivery_date (DATE, GENERATED: event_date - 2 días)
- priority_score (INT, GENERATED: 1-10)
- status (TEXT: Pendiente, En_planificacion, En_diseño, Lista_para_entrega, Entregada)
- created_at, updated_at (TIMESTAMP)

### Tabla: `request_history` (Auditoría)
- id (UUID, PK)
- request_id (UUID, FK)
- old_status (TEXT)
- new_status (TEXT)
- changed_by (UUID, FK a users)
- changed_at (TIMESTAMP)

### Vistas
- **v_requests_detailed**: Todas las solicitudes con nombres de comité y usuario
- **v_requests_urgent**: Solicitudes con prioridad >= 5
- **v_requests_public**: Solicitudes para calendario público (sin datos sensibles)

### Políticas de RLS (Row-Level Security)
- Comités ven solo sus propias solicitudes
- DECOM admins ven todas las solicitudes
- Calendario público: Acceso sin autenticación
- Sin eliminar solicitudes: Auditoría completa

---

## 6. Validaciones

### Cliente (React Hook Form + Zod)
- Email: formato válido
- Teléfono: regex `^\+?57\d{10}$`
- event_date: debe ser futuro (no pasado)
- event_info: mínimo 5, máximo 500 caracteres
- material_type: enum validado
- bible_verse_text: requerido si include_bible_verse=true

### Servidor (Supabase RLS + Triggers)
- Fechas calculadas automáticamente
- No permitir event_date en pasado
- No permitir eliminar solicitudes
- updated_at sincronizado automáticamente
- Cambios de estado registrados en request_history

---

## 7. Reglas de Cálculo Automático

```
delivery_date = event_date - 2 días
planning_start_date = event_date - 7 días

priority_score = función(días hasta planning_start_date, días hasta delivery_date)
  - Si en período crítico (planificación): 8-10
  - Si en período normal: 5-7
  - Si es próximo (entrega): 1-4
```

---

## 8. Funcionalidades NO Incluidas (MVP)

- ❌ Almacenamiento de archivos multimedia
- ❌ Editor de diseño integrado
- ❌ Envío automático de archivos
- ❌ Sistema de notificaciones push/email
- ❌ Solicitudes recurrentes
- ❌ Exportación PDF
- ❌ Recuperación de contraseña
- ❌ Múltiples roles en DECOM
- ❌ Permisos granulares

---

## 9. Historias de Usuario (Finales)

### HU1: Comité envía solicitud (P1)
Como miembro de un comité, quiero llenar un formulario simple para solicitar material publicitario, para evitar comunicación desorganizada por WhatsApp.

**Aceptación**:
- Formulario en 2 pasos, clara indicación de progreso
- Todos los campos están validados
- Recibo confirmación visual inmediata
- Puedo ver el número de solicitud para referencia

### HU2: DECOM gestiona solicitudes en lista y calendario (P1)
Como administrador DECOM, quiero ver todas las solicitudes en vista de lista y calendario, para priorizar mi trabajo según fechas establecidas.

**Aceptación**:
- Vistas intercambiables (lista/mes/semana/estado)
- Filtros funcionales por estado, comité, fechas
- Código de colores por prioridad
- Información clara de fechas críticas

### HU3: DECOM cambia estados y contacta por WhatsApp (P1)
Como administrador DECOM, quiero cambiar el estado de una solicitud y contactar al responsable vía WhatsApp cuando esté lista, para entregar de forma rápida y personal.

**Aceptación**:
- Cambio de estado es simple y confirmado
- Botón WhatsApp abre chat directamente
- Historial de cambios visible

### HU4: Comité ve calendario público (P2)
Como miembro de un comité, quiero ver el calendario de solicitudes ya registradas antes de enviar la mía, para entender la carga de trabajo y planificar mejor mi solicitud.

**Aceptación**:
- Acceso sin autenticación
- Botón en formulario antes de enviar
- Link en confirmación después de enviar
- Filtros por mes, año, estado, tipo material
- No muestra datos sensibles

---

## 10. Criterios de Éxito

- ✅ Reducción del 80% de solicitudes por WhatsApp directo
- ✅ 100% de solicitudes con información completa
- ✅ Visibilidad clara de carga de trabajo con al menos 7 días de anticipación
- ✅ Trazabilidad completa del historial de solicitudes
- ✅ Comités entienden la carga de trabajo (no hay sorpresas)
- ✅ Reducción de conflictos por "por qué tardamos tanto"

---

## 11. Consideraciones de UX

- **Mobile-first**: Diseño adaptado para uso en teléfonos (375px mínimo)
- **Formulario guiado**: 2 pasos con indicador visual de progreso
- **Validaciones en tiempo real**: Feedback inmediato
- **Confirmación visual**: Éxito claro después de envío
- **Colores corporativos IPUC**: Paleta oficial aplicada
- **Iconografía clara**: Material Design icons
- **Accesibilidad**: Etiquetas HTML correctas, contraste suficiente

---

## 12. Documentación Generada (Phase 1)

Todos los archivos están en `specs/001-decom-system/`:

- **spec.md**: Especificación completa (4 HU, 27 FR, 10 criterios, edge cases)
- **plan.md**: Roadmap técnico e implementación
- **research.md**: 11 decisiones tecnológicas documentadas
- **data-model.md**: Modelo de datos completo con validaciones y RLS
- **contracts/api-contracts.md**: 9+ endpoints con JSON schemas
- **contracts/database-schema.sql**: DDL producción-lista para Supabase
- **quickstart.md**: Guía de 7 pasos para desarrolladores
- **checklists/requirements.md**: Verificación de calidad (✅ PASS)

---

## 13. Estado del Proyecto

**Phase 1**: ✅ COMPLETA (Especificación + Diseño + Arquitectura)  
**Phase 2**: ⏳ PRÓXIMA (Breakdown de tareas → implementación)

**Próximo comando**: `/speckit.tasks` para generar lista de tareas granulares (10-20 tareas)

---

**Versión**: 2.0 (Final Phase 1 + Mejora Pública)  
**Fecha**: Enero 6, 2026  
**Reviewed**: ✅ Specification complete, Technology stack validated, Database schema ready