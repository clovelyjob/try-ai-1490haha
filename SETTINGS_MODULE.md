# Módulo de Configuración (Settings) - Clovely

## Descripción General

El módulo de Configuración centraliza la administración de cuenta, privacidad, suscripciones, notificaciones, apariencia y preferencias. Ofrece control claro y seguro sobre todas las opciones personales de la plataforma.

## Características Implementadas

### ✅ Perfil Personal
- **Edición de datos**: nombre, email, teléfono, ubicación, LinkedIn
- **Avatar**: carga de foto de perfil (preparado para backend)
- **Validaciones**: 
  - Nombre requerido (máx. 50 caracteres)
  - Email formato válido
  - URL de LinkedIn válida
- **Estados**: edición inline, botones deshabilitados durante validación
- **Feedback**: toast de éxito/error, mensajes inline por campo

### ✅ Seguridad y Acceso
- **Cambio de contraseña**:
  - Validación: mínimo 8 caracteres, al menos una letra y un número
  - Confirmación de nueva contraseña
  - Contraseña actual requerida
- **Autenticación de dos factores (2FA)**: 
  - Toggle activar/desactivar (mock)
  - Preparado para integración con SMS/app autenticadora
- **Sesiones activas**:
  - Lista de dispositivos y ubicaciones
  - Timestamp de última actividad
  - Opción "Cerrar otras sesiones" con confirmación
  - Identificador de sesión actual

### ✅ Notificaciones
- **Canales configurables**:
  - Email (completamente funcional)
  - Push (preparado para backend)
  - SMS (preparado para backend)
- **Categorías por canal**:
  - Microacciones
  - Recomendaciones
  - Mensajes del Coach IA
  - Marketing y promociones
- **Envío de prueba**: botón para enviar email de test
- **Persistencia**: guardar preferencias automáticamente

### ✅ Apariencia y Accesibilidad
- **Modo de tema**:
  - Sistema (detecta preferencia del OS)
  - Claro
  - Oscuro
  - Transición suave con aplicación inmediata
- **Tamaño de fuente**:
  - Pequeño
  - Normal (predeterminado)
  - Grande
- **Contraste alto**: toggle para mejor accesibilidad visual
- **Aplicación global**: cambios afectan toda la app instantáneamente

### 🔄 En Desarrollo (Preparado para Backend)
- **Suscripción y facturación**: plan actual, historial, upgrade
- **Privacidad y datos**: visibilidad de perfil, GDPR
- **Integraciones**: LinkedIn, Coursera, Google Calendar
- **Preferencias del Coach IA**: tono, frecuencia de check-ins
- **Exportar datos**: descarga en formato JSON/ZIP
- **Eliminar cuenta**: workflow de confirmación

## Arquitectura Técnica

### Store Principal: `useSettingsStore.ts`

**Estado persistente (localStorage: `clovely-settings`):**
```typescript
{
  theme: 'system' | 'light' | 'dark',
  fontSize: 'small' | 'normal' | 'large',
  highContrast: boolean,
  notifications: {
    email: { microactions, recommendations, coachMessages, marketing },
    push: { ... },
    sms: { ... }
  },
  privacy: {
    profileVisibility: 'public' | 'network' | 'private',
    shareAggregatedData: boolean,
    showInLeaderboard: boolean
  },
  integrations: {
    linkedin: { connected: boolean, lastSync?: string },
    coursera: { ... },
    calendar: { ... }
  },
  coachPreferences: {
    tone: 'empathetic' | 'direct' | 'technical',
    checkInFrequency: 'daily' | 'weekly' | 'biweekly'
  },
  sessions: UserSession[]
}
```

**Acciones principales:**
- `setTheme(theme)` - Cambiar tema y aplicar a DOM
- `setFontSize(size)` - Ajustar tamaño de fuente global
- `toggleHighContrast()` - Activar/desactivar contraste alto
- `updateNotificationChannel(channel, category, value)` - Actualizar preferencias
- `updatePrivacy(updates)` - Modificar configuración de privacidad
- `connectIntegration(service)` / `disconnectIntegration(service)`
- `updateCoachPreferences(updates)` - Actualizar preferencias del coach
- `closeOtherSessions()` - Cerrar sesiones en otros dispositivos
- `resetToDefaults()` - Restaurar configuración predeterminada

### Componentes

