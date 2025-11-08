# Módulo de Recompensas y Coins - Clovely

## Descripción General

El módulo de Recompensas gamifica la experiencia del usuario mediante un sistema de puntos (Clovely Coins), logros, niveles y recompensas canjeables. Aumenta la retención y motiva a los usuarios a completar acciones constructivas.

## Características Principales

### 1. Sistema de Coins (Clovely Coins)

**Formas de ganar coins:**
- Completar microacción: +10 coins
- Mejorar CV: +20 coins
- Completar simulación de entrevista: +30 coins
- Obtener feedback positivo: +15 coins
- Invitar a un amigo: +50 coins
- Desbloquear logros: variable según el logro

**Balance y visualización:**
- Balance actual visible en el dashboard
- Historial completo de obtención y gasto
- Indicador de nivel actual y progreso

### 2. Sistema de Logros

**Logros disponibles:**

| ID | Título | Descripción | Coins | Condición |
|---|---|---|---|---|
| `cv_created` | Primer CV | Creaste tu primer CV en Clovely | 20 | Crear primer CV |
| `first_interview` | Primera Entrevista | Completaste tu primera simulación | 30 | Completar primera entrevista |
| `microactions_10` | 10 Microacciones | Completaste 10 microacciones | 15 | 10 microacciones completadas |
| `microactions_50` | 50 Microacciones | Completaste 50 microacciones | 50 | 50 microacciones completadas |
| `microactions_100` | Centenario | Completaste 100 microacciones | 100 | 100 microacciones completadas |
| `cv_perfect` | CV Perfecto | CV con score mayor a 90 | 40 | Score CV > 90 |
| `interview_master` | Maestro de Entrevistas | 5 simulaciones con score > 80 | 60 | 5 entrevistas con score > 80 |
| `job_applied` | Primera Postulación | Aplicaste a tu primera oferta | 25 | Primera aplicación |
| `level_pro` | Nivel Pro | Alcanzaste el nivel Pro | 100 | Llegar a nivel Pro |
| `friend_invited` | Embajador | Invitaste a un amigo | 50 | Invitación enviada |

### 3. Sistema de Niveles

**Umbrales de nivel:**
- **Novato**: 0 coins totales
- **Junior**: 100 coins totales
- **Pro**: 500 coins totales
- **Master**: 1500 coins totales
- **Líder**: 3000 coins totales

Cada nivel desbloquea beneficios adicionales y aumenta el prestigio del usuario.

### 4. Tienda de Recompensas

**Categorías de recompensas:**
- **Gift Cards**: Tarjetas de regalo ($10, $25, $50)
- **Mentorías**: Sesiones con mentores certificados (30min, 60min)
- **Plantillas**: Plantillas premium de CV
- **Cursos**: Cursos especializados (Entrevistas, LinkedIn, etc.)

**Recompensas disponibles:**

| Título | Categoría | Costo | Descripción |
|---|---|---|---|
| Mentoría Premium 30 min | Mentorship | 200 | Sesión personalizada con mentor certificado |
| Gift Card $10 | Gift Card | 300 | Tarjeta de regalo para Amazon |
| Plantilla CV Premium | Template | 150 | Acceso a plantillas exclusivas |
| Curso de Entrevistas | Course | 400 | Curso completo sobre técnicas |
| Gift Card $25 | Gift Card | 700 | Tarjeta de regalo para Amazon |
| Mentoría Premium 60 min | Mentorship | 350 | Sesión extendida con mentor |
| Curso de LinkedIn | Course | 250 | Optimiza tu perfil con IA |
| Gift Card $50 | Gift Card | 1200 | Tarjeta de regalo para Amazon |

### 5. Ranking Global

Tabla de clasificación que muestra:
- Top 10 usuarios por coins acumulados
- Nombre, nivel, coins y logros de cada usuario
- Posición del usuario actual resaltada
- Iconos especiales para top 3 (🏆, 🥈, 🥉)

## Arquitectura Técnica

### Store Principal: `useRewardsStore.ts`

**Estado:**
```typescript
{
  coins: number;              // Coins disponibles
  level: UserLevel;           // Nivel actual
  totalCoins: number;         // Coins acumulados históricamente
  history: CoinHistory[];     // Historial de transacciones
  achievements: Achievement[]; // Lista de logros
  redeemedRewards: string[];  // IDs de recompensas canjeadas
}
```

**Acciones principales:**
- `addCoins(amount, reason)` - Añadir coins
- `spendCoins(amount, reason)` - Gastar coins
- `redeemReward(rewardId, cost)` - Canjear recompensa
- `unlockAchievement(achievementId)` - Desbloquear logro
- `updateAchievementProgress(id, progress)` - Actualizar progreso
- `checkLevelUp()` - Verificar subida de nivel
- `getRewards()` - Obtener lista de recompensas
- `getLeaderboard()` - Obtener ranking

### Componentes

**CoinsSummary** (`src/components/rewards/CoinsSummary.tsx`)
- Resumen visual de coins, nivel y logros
- Cards con métricas principales
- Barra de progreso hacia siguiente nivel

**RewardsShop** (`src/components/rewards/RewardsShop.tsx`)
- Grid de recompensas canjeables
- Filtros por categoría
- Sistema de tabs para navegación
- Modal de confirmación de canje

