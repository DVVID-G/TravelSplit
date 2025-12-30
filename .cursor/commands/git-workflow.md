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
- **SIEMPRE pedir aprobación del usuario antes de crear el commit**
- Si el usuario rechaza el mensaje, ofrecer opción de modificar o cancelar
- Manejar errores de git de forma descriptiva y no continuar si hay errores críticos

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
   - Añadir todos los cambios: `git add .`
   - Generar mensaje de commit estándar analizando los cambios (usar paso 5)
   - **PEDIR APROBACIÓN DEL MENSAJE:**
     - Mostrar el mensaje propuesto de forma clara: "📝 Mensaje de commit propuesto: `[mensaje-estándar]`"
     - Preguntar: "¿Apruebas este mensaje? (sí/no/modificar)"
     - Si el usuario aprueba (sí/s/y/ok): continuar con el commit
     - Si el usuario quiere modificar: pedir el nuevo mensaje y usarlo
     - Si el usuario rechaza (no/n/cancelar): cancelar la operación y terminar
   - Crear commit: `git commit -m "[mensaje-aprobado]"`
   - Verificar si hay remoto configurado: `git remote -v`
   - Si hay remoto, hacer push de la nueva rama: `git push -u origin feature/[nombre-feature]`
   - Si no hay remoto, informar que el commit está listo pero falta configurar remoto
   - Informar al usuario: "✅ Feature branch creada: feature/[nombre-feature] | Commit: [hash] | Push exitoso" (o solo commit si no hay remoto)

4. **Si es FEATURE EXISTENTE:**
   - Obtener nombre de la rama actual
   - Añadir todos los cambios: `git add .`
   - Generar mensaje de commit estándar analizando los cambios (usar paso 5)
   - **PEDIR APROBACIÓN DEL MENSAJE:**
     - Mostrar el mensaje propuesto de forma clara: "📝 Mensaje de commit propuesto: `[mensaje-estándar]`"
     - Preguntar: "¿Apruebas este mensaje? (sí/no/modificar)"
     - Si el usuario aprueba (sí/s/y/ok): continuar con el commit
     - Si el usuario quiere modificar: pedir el nuevo mensaje y usarlo
     - Si el usuario rechaza (no/n/cancelar): cancelar la operación y terminar
   - Crear commit: `git commit -m "[mensaje-aprobado]"`
   - Verificar si hay commits locales sin push: `git status -sb` (buscar "ahead")
   - Verificar si hay remoto configurado: `git remote -v`
   - Si hay remoto, hacer push: `git push` (sin -u ya que la rama ya existe)
   - Si no hay remoto, informar que el commit está listo pero falta configurar remoto
   - Informar al usuario: "✅ Commit realizado en [rama-actual] | Push exitoso" (o solo commit si no hay remoto)

5. **Generación de mensajes de commit estándar:**
   - Analizar archivos modificados con `git diff --name-only` y `git diff --stat`
   - Determinar tipo de commit:
     - `feat`: Nuevos archivos en `modules/`, `components/`, nuevos endpoints
     - `fix`: Correcciones de bugs, errores
     - `refactor`: Reestructuración sin cambio de funcionalidad
     - `docs`: Cambios en documentación, README, comentarios
     - `style`: Formato, linting, espacios (sin cambio de código)
     - `test`: Añadir o modificar tests
     - `chore`: Build, dependencias, configuraciones
   - Determinar scope basado en:
     - Directorio principal modificado (ej: `modules/users` → `users`)
     - Componente principal (ej: `components/Button.tsx` → `button`)
   - Generar descripción breve (máximo 50 caracteres) basada en:
     - Archivos nuevos creados
     - Funcionalidad principal modificada
     - Cambios más significativos
   - Formato final: `tipo(scope): descripción breve`
   - Ejemplos:
     - `feat(auth): add user registration endpoint`
     - `fix(users): correct email validation`
     - `refactor(components): simplify Button component`

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

