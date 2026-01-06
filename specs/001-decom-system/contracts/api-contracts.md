# Phase 1: API Contracts - DECOM System

**Created**: Enero 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`

---

## Overview

This document defines all API endpoints, request/response schemas, and integration patterns for the DECOM system. Covers both Supabase client-side APIs and Next.js route handlers.

---

## API Architecture

**Pattern**: Supabase client-side queries + Next.js API routes for business logic

```
User → Next.js Pages/Components
     ↓
     → Supabase JS Client (realtime subscriptions for live updates)
     ↓
     → Supabase PostgreSQL Database
```

**No custom backend server**: All logic in Next.js edge functions + Supabase RLS policies

---

## Authentication API

### POST /api/auth/signup

**Purpose**: Create new user account and register with Supabase Auth

**Request**:
```json
{
  "email": "usuario@iglesia.com",
  "password": "secure_password_123",
  "fullName": "Juan Pérez",
  "preferredCommitteeId": "uuid-of-committee",
  "role": "comite_member" // or "decom_admin" (admin-only)
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@iglesia.com",
    "fullName": "Juan Pérez",
    "role": "comite_member",
    "preferredCommitteeId": "uuid",
    "createdAt": "2026-01-06T12:00:00Z"
  },
  "session": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Invalid email format",
  "code": "INVALID_EMAIL"
}
```

**Response** (409 Conflict):
```json
{
  "error": "Email already exists",
  "code": "EMAIL_EXISTS"
}
```

**Validations**:
- Email: Valid format, unique in system
- Password: Min 8 chars (enforced client-side + server-side)
- preferredCommitteeId: Valid UUID, exists in committees table
- role: Only 'comite_member' or 'decom_admin'

---

### POST /api/auth/login

**Purpose**: Authenticate user and create session

**Request**:
```json
{
  "email": "usuario@iglesia.com",
  "password": "secure_password_123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@iglesia.com",
    "role": "comite_member",
    "preferredCommitteeId": "uuid",
    "createdAt": "2026-01-06T12:00:00Z"
  },
  "session": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

---

### POST /api/auth/logout

**Purpose**: End user session and clear cookies

**Request**: No body required (uses Authorization header)

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

## Requests API

### GET /api/requests

