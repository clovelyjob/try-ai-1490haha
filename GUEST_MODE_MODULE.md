# Módulo de Acceso sin Registro (Modo Invitado) - Clovely

## Descripción General

El módulo de Modo Invitado permite a los usuarios explorar Clovely sin necesidad de crear una cuenta, reduciendo la fricción de entrada y aumentando la retención temprana. Los usuarios pueden probar funcionalidades clave antes de decidir registrarse, con la opción de convertir su sesión de prueba en una cuenta permanente que conserva todo su progreso.

## Objetivo

- **Reducir abandono**: Eliminar barreras de entrada permite que más usuarios prueben el producto
- **Try before sign-up**: Los usuarios experimentan valor inmediato sin compromiso
- **Conversión fluida**: Proceso simple para convertir datos temporales en cuenta permanente

## Tecnologías Utilizadas

- **React 18** con Vite
- **Zustand** con persistencia para gestión de estado
- **localStorage** para datos temporales
- **Framer Motion** para animaciones suaves
- **Zod** para validación de formularios
- **shadcn/ui** para componentes UI
- **TailwindCSS** para estilos

## Estructura de Archivos

```
src/
├── pages/
│   ├── GuestStart.tsx           # Página de carga al iniciar modo invitado
│   └── Landing.tsx              # Landing actualizado con botón demo
├── components/
│   └── GuestBanner.tsx          # Banner persistente + modal de registro
├── store/
│   └── useAuthStore.ts          # Store actualizado con modo invitado
```

## Características Principales

### 1. Inicio Modo Invitado

**Punto de entrada:**
- Botón "Probar sin registrarse" en Landing page
- Ruta: `/guest-start`
- Animación de carga 2 segundos
- Redirección automática a `/dashboard`

**Datos generados:**
```typescript
{
  user: {
    id: 'guest_' + timestamp,
    name: 'Usuario Invitado',
    email: '',
    plan: 'free',
    onboardingCompleted: true
  },
  guestData: {
    skills: [
      { name: 'Comunicación', level: 'En desarrollo' },
      { name: 'Pensamiento crítico', level: 'Fortaleza' },
      { name: 'Gestión del tiempo', level: 'Por explorar' }
    ],
    progress: { cv: false, interview: true, rewards: false },
    startedAt: ISO timestamp
  }
}
```

**Persistencia:**
- Todo guardado en `localStorage` bajo clave `clovely-auth`
- Sobrevive recargas de página
- Se limpia al hacer logout

### 2. Banner de Usuario Invitado

**GuestBanner Component:**

**Ubicación:**
- Aparece en top de Dashboard y Coach cuando `isGuestMode === true`
- Sticky position, z-index alto para estar siempre visible
- Puede minimizarse temporalmente (pero no eliminarse permanentemente)

**Diseño:**
- Background gradient sutil (primary/secondary)
- Icono Sparkles
- Texto: "Estás usando la versión demo. Tus datos no se guardarán permanentemente."
- Botón CTA: "Crear mi cuenta" (gradient orange)
- Botón cerrar temporal (X)

**Animaciones:**
- Entrada desde arriba (slide-in)
- Salida suave (fade-out) al minimizar
- Reaparece en próxima navegación si no se ha registrado

### 3. Modal de Conversión a Cuenta Real

**Trigger:**
- Click en "Crear mi cuenta" desde GuestBanner
- También accesible desde menú de usuario

**Formulario:**
```typescript
{
  name: string (min 2 chars),
  email: string (email válido),
  password: string (min 8 chars)
}
```

**Validación:**
- Realizada con Zod schema
- Errores inline por campo
- Iconos AlertCircle para errores visuales

**Proceso:**
1. Usuario completa formulario
2. Click "Crear mi cuenta"
3. Validación local (Zod)
4. Mock API call (500ms delay)
5. Migración de datos:
   - `guestData` → nuevo perfil de usuario
   - `localStorage` actualizado
   - `isGuestMode: false`
6. Toast success: "¡Cuenta creada exitosamente! Tu progreso se ha guardado"
7. Modal se cierra
8. Banner desaparece

**Estados visuales:**
- Spinner en botón durante envío
- Campos deshabilitados mientras procesa
- Skeleton en transición

### 4. Migración de Datos

**Datos preservados al convertir:**
- Habilidades con etiquetas cualitativas
- Progreso en módulos (CV, entrevistas, recompensas)
- Microacciones completadas (si aplica)
- Preferencias de configuración

**Datos creados nuevos:**
- ID de usuario real (timestamp)
- Email y nombre del formulario
- Avatar generado (dicebear API)
- createdAt actualizado

