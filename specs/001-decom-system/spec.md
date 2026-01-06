# Feature Specification: Sistema de Gestión de Solicitudes de Comunicación - DECOM

**Feature Branch**: `001-decom-system`  
**Created**: Enero 6, 2026  
**Status**: Draft  
**Input**: Sistema web responsivo para centralizar y gestionar solicitudes de material publicitario dirigidas al comité de comunicaciones (DECOM) de la iglesia, reemplazando el flujo informal por WhatsApp con un proceso estructurado y trazable.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Comité solicita material publicitario (Priority: P1)

Como miembro de un comité de la iglesia, quiero llenar un formulario simple para solicitar material publicitario (flyer, banner, video, etc.) sin tener que escribir manualmente por WhatsApp a DECOM.

**Why this priority**: Es la funcionalidad central. Sin esto, no hay valor. Reemplaza el flujo caótico de WhatsApp.

**Independent Test**: Un comité completa el formulario, ve fechas calculadas automáticamente, y recibe confirmación de registro.

**Acceptance Scenarios**:

1. **Given** soy miembro del comité de jóvenes, **When** accedo al formulario de nueva solicitud, **Then** veo opciones para seleccionar mi comité, fecha del evento, tipo de material y número de WhatsApp.

2. **Given** he llenado los datos del evento, **When** continúo al paso 2, **Then** el sistema calcula automáticamente la fecha de planificación (7 días antes) y entrega (2 días antes).

3. **Given** necesito una cita bíblica, **When** activo el toggle, **Then** aparece un campo para escribir la cita.

4. **Given** completo el formulario, **When** hago clic en "Enviar Solicitud", **Then** veo confirmación y la solicitud aparece con estado "Pendiente".

---

### User Story 2 - DECOM gestiona solicitudes (Priority: P1)

Como administrador de DECOM, quiero ver todas las solicitudes en lista con información clave (comité, evento, fecha, estado, prioridad) y cambiar estados manualmente para trazabilidad completa.

**Why this priority**: Crítico para gestión de carga de trabajo y cumplimiento del propósito del sistema.

**Independent Test**: Un administrador ve todas las solicitudes, filtra por estado, cambia estados, y contacta vía WhatsApp cuando está lista para entregar.

**Acceptance Scenarios**:

1. **Given** soy administrador DECOM, **When** accedo al panel de gestión, **Then** veo todas las solicitudes ordenadas por prioridad automática.

2. **Given** tengo solicitudes pendientes, **When** cambio una a "En diseño", **Then** el cambio se registra en el historial y aparece con el nuevo estado.

3. **Given** el material está listo, **When** cambio a "Lista para entrega", **Then** aparece botón de WhatsApp con el número registrado.

---

### User Story 3 - DECOM visualiza en calendario (Priority: P2)

Como administrador de DECOM, quiero ver solicitudes en calendario mensual por fecha de evento para visualizar carga de trabajo semanal.

**Why this priority**: Mejora la planificación a largo plazo pero no es crítica para MVP.

**Independent Test**: Cambio entre vista Lista y Calendario, selecciono un día, y veo solicitudes de ese día.

**Acceptance Scenarios**:

1. **Given** estoy en el panel de gestión, **When** hago clic en "Calendario", **Then** cambio a vista mensual.

2. **Given** un día tiene solicitudes, **When** hago clic, **Then** veo panel inferior con solicitudes de ese día.

---

### User Story 4 - Comité visualiza calendario de solicitudes (Priority: P2)

Como miembro de un comité, quiero ver el calendario de solicitudes ya registradas antes de enviar la mía, para entender la carga de trabajo y planificar mejor mi solicitud.

**Why this priority**: Mejora la cultura organizacional, reduce conflictos, educa sin ser agresivo. Diferencia el sistema de un simple formulario.

