---
name: /git-workflow
id: git-workflow
category: Git
description: Analiza el flujo de trabajo, crea rama si es feature nueva, hace commits estándar y push al remoto.
triggers:
  - "commit"
  - "push"
  - "feature"
  - "rama"
  - "git workflow"
---

**Guardrails**
- Solo ejecutar comandos git si hay cambios para commitear
- No forzar push si hay conflictos potenciales
- Usar mensajes de commit descriptivos y estándar
- Verificar estado de git antes de cada operación
- No hacer commit si el working directory está limpio
- **SIEMPRE pedir aprobación del usuario antes de crear commits**
- Si el usuario rechaza el mensaje, ofrecer opción de modificar o cancelar
- Manejar errores de git de forma descriptiva y no continuar si hay errores críticos
- **Por defecto, crear commits atómicos y detallados** (un commit por grupo lógico de cambios)
- Si el usuario solicita commits atómicos explícitamente, dividir cambios en múltiples commits

**Steps**

1. **Verificar estado inicial de Git:**
   - Ejecutar `git status --short` para ver cambios sin commitear de forma compacta
   - Ejecutar `git branch --show-current` para obtener rama actual
   - Ejecutar `git log --oneline -1` para ver último commit local
   - Ejecutar `git status -sb` para ver relación con remoto (ahead/behind)
   - Si no hay cambios en working directory ni staged, informar al usuario y terminar

2. **Determinar si es feature nueva o existente:**
   - Obtener rama actual con `git branch --show-current`
   - Verificar si la rama existe en remoto: `git ls-remote --heads origin [rama-actual]`
   - **FEATURE NUEVA si:**
     - La rama actual es `main`, `master`, `develop`, `dev` o `staging`
     - La rama actual no existe en remoto Y no empieza con `feature/`
     - La rama actual no empieza con `feature/`, `fix/`, `hotfix/`, `refactor/`
   - **FEATURE EXISTENTE si:**
     - La rama actual empieza con `feature/`, `fix/`, `hotfix/`, `refactor/`
     - La rama existe en remoto (aunque no tenga commits locales sin push)

3. **Si es FEATURE NUEVA:**
   - Analizar archivos modificados con `git diff --name-only` y `git diff --stat`
   - Generar nombre de feature automáticamente basado en:
     - Nombres de archivos modificados (extraer palabras clave)
     - Directorios modificados (ej: `modules/users` → `user-management`)
     - Si no se puede inferir, usar formato: `feature-[timestamp]` o preguntar al usuario
   - Crear nueva rama: `git checkout -b feature/[nombre-feature]` (usar kebab-case, sin espacios)
   - **ANALIZAR CAMBIOS PARA COMMITS ATÓMICOS:**
     - Agrupar archivos por tipo de cambio lógico (usar paso 5)
     - Si hay múltiples grupos lógicos, crear commits atómicos separados
     - Si hay un solo grupo lógico, crear un commit único
   - Para cada grupo de cambios:
     - Añadir archivos del grupo: `git add [archivos-del-grupo]`
     - Generar mensaje de commit estándar analizando los cambios (usar paso 5.1)
     - **PEDIR APROBACIÓN DEL MENSAJE:**
       - Mostrar el mensaje propuesto de forma clara: "📝 Mensaje de commit propuesto: `[mensaje-estándar]`"
       - Mostrar lista de archivos incluidos en este commit
       - Preguntar: "¿Apruebas este mensaje? (sí/no/modificar)"
       - Si el usuario aprueba (sí/s/y/ok): continuar con el commit
       - Si el usuario quiere modificar: pedir el nuevo mensaje y usarlo
       - Si el usuario rechaza (no/n/cancelar): cancelar la operación y terminar
     - Crear commit: `git commit -m "[mensaje-aprobado]"`
   - Verificar si hay remoto configurado: `git remote -v`
   - Si hay remoto, hacer push de la nueva rama: `git push -u origin feature/[nombre-feature]`
   - Si no hay remoto, informar que los commits están listos pero falta configurar remoto
   - Informar al usuario: "✅ Feature branch creada: feature/[nombre-feature] | Commits: [número] | Push exitoso" (o solo commits si no hay remoto)

