# Módulo Career Coach - Clovely

## Descripción General

El Career Coach es un asistente de carrera impulsado por IA que acompaña al usuario 24/7 en su desarrollo profesional. Genera planes personalizados, sugiere microacciones, analiza CVs, simula entrevistas con feedback en tiempo real, recomienda cursos y ajusta la ruta profesional basándose en datos y comportamiento del usuario.

## Tecnologías Utilizadas

- **Framework**: React 18 con Vite
- **Estilos**: TailwindCSS con sistema de tokens semánticos
- **Componentes UI**: shadcn/ui
- **Iconografía**: Lucide Icons
- **Estado Global**: Zustand con persistencia
- **Animaciones**: Framer Motion
- **Notificaciones**: Sonner (toasts)
- **TypeScript**: Fuertemente tipado

## Estructura de Archivos

```
src/
├── components/
│   ├── coach/
│   │   ├── CoachChat.tsx                 # Chat conversacional con IA
│   │   ├── CoachActionPlanner.tsx        # Planificador de microacciones
│   │   └── CoachInterviewSimulator.tsx   # Simulador de entrevistas
│   └── CareerCopilot.tsx                 # Componente de análisis CV
├── pages/
│   └── Coach.tsx                         # Página principal del coach
└── store/
    └── useCoachStore.ts                  # Store de Zustand para el coach
```

## Características Principales

### 1. Chat Conversacional (CoachChat.tsx)

**Funcionalidades:**
- Chat en tiempo real con IA
- Historial de mensajes persistente
- Indicadores de "escribiendo"
- Acciones rápidas contextuales
- Respuestas adaptativas según el contexto del usuario

**Interacciones:**
- Envío de mensajes con Enter
- Botones de acciones rápidas
- Avatar animado del coach
- Indicador de estado "en línea"

**Estados visuales:**
- Mensajes del usuario (alineados a la derecha, fondo primary)
- Mensajes del asistente (alineados a la izquierda, fondo muted)
- Animación de typing con 3 puntos
- Transiciones suaves con Framer Motion

### 2. Planificador de Microacciones (CoachActionPlanner.tsx)

**Funcionalidades:**
- Generación automática de plan semanal
- 5-7 microacciones priorizadas
- Seguimiento de progreso
- Sistema de recompensas (XP y monedas)
- Categorización por tipo de acción

**Categorías de Acciones:**
- CV (📄): Optimización de curriculum
- Learning (📚): Cursos y aprendizaje
- Networking (🤝): Conexiones profesionales
- Application (📨): Postulaciones
- Practice (🎤): Práctica de entrevistas

**Estados de Acciones:**
- Pending: Por realizar
- In Progress: En progreso
- Completed: Completada (otorga recompensas)
- Skipped: Omitida

**Recompensas:**
- XP según dificultad (30-100 XP por acción)
- 10 monedas base por microacción completada
- Desbloqueo de logros progresivos

### 3. Simulador de Entrevistas (CoachInterviewSimulator.tsx)

**Funcionalidades:**
- Selección de rol y nivel de dificultad
- 5 preguntas adaptadas al contexto
- Feedback inmediato por respuesta
- Análisis de estructura STAR
- Score individual y promedio
- Sugerencias de mejora específicas

**Tipos de Preguntas:**
- Behavioral: Comportamiento y experiencia
- Technical: Habilidades técnicas
- Situational: Resolución de problemas

**Análisis de Respuestas:**
- Detección de estructura STAR (Situación, Tarea, Acción, Resultado)
- Verificación de métricas cuantificables
- Evaluación de longitud de respuesta (80-200 palabras recomendadas)
- Score de 0-100 por respuesta

**Feedback Proporcionado:**
- Fortalezas identificadas
- Áreas de mejora
- Score promedio de la sesión
- Opción de guardar o reintentar

### 4. Análisis de CV (CareerCopilot.tsx)

**Funcionalidades:**
- Análisis automático del CV
- Score de optimización (0-100)
- Keywords faltantes/presentes
- Sugerencias de mejora priorizadas
- Recomendaciones de plantilla

**Criterios de Evaluación:**
- Uso de verbos de acción
- Presencia de métricas cuantificables
- Extensión del contenido
- Keywords relevantes del sector