**Mock API endpoint:**
```typescript
POST /mock/demo/migrate
Request: { guestId, name, email, password }
Response: { userId, success: true }
```

## Hooks y Store

### useAuthStore (Actualizado)

**Nuevos estados:**
```typescript
{
  isGuestMode: boolean,
  guestData: any | null
}
```

**Nuevas acciones:**
```typescript
startGuestMode: () => void
convertGuestToUser: (name, email, password) => Promise<void>
```

**Uso:**
```typescript
const { isGuestMode, startGuestMode, convertGuestToUser } = useAuthStore();

// Iniciar modo invitado
startGuestMode();

// Convertir a usuario real
await convertGuestToUser('Ana García', 'ana@email.com', 'password123');
```

## Flujos de Usuario

### Flujo 1: Acceso como Invitado

1. Usuario llega a Landing page
2. Ve dos opciones:
   - "Probar sin registrarse"
   - "Descubre tu camino ideal" (registro normal)
3. Click en "Probar sin registrarse"
4. Redirige a `/guest-start`
5. Animación de carga (2s)
6. Automáticamente crea usuario invitado
7. Redirige a `/dashboard`
8. Banner aparece en top: "Estás en modo demo"

### Flujo 2: Exploración como Invitado

1. Usuario navega libremente por:
   - Dashboard
   - Career Coach (chat, planificador, entrevistas)
   - Rewards
   - Settings (limitado)
2. Banner permanece visible en todas las vistas
3. Datos guardados en `localStorage`
4. Puede cerrar temporalmente el banner

### Flujo 3: Conversión a Usuario Real

1. Usuario decide crear cuenta
2. Click "Crear mi cuenta" en banner
3. Modal aparece con formulario
4. Completa: nombre, email, contraseña
5. Validación en tiempo real
6. Submit → spinner activo
7. Mock API (500ms)
8. Datos migrados automáticamente
9. Toast: "Cuenta creada exitosamente"
10. Modal cierra, banner desaparece
11. Usuario ahora autenticado permanentemente

### Flujo 4: Cierre de Sesión Invitado

1. Usuario hace logout
2. Limpieza completa de `localStorage`
3. `isGuestMode = false`
4. `guestData = null`
5. Redirige a Landing page

## Validaciones y Seguridad

### Formulario de Conversión

**Validaciones Zod:**
```typescript
const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
```

**Errores inline:**
- Icono AlertCircle
- Texto rojo descriptivo
- Aparece bajo cada campo con error

**Prevención:**
- No permite submit si hay errores
- Botón deshabilitado durante procesamiento
- Rate limiting (mock)

## Estados Visuales

### GuestStart.tsx
- Spinner central animado (Sparkles)
- 3 puntos con animación de pulso escalonada
- Card con sombra suave
- Background gradient

### GuestBanner
- Alert component de shadcn
- Gradient background subtle
- Icono Sparkles color primary
- Botón CTA gradient orange
- Botón X para cerrar temporal
- Animación slide-in desde arriba

### Modal de Registro
- DialogContent de shadcn
- 3 inputs con labels
- Alert informativo (fondo primary/5)
- 2 botones: Cancelar (outline) y Crear cuenta (gradient)
- Loading state en botón

## Mensajes UX

### Banner:
- **Principal**: "Estás usando la versión demo. Tus datos no se guardarán permanentemente."
- **CTA**: "Crear mi cuenta"

### Modal:
- **Título**: "Guardar mi progreso"
- **Descripción**: "Crea tu cuenta para guardar todo lo que hiciste en la demostración"
- **Info box**: "Al crear tu cuenta, guardaremos todo tu progreso de la demostración automáticamente"

### Toasts:
- **Success**: "¡Cuenta creada exitosamente! • Tu progreso de demostración se ha guardado"
- **Error validación**: "Por favor completa todos los campos correctamente"

## Limitaciones Modo Invitado

**Funcionalidades disponibles:**
✅ Dashboard completo
✅ Career Coach (chat, planificador, simulador)
✅ Análisis de CV (sin guardar permanente)
✅ Explorar oportunidades (sin postular)
✅ Ver recompensas y progreso
✅ Configuración básica

**Funcionalidades restringidas:**
❌ Guardar CVs permanentemente
❌ Postular a ofertas
❌ Conectar integraciones (LinkedIn, etc.)
❌ Exportar datos
❌ Acceso a círculos sociales
❌ Mentorías programadas

**Tooltips en zonas restringidas:**
- Texto: "Función disponible al registrarte"
- Diseño: Tooltip de shadcn
- Trigger: Hover sobre elemento bloqueado

## Datos Mock

