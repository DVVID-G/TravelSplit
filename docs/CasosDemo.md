# Casos de Demostración: Reglas de Cursor en TravelSplit

Este documento presenta casos prácticos que demuestran el funcionamiento de los diferentes tipos de reglas de Cursor: **Reglas de Usuario**, **Reglas de Proyecto** y **Reglas AGENTS**. Cada caso muestra el comportamiento del agente antes y después de aplicar la regla, con descripciones detalladas de cómo el agente procesa las solicitudes y genera respuestas.

---

## Tabla de Contenidos

1. [Reglas de Usuario](#1-reglas-de-usuario)
2. [Reglas de Proyecto](#2-reglas-de-proyecto)
3. [Reglas AGENTS](#3-reglas-agents)
   - [Caso 1: Agent de Arquitectura CSR](#caso-1-agent-de-arquitectura-csr)
   - [Caso 2: Agent de Validación de DTOs](#caso-2-agent-de-validación-de-dtos)
   - [Caso 3: Agent de Componentes React](#caso-3-agent-de-componentes-react)

---

## 1. Reglas de Usuario

### Descripción
Las **Reglas de Usuario** son configuraciones globales que se aplican a todos los proyectos del usuario. Se configuran en la configuración de Cursor (Settings → Rules for AI) y afectan el comportamiento del agente en todos los contextos, independientemente del proyecto en el que se esté trabajando.

### Caso: Idioma de Documentación en Español

**Objetivo:** Configurar una regla de usuario que indique al agente que toda la documentación, comentarios y explicaciones deben generarse en español.

#### Configuración de la Regla

**Ubicación:** Configuración de Cursor (Settings → Rules for AI)

**Contenido de la Regla:**
```
Always respond in Spanish. All documentation, comments, and explanations must be written in Spanish. Code comments should be in Spanish unless they are part of a library or framework that requires English.
```

#### Escenario de Prueba

**Solicitud al Agente:** "Create a new endpoint to get trip details by ID"

##### ANTES (Sin Regla de Usuario)

**Comportamiento del Agente:**
Cuando el usuario solicita crear un endpoint sin tener configurada la regla de usuario, el agente se comporta de la siguiente manera:

1. **Procesamiento de la Solicitud:**
   - El agente analiza la solicitud en inglés y asume que el contexto de trabajo es en inglés
   - No tiene ninguna preferencia de idioma configurada, por lo que usa su idioma predeterminado (inglés)
   - Genera código con comentarios en inglés
   - Proporciona explicaciones en inglés

2. **Generación de Respuesta:**
   - El agente crea el endpoint solicitado
   - Los comentarios en el código están en inglés (por ejemplo: "Get trip details endpoint")
   - Las explicaciones sobre cómo funciona el código están en inglés
   - La documentación generada (si se solicita) está en inglés
   - Los mensajes de error sugeridos están en inglés

3. **Interacción con el Usuario:**
   - Todas las respuestas del agente están en inglés
   - Si el usuario pregunta sobre el código, las explicaciones son en inglés
   - Las sugerencias y recomendaciones están en inglés

**Resultado:** El código generado y toda la comunicación está en inglés, lo cual puede no ser deseable si el equipo de desarrollo prefiere trabajar en español.

##### DESPUÉS (Con Regla de Usuario)

**Comportamiento del Agente:**
Una vez configurada la regla de usuario para usar español, el comportamiento del agente cambia significativamente:

1. **Activación de la Regla:**
   - La regla se carga automáticamente al iniciar Cursor
   - Se aplica a todas las interacciones sin necesidad de mencionarla explícitamente
   - Tiene efecto inmediato en todas las conversaciones

2. **Procesamiento de la Solicitud:**
   - El agente recibe la solicitud (que puede estar en inglés o español)
   - Detecta que tiene una regla de usuario activa que especifica español
   - Prioriza el español para todas sus respuestas y generación de código
   - Aunque la solicitud esté en inglés, responde en español

3. **Generación de Respuesta:**
   - El agente crea el endpoint solicitado
   - **Todos los comentarios en el código están en español** (por ejemplo: "Endpoint para obtener detalles de un viaje por ID")
   - **Todas las explicaciones están en español** ("Este endpoint permite obtener la información completa de un viaje específico...")
   - **La documentación generada está en español**
   - **Los mensajes de error sugeridos están en español** ("El viaje no fue encontrado")
   - Los nombres de variables y funciones pueden mantenerse en inglés (siguiendo convenciones de código), pero los comentarios y documentación están en español

4. **Interacción con el Usuario:**
   - Todas las respuestas del agente están en español
   - Las explicaciones técnicas están en español
   - Las sugerencias y recomendaciones están en español
   - Si el usuario pregunta en inglés, el agente responde en español (siguiendo la regla)

5. **Persistencia:**
   - La regla permanece activa en todas las sesiones
   - No es necesario recordarle al agente que use español en cada interacción
   - Se aplica consistentemente a lo largo del tiempo

**Resultado:** Todo el código generado, comentarios, documentación y comunicación está en español, creando un entorno de trabajo consistente para equipos hispanohablantes.

#### Demostración en Backend

**Escenario:** El usuario solicita "Create a complete trip creation endpoint with validation"

**Comportamiento del Agente SIN regla:**
- Genera el código del endpoint
- Los comentarios están en inglés: "Create a new trip", "Validate input data", "Save to database"
- Las explicaciones están en inglés: "This endpoint creates a new trip and validates the input..."
- Los mensajes de error sugeridos están en inglés: "Trip name is required", "Invalid currency"
- La documentación Swagger (si se genera) tiene descripciones en inglés

**Comportamiento del Agente CON regla:**
- Genera el mismo código funcional
- **Los comentarios están en español:** "Crear un nuevo viaje", "Validar datos de entrada", "Guardar en base de datos"
- **Las explicaciones están en español:** "Este endpoint crea un nuevo viaje y valida los datos de entrada..."
- **Los mensajes de error sugeridos están en español:** "El nombre del viaje es requerido", "Moneda inválida"
- **La documentación Swagger tiene descripciones en español**
- El agente incluso sugiere nombres de variables más descriptivos en español cuando es apropiado

#### Demostración en Frontend

**Escenario:** El usuario solicita "Create a form component to add participants to a trip"

**Comportamiento del Agente SIN regla:**
- Genera el componente React
- Los comentarios están en inglés: "Form to add participants", "Handle form submission", "Validate email"
- Las etiquetas de los campos están en inglés: "Email", "Add Participant", "Submit"
- Los mensajes de validación están en inglés: "Email is required", "Invalid email format"
- Las explicaciones están en inglés

**Comportamiento del Agente CON regla:**
- Genera el mismo componente funcional
- **Los comentarios están en español:** "Formulario para agregar participantes", "Manejar envío del formulario", "Validar email"
- **Las etiquetas de los campos están en español:** "Correo Electrónico", "Agregar Participante", "Enviar"
- **Los mensajes de validación están en español:** "El correo electrónico es requerido", "Formato de correo inválido"
- **Las explicaciones están en español**
- El agente sugiere usar textos en español para la interfaz de usuario

#### Análisis del Comportamiento

**Cómo funciona la Regla de Usuario:**

1. **Alcance Global:**
   - La regla se aplica automáticamente a todas las interacciones con el agente
   - No es necesario mencionarla en cada solicitud
   - Funciona en todos los proyectos del usuario
   - Se mantiene activa entre sesiones

2. **Prioridad:**
   - Las reglas de usuario tienen menor prioridad que las reglas de proyecto o agentes específicos
   - Si hay un conflicto, las reglas más específicas tienen prioridad
   - Sin embargo, cuando no hay reglas más específicas, la regla de usuario se aplica consistentemente

3. **Persistencia:**
   - Una vez configurada, la regla permanece activa hasta que se modifique o elimine
   - No requiere configuración adicional por proyecto
   - Se sincroniza entre diferentes máquinas si se usa la misma cuenta de Cursor

4. **Aplicación Automática:**
   - El agente no necesita recordar explícitamente usar español
   - La regla se aplica de forma transparente
   - El usuario puede olvidarse de la regla y seguirá funcionando

**Evidencia del Funcionamiento:**
- Todos los comentarios de código se generan en español
- Las explicaciones del agente están en español
- La documentación generada está en español
- Los mensajes de error y validación sugeridos están en español
- Los nombres de variables y funciones pueden mantenerse en inglés (convención de código), pero todo lo demás está en español

---

## 2. Reglas de Proyecto

### Descripción
Las **Reglas de Proyecto** son reglas específicas del proyecto que se almacenan en la carpeta `.cursor/rules/` del repositorio. Estas reglas se aplican solo cuando se trabaja en ese proyecto específico y tienen mayor prioridad que las reglas de usuario. Son ideales para definir convenciones arquitectónicas, patrones de diseño y estándares de código específicos del proyecto.

### Caso: Aplicación del Patrón Controller-Direct (Arquitectura Simplificada)

**Objetivo:** Crear una regla de proyecto que fuerce al agente a seguir un patrón simplificado donde el Controller accede directamente a TypeORM, sin capas intermedias de Service ni Repository personalizado. Esta regla demuestra cómo las reglas de proyecto pueden forzar una arquitectura específica diferente a las mejores prácticas por defecto.

#### Configuración de la Regla

**Ubicación:** `.cursor/rules/csr-pattern.md`

**Contenido de la Regla:**
```
---
globs:
  - "**/controllers/**/*.ts"
  - "**/services/**/*.ts"
  - "**/repositories/**/*.ts"
  - "**/dto/**/*.ts"
  - "**/modules/**/*.module.ts"
alwaysApply: false
---

# Regla de Arquitectura: Patrón Controller-Direct (Arquitectura Simplificada)

## Regla de Oro
El Controller DEBE acceder directamente a TypeORM usando @InjectRepository. Toda la lógica de negocio, validación y acceso a datos debe estar en el Controller. NO se deben crear capas intermedias de Service ni Repository personalizado.

## Estructura Obligatoria
Al crear un nuevo endpoint, SIEMPRE debes:
1. Crear/actualizar el Controller en src/modules/[module]/controllers/
2. Crear/actualizar el DTO en src/modules/[module]/dto/
3. Inyectar directamente el Repository de TypeORM en el Controller usando @InjectRepository
4. Colocar TODA la lógica (validación, negocio, acceso a datos) en el Controller

## Prohibiciones
- NO crear archivos de Service personalizado
- NO crear archivos de Repository personalizado
- NO separar la lógica en múltiples capas
- NO delegar operaciones a Services
- NO usar capas intermedias entre Controller y TypeORM

## Estructura del Código
El Controller debe tener esta estructura:
- Inyectar el Repository de TypeORM: `@InjectRepository(Entity) private repository: Repository<Entity>`
- Implementar toda la lógica en los métodos del Controller
- Usar el DTO solo para validación de entrada
- Realizar todas las operaciones de base de datos directamente desde el Controller
```

#### Prompts de Prueba para Validar la Regla

Para probar el funcionamiento de esta regla, puedes usar los siguientes prompts:

**Prompt SIN regla aplicada (comportamiento esperado: código que sigue mejores prácticas - patrón CSR):**
```
Crea un endpoint POST para crear un nuevo usuario. El usuario debe tener los campos: nombre (string, requerido), email (string, requerido, formato válido), contraseña (string, requerido, mínimo 8 caracteres).
```

**Comportamiento esperado SIN regla:**
- El agente seguirá las mejores prácticas de NestJS y creará el patrón CSR:
  1. DTO en `src/modules/users/dto/create-user.dto.ts` con validaciones usando class-validator
  2. Repository personalizado en `src/modules/users/repositories/users.repository.ts` para acceso a datos
  3. Service en `src/modules/users/services/users.service.ts` con lógica de negocio
  4. Controller en `src/modules/users/controllers/users.controller.ts` que solo maneja HTTP y delega al Service
- El Controller NO accederá directamente a TypeORM
- El Service usará el Repository para todas las operaciones de datos
- Todas las capas estarán correctamente separadas (mejores prácticas)

**Prompt CON regla aplicada (comportamiento esperado: código que sigue el patrón Controller-Direct forzado por la regla):**
```
Crea un endpoint POST para crear un nuevo usuario. El usuario debe tener los campos: nombre (string, requerido), email (string, requerido, formato válido), contraseña (string, requerido, mínimo 8 caracteres).
```

**Comportamiento esperado CON regla:**
- El agente seguirá estrictamente la regla y creará solo 2 archivos:
  1. DTO en `src/modules/users/dto/create-user.dto.ts` con validaciones usando class-validator
  2. Controller en `src/modules/users/controllers/users.controller.ts` que contiene TODA la lógica
- El Controller inyectará directamente TypeORM usando `@InjectRepository(User) private userRepository: Repository<User>`
- Toda la lógica (validación de negocio, verificación de email duplicado, hash de contraseña, guardado) estará en el Controller
- NO se creará Service ni Repository personalizado
- El código funcionará pero seguirá el patrón simplificado forzado por la regla

**Nota:** La regla se activa automáticamente cuando trabajas en archivos que coinciden con los globs definidos (`**/controllers/**/*.ts`, `**/services/**/*.ts`, etc.) o cuando mencionas crear endpoints en el contexto del backend. Esta regla demuestra cómo las reglas de proyecto pueden forzar una arquitectura específica, incluso si va en contra de las mejores prácticas por defecto del agente.

#### Escenario de Prueba

**Solicitud al Agente:** "Create an endpoint to add a participant to a trip"

##### ANTES (Sin Regla de Proyecto)

**Comportamiento del Agente:**
Cuando el usuario solicita crear un endpoint sin tener configurada la regla de proyecto, el agente sigue las mejores prácticas por defecto de NestJS:

1. **Análisis de la Solicitud:**
   - El agente entiende que necesita crear un endpoint para agregar participantes
   - Usa su conocimiento general sobre NestJS y mejores prácticas
   - Sigue automáticamente el patrón CSR (Controller-Service-Repository) que es la práctica recomendada

2. **Generación de Código:**
   - El agente crea automáticamente todas las capas necesarias siguiendo el patrón CSR
   - Crea un DTO para validación de entrada
   - Crea un Repository personalizado para acceso a datos
   - Crea un Service con la lógica de negocio
   - Crea un Controller que solo maneja HTTP y delega al Service
   - Separa correctamente las responsabilidades en capas

3. **Estructura Generada:**
   - Crea múltiples archivos siguiendo la estructura del proyecto:
     - DTO en `src/modules/trips/dto/add-participant.dto.ts`
     - Repository en `src/modules/trips/repositories/trip-participants.repository.ts`
     - Service en `src/modules/trips/services/trip-participants.service.ts`
     - Controller en `src/modules/trips/controllers/trips.controller.ts`
   - El Controller NO accede directamente a TypeORM
   - El Service contiene toda la lógica de negocio
   - El Repository maneja todas las operaciones de base de datos

4. **Calidad del Código:**
   - Sigue las mejores prácticas de NestJS
   - Código fácil de testear (capas separadas)
   - Fácil de mantener (separación de responsabilidades)
   - Sigue las convenciones estándar de la industria
   - Arquitectura escalable y mantenible

5. **Interacción con el Usuario:**
   - El agente explica la estructura creada
   - Menciona que siguió el patrón CSR
   - Explica las responsabilidades de cada capa

**Resultado:** Se genera código funcional que sigue las mejores prácticas de NestJS con el patrón CSR, sin necesidad de reglas adicionales.

##### DESPUÉS (Con Regla de Proyecto)

**Comportamiento del Agente:**
Una vez configurada la regla de proyecto, el comportamiento del agente cambia completamente, forzando el patrón Controller-Direct:

1. **Carga de la Regla:**
   - Al iniciar la conversación en este proyecto, el agente automáticamente lee las reglas de `.cursor/rules/`
   - Detecta la regla del patrón Controller-Direct
   - La carga en su contexto de trabajo
   - La regla se convierte en parte de sus instrucciones para este proyecto
   - **La regla tiene prioridad sobre las mejores prácticas por defecto**

2. **Análisis de la Solicitud:**
   - El agente entiende que necesita crear un endpoint para agregar participantes
   - **Reconoce inmediatamente que debe seguir el patrón Controller-Direct (forzado por la regla)**
   - Planifica crear solo 2 archivos: Controller y DTO
   - Identifica que toda la lógica debe ir en el Controller

3. **Planificación de la Implementación:**
   - El agente planifica crear solo 2 archivos:
     - Un DTO para validar los datos de entrada
     - Un Controller que contiene TODA la lógica
   - Decide que el Controller debe inyectar directamente TypeORM
   - Identifica que toda la lógica (validación, negocio, datos) va en el Controller

4. **Generación de Código Simplificado:**

   **a) Generación del DTO:**
   - El agente primero crea el DTO con validaciones usando `class-validator`
   - Incluye decoradores apropiados (`@IsUUID`, `@IsNotEmpty`)
   - Añade mensajes de error en español (siguiendo la regla de usuario)
   - Coloca el archivo en la ubicación correcta: `src/modules/trips/dto/add-participant.dto.ts`

   **b) Generación del Controller (con toda la lógica):**
   - El agente crea el controlador que contiene TODA la lógica
   - Inyecta directamente TypeORM usando `@InjectRepository(TripParticipant) private tripParticipantRepository: Repository<TripParticipant>`
   - Implementa toda la lógica en el método del Controller:
     - Validación de negocio (verificar si el participante ya existe)
     - Operaciones de base de datos (buscar, crear, guardar)
     - Manejo de excepciones
     - Transformación de datos
   - Usa el DTO solo para validación automática de entrada
   - Coloca el archivo en: `src/modules/trips/controllers/trips.controller.ts`
   - **NO crea archivos de Service ni Repository personalizado**

5. **Validación de la Regla:**
   - El agente verifica que el código generado cumple con todas las reglas:
     - ✅ El Controller accede directamente a TypeORM usando @InjectRepository
     - ✅ Toda la lógica está en el Controller
     - ✅ NO se crearon archivos de Service personalizado
     - ✅ NO se crearon archivos de Repository personalizado
     - ✅ Solo se crearon Controller y DTO
   - Si detecta alguna violación (como intentar crear un Service), corrige automáticamente el código para seguir la regla

6. **Explicación al Usuario:**
   - El agente explica la estructura creada
   - Menciona que siguió el patrón Controller-Direct según la regla del proyecto
   - Explica que toda la lógica está en el Controller
   - Puede mencionar que esta arquitectura es más simple pero menos escalable

7. **Rechazo de Código Incorrecto:**
   - Si el usuario intenta pedir código que viole el patrón (como crear un Service), el agente lo rechaza
   - Explica por qué el código propuesto viola las reglas del proyecto
   - Sugiere una alternativa que siga el patrón Controller-Direct
   - Educa al usuario sobre las convenciones del proyecto

**Resultado:** Se genera código que sigue estrictamente el patrón Controller-Direct forzado por la regla, con toda la lógica en el Controller y acceso directo a TypeORM, demostrando cómo las reglas de proyecto pueden forzar una arquitectura específica diferente a las mejores prácticas por defecto.

#### Demostración en Backend

**Escenario:** El usuario solicita "Create an endpoint to update trip details"

**Comportamiento del Agente SIN regla:**
- **Sigue las mejores prácticas y crea el patrón CSR:**
  - Crea 4 archivos: DTO, Repository, Service y Controller
  - Crea el DTO con validaciones para actualización (campos opcionales)
  - Crea el Repository con métodos específicos como `findOne()` y `update()`
  - Crea el Service con lógica de negocio:
    - Verifica que el viaje existe
    - Valida que el viaje está activo (regla de negocio)
    - Maneja errores apropiados (NotFoundException, BadRequestException)
  - Crea el Controller que solo recibe la petición HTTP y delega al servicio
  - El Controller NO accede directamente a la base de datos
- Explica la estructura al usuario y por qué cada capa es necesaria (mejores prácticas)

**Comportamiento del Agente CON regla:**
- **Sigue estrictamente la regla y crea el patrón Controller-Direct:**
  - **Planifica la creación de solo 2 archivos:** DTO y Controller
  - **Crea el DTO primero** con validaciones para actualización (campos opcionales)
  - **Crea el Controller** que contiene TODA la lógica:
    - Inyecta directamente TypeORM usando `@InjectRepository(Trip)`
    - Verifica que el viaje existe (lógica en el Controller)
    - Valida que el viaje está activo (lógica en el Controller)
    - Maneja errores apropiados directamente en el Controller
    - Realiza la actualización directamente desde el Controller
  - **NO crea Service ni Repository personalizado**
  - **Toda la lógica está en el Controller**
- Explica que siguió el patrón Controller-Direct según la regla del proyecto

#### Demostración en Frontend

**Escenario:** El usuario solicita "Create a component to display trip participants"

**Comportamiento del Agente SIN regla de proyecto para frontend:**
- Puede crear un componente que haga llamadas API directamente
- Mezcla lógica de negocio con presentación
- No sigue la estructura de carpetas del proyecto

**Comportamiento del Agente CON regla de proyecto para frontend:**

Si existe una regla adicional en `.cursor/rules/frontend-patterns.md` que especifica:
- Usar React Hook Form para formularios
- Usar TanStack Query para llamadas API
- Separar lógica en hooks personalizados

El agente:
- **Crea un hook personalizado** (`useTripParticipants`) que usa TanStack Query
- **Crea un servicio API** (`tripsApi`) que encapsula las llamadas HTTP
- **Crea el componente** que solo se enfoca en la presentación
- **Separa las responsabilidades** correctamente
- **Sigue la estructura de carpetas** del proyecto (hooks/, services/, components/)
- Explica cómo cada parte se relaciona con las otras

#### Análisis del Comportamiento

**Cómo funciona la Regla de Proyecto:**

1. **Alcance Local:**
   - La regla solo se aplica cuando se trabaja en este proyecto específico
   - No afecta otros proyectos del usuario
   - Se activa automáticamente al abrir el proyecto en Cursor

2. **Prioridad Alta:**
   - Tiene mayor prioridad que las reglas de usuario
   - Si hay un conflicto, la regla de proyecto prevalece
   - Se aplica de forma consistente en todo el proyecto

3. **Aplicación Automática:**
   - El agente lee las reglas de `.cursor/rules/` automáticamente
   - No es necesario mencionar la regla en cada solicitud
   - Se convierte en parte del contexto de trabajo del agente

4. **Contexto Específico:**
   - Puede referenciar la estructura del proyecto
   - Conoce las convenciones específicas del proyecto
   - Puede aplicar reglas que dependen del stack tecnológico usado

5. **Validación Continua:**
   - El agente valida que el código generado cumple con las reglas
   - Rechaza código que viole las reglas
   - Sugiere refactorización cuando detecta violaciones

**Evidencia del Funcionamiento:**
- El agente crea automáticamente solo Controller y DTO (sin Service ni Repository personalizado)
- El Controller accede directamente a TypeORM usando @InjectRepository
- Toda la lógica está en el Controller (validación, negocio, datos)
- Rechaza crear código que viole el patrón Controller-Direct (como crear un Service)
- Sugiere refactorizar código existente que no siga el patrón forzado por la regla
- Aplica las reglas tanto en backend como en frontend cuando están definidas
- Explica al usuario por qué sigue cierta estructura (según la regla del proyecto)
- Mantiene consistencia en todo el proyecto (aunque vaya en contra de mejores prácticas)
- **Demuestra que las reglas de proyecto tienen prioridad sobre las mejores prácticas por defecto del agente**

---

## 3. Reglas AGENTS

### Descripción
Las **Reglas AGENTS** son agentes especializados que se activan mediante menciones específicas (como `@agent-name`). Estos agentes tienen conocimiento profundo sobre un dominio específico y pueden realizar tareas complejas siguiendo reglas y patrones predefinidos. A diferencia de las reglas de proyecto que se aplican automáticamente, los agentes se activan explícitamente cuando el usuario los menciona.

### Formas de Configurar Agentes

Cursor soporta dos formas principales de configurar agentes:

1. **AGENTS.md (Enfoque Simple):**
   - Archivo markdown plano ubicado en la raíz del proyecto o en subdirectorios
   - No requiere metadatos ni configuraciones complejas
   - Perfecto para proyectos que necesitan instrucciones simples y legibles
   - Soporta archivos anidados en subdirectorios para control granular
   - Las instrucciones se combinan jerárquicamente (más específicas tienen prioridad)
   - Ubicación: `AGENTS.md` en la raíz o `[subdirectorio]/AGENTS.md`

2. **.cursor/agents/ (Enfoque Estructurado):**
   - Archivos markdown individuales para cada agente especializado
   - Permite estructura más compleja con metadatos
   - Ideal para agentes con múltiples reglas y capacidades
   - Cada agente tiene su propio archivo (ej: `csr-architect.md`)
   - Ubicación: `.cursor/agents/[agent-name].md`

**Nota:** Ambos enfoques son válidos. `AGENTS.md` es más simple y directo, mientras que `.cursor/agents/` ofrece más estructura y organización para proyectos complejos.

#### Archivos AGENTS.md Anidados

Una característica poderosa de `AGENTS.md` es el soporte para archivos anidados en subdirectorios. Esto permite tener instrucciones específicas para diferentes áreas del proyecto:

```
project/
  AGENTS.md              # Instrucciones globales del proyecto
  frontend/
    AGENTS.md            # Instrucciones específicas para frontend
    components/
      AGENTS.md          # Instrucciones específicas para componentes
  backend/
    AGENTS.md            # Instrucciones específicas para backend
    modules/
      users/
        AGENTS.md        # Instrucciones específicas para el módulo de usuarios
```

**Comportamiento:**
- Las instrucciones de `AGENTS.md` en subdirectorios se combinan con las de directorios padre
- Las instrucciones más específicas (en subdirectorios más profundos) tienen prioridad
- Cuando trabajas en un archivo, Cursor aplica todas las instrucciones relevantes desde la raíz hasta el subdirectorio actual
- Esto permite tener reglas globales y sobrescribirlas o complementarlas en áreas específicas

**Ejemplo de jerarquía:**
- `AGENTS.md` (raíz): "Usar TypeScript para todos los archivos"
- `Backend/AGENTS.md`: "Seguir patrón CSR para todos los endpoints"
- `Backend/modules/users/AGENTS.md`: "Validar que los emails sean únicos al crear usuarios"

Cuando trabajas en `Backend/modules/users/controllers/users.controller.ts`, se aplican las tres instrucciones, con prioridad para las más específicas.

### Caso 1: Agent de Arquitectura CSR

Este caso muestra cómo configurar un agente especializado en arquitectura CSR usando ambos enfoques disponibles.

#### Opción A: Configuración usando .cursor/agents/ (Enfoque Estructurado)

**Ubicación:** `.cursor/agents/csr-architect.md`

**Contenido del Agent:**
```
# Agent: CSR Architect

## Role
You are a specialized agent for enforcing the Controller-Service-Repository (CSR) pattern in NestJS applications.

## Rules
1. When creating endpoints, ALWAYS create Controller, Service, and Repository layers
2. Controllers should ONLY handle HTTP requests/responses and delegate to Services
3. Services contain ALL business logic and use Repositories for data access
4. Repositories handle ALL database operations using TypeORM
5. DTOs must be created with class-validator decorators
6. Never allow direct database access from Controllers
7. Always validate that the CSR pattern is followed before suggesting code

## Capabilities
- Create complete CSR implementations for new endpoints
- Refactor existing code to follow CSR pattern
- Identify violations of the CSR pattern
- Suggest improvements to maintain separation of concerns
```

#### Opción B: Configuración usando AGENTS.md (Enfoque Simple)

**Ubicación:** `Backend/AGENTS.md` (para instrucciones específicas del backend)

**Contenido del Agent:**
```
# Project Instructions

## Architecture
- Follow the Controller-Service-Repository (CSR) pattern for all endpoints
- Controllers should ONLY handle HTTP requests/responses and delegate to Services
- Services contain ALL business logic and use Repositories for data access
- Repositories handle ALL database operations using TypeORM
- Never allow direct database access from Controllers

## Code Style
- DTOs must be created with class-validator decorators
- Always validate that the CSR pattern is followed before suggesting code

## When creating endpoints
- ALWAYS create Controller, Service, and Repository layers
- Create DTOs with proper validation
- Ensure separation of concerns between layers
```

**Ventajas de cada enfoque:**
- **.cursor/agents/**: Más estructura, mejor para agentes complejos con múltiples secciones (Role, Rules, Capabilities)
- **AGENTS.md**: Más simple, mejor para instrucciones directas y legibles, soporta archivos anidados por subdirectorio

#### Escenario de Prueba

**Solicitud al Agente:** "@csr-architect Create an endpoint to update trip details"

##### ANTES (Sin Agent)

**Comportamiento del Agente Genérico:**
Cuando el usuario solicita crear un endpoint sin mencionar un agent específico:

1. **Procesamiento de la Solicitud:**
   - El agente genérico analiza la solicitud
   - Usa su conocimiento general sobre NestJS
   - Puede o no seguir el patrón CSR dependiendo de cómo interprete la solicitud
   - No tiene un enfoque especializado en arquitectura

2. **Generación de Código:**
   - Puede crear solo el controlador
   - Puede acceder directamente a TypeORM desde el controlador
   - Puede omitir capas si no se mencionan explícitamente
   - La estructura puede ser inconsistente con otros endpoints del proyecto

3. **Validación:**
   - No valida específicamente el patrón CSR
   - No verifica que todas las capas estén presentes
   - No rechaza código que viole principios arquitectónicos

4. **Interacción:**
   - Proporciona código funcional pero puede no ser óptimo arquitectónicamente
   - No educa específicamente sobre el patrón CSR
   - No sugiere mejoras arquitectónicas a menos que se le pregunte

**Resultado:** Código funcional pero potencialmente inconsistente con las convenciones del proyecto.

##### DESPUÉS (Con Agent @csr-architect)

**Comportamiento del Agent Especializado:**
Cuando el usuario menciona `@csr-architect`, el comportamiento cambia completamente:

1. **Activación del Agent:**
   - El usuario menciona `@csr-architect` en su solicitud
   - Cursor detecta la mención y busca el agent en `.cursor/agents/csr-architect.md`
   - Carga el agent y sus reglas específicas
   - El agent se convierte en el contexto principal para esa interacción
   - Todas las reglas del agent se activan inmediatamente

2. **Análisis Profundo de la Solicitud:**
   - El agent analiza: "Create an endpoint to update trip details"
   - **Reconoce inmediatamente que debe seguir el patrón CSR estrictamente**
   - Identifica que necesita crear un endpoint de actualización (PATCH o PUT)
   - Planifica la creación de todas las capas necesarias
   - Considera las reglas de negocio del proyecto (soft delete, validaciones, etc.)

3. **Planificación Arquitectónica:**
   - El agent crea un plan detallado:
     - DTO de actualización (con campos opcionales usando `PartialType`)
     - Repository con métodos `findOne()` y `update()`
     - Service con lógica de negocio (verificar existencia, validar estado activo)
     - Controller que solo maneja HTTP
   - Decide qué validaciones van en el DTO vs el Service
   - Identifica qué lógica de negocio debe implementarse

4. **Generación de Código en Capas con Validación:**

   **a) Análisis de Requisitos:**
   - El agent analiza qué campos pueden actualizarse (nombre, descripción)
   - Identifica que algunos campos no deberían actualizarse (ID, created_at)
   - Considera las reglas de negocio (solo viajes activos pueden actualizarse)

   **b) Creación del DTO:**
   - Crea un DTO de actualización que extiende `PartialType` del DTO de creación
   - Aplica validaciones apropiadas (`@IsOptional`, `@MaxLength`)
   - Incluye documentación Swagger
   - Añade mensajes de error en español

   **c) Creación del Repository:**
   - Crea métodos específicos: `findOne()` que respeta soft delete
   - Crea método `update()` que actualiza y retorna la entidad actualizada
   - Encapsula toda la lógica de acceso a datos
   - Maneja correctamente las relaciones si es necesario

   **d) Creación del Service:**
   - Implementa lógica de negocio:
     - Verifica que el viaje existe (lanza `NotFoundException` si no)
     - Valida que el viaje está activo (lanza `BadRequestException` si no)
     - Aplica cualquier otra regla de negocio
   - Usa el repository para todas las operaciones de datos
   - Maneja excepciones apropiadamente

   **e) Creación del Controller:**
   - Solo maneja la petición HTTP
   - Usa el DTO para validación automática
   - Delega inmediatamente al servicio
   - Retorna la respuesta apropiada

5. **Validación Estricta del Patrón:**
   - El agent verifica cada capa:
     - ✅ Controller no tiene acceso a TypeORM
     - ✅ Controller no tiene lógica de negocio
     - ✅ Service contiene toda la lógica de negocio
     - ✅ Service usa Repository, no TypeORM directamente
     - ✅ Repository maneja todas las operaciones de base de datos
     - ✅ DTO tiene validaciones apropiadas
   - Si detecta alguna violación, **rechaza el código y lo corrige**

6. **Explicación Detallada:**
   - El agent explica por qué creó cada capa
   - Explica qué responsabilidades tiene cada capa
   - Menciona cómo se relacionan las capas entre sí
   - Educa al usuario sobre el patrón CSR

7. **Rechazo de Código Incorrecto:**
   - Si el usuario intenta pedir código que viole el patrón, el agent lo rechaza firmemente
   - Explica específicamente qué regla se violaría
   - Proporciona una alternativa que siga el patrón
   - Mantiene su rol de "guardián" del patrón CSR

8. **Contexto Persistente:**
   - Durante la conversación, el agent mantiene el contexto del patrón CSR
   - Recuerda las decisiones arquitectónicas tomadas
   - Aplica consistencia en todas las sugerencias
   - Si se crean múltiples endpoints, todos siguen el mismo patrón

**Resultado:** Código que sigue estrictamente el patrón CSR, con todas las capas correctamente implementadas y validadas.

#### Explicación Detallada del Funcionamiento

**1. Activación del Agent:**

**Para agentes en `.cursor/agents/`:**
- El usuario menciona `@csr-architect` en su solicitud
- Cursor detecta la mención usando el símbolo `@`
- Busca el archivo del agent en `.cursor/agents/csr-architect.md`
- Carga el contenido del agent (Role, Rules, Capabilities)
- El agent se convierte en el "persona" que responde, no el agente genérico

**Para instrucciones en `AGENTS.md`:**
- Las instrucciones se aplican automáticamente cuando trabajas en archivos del directorio donde está ubicado el `AGENTS.md`
- No requiere mención explícita con `@agent-name`
- Se combinan con instrucciones de directorios padre
- Funcionan como reglas de proyecto pero específicas por directorio

**2. Aplicación de Reglas:**
- Todas las reglas del agent se convierten en instrucciones prioritarias
- El agent verifica cada sugerencia contra las reglas antes de proponer código
- Si una sugerencia viola alguna regla, el agent la rechaza o la modifica

**3. Conocimiento Especializado:**
- El agent tiene conocimiento profundo sobre el patrón CSR
- Entiende las mejores prácticas de NestJS
- Conoce los anti-patrones comunes y los evita
- Sabe cómo estructurar código escalable y mantenible

**4. Validación Continua:**
- El agent no solo genera código, sino que lo valida
- Verifica que el código generado cumple con todas las reglas
- Sugiere mejoras incluso después de generar el código inicial
- Actúa como un "code reviewer" automático

**5. Educación del Usuario:**
- El agent no solo genera código, sino que educa
- Explica por qué sigue cierta estructura
- Enseña las mejores prácticas
- Ayuda al usuario a entender el patrón CSR

**6. Consistencia:**
- El agent mantiene consistencia en todas sus respuestas
- Si se crean múltiples endpoints, todos siguen el mismo patrón
- Aplica las mismas reglas de forma consistente
- Crea un código base uniforme en todo el proyecto

---

### Caso 2: Agent de Validación de DTOs

#### Configuración del Agent

**Ubicación:** `.cursor/agents/dto-validator.md`

**Contenido del Agent:**
```
# Agent: DTO Validator

## Role
You are a specialized agent for creating and validating Data Transfer Objects (DTOs) in NestJS applications using class-validator and class-transformer.

## Rules
1. ALL DTOs must use class-validator decorators for validation
2. Use appropriate validators: @IsString(), @IsNumber(), @IsEmail(), @IsUUID(), etc.
3. Add @IsOptional() for optional fields
4. Use @Min(), @Max(), @Length() for constraints
5. Always include transformation decorators from class-transformer when needed
6. Create separate DTOs for Create and Update operations
7. Use @ApiProperty() from @nestjs/swagger for API documentation
8. Validate nested objects with @ValidateNested() and @Type()
```

#### Escenario de Prueba

**Solicitud al Agente:** "@dto-validator Create DTOs for expense creation and update"

##### ANTES (Sin Agent)

**Comportamiento del Agente Genérico:**
Cuando el usuario solicita crear DTOs sin mencionar un agent específico:

1. **Procesamiento de la Solicitud:**
   - El agente genérico entiende que necesita crear DTOs
   - Puede crear estructuras básicas de TypeScript
   - Puede o no incluir validaciones
   - No tiene conocimiento especializado sobre class-validator

2. **Generación de Código:**
   - Puede crear interfaces o clases simples
   - Puede omitir decoradores de validación
   - Puede no incluir documentación Swagger
   - Puede no considerar todos los casos de validación
   - Puede crear un solo DTO para crear y actualizar (incorrecto)

3. **Validación:**
   - No valida que se usen los decoradores apropiados
   - No verifica que los tipos sean correctos
   - No asegura que haya mensajes de error personalizados
   - No valida que se separen DTOs de creación y actualización

4. **Interacción:**
   - Proporciona código básico que puede funcionar
   - No educa sobre mejores prácticas de validación
   - No sugiere validaciones adicionales que podrían ser necesarias

**Resultado:** DTOs básicos que pueden no tener validaciones completas ni seguir mejores prácticas.

##### DESPUÉS (Con Agent @dto-validator)

**Comportamiento del Agent Especializado:**
Cuando el usuario menciona `@dto-validator`, el comportamiento se vuelve altamente especializado:

1. **Activación del Agent:**
   - El usuario menciona `@dto-validator`
   - El agent se carga desde `.cursor/agents/dto-validator.md`
   - Todas sus reglas específicas sobre validación se activan
   - El agent se enfoca exclusivamente en crear DTOs perfectos

2. **Análisis Profundo de Requisitos:**
   - El agent analiza: "Create DTOs for expense creation and update"
   - **Reconoce que necesita DOS DTOs separados** (Create y Update)
   - Analiza el modelo de datos del proyecto (Expense entity)
   - Identifica todos los campos que necesitan validación
   - Considera las reglas de negocio (montos positivos, UUIDs válidos, etc.)

3. **Planificación de Validaciones:**
   - El agent planifica qué validaciones necesita cada campo:
     - `title`: String, requerido, máximo 100 caracteres
     - `amount`: Number, requerido, positivo, mínimo 0.01, máximo 2 decimales
     - `payerId`: UUID, requerido, formato válido
     - `categoryId`: Integer, requerido, positivo, debe ser una categoría válida
     - `receiptUrl`: URL, opcional, formato válido
     - `beneficiaryIds`: Array de UUIDs, requerido, al menos uno
   - Considera mensajes de error personalizados en español
   - Planifica documentación Swagger para cada campo

4. **Generación del DTO de Creación:**

   **a) Análisis de Campos:**
   - El agent identifica todos los campos necesarios para crear un gasto
   - Determina qué campos son requeridos y cuáles opcionales
   - Identifica los tipos de datos correctos

   **b) Aplicación de Validaciones:**
   - Para cada campo, aplica los decoradores apropiados:
     - `@IsString()` con `@MaxLength()` para títulos
     - `@IsNumber()` con `@IsPositive()` y `@Min()` para montos
     - `@IsUUID()` para IDs de usuarios
     - `@IsInt()` con `@IsPositive()` para IDs de categorías
     - `@IsOptional()` con `@IsUrl()` para URLs opcionales
     - `@IsUUID({ each: true })` para arrays de UUIDs
   - Añade mensajes de error personalizados en español para cada validación

   **c) Documentación Swagger:**
   - Añade `@ApiProperty()` o `@ApiPropertyOptional()` a cada campo
   - Incluye descripciones en español
   - Proporciona ejemplos de valores válidos
   - Especifica tipos y restricciones en la documentación

   **d) Transformaciones:**
   - Usa `@Type()` cuando es necesario para transformaciones
   - Aplica `valueAsNumber: true` en formularios cuando corresponde
   - Considera transformaciones de fechas si es necesario

5. **Generación del DTO de Actualización:**

   **a) Uso de PartialType:**
   - El agent crea el DTO de actualización extendiendo `PartialType(CreateExpenseDto)`
   - Esto hace que todos los campos sean opcionales automáticamente
   - Mantiene las mismas validaciones pero aplicadas solo si el campo está presente

   **b) Validaciones Específicas:**
   - Puede añadir validaciones adicionales específicas para actualización
   - Considera qué campos pueden actualizarse y cuáles no
   - Aplica reglas de negocio específicas para actualizaciones

6. **Validación de Completitud:**
   - El agent verifica que:
     - ✅ Todos los campos tienen validaciones apropiadas
     - ✅ Los mensajes de error están en español
     - ✅ La documentación Swagger está completa
     - ✅ Se separaron correctamente los DTOs de creación y actualización
     - ✅ Los tipos son correctos
     - ✅ Se consideraron todos los casos edge (arrays vacíos, valores negativos, etc.)

7. **Sugerencias de Mejora:**
   - El agent puede sugerir validaciones adicionales:
     - Validación de categorías contra una lista de categorías válidas
     - Validación de que el pagador está en la lista de beneficiarios (si aplica)
     - Validación de formatos de archivo para imágenes
   - Sugiere crear DTOs anidados si la estructura es compleja
   - Recomienda usar enums para valores predefinidos

8. **Explicación Detallada:**
   - El agent explica cada validación aplicada
   - Explica por qué se eligieron ciertos decoradores
   - Menciona cómo las validaciones se integran con NestJS
   - Educa al usuario sobre mejores prácticas de validación

**Resultado:** DTOs completos con validaciones exhaustivas, documentación Swagger y separación correcta entre creación y actualización.

#### Explicación Detallada del Funcionamiento

**1. Activación del Agent:**
- El usuario menciona `@dto-validator`
- El agent se activa y carga sus reglas específicas sobre validación
- Se convierte en un "experto en DTOs" para esa interacción
- Todas sus respuestas se enfocan en crear DTOs perfectos

**2. Conocimiento Especializado:**
- El agent tiene conocimiento profundo sobre:
   - Todos los decoradores de class-validator
   - Cuándo usar cada decorador
   - Cómo combinar múltiples validaciones
   - Mejores prácticas de validación en NestJS
   - Integración con Swagger

**3. Análisis de Contexto:**
- El agent analiza el modelo de datos del proyecto
- Considera las reglas de negocio (montos en COP, UUIDs, etc.)
- Aplica el idioma español para mensajes de error (regla de usuario)
- Sigue las convenciones del proyecto

**4. Generación Inteligente:**
- No solo aplica validaciones básicas
- Considera casos edge y validaciones complejas
- Aplica transformaciones cuando es necesario
- Separa correctamente DTOs de creación y actualización

**5. Validación Continua:**
- El agent valida su propio trabajo
- Verifica que todas las reglas se cumplieron
- Sugiere mejoras incluso después de generar el código
- Actúa como un "validator de validators"

**6. Educación:**
- El agent educa al usuario sobre:
   - Por qué se usan ciertas validaciones
   - Cómo funcionan los decoradores
   - Mejores prácticas de validación
   - Cómo integrar con el resto de la aplicación

---

### Caso 3: Agent de Componentes React

#### Configuración del Agent

**Ubicación:** `.cursor/agents/react-components.md`

**Contenido del Agent:**
```
# Agent: React Components Specialist

## Role
You are a specialized agent for creating React components following best practices for the TravelSplit project.

## Rules
1. ALL components must use TypeScript with proper typing
2. Use React Hook Form for ALL forms
3. Use TanStack Query (React Query) for ALL API calls
4. Use Zustand for global state management (session, UI state)
5. Use Tailwind CSS for styling (no inline styles, no CSS modules)
6. Components must be responsive and follow WCAG guidelines
7. Separate business logic into custom hooks
8. Use proper error handling and loading states
9. All text and labels must be in Spanish
10. Follow atomic design principles (atoms, molecules, organisms)
```

#### Escenario de Prueba

**Solicitud al Agente:** "@react-components Create a form to create a new expense with image upload"

##### ANTES (Sin Agent)

**Comportamiento del Agente Genérico:**
Cuando el usuario solicita crear un componente React sin mencionar un agent específico:

1. **Procesamiento de la Solicitud:**
   - El agente genérico entiende que necesita crear un formulario
   - Puede crear un componente básico de React
   - Puede o no usar las librerías específicas del proyecto
   - No tiene conocimiento especializado sobre la estructura del proyecto

2. **Generación de Código:**
   - Puede crear un componente con `useState` básico
   - Puede usar `fetch` directamente en lugar de TanStack Query
   - Puede no usar React Hook Form
   - Puede no tener manejo de errores apropiado
   - Puede no ser accesible
   - Puede no usar Tailwind CSS
   - Puede no seguir la estructura de carpetas del proyecto

3. **Estructura:**
   - Puede crear un solo archivo con toda la lógica
   - Puede no separar hooks personalizados
   - Puede no crear servicios API
   - Puede no seguir principios de diseño atómico

4. **Validación:**
   - No valida que se usen las librerías correctas
   - No verifica accesibilidad
   - No asegura que se sigan las convenciones del proyecto

**Resultado:** Componente funcional pero que puede no seguir las mejores prácticas ni las convenciones del proyecto.

##### DESPUÉS (Con Agent @react-components)

**Comportamiento del Agent Especializado:**
Cuando el usuario menciona `@react-components`, el comportamiento se vuelve altamente especializado:

1. **Activación del Agent:**
   - El usuario menciona `@react-components`
   - El agent se carga desde `.cursor/agents/react-components.md`
   - Todas sus reglas específicas sobre React se activan
   - El agent se convierte en un "experto en React" para esa interacción

2. **Análisis Profundo de Requisitos:**
   - El agent analiza: "Create a form to create a new expense with image upload"
   - **Identifica que necesita:**
     - Un formulario completo con validación
     - Subida de archivos (imagen)
     - Integración con API
     - Manejo de estado (carga, errores, éxito)
   - Planifica la creación de múltiples archivos siguiendo la estructura del proyecto

3. **Planificación de la Estructura:**
   - El agent planifica crear:
     - Tipos TypeScript para el formulario
     - Hook personalizado para la mutación (usando TanStack Query)
     - Servicio API para la llamada HTTP
     - Componente del formulario (usando React Hook Form)
   - Decide qué lógica va en cada archivo
   - Sigue la estructura de carpetas del proyecto

4. **Generación de Tipos TypeScript:**
   - El agent primero crea los tipos necesarios
   - Define la interfaz para los datos del formulario
   - Incluye tipos para categorías, participantes, etc.
   - Asegura que todos los tipos sean estrictos y completos

5. **Generación del Hook Personalizado:**
   - El agent crea un hook `useCreateExpense` que:
     - Usa `useMutation` de TanStack Query
     - Encapsula la lógica de la mutación
     - Maneja invalidación de queries relacionadas
     - Incluye manejo de errores
   - Coloca el hook en la ubicación correcta: `src/hooks/useCreateExpense.ts`

6. **Generación del Servicio API:**
   - El agent crea un servicio que:
     - Encapsula la llamada HTTP
     - Maneja FormData para la subida de archivos
     - Usa el cliente API configurado del proyecto
     - Sigue las convenciones de nombres del proyecto
   - Coloca el servicio en: `src/services/api/expenses.api.ts`

7. **Generación del Componente del Formulario:**

   **a) Configuración de React Hook Form:**
   - El agent configura React Hook Form con:
     - `useForm` con tipos TypeScript
     - Validaciones para cada campo
     - Manejo de errores de validación
     - Valores por defecto apropiados

   **b) Campos del Formulario:**
   - El agent crea cada campo del formulario:
     - Título: input de texto con validación (requerido, máximo 100 caracteres)
     - Monto: input numérico con validación (requerido, positivo, mínimo 0.01)
     - Pagador: select con lista de participantes
     - Categoría: select con lista de categorías
     - Beneficiarios: checkboxes con validación (al menos uno requerido)
     - Foto del recibo: input de archivo con aceptación de imágenes
   - Cada campo tiene:
     - Label accesible en español
     - Validación con mensajes de error en español
     - Estilos con Tailwind CSS
     - Atributos de accesibilidad (aria-labels, roles)

   **c) Manejo de Estado:**
   - El agent implementa:
     - Estado de carga (`isPending` de la mutación)
     - Manejo de errores (muestra errores de API y validación)
     - Estado de éxito (puede resetear el formulario o mostrar mensaje)
     - Deshabilitación de botones durante la carga

   **d) Estilos con Tailwind CSS:**
   - El agent aplica estilos usando Tailwind:
     - Clases de espaciado (`space-y-6`, `p-6`)
     - Clases de colores (`bg-white`, `text-gray-700`)
     - Clases de bordes y sombras (`border`, `rounded-lg`, `shadow-md`)
     - Estados de hover y focus
     - Diseño responsive
   - No usa estilos inline ni CSS modules

   **e) Accesibilidad:**
   - El agent implementa:
     - `aria-label` en el formulario
     - `aria-invalid` y `aria-describedby` en campos con errores
     - `role="alert"` en mensajes de error
     - Labels asociados correctamente con inputs
     - Navegación por teclado funcional
     - Contraste de colores apropiado

   **f) Lógica de Negocio:**
   - El agent implementa lógica específica:
     - El pagador no puede ser beneficiario (se deshabilita en checkboxes)
     - Validación de que al menos un beneficiario está seleccionado
     - Preview de la imagen seleccionada (opcional pero recomendado)
     - Reset del formulario después de éxito

8. **Integración con el Proyecto:**
   - El agent asegura que el componente:
     - Use TanStack Query para obtener participantes y categorías
     - Se integre con el sistema de autenticación del proyecto
     - Siga las convenciones de nombres del proyecto
     - Use los tipos compartidos del proyecto

9. **Validación de Reglas:**
   - El agent verifica que:
     - ✅ Se usa TypeScript con tipos estrictos
     - ✅ Se usa React Hook Form para el formulario
     - ✅ Se usa TanStack Query para la mutación
     - ✅ Se usa Tailwind CSS para estilos
     - ✅ El componente es accesible (WCAG)
     - ✅ La lógica está separada en hooks
     - ✅ Los textos están en español
     - ✅ Se manejan errores y estados de carga

10. **Explicación Detallada:**
    - El agent explica:
      - Por qué se usó cada librería
      - Cómo se estructura el componente
      - Cómo se manejan los estados
      - Cómo se integra con el resto de la aplicación
      - Mejores prácticas aplicadas

**Resultado:** Componente React completo, bien estructurado, accesible, con todas las mejores prácticas aplicadas y siguiendo las convenciones del proyecto.

#### Explicación Detallada del Funcionamiento

**1. Activación del Agent:**
- El usuario menciona `@react-components`
- El agent se activa y carga todas sus reglas específicas sobre React
- Se convierte en un "experto en React" para esa interacción
- Todas sus respuestas se enfocan en crear componentes perfectos

**2. Conocimiento Especializado:**
- El agent tiene conocimiento profundo sobre:
   - React Hook Form y sus mejores prácticas
   - TanStack Query y patrones de mutación
   - Tailwind CSS y diseño responsive
   - Accesibilidad web (WCAG)
   - TypeScript en React
   - Estructura de proyectos React modernos

**3. Aplicación de Múltiples Reglas:**
- El agent aplica simultáneamente:
   - Regla de usuario (español)
   - Reglas del proyecto (estructura de carpetas)
   - Reglas del agent (React Hook Form, TanStack Query, etc.)
   - Mejores prácticas de React y TypeScript

**4. Generación Completa:**
- No solo crea el componente
- Crea toda la infraestructura necesaria:
   - Tipos TypeScript
   - Hooks personalizados
   - Servicios API
   - El componente en sí
- Asegura que todo esté correctamente integrado

**5. Validación Continua:**
- El agent valida que se sigan todas las reglas
- Verifica accesibilidad
- Asegura que se usen las librerías correctas
- Sugiere mejoras incluso después de generar el código

**6. Educación:**
- El agent educa al usuario sobre:
   - Por qué se usan ciertas librerías
   - Cómo funcionan los hooks personalizados
   - Mejores prácticas de React
   - Cómo mantener el código

---

## Resumen Comparativo

### Tabla de Comparación: Antes vs Después

| Aspecto | Sin Reglas | Con Reglas |
|---------|-----------|------------|
| **Idioma de Documentación** | Inglés (inconsistente) | Español (consistente y automático) |
| **Arquitectura Backend** | Código monolítico, sin separación de capas | Patrón CSR estricto con todas las capas |
| **Validación de DTOs** | Sin validaciones o validaciones básicas | Validaciones completas con class-validator y Swagger |
| **Componentes React** | Básicos, sin estructura clara | Complejos, bien estructurados con hooks y servicios |
| **Manejo de Estado** | useState básico o inconsistente | TanStack Query + Zustand según corresponda |
| **Formularios** | HTML nativo o implementación básica | React Hook Form con validación completa |
| **Estilos** | Inline, CSS modules o inconsistente | Tailwind CSS consistente |
| **Accesibilidad** | No considerada o básica | WCAG compliant con atributos apropiados |
| **TypeScript** | Tipado básico o sin tipos | Tipado estricto y completo |
| **Manejo de Errores** | Inexistente o básico | Completo con estados de carga y mensajes claros |
| **Estructura de Archivos** | Inconsistente | Sigue la estructura del proyecto |
| **Consistencia** | Variable según el contexto | Consistente en todo el proyecto |

### Beneficios de Usar Reglas

1. **Consistencia:**
   - Todo el código sigue los mismos patrones
   - Misma estructura en todo el proyecto
   - Mismas convenciones de nombres
   - Mismo estilo de código

2. **Calidad:**
   - El código generado es de mayor calidad
   - Sigue mejores prácticas automáticamente
   - Incluye validaciones y manejo de errores
   - Es más mantenible y escalable

3. **Productividad:**
   - Menos tiempo corrigiendo código mal estructurado
   - Menos decisiones repetitivas
   - Generación automática de código boilerplate
   - Menos errores comunes

4. **Mantenibilidad:**
   - Código más fácil de entender
   - Estructura predecible
   - Separación clara de responsabilidades
   - Fácil de extender y modificar

5. **Escalabilidad:**
   - Estructura que soporta el crecimiento del proyecto
   - Patrones que facilitan agregar nuevas funcionalidades
   - Código que es fácil de testear
   - Arquitectura que soporta equipos grandes

6. **Estándares:**
   - Cumplimiento automático de estándares
   - Mejores prácticas aplicadas automáticamente
   - Código que sigue convenciones de la industria
   - Documentación automática cuando es apropiado

7. **Educación:**
   - El equipo aprende mejores prácticas viendo el código generado
   - Los agentes educan sobre por qué se hacen las cosas de cierta manera
   - Consistencia que facilita la incorporación de nuevos miembros
   - Documentación implícita en la estructura del código

---

## Conclusiones

Las reglas de Cursor (Usuario, Proyecto y AGENTS) son herramientas poderosas que permiten:

1. **Automatizar** la aplicación de convenciones y patrones:
   - Las reglas se aplican automáticamente sin intervención manual
   - Reducen la carga cognitiva del desarrollador
   - Eliminan la necesidad de recordar convenciones en cada interacción

2. **Garantizar** la calidad y consistencia del código:
   - El código generado sigue estándares definidos
   - Se reducen errores comunes
   - Se mantiene consistencia en todo el proyecto

3. **Acelerar** el desarrollo al reducir decisiones repetitivas:
   - No es necesario explicar las convenciones en cada solicitud
   - El código se genera siguiendo los patrones correctos desde el inicio
   - Menos tiempo en refactorización

4. **Educar** al equipo sobre mejores prácticas:
   - Los agentes explican por qué se hacen las cosas de cierta manera
   - El código generado sirve como ejemplo
   - Facilita la incorporación de nuevos miembros al equipo

5. **Estandarizar** la arquitectura y estructura del proyecto:
   - Todos los endpoints siguen el mismo patrón
   - Todos los componentes siguen la misma estructura
   - Fácil navegación y comprensión del código

Cada tipo de regla tiene su propósito específico:

- **Reglas de Usuario:** Preferencias globales que se aplican a todos los proyectos (idioma, estilo general, preferencias personales)
- **Reglas de Proyecto:** Convenciones específicas del proyecto que se aplican automáticamente (arquitectura, patrones, estructura de carpetas)
- **Reglas AGENTS:** Especialización en dominios específicos que se activan cuando se necesitan (DTOs, componentes React, arquitectura CSR)

La combinación de estos tres tipos de reglas permite crear un entorno de desarrollo altamente productivo, consistente y de alta calidad, donde el agente de IA se convierte en un miembro más del equipo que conoce y aplica las convenciones del proyecto automáticamente.