## Modelo de Datos

### CoachMessage
```typescript
{
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'chat' | 'cv_analysis' | 'interview_feedback' | 'action_suggestion' | 'course_recommendation';
  timestamp: string;
  metadata?: {
    cvId?: string;
    score?: number;
    suggestions?: any[];
    actionIds?: string[];
  };
}
```

### WeeklyAction
```typescript
{
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'cv' | 'learning' | 'networking' | 'application' | 'practice';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  dueDate: string;
  completedAt?: string;
  xpReward: number;
  relatedGoalId?: string;
  relatedCVId?: string;
  relatedOpportunityId?: string;
}
```

### CVAnalysisResult
```typescript
{
  score: number;
  keywords: { word: string; present: boolean; importance: 'high' | 'medium' | 'low' }[];
  suggestions: {
    id: string;
    category: 'content' | 'format' | 'keywords' | 'structure';
    text: string;
    priority: 'high' | 'medium' | 'low';
    example?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendedTemplate?: string;
}
```

### InterviewAnswer
```typescript
{
  questionId: string;
  text: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}
```

## Persistencia (localStorage)

### Claves Utilizadas:
- `clovely-coach`: Estado completo del coach (mensajes, contextos, análisis)
- `clovely-action-plan`: Microacciones y planes semanales
- `clovely-cvs`: CVs guardados
- `clovely-interviews`: Sesiones de entrevistas guardadas

## Integraciones con Otros Módulos

### Con Rewards Store:
- Otorga 10 monedas por microacción completada
- Actualiza progreso de logros
- Registra eventos para analytics

### Con Progress Store:
- Actualiza XP del usuario
- Contribuye al cálculo de nivel
- Mantiene racha de actividad

### Con CV Store:
- Accede a CVs guardados para análisis
- Guarda versiones optimizadas
- Calcula score de optimización

## Flujos de Usuario

### Flujo: Generar Plan Semanal
1. Usuario hace clic en "Generar Plan Semanal"
2. Sistema muestra loader por 2 segundos (mock)
3. Se generan 5 microacciones personalizadas
4. Toast de confirmación
5. Acciones se muestran con checkboxes

### Flujo: Completar Microacción
1. Usuario marca checkbox de acción
2. Acción cambia estado a "completed"
3. Se otorga XP y monedas
4. Toast de confirmación con recompensas
5. Se actualiza progreso semanal

### Flujo: Simular Entrevista
1. Usuario selecciona rol y nivel
2. Inicia sesión de 5 preguntas
3. Por cada pregunta:
   - Muestra pregunta con categoría
   - Usuario escribe respuesta
   - IA analiza (2 segundos)
   - Muestra score y feedback
   - Avanza a siguiente pregunta
4. Al finalizar: resumen con score promedio
5. Opción de guardar o reintentar

### Flujo: Análisis de CV
1. Usuario hace clic en "Analizar CV"
2. Sistema carga último CV guardado
3. Mock IA analiza contenido (2 segundos)
4. Muestra score, keywords y sugerencias
5. Opción de ir a editar CV

## APIs Mock (Para Desarrollo)

### POST /mock/ia/analyze-cv
```typescript
Request: { cvText: string, jobDescription?: string }
Response: CVAnalysisResult
```

### POST /mock/ia/evaluate-answer
```typescript
Request: { question: string, answerText: string, context: string }
Response: { score: number, feedback: string, tags: string[] }
```

### POST /mock/coach/generate-plan
```typescript
Request: { userProfile: object, map: object }
Response: { microactions: WeeklyAction[] }
```

## Mensajes y Microcopy

### Saludos del Coach:
- "¡Hola! Soy tu Career Coach. Estoy aquí para ayudarte a optimizar tu CV, practicar entrevistas, encontrar cursos y planificar tu desarrollo profesional. ¿En qué quieres avanzar hoy?"

### Mensajes de Éxito:
- "Plan semanal generado con éxito - He creado 5 microacciones personalizadas para ti"
- "¡Microacción completada! - Has ganado XP y monedas"
- "Análisis completado - Tu CV ha sido evaluado"