**Purpose**: List all requests (filtered by user's role and permissions)

**Query Parameters**:
```
?status=Pendiente,En planificación
&sort=priority_score,-event_date
&limit=20
&offset=0
&committeeId=uuid (optional, DECOM only)
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "committeeName": "Jóvenes",
      "committeeId": "uuid",
      "eventName": "Retiro anual 2026",
      "eventDate": "2026-02-15",
      "planningStartDate": "2026-02-08",
      "deliveryDate": "2026-02-13",
      "materialType": "banner",
      "contactWhatsapp": "+573001234567",
      "includeBibleVerse": true,
      "bibleVerseText": "Juan 3:16 - Porque de tal manera amó Dios al mundo...",
      "status": "En diseño",
      "priorityScore": 7,
      "createdAt": "2026-01-06T12:00:00Z",
      "createdBy": "user-uuid",
      "updatedAt": "2026-01-06T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "pages": 3
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**Behaviors by Role**:
- **comite_member**: See only their own requests
- **decom_admin**: See all requests, can filter by committee

---

### POST /api/requests

**Purpose**: Create new request (submit by committee)

**Request**:
```json
{
  "committeeId": "uuid",
  "eventName": "Retiro anual 2026",
  "eventInfo": "Retiro de jóvenes de 3 días en la montaña...",
  "eventDate": "2026-02-15",
  "materialType": "banner",
  "contactWhatsapp": "+573001234567",
  "includeBibleVerse": true,
  "bibleVerseText": "Juan 3:16 - Porque de tal manera amó Dios al mundo..."
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "uuid",
    "committeeId": "uuid",
    "committeeName": "Jóvenes",
    "eventName": "Retiro anual 2026",
    "eventDate": "2026-02-15",
    "planningStartDate": "2026-02-08",
    "deliveryDate": "2026-02-13",
    "materialType": "banner",
    "contactWhatsapp": "+573001234567",
    "includeBibleVerse": true,
    "bibleVerseText": "Juan 3:16...",
    "status": "Pendiente",
    "priorityScore": 3,
    "createdAt": "2026-01-06T12:00:00Z",
    "createdBy": "user-uuid"
  },
  "message": "Solicitud creada exitosamente"
}
```

**Response** (400 Bad Request):
```json
{
  "errors": {
    "eventDate": "Event date must be in the future",
    "contactWhatsapp": "Invalid WhatsApp number format",
    "bibleVerseText": "Bible verse is required when includeBibleVerse is true"
  },
  "code": "VALIDATION_ERROR"
}
```

**Response** (403 Forbidden):
```json
{
  "error": "Committee mismatch: You can only submit requests for your own committee",
  "code": "FORBIDDEN"
}
```

**Validations** (server-side, echoes client-side):
- eventDate: Must be future
- contactWhatsapp: Must match regex `^\+?57\d{10}$`
- eventInfo: 5-500 characters
- bibleVerseText: Required if includeBibleVerse = true, max 200 chars
- committeeId: User must be member of that committee (or DECOM admin)

---

### GET /api/requests/:id

**Purpose**: Retrieve single request details

**Path Parameters**:
```
:id = UUID of request
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "committeeId": "uuid",
    "committeeName": "Jóvenes",
    "createdBy": "user-uuid",
    "createdByName": "Juan Pérez",
    "eventName": "Retiro anual 2026",
    "eventInfo": "Retiro de jóvenes...",
    "eventDate": "2026-02-15",
    "planningStartDate": "2026-02-08",
    "deliveryDate": "2026-02-13",
    "materialType": "banner",
    "contactWhatsapp": "+573001234567",
    "includeBibleVerse": true,
    "bibleVerseText": "Juan 3:16...",
    "status": "En diseño",
    "priorityScore": 7,
    "createdAt": "2026-01-06T12:00:00Z",
    "updatedAt": "2026-01-06T13:30:00Z",
    "history": [
      {
        "id": "uuid",
        "oldStatus": "Pendiente",
        "newStatus": "En planificación",
        "changedBy": "admin-uuid",
        "changedByName": "María García",
        "changedAt": "2026-01-06T12:30:00Z"
      },
      {
        "id": "uuid",
        "oldStatus": "En planificación",
        "newStatus": "En diseño",
        "changedBy": "admin-uuid",
        "changedByName": "María García",
        "changedAt": "2026-01-06T13:30:00Z"
      }
    ]
  }
}
```

**Response** (403 Forbidden):
```json
{
  "error": "You don't have access to this request",
  "code": "FORBIDDEN"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Request not found",
  "code": "NOT_FOUND"
}
```

**Behaviors by Role**:
- **comite_member**: Can see own requests only
- **decom_admin**: Can see all requests

---

### PATCH /api/requests/:id

**Purpose**: Update request status (DECOM only)

**Path Parameters**:
```
:id = UUID of request
```

**Request**:
```json
{
  "status": "En diseño",
  "changeReason": "Starting design work today"
}
```

**Allowed Status Transitions**:
```
Pendiente → En planificación, En diseño
En planificación → En diseño, Lista para entrega
En diseño → Lista para entrega, En planificación
Lista para entrega → Entregada, En diseño
Entregada → (no transitions back)
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "status": "En diseño",
    "updatedAt": "2026-01-06T13:30:00Z",
    "history": [
      {
        "id": "uuid",
        "oldStatus": "En planificación",
        "newStatus": "En diseño",
        "changedBy": "admin-uuid",
        "changedByName": "María García",
        "changedAt": "2026-01-06T13:30:00Z",
        "changeReason": "Starting design work today"
      }
    ]
  },
  "message": "Estado actualizado exitosamente"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Invalid status transition: Cannot go from 'Entregada' to 'En diseño'",
  "code": "INVALID_TRANSITION"
}
```

**Response** (403 Forbidden):
```json
{
  "error": "Only DECOM admins can change request status",
  "code": "FORBIDDEN"
}
```

**Response** (404 Not Found):
```json
{
  "error": "Request not found",
  "code": "NOT_FOUND"
}
```

---

## Committees API

### GET /api/committees

**Purpose**: List all predefined committees

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "Jóvenes",
      "description": "Ministerio de jóvenes",
      "colorBadge": "bg-blue-500",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid-2",
      "name": "Damas",
      "description": "Ministerio de damas",
      "colorBadge": "bg-pink-500",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Caching**: Can be cached client-side for entire session (rarely changes)

---

## User Profile API

### GET /api/user/profile

**Purpose**: Get current logged-in user's profile

**Request**: No body (uses Authorization header)

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "email": "usuario@iglesia.com",
    "fullName": "Juan Pérez",
    "role": "comite_member",
    "preferredCommitteeId": "uuid",
    "preferredCommitteeName": "Jóvenes",
    "createdAt": "2026-01-06T12:00:00Z"
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

---

### PATCH /api/user/profile

**Purpose**: Update user profile (non-admin fields)

**Request**:
```json
{
  "fullName": "Juan Carlos Pérez",
  "preferredCommitteeId": "new-uuid"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "uuid",
    "email": "usuario@iglesia.com",
    "fullName": "Juan Carlos Pérez",
    "role": "comite_member",
    "preferredCommitteeId": "new-uuid",
    "preferredCommitteeName": "Damas",
    "createdAt": "2026-01-06T12:00:00Z",
    "updatedAt": "2026-01-06T14:00:00Z"
  }
}
```

---

## WhatsApp Integration

### GET /api/whatsapp/link

**Purpose**: Generate safe WhatsApp link for contacting request creator

**Query Parameters**:
```
?requestId=uuid
&message=opcional%20mensaje%20personalizado
```

**Response** (200 OK):
```json
{
  "data": {
    "phoneNumber": "+573001234567",
    "message": "Hola, tu solicitud de material está lista para entrega",
    "whatsappUrl": "https://wa.me/573001234567?text=Hola%2C%20tu%20solicitud%20de%20material%20est%C3%A1%20lista%20para%20entrega",
    "shortCode": "https://decom.app/wa/uuid-short-code"
  }
}
```

**Usage in Frontend**:
```html
<a href="https://wa.me/573001234567?text=..." target="_blank">
  Contactar por WhatsApp
