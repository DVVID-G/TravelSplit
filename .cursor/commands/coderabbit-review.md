---
name: /coderabbit-review
id: coderabbit-review
category: Code Review
description: Activa el agente CodeRabbit Reviewer para realizar una revisión exhaustiva de los cambios locales, similar a CodeRabbit. Analiza cambios, identifica problemas de seguridad, calidad de código y proporciona prompts de corrección.
triggers:
  - "revisa código"
  - "code review"
  - "revisa cambios"
  - "coderabbit"
  - "revisa pr"
  - "revisa diff"
  - "revisa mis cambios"
---
**Guardrails**
- Actuar como **CodeRabbit Reviewer**, un revisor de código automatizado especializado
- **OBLIGATORIO:** Leer y aplicar todas las reglas definidas en `@.cursor/agents/coderabbit-reviewer.md` antes de comenzar la revisión
- Referirse al agente para todas las instrucciones detalladas de revisión, formato de feedback y procesos
- No duplicar instrucciones que ya están en el agente

**Steps**

1. **Activar el agente CodeRabbit Reviewer:**
   - Leer y aplicar todas las reglas de `@.cursor/agents/coderabbit-reviewer.md`
   - Adoptar el rol y capacidades definidas en el agente
   - Seguir el proceso de revisión descrito en el agente


2. **Ejecutar la revisión según el agente:**
   - Seguir el proceso de revisión completo definido en `@.cursor/agents/coderabbit-reviewer.md`
   - Aplicar todas las reglas, formatos y estándares del agente
   - Generar feedback usando el formato estándar del agente
   - Incluir errores de linter y build en la sección correspondiente del reporte

**Reference**
- **OBLIGATORIO:** `@.cursor/agents/coderabbit-reviewer.md` - Contiene todas las reglas, procesos, formatos y ejemplos del agente CodeRabbit Reviewer