**ProfileSection** (`src/components/settings/ProfileSection.tsx`)
- Formulario de edición de perfil
- Validación con zod schema
- Upload de avatar (preparado)
- Estados de edición inline
- Integración con `useAuthStore`

**SecuritySection** (`src/components/settings/SecuritySection.tsx`)
- Cambio de contraseña con validaciones
- Toggle 2FA (mock)
- Gestión de sesiones activas
- Dialogs de confirmación para acciones críticas

**NotificationsSection** (`src/components/settings/NotificationsSection.tsx`)
- Switches por canal y categoría
- Cards separadas por tipo de notificación
- Botón de envío de prueba
- Feedback inmediato en cambios

**AppearanceSection** (`src/components/settings/AppearanceSection.tsx`)
- Radio groups para tema y tamaño de fuente
- Switch para contraste alto
- Aplicación inmediata de cambios
- Descripciones claras de cada opción

### Página Principal: `Settings.tsx`

**Estructura:**
- Layout responsivo (sidebar + contenido)
- Navegación lateral con 8 secciones
- Separador visual
- Opciones críticas al final (Exportar/Eliminar)
- Sticky sidebar en desktop
- Mobile: stack vertical

**Secciones de navegación:**
1. Perfil
2. Seguridad
3. Notificaciones
4. Apariencia
5. Suscripción
6. Privacidad
7. Integraciones
8. Coach IA

## Validaciones y Seguridad

### Validación de Entrada (Zod)
```typescript
// Perfil
const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
});

// Contraseña
const passwordSchema = z.object({
  current: z.string().min(1, 'Contraseña actual requerida'),
  new: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[a-zA-Z]/, 'Debe contener al menos una letra')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirm: z.string(),
}).refine((data) => data.new === data.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
});
```

### Estados Visuales
- **Botones deshabilitados**: durante validación y guardado
- **Errors inline**: mensajes específicos por campo
- **Spinners**: en acciones asíncronas
- **Toasts**: feedback de éxito/error
- **Alert dialogs**: confirmaciones para acciones destructivas

## Flujos de Usuario

### Flujo 1: Editar Perfil
1. Usuario navega a Settings → Perfil
2. Click "Editar perfil"
3. Campos se habilitan para edición
4. Cambios con validación en tiempo real
5. Click "Guardar cambios"
6. Spinner durante guardado (800ms mock)
7. Toast de éxito
8. Vista vuelve a modo lectura

### Flujo 2: Cambiar Contraseña
1. Usuario navega a Seguridad
2. Click "Cambiar contraseña"
3. Formulario se expande
4. Completa 3 campos (actual, nueva, confirmar)
5. Validaciones inline durante escritura
6. Click "Actualizar contraseña"
7. Spinner durante procesamiento
8. Toast de confirmación
9. Formulario se cierra

### Flujo 3: Cerrar Otras Sesiones
1. Usuario ve lista de sesiones activas
2. Identifica sesión actual marcada
3. Click "Cerrar otras sesiones"
4. Alert dialog de confirmación
5. Confirma acción
6. Sesiones se filtran
7. Toast de éxito

### Flujo 4: Cambiar Tema
1. Usuario navega a Apariencia
2. Selecciona radio button de tema
3. Tema se aplica instantáneamente a toda la app
4. Document root actualiza clase 'dark'
5. Toast de confirmación

## Persistencia

**LocalStorage Keys:**
- `clovely-settings` - Configuración completa del usuario
- `clovely-auth` - Datos de usuario (incluye perfil)

**Estructura en localStorage:**
```json
{
  "state": {
    "theme": "system",
    "fontSize": "normal",
    "highContrast": false,
    "notifications": { ... },
    "privacy": { ... },
    "integrations": { ... },
    "coachPreferences": { ... },
    "sessions": [ ... ]
  },
  "version": 0
}
```

## Mock API Endpoints (Preparados)

**Perfil:**
- `GET /mock/user/{id}` - Obtener datos de usuario
- `POST /mock/user/update` - Actualizar perfil
- `POST /mock/user/change-password` - Cambiar contraseña
- `POST /mock/user/send-email-verification` - Verificar email

**Configuración:**
- `GET /mock/settings/{id}` - Obtener configuración
- `POST /mock/settings/update` - Actualizar configuración

**Notificaciones:**
- `POST /mock/notifications/test` - Enviar notificación de prueba