</a>
```

**Notes**:
- No files are sent (only text link)
- User manually decides to send files via WhatsApp
- Short URL is optional (for shortening long messages)

---

## Public Calendar API

**Purpose**: Read-only calendar view for non-authenticated comité members to see existing solicitations and workload

### GET /api/public/calendar

**Authentication**: NO (Public API)

**Purpose**: Retrieve all requests for public calendar view (no sensitive data)

**Query Parameters**:
```
?month=1          // Optional: 1-12 (default: current month)
&year=2026        // Optional (default: current year)
&materialType=flyer // Optional: flyer, banner, video, redes, otro
&status=Pendiente // Optional: Pendiente, En_planificacion, En_diseño, Lista_para_entrega, Entregada
&limit=50         // Optional: max records (default: 50, max: 100)
&offset=0         // Optional: pagination offset
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "uuid-1",
      "eventDate": "2026-02-15",
      "materialType": "flyer",
      "status": "En_planificacion",
      "priorityScore": 8,
      "daysSinceCreated": 3,
      "daysUntilDelivery": 4
    },
    {
      "id": "uuid-2",
      "eventDate": "2026-02-20",
      "materialType": "banner",
      "status": "Pendiente",
      "priorityScore": 6,
      "daysSinceCreated": 1,
      "daysUntilDelivery": 9
    }
  ],
  "pagination": {
    "total": 47,
    "limit": 50,
    "offset": 0,
    "pages": 1
  },
  "meta": {
    "month": 2,
    "year": 2026,
    "totalByStatus": {
      "Pendiente": 15,
      "En_planificacion": 22,
      "En_diseño": 8,
      "Lista_para_entrega": 2,
      "Entregada": 0
    },
    "totalByMaterialType": {
      "flyer": 25,
      "banner": 15,
      "video": 5,
      "redes": 2,
      "otro": 0
    }
  }
}
```

**Response** (200 OK - Empty month):
```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "limit": 50,
    "offset": 0,
    "pages": 0
  },
  "meta": {
    "month": 3,
    "year": 2026,
    "totalByStatus": {},
    "totalByMaterialType": {}
  }
}
```

**What IS Visible**:
- ✅ Event date
- ✅ Material type (flyer, banner, video, redes, otro)
- ✅ Status (workflow progress indicator)
- ✅ Priority score (1-10, indicates urgency)
- ✅ Days since created (shows workload progression)
- ✅ Days until delivery (shows timeline)

**What is NOT Visible** (Protected/Encrypted):
- ❌ Committee name (no user can identify who requested)
- ❌ Event name / Event info (private details)
- ❌ Contact WhatsApp (encrypted, never exposed)
- ❌ Bible verses (private)
- ❌ User name (private)

**Use Cases**:
1. **Before submitting form**: Comité views calendar to understand current workload
   - "Oh, there are 5 flyers already in progress, maybe I should submit a banner instead"
2. **After submitting form**: Comité receives link to see where their request appears
   - "I can see my request is Pendiente, 3 others are ahead of me"
3. **Cultural leadership**: Transparency reduces conflict and improves understanding
   - "Now I understand we're not being slow, there's just a lot of work"

**Frontend Integration**:
```typescript
// components/PublicCalendar.tsx
async function PublicCalendar({ month, year }: Props) {
  const response = await fetch(
    `/api/public/calendar?month=${month}&year=${year}`
  );
  const { data, meta } = await response.json();
  
  return (
    <div>
      <h3>Ver carga de solicitudes</h3>
      <div className="status-summary">
        {Object.entries(meta.totalByStatus).map(([status, count]) => (
          <div key={status}>{status}: {count}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {data.map(request => (
          <CalendarDay
            date={request.eventDate}
            type={request.materialType}
            status={request.status}
            priority={request.priorityScore}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Real-Time Subscriptions (Optional, Phase 2+)

**Purpose**: Live updates of requests list for DECOM dashboard

**Using Supabase Realtime**:
```typescript
// hooks/useRequestsRealtime.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRequestsRealtime() {
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    // Subscribe to all changes on requests table
    const subscription = supabase
      .channel('requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          console.log('Change received!', payload);
          // Update local state based on payload
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return requests;
}
```

---

## Error Handling Standards

All errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Optional field-specific error"
  },
  "timestamp": "2026-01-06T12:00:00Z"
}
```

**Common Error Codes**:
- `UNAUTHORIZED`: Missing/invalid authentication
- `FORBIDDEN`: User doesn't have permission
- `VALIDATION_ERROR`: Request body validation failed
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `INVALID_TRANSITION`: Invalid state transition
- `INTERNAL_ERROR`: Server error

---

## Rate Limiting

**Strategy**: No explicit rate limiting for MVP (Supabase free tier has implicit limits)

**Future consideration**: Implement rate limiting per user:
```
- 10 requests/minute per user (read operations)
- 2 requests/minute per user (write operations)
```

---

## CORS & Security Headers

**CORS Policy**: Same-origin (frontend on same domain as API)

**Security Headers** (set in Next.js middleware):
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Pagination Standard

All list endpoints use pagination:

```
GET /api/resource?limit=20&offset=0

Response:
{
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "pages": 5
  }
}
```

---

## Date Format Standard

All dates in ISO 8601 UTC format:
```
2026-01-06T12:00:00Z
```

---

## Next Steps

Implementation will create:
1. **database-schema.sql**: DDL for Supabase
2. **lib/supabase/client.ts**: Client initialization
3. **app/api/** route handlers matching these contracts
4. **lib/hooks/use*.ts**: Custom React hooks for data fetching

---

**API Contracts Status**: ✅ COMPLETE  
**Ready for implementation**: ✅ YES

**Date**: Enero 6, 2026  
**Reviewed by**: Assistant (GitHub Copilot)
