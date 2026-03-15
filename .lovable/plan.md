

## Plan: Verificación de usuarios por link de confirmación

### Situación actual
- La autenticación tiene `auto_confirm_email: true`, lo que significa que los usuarios se confirman automáticamente sin verificar su email.
- Después de registrarse, se redirige inmediatamente a `/onboarding`.

### Cambios necesarios

**1. Desactivar auto-confirm de email**
- Usar la herramienta `configure_auth` para establecer `auto_confirm_email: false`.
- Esto hace que al registrarse se envíe un link de confirmación al correo del usuario.

**2. Crear página `/verify-email`**
- Nueva página que se muestra después de registrarse, indicando al usuario que revise su correo.
- Mostrará el email al que se envió el link, con opción de reenviar el correo.
- Diseño limpio con el logo de MoonJab, icono de correo, y mensaje claro.

**3. Actualizar flujo de registro (`Register.tsx`)**
- Después de un registro exitoso, redirigir a `/verify-email` en lugar de `/onboarding`.
- Pasar el email como state en la navegación para mostrarlo en la página de verificación.

**4. Actualizar flujo de registro en `Auth.tsx`**
- Mismo cambio: mostrar mensaje de "revisa tu correo" en lugar de redirigir directamente.

**5. Actualizar `App.tsx`**
- Agregar la ruta `/verify-email` como ruta pública.

**6. Manejar el error de email no confirmado en Login**
- Si el usuario intenta iniciar sesión sin confirmar su email, mostrar un mensaje claro indicándole que verifique su correo primero.

### Flujo resultante
```text
Registro → Verificar email (página) → Usuario hace clic en link → Redirige a /onboarding
```

