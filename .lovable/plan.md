

## Problema

Cuando el usuario hace clic en el link de confirmación del email, es redirigido a `/onboarding`. Pero `/onboarding` está protegida por `ProtectedRoute`, que verifica la sesión con `supabase.auth.getSession()`. El problema es una **condición de carrera**: el token del URL aún no ha sido procesado cuando `ProtectedRoute` verifica la autenticación, así que no encuentra sesión y redirige a `/login`.

## Solución

Cambiar el `emailRedirectTo` para que apunte a `/auth` (o la raíz `/`) en lugar de `/onboarding`. La página `/auth` ya tiene lógica en su `useEffect` que detecta cuando hay sesión activa y redirige automáticamente a `/onboarding` o `/dashboard` según el estado del perfil.

### Cambios necesarios

1. **`src/store/useAuthStore.ts`** — Cambiar `emailRedirectTo` de `/onboarding` a `/auth`
2. **`src/pages/Auth.tsx`** — Ya maneja la redirección correcta (no necesita cambios)
3. **`src/pages/VerifyEmail.tsx`** — Cambiar el `emailRedirectTo` del botón "Reenviar" de `/onboarding` a `/auth`

### Flujo corregido

```text
Registro → /verify-email → Clic en link del correo → /auth → detecta sesión → /onboarding
```

Tres líneas de código a cambiar en total.