4. **Si es FEATURE EXISTENTE:**
   - Obtener nombre de la rama actual
   - **ANALIZAR CAMBIOS PARA COMMITS ATÓMICOS:**
     - Agrupar archivos por tipo de cambio lógico (usar paso 5)
     - Si hay múltiples grupos lógicos, crear commits atómicos separados
     - Si hay un solo grupo lógico, crear un commit único
   - Para cada grupo de cambios:
     - Añadir archivos del grupo: `git add [archivos-del-grupo]`
     - Generar mensaje de commit estándar analizando los cambios (usar paso 5.1)
     - **PEDIR APROBACIÓN DEL MENSAJE:**
       - Mostrar el mensaje propuesto de forma clara: "📝 Mensaje de commit propuesto: `[mensaje-estándar]`"
       - Mostrar lista de archivos incluidos en este commit
       - Preguntar: "¿Apruebas este mensaje? (sí/no/modificar)"
       - Si el usuario aprueba (sí/s/y/ok): continuar con el commit
       - Si el usuario quiere modificar: pedir el nuevo mensaje y usarlo
       - Si el usuario rechaza (no/n/cancelar): cancelar la operación y terminar
     - Crear commit: `git commit -m "[mensaje-aprobado]"`
   - Verificar si hay commits locales sin push: `git status -sb` (buscar "ahead")
   - Verificar si hay remoto configurado: `git remote -v`
   - Si hay remoto, hacer push: `git push` (sin -u ya que la rama ya existe)
   - Si no hay remoto, informar que los commits están listos pero falta configurar remoto
   - Informar al usuario: "✅ Commits realizados en [rama-actual]: [número] commits | Push exitoso" (o solo commits si no hay remoto)

5. **Agrupación de cambios para commits atómicos:**
   - Analizar archivos modificados con `git diff --name-only` y `git diff --stat`
   - Agrupar archivos por tipo lógico de cambio:
     - **Grupo 1 - Dependencias:** `package.json`, `package-lock.json`, archivos de configuración de dependencias
     - **Grupo 2 - Configuración/Estilos:** `tailwind.config.ts`, `*.css`, `index.html`, archivos de configuración de build
     - **Grupo 3 - Servicios/API:** Archivos en `services/`, `api/`, `utils/` relacionados con lógica de negocio
     - **Grupo 4 - Componentes:** Archivos en `components/`, actualizaciones de componentes existentes
     - **Grupo 5 - Páginas/Vistas:** Archivos en `pages/`, `views/`, nuevas páginas o vistas
     - **Grupo 6 - Routing/Navegación:** Archivos en `routes/`, `router/`, `App.tsx` (configuración de routing)
     - **Grupo 7 - Documentación:** Archivos en `docs/`, `openspec/`, `README.md`, archivos `.md`
     - **Grupo 8 - Tests:** Archivos en `test/`, `__tests__/`, `*.test.ts`, `*.spec.ts`
     - **Grupo 9 - Otros:** Archivos que no encajan en los grupos anteriores
   - Si un archivo puede pertenecer a múltiples grupos, priorizar por:
     1. Si es nuevo archivo → grupo más específico
     2. Si es modificación → grupo de funcionalidad principal
   - Crear un commit por cada grupo que tenga archivos

5.1. **Generación de mensajes de commit estándar:**
   - Para cada grupo de archivos, analizar el tipo de cambio:
   - Determinar tipo de commit:
     - `feat`: Nuevos archivos en `modules/`, `components/`, `pages/`, nuevos endpoints, nuevas funcionalidades
     - `fix`: Correcciones de bugs, errores, validaciones
     - `refactor`: Reestructuración sin cambio de funcionalidad, mejoras de código
     - `docs`: Cambios en documentación, README, comentarios, OpenSpec
     - `style`: Formato, linting, espacios, cambios visuales sin lógica (CSS, Tailwind config)
     - `test`: Añadir o modificar tests
     - `chore`: Build, dependencias, configuraciones de herramientas
   - Determinar scope basado en:
     - Directorio principal modificado (ej: `modules/users` → `users`)
     - Componente principal (ej: `components/Button.tsx` → `button`)
     - Área funcional (ej: `pages/RegisterPage.tsx` → `auth`)
   - Generar descripción breve (máximo 50 caracteres) basada en:
     - Archivos nuevos creados
     - Funcionalidad principal modificada
     - Cambios más significativos del grupo
   - Agregar cuerpo del commit con detalles (opcional pero recomendado):
     - Listar archivos principales modificados
     - Describir cambios clave en bullet points
     - Formato: `- Descripción del cambio`
   - Formato final: 
     ```
     tipo(scope): descripción breve
     
     - Detalle 1 del cambio
     - Detalle 2 del cambio
     - Detalle 3 del cambio
     ```
   - Ejemplos:
     - `chore(frontend): add dependencies for form validation and state management`
     - `style(frontend): configure Tailwind with design system colors and fonts`
     - `feat(auth): add user registration page with form validation`
     - `refactor(components): update Input and Button to match design system`
     - `docs(openspec): update tasks checklist for registration feature`

6. **Manejo de errores:**
   - Si `git checkout -b` falla (rama ya existe), informar y sugerir usar rama existente
   - Si `git push` falla por conflictos, informar y NO forzar push
   - Si `git push` falla por falta de upstream, usar `git push -u origin [rama]`
   - Si hay errores de permisos o remoto, informar claramente al usuario
   - Si el working directory tiene conflictos de merge, informar y NO continuar

**Referencias**
- Usar `git diff --name-only` para ver archivos modificados
- Usar `git diff --stat` para ver resumen de cambios
- Usar `git status -sb` para ver relación con remoto
- Verificar remoto con `git remote -v` antes de push
- Usar `git log --oneline -5` para ver contexto de commits recientes