**Independent Test**: Sin autenticación, puedo ver botón "Ver calendario de solicitudes" en formulario, ver calendario en modo solo lectura, luego enviar mi solicitud. Después de enviar, recibo confirmación con link al calendario.

**Acceptance Scenarios**:

1. **Given** accedo al formulario de solicitud, **When** veo el calendario de carga, **Then** entiendo qué eventos ya están registrados y cuáles están más cercanos.

2. **Given** veo el calendario, **When** identifico que hay muchas solicitudes para la misma semana, **Then** considero si puedo cambiar mi fecha o soy consciente de la prioridad.

3. **Given** envío mi solicitud, **When** recibo confirmación, **Then** veo link a "Consultar calendario" para seguimiento.

4. **Given** veo el calendario, **When** busco mi solicitud, **Then** la reconozco por fecha evento y tipo de material, pero no veo detalles sensibles.

---

### Edge Cases

- ¿Qué pasa si un comité solicita un evento con fecha pasada? (Rechazar con mensaje)
- ¿Qué pasa si no se cambia estado y la fecha de entrega pasó? (Marcar como vencida)
- ¿Qué pasa si el número de WhatsApp es inválido? (Validar formato antes de guardar)
- ¿Qué pasa si activa "Incluir cita" pero no escribe texto? (Requerir campo completo)

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: Sistema DEBE permitir a comités rellenar formulario con campos: comité, info evento, fecha evento, tipo material, WhatsApp, cita bíblica (sí/no).

- **FR-002**: Sistema DEBE calcular automáticamente fechas de planificación (7 días antes) y entrega (2 días antes) basándose en la fecha del evento.

- **FR-003**: Sistema DEBE mostrar fechas calculadas como solo lectura en el formulario antes de enviar.

- **FR-004**: Sistema DEBE validar campos obligatorios antes de permitir envío de solicitud.

- **FR-005**: Sistema DEBE validar formato de número WhatsApp (+57 ó 57 seguido de 10 dígitos).

- **FR-006**: Sistema DEBE almacenar solicitud con estado inicial "Pendiente".

- **FR-007**: Sistema DEBE mostrar a DECOM lista de todas las solicitudes con: comité, evento, fecha evento, estado, tipo material, prioridad.

- **FR-008**: Sistema DEBE calcular automáticamente prioridad basándose en proximidad a fechas de planificación y entrega (sin intervención manual).

- **FR-009**: Sistema DEBE permitir a DECOM filtrar solicitudes por estado: Pendiente, En planificación, En diseño, Lista para entrega, Entregada.

- **FR-010**: Sistema DEBE permitir a DECOM cambiar manualmente el estado de solicitud entre estados válidos.

- **FR-011**: Sistema DEBE mostrar botón de contacto WhatsApp cuando solicitud está "Lista para entrega", con formato `https://wa.me/[número]?text=[mensaje]`.

- **FR-012**: Sistema DEBE proporcionar vista de calendario mensual mostrando solicitudes por fecha evento con indicadores visuales de estado/prioridad.

- **FR-013**: Sistema DEBE permitir seleccionar día en calendario y mostrar panel con solicitudes de ese día.

- **FR-014**: Sistema DEBE proporcionar autenticación para DECOM y comités registrados.

- **FR-015**: Sistema DEBE ser completamente responsive y mobile-first.

- **FR-016**: Sistema DEBE mantener historial de cambios de estado para cada solicitud (trazabilidad).

- **FR-017**: Sistema DEBE validar en tiempo real mientras usuario completa formulario.

- **FR-018**: Sistema DEBE mostrar confirmación visual cuando solicitud se crea exitosamente.

- **FR-019**: Sistema DEBE permitir a comité ver sus solicitudes actuales y pasadas en dashboard personal.

- **FR-020**: Sistema DEBE aplicar paleta de colores: primario #8B0000, secundario #FFD700, con estados diferenciados por color.

- **FR-021**: Sistema DEBE proporcionar vista pública de calendario (solo lectura) accesible a comités sin autenticación.

