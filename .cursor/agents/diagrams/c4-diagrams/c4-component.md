# C4 Component Diagram (Level 3)

## Purpose

Shows components within each container and their relationships. Component structure is determined by the discovered architecture pattern.

## Prerequisites

**Required Input from Discovery:**

```yaml
# From c4-discovery.md Phase 3, 5, and 6
architecture:
  backend:
    pattern: "{CSED | Layered | DDD | Hexagonal | MVC}"
    layers:
      - "{layer_1}"
      - "{layer_2}"
  frontend:
    pattern: "{Atomic | Feature-based | MVC}"

components:
  backend:
    - module: "{module_name}"
      components:
        - name: "{component_name}"
          type: "{controller | service | entity | repository}"
  frontend:
    - name: "{component_name}"
      type: "{page | atom | molecule | organism | hook}"

stack:
  backend:
    framework: "{framework}"
    orm: "{orm}"
    database: "{database}"
```

---

## Generation Process

### Step 1: Identify Architecture Pattern

From `architecture.backend.pattern`, determine component structure:

| Pattern | Component Types | Naming Convention |
|---------|-----------------|-------------------|
| **CSED** | Controller, Service, Entity, DTO | `{Module}Controller`, `{Module}Service` |
| **Layered** | Controller, Service, Repository | `{Module}Controller`, `{Module}Service`, `{Module}Repository` |
| **DDD** | Controller, Application Service, Domain Service, Repository | `{Module}AppService`, `{Module}DomainService` |
| **Hexagonal** | Adapter, Port, UseCase, Repository | `{Module}Adapter`, `{Module}UseCase` |
| **MVC** | Controller, Model, View | `{Module}Controller`, `{Module}Model` |

### Step 2: Map Components from Discovery

For each module in `components.backend`:

```plantuml
' Module: {module_name}
Component({module}_{type}, "{ComponentName}", "{framework} {type}", "{description}")
```

### Step 3: Determine Technology Labels

Based on discovered stack:

| Discovery Field | Technology Label |
|-----------------|------------------|
| `stack.backend.framework` = "NestJS" | "NestJS Controller", "NestJS Service" |
| `stack.backend.framework` = "Express" | "Express Router", "Service" |
| `stack.backend.framework` = "FastAPI" | "FastAPI Router", "Service" |
| `stack.backend.framework` = "Spring Boot" | "Spring Controller", "Spring Service" |
| `stack.backend.framework` = "Django" | "Django View", "Django Model" |
| `stack.backend.orm` = "TypeORM" | "TypeORM Entity" |
| `stack.backend.orm` = "Prisma" | "Prisma Model" |
| `stack.backend.orm` = "SQLAlchemy" | "SQLAlchemy Model" |
| `stack.backend.orm` = "Hibernate" | "JPA Entity" |

---

## Pattern-Specific Templates

### CSED Pattern (NestJS, similar frameworks)

```plantuml
' {Module} Module
Component({module}_controller, "{Module}Controller", "{framework} Controller", "Handles HTTP requests")
Component({module}_service, "{Module}Service", "{framework} Service", "Business logic")
ComponentDb({module}_entity, "{Module} Entity", "{orm} Entity", "Data model")

Rel({module}_controller, {module}_service, "Uses")
Rel({module}_service, {module}_entity, "Persists", "{orm}")
```

### Layered Pattern (Spring Boot, Django)

```plantuml
' {Module} Layer
Component({module}_controller, "{Module}Controller", "{framework} Controller", "HTTP layer")
Component({module}_service, "{Module}Service", "{framework} Service", "Business logic")
Component({module}_repository, "{Module}Repository", "{orm} Repository", "Data access")

Rel({module}_controller, {module}_service, "Uses")
Rel({module}_service, {module}_repository, "Uses")
```

### DDD Pattern

