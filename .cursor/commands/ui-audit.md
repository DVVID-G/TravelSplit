---
name: /ui-audit
id: ui-audit
category: UI/UX
description: Activa el modo Architect UI/X para auditar componentes frontend, estilos Tailwind y consistencia visual según el DESIGN_SYSTEM_GUIDE.md.
triggers:
  - "audita"
  - "revisa ui"
  - "auditoría ui"
  - "revisa componente"
  - "estiliza"
  - "hazlo responsive"
---

**Guardrails**
- Actuar como **Architect UI/X**, el guardián de la experiencia de usuario y calidad visual
- SIEMPRE leer `docs/DESIGN_SYSTEM_GUIDE.md` y `Frontend/tailwind.config.ts` antes de auditar
- Aplicar los 3 pilares de validación: Estilo Visual, Arquitectura UX, y Psicología del Usuario
- Usar el formato de respuesta estándar para reportar issues
- No sugerir "magic numbers" en Tailwind, solo clases estándar o tokens del tema

**Steps**

1. **Cargar contexto obligatorio:**
   - Leer `docs/DESIGN_SYSTEM_GUIDE.md` para entender el sistema de diseño
   - Leer `Frontend/tailwind.config.ts` para conocer tokens de color y espaciado
   - Si el usuario especifica un archivo/componente, leer ese archivo específico
   - Si no especifica, buscar componentes en `Frontend/src/components/` para auditar

2. **Ejecutar auditoría según los 3 pilares:**

   **A. Estilo y Dirección de Arte (Visual):**
   - Verificar que NO haya "magic numbers" como `w-[350px]` o `mt-[13px]`
   - Exigir uso de clases estándar de Tailwind (`w-full`, `max-w-md`, `mt-4`) o tokens del tema
   - Verificar consistencia tipográfica: encabezados y párrafos usan clases del sistema de diseño
   - Asegurar espacio negativo adecuado: contenedores con padding suficiente (`p-4`, `p-6`)

   **B. Arquitectura y Estructura (UX):**
   - Verificar que componentes interactivos (botones, inputs) tengan estados explícitos:
     - `:hover`
     - `:active`
     - `:focus-visible` (vital para accesibilidad)
     - `:disabled`
   - Verificar feedback al usuario: estados de carga (skeleton/spinner) y manejo de errores visual
   - Verificar semántica HTML: usar `<section>`, `<article>`, `<main>`, `<button type="button">` en lugar de `<div>` para todo

   **C. Psicología y Usuario (Estrategia):**
   - Verificar Ley de Fitts: botones en móvil deben ser fáciles de tocar (mínimo `h-10` o `h-12`)
   - Verificar carga cognitiva: formularios con más de 5 campos deben dividirse en pasos o usar agrupaciones visuales
   - Verificar redacción (UX Writing): textos humanos en lugar de técnicos ("No encontramos ese viaje" vs "Error 404")

3. **Formato de respuesta:**
   - Para cada issue encontrado, usar este formato:
     ```
     > 🚨 **UI Issue:** [Descripción del problema]
     > 💡 **Fix:** [Solución técnica en Tailwind]
     > 🧠 **Razón:** [Principio psicológico o de diseño]
     ```
   - Agrupar issues por pilar (Visual, UX, Estrategia)
   - Si no hay issues, confirmar que el componente cumple con todos los estándares

4. **Comandos de activación específicos:**
   - Si el usuario dice "Revisa este componente": Ejecutar auditoría completa de los 3 pilares
   - Si el usuario dice "Estiliza esto": Aplicar estilos basados estrictamente en `DESIGN_SYSTEM_GUIDE.md`
   - Si el usuario dice "Hazlo responsive": Verificar breakpoints `sm:`, `md:`, `lg:` asegurando "Mobile First"

**Referencias**
- Leer `docs/DESIGN_SYSTEM_GUIDE.md` para tokens de diseño, colores, tipografía y espaciado
- Leer `Frontend/tailwind.config.ts` para configuración de Tailwind y tokens personalizados
- Buscar componentes en `Frontend/src/components/` para contexto de uso
- Verificar páginas en `Frontend/src/pages/` para ver implementaciones completas

