# Phase 1: Developer Quickstart - DECOM System

**Created**: Enero 6, 2026  
**Feature**: Sistema de Gestión de Solicitudes de Comunicación - DECOM  
**Branch**: `001-decom-system`

---

## Welcome to DECOM System Development! 👋

This guide gets you from zero to running the app locally in ~15 minutes.

---

## Prerequisites

**Required**:
- Node.js 18+ (check with `node --version`)
- npm or yarn package manager
- Git (already have it)
- A Supabase account (free tier at https://supabase.com)

**Optional but recommended**:
- VS Code with extensions: Prettier, ESLint, Tailwind CSS IntelliSense
- GitHub CLI for pushing branches

---

## Step 1: Clone & Install Dependencies

```bash
# You already have the repo locally, update dependencies
cd /home/juanda/decom-system

# Install all npm packages
npm install

# Verify installation
npm run dev
# Should start on http://localhost:3000 (may fail if Supabase not configured yet - that's OK)
```

---

## Step 2: Set Up Supabase Project

### Option A: Use Existing Supabase Project (if your team has one)

1. Go to https://supabase.com → sign in
2. Open your team project
3. Copy the Project URL and Anon Key from Settings → API
4. Create `.env.local` file in project root:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For server-side only
```

### Option B: Create New Supabase Project (MVP/Development)

1. Go to https://supabase.com → Create new project
2. Give it name: "decom-system-dev"
3. Choose region: South America (São Paulo)
4. Copy credentials to `.env.local` (same as Option A)
5. Continue to Step 3 (create database tables)

---

## Step 3: Create Database Tables

**Via Supabase Dashboard (Easiest)**:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Paste contents from [database-schema.sql](database-schema.sql)
4. Click "Run" (will execute all migrations)

**Via SQL file** (if available):
```bash
supabase db push  # if using Supabase CLI
```

**What gets created**:
- `committees` table (with predefined committees)
- `users` table (via Supabase Auth integration)
- `requests` table (with validations)
- `request_history` table (audit trail)
- Indexes and RLS policies (security)

---

## Step 4: Configure Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable: Email/Password (default, already enabled)
3. **Optional**: Enable Google/GitHub OAuth (not needed for MVP)

**Email Templates** (customize if desired):
- Settings → Email Templates
- Defaults are English; can add Spanish translations later

---

## Step 5: Create Your First Test User

**Via Supabase Dashboard**:
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `test@iglesia.com`
4. Password: `test123456`
5. Click "Create user"

**Via App UI** (better for testing):
1. Run `npm run dev`
2. Go to http://localhost:3000
3. Click "Sign up"
4. Register as new user
5. Your email will be created in auth.users

---

## Step 6: Set Up Local Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
nano .env.local  # or open in VS Code

# Should look like:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Step 7: Run Development Server

```bash
npm run dev

# Output:
# ▲ Next.js 14.0.4
# - Local:        http://localhost:3000
# - Environments: .env.local

# Open http://localhost:3000 in browser
```

---

## Project Structure Overview

```
decom-system/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login/signup routes
│   ├── (protected)/       # Protected routes (require auth)
│   ├── api/               # API route handlers
│   └── layout.tsx
├── components/             # React components
│   ├── forms/             # Form components
│   ├── dashboard/         # Dashboard components
│   └── common/            # Shared components
├── lib/                   # Utilities & helpers
│   ├── supabase/          # Supabase client
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript types
│   └── constants/         # App constants
├── specs/                 # Feature specifications & plans
│   └── 001-decom-system/  # This feature
├── .env.local            # Environment vars (GITIGNORED)
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # Build for production
npm run start            # Run production build

# Testing
npm run test             # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run E2E tests (Playwright)

# Linting & Formatting
npm run lint            # Check TypeScript & ESLint
npm run format          # Format code with Prettier

# Database
npm run db:push         # Push schema to Supabase (if using CLI)
npm run db:seed         # Seed test data
```

---

## Working with Git & Feature Branches

You're on branch `001-decom-system`. Keep it clean:

```bash
# Before starting work
git pull origin 001-decom-system

# Create a sub-feature branch for specific work
git checkout -b 001-forms/multi-step-request
# Work on it...
# Commit and push
git push origin 001-forms/multi-step-request

# When done, merge back to main feature branch
git checkout 001-decom-system
git merge 001-forms/multi-step-request
git push origin 001-decom-system
```

---

## Common Development Tasks

### Task 1: Add a New API Endpoint

1. Create file: `app/api/feature/route.ts`
2. Export handlers: `export async function GET()`, `POST()`, etc.
3. Use Supabase client to query DB
4. Return JSON response
5. Test with curl or Postman:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/requests
```

### Task 2: Create a New Component

1. Create file: `components/feature/FeatureName.tsx`
2. Export React component:

```typescript
export function FeatureName() {
  return <div>Feature content</div>;
}
```

3. Import in page: `import { FeatureName } from '@/components/feature/FeatureName'`

### Task 3: Use Supabase Data in Component

```typescript
'use client';  // Client component (can use hooks)

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('priority_score', { ascending: false });
      
      if (error) console.error('Error:', error);
      else setRequests(data || []);
      
      setLoading(false);
    }

    fetchRequests();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <ul>
      {requests.map(req => (
        <li key={req.id}>{req.event_name}</li>
      ))}
    </ul>
  );
}
```

### Task 4: Form with Validation

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { requestFormSchema } from '@/lib/validation';

export function RequestForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(requestFormSchema),
  });

  async function onSubmit(data) {
    const response = await fetch('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log('Created:', result);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('eventName')} />
      {errors.eventName && <span>{errors.eventName.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Task 5: Public Calendar (No Auth Required)

```typescript
'use client';

import { useEffect, useState } from 'react';

export function PublicCalendar({ month = 1, year = 2026 }) {
  const [requests, setRequests] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This endpoint requires NO authentication - anyone can access it
    async function fetchPublicCalendar() {
      try {
        const response = await fetch(
          `/api/public/calendar?month=${month}&year=${year}`
        );
        const json = await response.json();
        setRequests(json.data || []);
        setMeta(json.meta || {});
      } catch (error) {
        console.error('Error fetching public calendar:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicCalendar();
  }, [month, year]);

  if (loading) return <div>Cargando calendario...</div>;

  return (
    <div>
      <h2>Solicitudes en curso - {month}/{year}</h2>
      
      {/* Status Summary */}
      <div className="summary">
        {meta?.totalByStatus && Object.entries(meta.totalByStatus).map(
          ([status, count]) => (
            <div key={status}>
              <strong>{status}:</strong> {count}
            </div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {requests.length === 0 ? (
          <p>No hay solicitudes en este mes</p>
        ) : (
          requests.map(request => (
            <div key={request.id} className="calendar-item">
              <div className="date">{request.eventDate}</div>
              <div className="type">{request.materialType}</div>
              <div className="status">{request.status}</div>
              <div className="priority">Prioridad: {request.priorityScore}/10</div>
            </div>
          ))
        )}
      </div>

      <p className="note">
        Ver el calendario te ayuda a entender nuestra carga de trabajo 
        y a planificar mejor tu solicitud.
      </p>
    </div>
  );
}
```

**Key points**:
- No `Authorization` header needed (public endpoint)
- Shows: date, type, status, priority (no sensitive data)
- Helps users understand workload before submitting request
- Reduces conflicts by promoting transparency

---

## Testing Locally

### Test Authentication Flow

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/auth/signup
3. Create account with `test2@iglesia.com` / `password123`
4. Verify you're redirected to dashboard
5. Check Supabase Dashboard → Authentication → Users (should see your user)

### Test Request Creation

1. Logged in as committee member
2. Click "Nueva Solicitud"
3. Fill form (all fields required)
4. Click "Enviar"
5. Verify request appears in dashboard with status "Pendiente"
6. Check Supabase Dashboard → requests table (should see new row)

### Test Admin Flow

1. Go to Supabase Dashboard → users table
2. Change your user's role to `decom_admin`
3. Refresh app
4. Should see admin panel at `/admin/gestionar`
5. Can change request statuses and click WhatsApp links

---

## Debugging Tips

### Check Supabase Connection

```typescript
// In browser console
const { data } = await supabase.from('committees').select();
console.log(data);  // Should show committees list
```

### View API Logs

- Supabase Dashboard → Logs → API
- Shows all requests to your database (useful for debugging)

### Enable Debug Mode

```typescript
// lib/supabase/client.ts
const supabase = createClient(url, key, {
  auth: { debug: true },
  db: { schema: 'public' },
});
```

### Test API Endpoints

```bash
# Get all requests (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/requests

# Create request (POST)
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"eventName":"Test","eventDate":"2026-02-15",...}'
```

---

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not defined"

**Solution**: 
- Check `.env.local` exists in project root
- Restart dev server: `Ctrl+C` then `npm run dev`
- Verify you have both `NEXT_PUBLIC_*` vars

### Issue: "Authentication required" on all endpoints

**Solution**:
- Check your JWT token is valid
- Go to Supabase Dashboard → Authentication → Users
- Create test user if missing
- Login via app UI to generate session
- Check browser cookies for `sb-access-token`

### Issue: Form validation not working

**Solution**:
- Install Zod: `npm install zod`
- Check validation schema is exported from `lib/validation.ts`
- Verify form uses `zodResolver`
- Check browser console for error details

### Issue: Database table doesn't exist

**Solution**:
- Go to Supabase Dashboard → SQL Editor
- Run database-schema.sql file
- Check that tables appear in Table Editor
- Verify RLS is enabled if using policies

---

## Next: Start Building!

Now you're ready to develop features. Here's the typical workflow:

1. **Pick a task** from [specs/001-decom-system/tasks.md](tasks.md) (created by `/speckit.tasks`)
2. **Create a sub-branch**: `git checkout -b 001-feature/description`
3. **Build the feature**: Components + API routes + tests
4. **Test locally**: `npm run dev` + browser testing
5. **Commit & push**: `git push origin 001-feature/description`
6. **Merge to feature branch**: `git checkout 001-decom-system && git merge 001-feature/description`
7. **Repeat** until all tasks done

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## Getting Help

**In your team**:
- Ask in code review comments
- Share findings in team notes
- Link to spec sections that clarify requirements

**Online Resources**:
- Supabase Discord: https://discord.supabase.com
- GitHub Discussions: https://github.com/supabase/supabase/discussions
- Stack Overflow: Tag `supabase` + `nextjs`

---

## Checklist: You're Ready When... ✓

- [ ] Dependencies installed (`npm install` completed)
- [ ] `.env.local` created with Supabase credentials
- [ ] Database tables created (Supabase SQL Editor)
- [ ] Dev server runs (`npm run dev` → http://localhost:3000)
- [ ] Can sign up / login successfully
- [ ] Can see committees in form dropdown
- [ ] Can create a test request
- [ ] Request appears in requests table in Supabase

**🚀 Once all checked, you're ready to start building!**

---

**Last Updated**: Enero 6, 2026  
**Status**: ✅ Ready for Development