```plantuml
' {Module} Domain
Component({module}_controller, "{Module}Controller", "API Controller", "HTTP adapter")
Component({module}_app_service, "{Module}AppService", "Application Service", "Use cases")
Component({module}_domain_service, "{Module}DomainService", "Domain Service", "Domain logic")
Component({module}_repository, "{Module}Repository", "Repository", "Data access")

Rel({module}_controller, {module}_app_service, "Uses")
Rel({module}_app_service, {module}_domain_service, "Uses")
Rel({module}_app_service, {module}_repository, "Uses")
```

### Hexagonal Pattern

```plantuml
' {Module} Hexagon
Component({module}_adapter, "{Module}Adapter", "Input Adapter", "HTTP/CLI adapter")
Component({module}_usecase, "{Module}UseCase", "Use Case", "Application logic")
Component({module}_port, "{Module}Port", "Output Port", "Interface")
Component({module}_repository, "{Module}Repository", "Output Adapter", "Data access")

Rel({module}_adapter, {module}_usecase, "Calls")
Rel({module}_usecase, {module}_port, "Uses")
Rel({module}_repository, {module}_port, "Implements")
```

---

## Important Rules

1. **DO NOT use `Container_Boundary`** - Only for Container Diagrams, causes syntax errors
2. **DO NOT nest `Component_Boundary`** - Use components directly
3. **Use comments for grouping** - `' {Module} Module` for logical organization
4. **`ContainerDb` only for externals** - Databases, external services
5. **Diagram name in kebab-case** - `03-components-backend` (NO uppercase)

---

## PlantUML Template

```plantuml
@startuml 03-components-{container}
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_WITH_LEGEND()

' Generated by C4 Diagram Generator on {YYYY-MM-DD}
' Agent: C4 Diagram Generator
' System: {system_name} v{version}
' Architecture Pattern: {architecture.backend.pattern}

title {system_name} {container} - Component Diagram

' GENERATE COMPONENTS FOR EACH MODULE IN discovery.components.backend
' USE PATTERN-SPECIFIC TEMPLATE BASED ON architecture.backend.pattern

' {Module 1} Module
Component({mod1}_controller, "{Mod1}Controller", "{framework} Controller", "Handles {mod1} requests")
Component({mod1}_service, "{Mod1}Service", "{framework} Service", "{Mod1} business logic")
ComponentDb({mod1}_entity, "{Mod1} Entity", "{orm} Entity", "{Mod1} data model")

' {Module 2} Module
Component({mod2}_controller, "{Mod2}Controller", "{framework} Controller", "Handles {mod2} requests")
Component({mod2}_service, "{Mod2}Service", "{framework} Service", "{Mod2} business logic")
ComponentDb({mod2}_entity, "{Mod2} Entity", "{orm} Entity", "{Mod2} data model")

' Common Components (if discovered)
Component(guard, "AuthGuard", "{framework} Guard", "Authentication guard")
Component(mapper, "Mapper", "Mapper", "Entity-DTO mapping")

' External Container (database from discovery)
ContainerDb(database, "{db_name}", "{stack.backend.database}", "Stores all entities")

' Relationships (based on architecture pattern)
Rel({mod1}_controller, {mod1}_service, "Uses")
Rel({mod1}_service, {mod1}_entity, "Persists", "{orm}")
Rel({mod1}_entity, database, "Stored in")

Rel({mod2}_controller, {mod2}_service, "Uses")
Rel({mod2}_service, {mod2}_entity, "Persists", "{orm}")
Rel({mod2}_entity, database, "Stored in")

@enduml
```

---

## Output File

`docs/diagrams/c4/03-components-{container}.puml`

Where `{container}` is derived from discovery (e.g., `backend`, `frontend`, `api`, `web`).

---

## Validation

Delegate to `@c4-validation.md`:

- [ ] Architecture pattern from discovery applied
- [ ] All discovered modules have components
- [ ] Technology labels match discovered stack
- [ ] NO `Container_Boundary` used
- [ ] Comments for logical grouping by module
- [ ] @startuml in kebab-case lowercase