### Usuario Invitado Estándar
```json
{
  "id": "guest_1731234567890",
  "name": "Usuario Invitado",
  "email": "",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest",
  "plan": "free",
  "createdAt": "2025-11-08T10:00:00.000Z",
  "lastLogin": "2025-11-08T10:00:00.000Z",
  "onboardingCompleted": true
}
```

### Guest Data
```json
{
  "skills": [
    {"name": "Comunicación", "level": "En desarrollo"},
    {"name": "Pensamiento crítico", "level": "Fortaleza"},
    {"name": "Gestión del tiempo", "level": "Por explorar"}
  ],
  "progress": {
    "cv": false,
    "interview": true,
    "rewards": false
  },
  "startedAt": "2025-11-08T10:00:00.000Z"
}
```

## Criterios de Aceptación ✅

- [x] Botón "Probar sin registrarse" visible en Landing
- [x] Click inicia modo invitado automáticamente
- [x] Página de carga con animación (2s)
- [x] Redirección automática a Dashboard
- [x] Banner visible en Dashboard y Coach
- [x] Banner se puede minimizar temporalmente
- [x] Modal de registro se abre correctamente
- [x] Validación Zod funciona en todos los campos
- [x] Errores inline visibles y descriptivos
- [x] Conversión migra datos correctamente
- [x] Toast de éxito aparece tras registro
- [x] Banner desaparece tras conversión
- [x] Logout limpia datos completamente
- [x] Todo responsive (mobile + desktop)
- [x] Accesibilidad completa (labels, ARIA, keyboard)

## Integración con Otros Módulos

### Dashboard:
- Banner importado y mostrado condicionalmente
- No afecta layout existente
- Z-index apropiado

### Career Coach:
- Banner también visible aquí
- Funcionalidades completas disponibles
- Datos temporales funcionan normalmente

### Rewards:
- Sistema de XP funciona igual
- Monedas se acumulan
- Logros se desbloquean
- Todo se conserva al convertir

### Settings:
- Configuración básica accesible
- Integraciones bloqueadas con tooltip
- Export/delete account deshabilitados

## Mejoras Futuras (Roadmap)

### Corto Plazo:
- [ ] Analytics de conversión (demo → usuario real)
- [ ] A/B testing de mensajes en banner
- [ ] Límite de tiempo en modo demo (ej. 7 días)
- [ ] Recordatorio email si abandona sin convertir

### Mediano Plazo:
- [ ] OAuth social en conversión (Google, LinkedIn)
- [ ] Exportar progreso demo en JSON
- [ ] Gamificación en conversión (badge especial)
- [ ] Onboarding fast-track para usuarios convertidos

### Largo Plazo:
- [ ] Sincronización entre dispositivos en modo demo
- [ ] Código de invitación para recuperar sesión
- [ ] Panel admin para ver métricas de demo

## Cómo Probar

1. **Iniciar modo invitado:**
   ```
   1. Ir a Landing page (/)
   2. Click "Probar sin registrarse"
   3. Esperar animación (2s)
   4. Verificar redirección a /dashboard
   ```

2. **Verificar banner:**
   ```
   1. Confirmar banner visible en top
   2. Intentar minimizar con X
   3. Navegar a /dashboard/coach
   4. Verificar banner persiste
   ```

3. **Probar conversión:**
   ```
   1. Click "Crear mi cuenta" en banner
   2. Completar formulario con datos válidos
   3. Submit y esperar
   4. Verificar toast de éxito
   5. Confirmar banner desaparece
   6. Revisar localStorage para confirmar migración
   ```

4. **Testing de validación:**
   ```
   1. Intentar submit con campos vacíos → ver errores
   2. Email inválido → ver error específico
   3. Contraseña < 8 chars → ver error
   4. Campos correctos → submit exitoso
   ```

## Debugging

**Inspeccionar localStorage:**
```javascript
// En console del navegador
JSON.parse(localStorage.getItem('clovely-auth'))
```

**Verificar estado:**
```javascript
// En React DevTools
useAuthStore.getState()
```

**Forzar reset:**
```javascript
localStorage.clear()
window.location.reload()
```

## SEO y Performance

- Landing page optimizada para conversión
- Lazy loading de modal de registro
- Animaciones con GPU acceleration
- localStorage en lugar de API calls (más rápido)
- Imágenes optimizadas (dicebear SVG)

## Accesibilidad

- ✅ Labels en todos los inputs
- ✅ ARIA roles apropiados
- ✅ Focus visible en elementos interactivos
- ✅ Contraste 4.5:1 mínimo
- ✅ Navegación por teclado completa
- ✅ Screen reader friendly
- ✅ Error messages descriptivos

---

**Última actualización**: 2025-11-08  
**Versión**: 1.0.0  
**Mantenedor**: Equipo Clovely
