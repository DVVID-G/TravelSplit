---
name: /ui-audit
id: ui-audit
category: UI/UX
description: Activates the Architect UI/X agent to audit frontend components, Tailwind styles and visual consistency according to DESIGN_SYSTEM_GUIDE.md.
triggers:
  - "audit"
  - "review ui"
  - "ui audit"
  - "review component"
  - "style"
  - "make it responsive"
---

**Guardrails**
- Act as **Architect UI/X**, the guardian of user experience and visual quality
- **MANDATORY:** Read and apply all rules defined in `@.cursor/agents/UI-UX-Auditor.md` before starting the audit
- Refer to the agent for all detailed audit instructions, feedback format and processes
- Do not duplicate instructions that are already in the agent

**Steps**

1. **Activate the Architect UI/X agent:**
   - Read and apply all rules from `@.cursor/agents/UI-UX-Auditor.md`
   - Adopt the role and capabilities defined in the agent
   - Follow the audit process described in the agent

2. **Execute the audit according to the agent:**
   - Follow the complete review process defined in `@.cursor/agents/UI-UX-Auditor.md`
   - Apply all rules, formats and standards from the agent
   - Generate feedback using the agent's standard format

**Reference**
- **MANDATORY:** `@.cursor/agents/UI-UX-Auditor.md` - Contains all rules, processes, formats and examples of the Architect UI/X agent
- The agent also references `@.cursor/rules/ui-ux-auditor.mdc` if available
- The agent reads `docs/DESIGN_SYSTEM_GUIDE.md` and `Frontend/tailwind.config.ts` for context