- **FR-022**: Sistema DEBE mostrar en calendario público: fecha evento, tipo material, estado (Pendiente/En proceso/Entregada), pero SIN nombres de personas, WhatsApp, o citas bíblicas.

- **FR-023**: Sistema DEBE ofrecer botón "Ver calendario de solicitudes" EN EL FORMULARIO ANTES de enviar, para que comité vea carga actual.

- **FR-024**: Sistema DEBE mostrar link a calendario en confirmación DESPUÉS de enviar, con mensaje: "Puedes consultar el calendario para ver el orden de atención".

- **FR-025**: Vista pública de calendario DEBE permitir filtrar por: mes, año, estado (Pendiente/En proceso/Entregada), tipo material.

- **FR-026**: Sistema DEBE permitir a DECOM ver vistas múltiples de calendario: mes, semana, estado.

- **FR-027**: Sistema DEBE permitir a DECOM filtrar calendario por comité, rango de fechas, estado, prioridad.

### Key Entities

- **Solicitud (Request)**:
  - ID único (UUID)
  - Comité solicitante (referencia a Comité)
  - Información del evento (descripción)
  - Fecha del evento (date)
  - Tipo de material (flyer, banner, video, redes sociales, otro)
  - Número de WhatsApp (contacto)
  - ¿Incluir cita bíblica? (boolean)
  - Texto de cita bíblica (opcional)
  - Estado actual (enum: Pendiente, En planificación, En diseño, Lista para entrega, Entregada)
  - Fecha de inicio de planificación (calculada: event_date - 7 días)
  - Fecha de entrega sugerida (calculada: event_date - 2 días)
  - Puntuación de prioridad (calculada)
  - Fechas de creación y actualización (timestamps)
  - Historial de cambios de estado

- **Comité (Committee)**:
  - ID único (UUID)
  - Nombre del comité (texto)
  - Fecha de creación (timestamp)
  - [NEEDS CLARIFICATION: ¿Los comités tendrán usuarios individuales con roles, o es lista simple? ¿Se crea comité nuevo desde formulario o solo predefinidos (Jóvenes, Damas, Alabanza)?]

- **Usuario (User)**:
  - ID único (UUID)
  - Email
  - Hash de contraseña
  - Rol (comité_member, decom_admin)
  - Comité asociado (nullable)

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Al menos 80% de solicitudes se realizan a través del sistema en lugar de WhatsApp (primer mes).
- **SC-002**: 100% de solicitudes tienen información completa y validada (ningún campo faltante o formato inválido).
- **SC-003**: DECOM tiene visibilidad de carga de trabajo con 7+ días de anticipación (todas las solicitudes con fechas futuras y planificación clara).
- **SC-004**: Tiempo promedio para completar solicitud en móvil es menor a 3 minutos.
- **SC-005**: 95% de solicitudes tiene trazabilidad completa (todos los cambios de estado registrados).
- **SC-006**: Sistema soporta 50+ solicitudes simultáneas sin degradación de rendimiento.
- **SC-007**: Vista de calendario carga en menos de 1 segundo con 100+ solicitudes.
- **SC-008**: Comités reportan satisfacción mayor al 80% (encuesta post-lanzamiento).
- **SC-009**: Volumen de mensajes WhatsApp a DECOM se reduce en 70% mínimo.
- **SC-010**: Sistema tiene uptime de 99%.

---

## Assumptions & Dependencies

- Comités predefinidos: Jóvenes, Damas, Alabanza, y otros existentes (expandible).
- Supabase configurado y disponible.
- Usuarios DECOM administran sistema.
- Envío de archivos es responsabilidad de DECOM (no integrado).
- Sin notificaciones por email en MVP.
- Calendario muestra solo mes actual.

---

**Versión**: 1.0  
**Última actualización**: Enero 6, 2026  
**Estado**: Listo para validación y planificación