**Suscripción:**
- `GET /mock/subscription` - Obtener plan actual
- `POST /mock/subscription/upgrade` - Actualizar plan

**Integraciones:**
- `POST /mock/integrations/connect` - Conectar servicio
- `POST /mock/integrations/disconnect` - Desconectar servicio

**Cuenta:**
- `POST /mock/account/delete` - Eliminar cuenta
- `POST /mock/account/export` - Exportar datos

## Integración con Otros Módulos

### Con Auth Store
- Lee datos de usuario para formulario de perfil
- Actualiza usuario tras edición de perfil
- Logout cuando se cierra sesión

### Con Theme System
- Aplica cambios de tema a document root
- Detecta preferencia del sistema
- Sincroniza con ThemeToggle en otras partes de la app

### Con Progress Store
- Potencial integración con coins por completar perfil
- Logros al configurar 2FA
- Badges por personalización completa

## Accesibilidad (WCAG 2.1 AA)

✅ **Implementado:**
- Labels en todos los inputs
- Focus visible en elementos interactivos
- Navegación por teclado funcional
- Contraste mínimo 4.5:1 en textos
- ARIA labels en switches y radios
- Mensajes de error descriptivos
- Estados disabled claramente identificables

✅ **Características especiales:**
- Modo de contraste alto
- Ajuste de tamaño de fuente
- Transiciones suaves (respeta prefers-reduced-motion)

## Testing

**Casos de prueba implementados (manuales):**

1. ✅ Editar perfil guarda cambios correctamente
2. ✅ Validaciones de formulario funcionan
3. ✅ Cambio de contraseña valida todos los campos
4. ✅ Toggle 2FA actualiza estado
5. ✅ Cerrar otras sesiones filtra lista
6. ✅ Notificaciones se actualizan por canal
7. ✅ Envío de prueba muestra toast
8. ✅ Cambio de tema aplica globalmente
9. ✅ Cambio de fuente ajusta toda la app
10. ✅ Contraste alto se activa correctamente
11. ✅ Persistencia en localStorage funciona
12. ✅ Navegación entre secciones es fluida
13. ✅ Responsive funciona en mobile/desktop
14. ✅ Alert dialogs solicitan confirmación

## Rutas

- `/dashboard/settings` - Página principal de configuración
- Sección activa se maneja por estado interno (no query params)

## Acceso Rápido

Desde el sidebar del dashboard:
- Icono: ⚙️ Settings
- Label: "Configuración"
- Path: `/dashboard/settings`

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

## Dependencias Clave

- `zustand` - State management con persistencia
- `zod` - Validación de schemas
- `react-hook-form` - Manejo de formularios (opcional)
- `@radix-ui/react-*` - Componentes UI accesibles
- `lucide-react` - Iconografía
- `framer-motion` - Animaciones (para tema)

## Próximos Pasos

1. **Backend Real:**
   - Conectar endpoints reales de API
   - Implementar autenticación segura
   - Guardar cambios en base de datos

2. **Secciones Pendientes:**
   - Suscripción con integración Stripe
   - Privacidad con controles GDPR completos
   - Integraciones OAuth con LinkedIn/Calendar
   - Preferencias del Coach con efectos en IA

3. **Funcionalidades Avanzadas:**
   - 2FA real con SMS/authenticator app
   - Upload de avatar con crop/resize
   - Exportación de datos en múltiples formatos
   - Workflow completo de eliminación de cuenta

4. **Mejoras UX:**
   - Tooltips contextuales en configuraciones complejas
   - Tour guiado para nuevos usuarios
   - Historial de cambios de configuración
   - Búsqueda dentro de settings

## Notas de Seguridad

- ⚠️ Validar siempre inputs en servidor (no solo cliente)
- ⚠️ Nunca exponer contraseñas en logs
- ⚠️ Implementar rate limiting en cambio de contraseña
- ⚠️ Confirmar email antes de cambios críticos
- ⚠️ 2FA debe ser real para producción
- ⚠️ Sessions deben incluir IP y user agent reales
- ⚠️ Exportación de datos debe ser asíncrona y segura
- ⚠️ Eliminación de cuenta debe ser reversible (soft delete)

## Soporte

Para preguntas o problemas:
- Revisar código fuente en `src/pages/Settings.tsx`
- Consultar stores en `src/store/useSettingsStore.ts`
- Documentación de shadcn/ui: https://ui.shadcn.com
- Documentación de Zod: https://zod.dev