### Mensajes de Error:
- "Error al generar el plan - Intenta nuevamente"
- "Error al analizar CV - Por favor verifica el contenido"
- "Por favor escribe una respuesta"

### Feedback de Entrevista:
- Score >= 80: "¡Excelente respuesta! Muy bien estructurada y completa."
- Score >= 60: "Buena respuesta, con algunas áreas de mejora."
- Score < 60: "Tu respuesta puede mejorar significativamente."

## Validaciones

### Chat:
- No permitir envío de mensajes vacíos
- Deshabilitar input mientras procesa

### Planificador:
- Verificar userId válido
- No permitir completar acciones futuras
- Validar que exista un plan antes de mostrar

### Simulador:
- Requerir rol y nivel seleccionados para iniciar
- Validar respuestas no vacías
- Longitud recomendada: 80-200 palabras

## Estados Visuales

### Skeletons:
- Durante carga de datos del coach
- Mientras IA procesa respuestas

### Loaders:
- Botón con spinner al generar plan
- Indicador de "typing" en chat
- Análisis de respuestas en entrevista

### Animaciones:
- Entrada de mensajes (fade + slide)
- Bounce de puntos en typing indicator
- Transición suave entre preguntas
- Hover effects en tarjetas de acciones

### Badges:
- Estado online del coach (verde pulsante)
- Prioridad de acciones (colores semánticos)
- Categoría de preguntas
- Score de respuestas (colores según rango)

## Accesibilidad

- Labels en todos los inputs
- Roles ARIA apropiados
- Navegación por teclado completa
- Contraste mínimo 4.5:1
- Focus visible en elementos interactivos
- Textos alternativos en iconos

## Mejoras Futuras (Roadmap)

### Corto Plazo:
- [ ] Grabación de audio en simulador de entrevistas
- [ ] Transcripción automática de respuestas
- [ ] Descarga de resumen de sesión en PDF
- [ ] Optimización de CV para oferta específica (Fit Mode)

### Mediano Plazo:
- [ ] Integración con IA real (OpenAI/Claude)
- [ ] Notificaciones y recordatorios automáticos
- [ ] Panel B2B con métricas agregadas
- [ ] Recomendaciones de cursos con deep links

### Largo Plazo:
- [ ] Análisis de video en entrevistas
- [ ] Feedback en tiempo real durante entrevista
- [ ] Integración con LinkedIn para datos
- [ ] Coach multilingüe

## Cómo Probar

1. **Acceder al módulo:**
   ```
   Navigate to: /dashboard/coach
   ```

2. **Probar Chat:**
   - Escribir mensajes relacionados con CV, entrevistas, cursos
   - Verificar respuestas contextuales
   - Comprobar persistencia cerrando y abriendo

3. **Probar Planificador:**
   - Click en "Generar Plan Semanal"
   - Marcar acciones como completadas
   - Verificar otorgamiento de XP y monedas

4. **Probar Simulador:**
   - Seleccionar rol: "Frontend Developer" y nivel: "Junior"
   - Completar las 5 preguntas
   - Revisar feedback y scores
   - Guardar sesión

5. **Probar Análisis CV:**
   - Navegar a tab "Análisis CV"
   - Click en "Analizar CV"
   - Verificar score y sugerencias

## Datos Mock para Testing

El módulo incluye datos mock para desarrollo:
- 5 preguntas predefinidas por sesión
- Análisis de CV con detección de patterns
- Respuestas del coach contextuales
- Cursos recomendados de muestra

## Criterios de Aceptación ✅

- [x] Usuario puede iniciar chat y recibir respuestas en < 3s
- [x] Generar plan semanal crea 5 microacciones guardadas
- [x] Completar microacción otorga XP y actualiza progreso
- [x] Analizar CV devuelve score y sugerencias
- [x] Simular entrevista produce feedback por respuesta
- [x] Todas las vistas son responsive
- [x] Navegación por teclado funcional
- [x] Persistencia en localStorage correcta
- [x] Integración con rewards y progress stores

## Soporte y Documentación

Para más información sobre componentes individuales, revisa los comentarios en los archivos fuente.

---

**Última actualización**: 2025-11-08
**Versión**: 1.0.0
**Mantenedor**: Equipo Clovely
