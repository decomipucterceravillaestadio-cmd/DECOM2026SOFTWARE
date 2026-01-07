# Usuarios de Prueba - DECOM System

## Credenciales de Prueba

### Administrador Principal
- **Email:** `admin@decom.test`
- **Contraseña:** `DecomAdmin123!`
- **Rol:** `decom_admin`
- **Propósito:** Acceder al panel administrativo completo

### Administrador Alterno
- **Email:** `manager@decom.test`
- **Contraseña:** `ManagerDecom123!`
- **Rol:** `decom_admin`
- **Propósito:** Pruebas de múltiples administradores

### Miembro de Comité (Referencia)
- **Email:** `miembro@comite.test`
- **Contraseña:** `Miembro123!`
- **Rol:** `comite_member`
- **Propósito:** Pruebas de permisos limitados (no requiere usar en esta fase)

---

## Pasos para Crear Usuarios en Supabase

### Opción 1: A través del Dashboard de Supabase (Recomendado para Testing)

1. Accede a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto `decom-system`
3. Ve a **Authentication** → **Users**
4. Click en **+ Invitar usuario** o **+ Crear nuevo usuario**
5. Para cada usuario de prueba:
   - Email: (según tabla anterior)
   - Contraseña: (según tabla anterior)
   - Marca **Auto confirm user** para evitar validación de email
   - Click **Enviar invitación** o **Crear usuario**

### Opción 2: SQL Script para Migración

Copia y ejecuta en la consola SQL de Supabase:

```sql
-- Crear usuarios de prueba
-- NOTA: Supabase no permite crear usuarios directamente vía SQL
-- Usa el Dashboard (Opción 1) para crear los usuarios

-- Una vez que los usuarios existan en auth.users, 
-- asigna los roles ejecutando esto:

-- Para admin@decom.test
INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT id, email, 'decom_admin', 'Admin DECOM', now(), now()
FROM auth.users 
WHERE email = 'admin@decom.test'
ON CONFLICT (id) DO UPDATE SET role = 'decom_admin';

-- Para manager@decom.test
INSERT INTO public.users (id, email, role, full_name, created_at, updated_at)
SELECT id, email, 'decom_admin', 'Manager DECOM', now(), now()
FROM auth.users 
WHERE email = 'manager@decom.test'
ON CONFLICT (id) DO UPDATE SET role = 'decom_admin';
```

---

## Flujo de Prueba Recomendado

### 1. Probar Formulario Público (Sin Login)
- [ ] Abre `http://localhost:3000`
- [ ] Debe ver el formulario de 2 pasos
- [ ] Completa **Paso 1**: Selecciona comité, nombre evento, info, fecha
- [ ] Avanza a **Paso 2**: Selecciona tipo material, ingresa WhatsApp, versículo opcional
- [ ] Envía el formulario
- [ ] Debe redirigir a `/confirmation` con ID de solicitud

### 2. Probar Login de Administrador
- [ ] Click en **🔐 Iniciar Sesión** (esquina superior derecha)
- [ ] Ingresa: `admin@decom.test` / `DecomAdmin123!`
- [ ] Debe redirigir a `/dashboard`
- [ ] Debe mostrar solicitudes creadas en paso anterior

### 3. Probar Logout
- [ ] En el dashboard, busca botón de logout
- [ ] Click para cerrar sesión
- [ ] Debe redirigir a `/login` o `/`

### 4. Probar Rutas Protegidas
- [ ] Intenta acceder a `http://localhost:3000/admin` sin estar autenticado
- [ ] Debe redirigir a `/login`
- [ ] Con sesión activa, debe permitir acceso

---

## Notas Importantes

### Restricciones de Rol
- **decom_admin**: Acceso a `/admin/*` y `/dashboard/*`
- **Usuarios públicos**: Solo pueden acceder a `/new-request` y `/confirmation`
- **Sin sesión**: `/login` y `/calendar` públicos

### Validaciones del Login
```typescript
// Los usuarios deben cumplir:
- Email válido formato
- Contraseña 6+ caracteres
- Rol en DB debe ser 'decom_admin'
```

### Problemas Comunes

**"Usuario no existe"**
- Verifica que el usuario fue creado en Dashboard
- Confirma que el email coincide exactamente

**"No autorizado"**
- El usuario existe en auth pero NO en tabla `public.users`
- Ejecuta el SQL script anterior para asignar el rol

**Cookies de sesión no persisten**
- Borra el storage del navegador: DevTools → Application → Cookies
- Intenta login nuevamente

---

## Próximos Pasos (Después de FASE 2)

Una vez validado el flujo, procede con:
- [ ] FASE 3: Panel Administrativo (Ver todas las solicitudes, cambiar estados, asignar comités)
- [ ] FASE 4: Calendarios (Vista pública de eventos, gestión de fechas)
- [ ] FASE 5: Integración WhatsApp + Testing

---

**Última actualización:** FASE 2 completada
**Estado:** Listo para testing manual