**AchievementsPanel** (`src/components/rewards/AchievementsPanel.tsx`)
- Lista de logros desbloqueados y bloqueados
- Indicadores de progreso para logros graduales
- Animaciones con Framer Motion

**Leaderboard** (`src/components/rewards/Leaderboard.tsx`)
- Tabla de top 10 usuarios
- Destacado de posición actual
- Iconos especiales para top 3

**RewardModal** (`src/components/rewards/RewardModal.tsx`)
- Confirmación de canje
- Validación de balance
- Animación de confeti al canjear

### Página Principal: `Rewards.tsx`

Sistema de tabs con tres secciones:
1. **Tienda** - Canjear recompensas
2. **Mis Logros** - Ver logros desbloqueados
3. **Ranking** - Ver clasificación global

## Integración con Otros Módulos

### Con Action Plan Store
Al completar una microacción:
1. Se otorgan +10 coins automáticamente
2. Se actualiza el progreso de logros relacionados (10, 50, 100 microacciones)
3. Se guarda en el historial con descripción

### Con CV Store
Al crear o mejorar CV:
1. Primer CV creado → desbloquea logro `cv_created` (+20 coins)
2. Score > 90 → desbloquea logro `cv_perfect` (+40 coins)

### Con Interview Store
Al completar simulación de entrevista:
1. Primera entrevista → desbloquea logro `first_interview` (+30 coins)
2. 5 entrevistas con score > 80 → desbloquea logro `interview_master` (+60 coins)

### Con Opportunities Store
Al aplicar a oferta:
1. Primera postulación → desbloquea logro `job_applied` (+25 coins)

## Persistencia

**LocalStorage key:** `clovely-rewards`

**Estructura persistida:**
```json
{
  "state": {
    "coins": 150,
    "level": "Novato",
    "totalCoins": 150,
    "history": [],
    "achievements": [],
    "redeemedRewards": []
  },
  "version": 0
}
```

## Flujos de Usuario

### Flujo 1: Ganar Coins
1. Usuario completa una microacción
2. Sistema otorga +10 coins automáticamente
3. Toast muestra: "¡Has ganado 10 coins!"
4. Balance se actualiza en UI
5. Se verifica si hay nuevo nivel o logro

### Flujo 2: Canjear Recompensa
1. Usuario navega a la tienda
2. Selecciona una recompensa
3. Click en "Canjear"
4. Modal de confirmación aparece
5. Sistema valida balance suficiente
6. Usuario confirma
7. Coins se descuentan
8. Animación de confeti
9. Toast de éxito
10. Recompensa se registra como canjeada

### Flujo 3: Desbloquear Logro
1. Usuario completa acción que cumple condición de logro
2. Sistema detecta automáticamente
3. Logro se desbloquea
4. Coins reward se añaden al balance
5. Animación de entrada en panel de logros
6. Toast notifica: "¡Has desbloqueado [Logro]! +X coins"

### Flujo 4: Subir de Nivel
1. Usuario acumula suficientes coins para nuevo nivel
2. Sistema detecta cambio de nivel
3. Modal celebratorio aparece
4. Bonus adicional se otorga
5. Progreso se actualiza
6. Si es nivel Pro, se desbloquea logro adicional

## Notificaciones y Feedback

**Mensajes de éxito:**
- "¡Has ganado X coins!"
- "¡Recompensa canjeada con éxito!"
- "¡Felicidades! Has desbloqueado [Logro]"
- "¡Nivel alcanzado! Ahora eres [Nivel]"

**Mensajes de error:**
- "No tienes suficientes coins"
- "Error al procesar tu solicitud"

**Animaciones:**
- Confeti al canjear recompensa (canvas-confetti)
- Fade-in al desbloquear logros (Framer Motion)
- Progress bars animadas
- Hover effects en cards

## Expansión Futura

### Recompensas Personalizadas
- Integración con partners externos
- Descuentos en cursos de plataformas educativas
- Acceso a eventos exclusivos

### Social Features
- Compartir logros en redes sociales
- Competencias por equipos
- Recompensas grupales

### B2B Features
- Panel de administrador con métricas agregadas
- Recompensas corporativas personalizadas
- Rankings por cohortes institucionales
- Exportación de reportes de engagement

## Testing

**Casos de prueba mínimos:**
1. ✅ Usuario puede ver su balance de coins
2. ✅ Completar microacción añade +10 coins
3. ✅ Canjear recompensa resta coins correctamente
4. ✅ Validación de balance insuficiente funciona
5. ✅ Desbloquear logro añade coins reward
6. ✅ Progreso de logros graduales se actualiza
7. ✅ Subida de nivel se detecta automáticamente
8. ✅ Ranking muestra posición del usuario actual
9. ✅ Persistencia en localStorage funciona
10. ✅ Animaciones se ejecutan correctamente

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

- `zustand` - State management
- `canvas-confetti` - Animación de confeti
- `framer-motion` - Animaciones
- `@radix-ui/react-*` - Componentes UI
- `lucide-react` - Iconos

## Rutas

- `/dashboard/rewards` - Página principal de recompensas
- Tab "Tienda" - Ver y canjear recompensas
- Tab "Mis Logros" - Ver logros desbloqueados
- Tab "Ranking" - Ver clasificación global

## Acceso Rápido

Desde el sidebar del dashboard:
- Icono: 🏆 Trophy
- Label: "Recompensas"
- Path: `/dashboard/rewards`
