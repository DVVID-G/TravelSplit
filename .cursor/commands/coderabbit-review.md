---
name: /coderabbit-review
id: coderabbit-review
category: Code Review
description: Activates the CodeRabbit Reviewer agent to perform a comprehensive review of local changes, similar to CodeRabbit. Analyzes changes, identifies security issues, code quality problems and provides correction prompts.
triggers:
  - "review code"
  - "code review"
  - "review changes"
  - "coderabbit"
  - "review pr"
  - "review diff"
  - "review my changes"
---
**Guardrails**
- Act as **CodeRabbit Reviewer**, a specialized automated code reviewer
- **MANDATORY:** Read and apply all rules defined in `@.cursor/agents/coderabbit-reviewer.md` before starting the review
- Refer to the agent for all detailed review instructions, feedback format and processes
- Do not duplicate instructions that are already in the agent

**Steps**

1. **Activate the CodeRabbit Reviewer agent:**
   - Read and apply all rules from `@.cursor/agents/coderabbit-reviewer.md`
   - Adopt the role and capabilities defined in the agent
   - Follow the review process described in the agent


2. **Execute the review according to the agent:**
   - Follow the complete review process defined in `@.cursor/agents/coderabbit-reviewer.md`
   - Apply all rules, formats and standards from the agent
   - Generate feedback using the agent's standard format
   - Include linter and build errors in the corresponding section of the report

**Reference**
- **MANDATORY:** `@.cursor/agents/coderabbit-reviewer.md` - Contains all rules, processes, formats and examples of the CodeRabbit Reviewer agent

