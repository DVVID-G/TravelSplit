# C4 Code Diagram (Level 4 - Optional)

## Purpose

Shows classes, functions, and detailed relationships. Only generate when explicitly requested by the user.

## When to Generate

- User explicitly requests code-level diagram
- Detailed class structure documentation needed
- Module internals need to be documented

## Prerequisites

**Required Input from Discovery:**

```yaml
# From c4-discovery.md Phase 3 and 5
architecture:
  backend:
    pattern: "{architecture_pattern}"
    
stack:
  backend:
    language: "{language}"
    framework: "{framework}"
    orm: "{orm}"

components:
  backend:
    - module: "{module_name}"
      components:
        - name: "{ComponentName}"
          type: "{component_type}"
          file: "{file_path}"
```

---

## Generation Process

### Step 1: Read Module Files

Based on discovered architecture pattern, read relevant files:

| Pattern | Files to Read |
|---------|---------------|
| **CSED** | `controllers/{module}.controller.ts`, `services/{module}.service.ts`, `entities/{module}.entity.ts`, `dto/*.dto.ts` |
| **Layered** | `controller/{Module}Controller.java`, `service/{Module}Service.java`, `repository/{Module}Repository.java` |
| **DDD** | `application/{module}_service.py`, `domain/{module}.py`, `infrastructure/{module}_repository.py` |
| **MVC** | `views.py`, `models.py`, `serializers.py` |

### Step 2: Extract Class Information

For each class file, extract:

| Element | What to Extract |
|---------|-----------------|
| Class name | From class declaration |
| Stereotype | Based on component type from discovery |
| Properties | Private/public fields |
| Methods | Public method signatures |
| Dependencies | Constructor injections, imports |

### Step 3: Determine Stereotypes

Based on discovered stack:

| Component Type | Language | Stereotype |
|----------------|----------|------------|
| Controller | TypeScript | `<<Controller>>` |
| Controller | Java | `<<RestController>>` |
| Controller | Python | `<<APIRouter>>` |
| Service | Any | `<<Service>>` |
| Entity | TypeORM | `<<Entity>>` |
| Entity | Hibernate | `<<JpaEntity>>` |
| Entity | SQLAlchemy | `<<Model>>` |
| Repository | Any | `<<Repository>>` |
| DTO | Any | `<<DTO>>` |
| Guard | NestJS | `<<Guard>>` |
| Middleware | Express | `<<Middleware>>` |

---

## Elements Reference

### Class Definition

```plantuml
class ClassName <<Stereotype>> {
  - privateProperty: Type
  + publicMethod(): ReturnType
}
```

### Relationships

```plantuml
ClassA --> ClassB : uses
ClassA --|> BaseClass : extends
ClassA ..> Interface : implements
```

---

## Important Rules

1. **NO generic types in properties:** Use `Repository` (NOT `Repository<User>`)
2. **NO generic types in relationships:** Use `Service --> Repository` (NOT `Service --> Repository<User>`)
3. **Generic types in return types OK:** `Promise<User[]>` in method signatures is acceptable
4. **Define base classes separately:** If needed, define `Repository` as separate class

### Correct Pattern

```plantuml
class {Module}Service <<Service>> {
  - {module}Repository: Repository  ' NO generic type
  + findAll(): Promise<{Module}[]>  ' Generic in return type OK
}

UsersService --> Repository : uses  ' NO generic type in relationship
```

### Incorrect Pattern (DO NOT USE)

```plantuml
' WRONG - causes syntax errors
UsersService --> Repository<User> : uses
- userRepository: Repository<User>
```

---

## Stack-Specific Templates

### TypeScript/NestJS

```plantuml
skinparam class {
  BackgroundColor<<Controller>> #E1F5FE
  BackgroundColor<<Service>> #F3E5F5
  BackgroundColor<<Entity>> #E8F5E9
  BackgroundColor<<DTO>> #FFF3E0
}

package "{Module} Module" {
  class {Module}Controller <<Controller>> {
    - {module}Service: {Module}Service
    + findAll(): Promise<{Module}ResponseDto[]>
    + findOne(id: string): Promise<{Module}ResponseDto>
    + create(dto: Create{Module}Dto): Promise<{Module}ResponseDto>
  }

  class {Module}Service <<Service>> {
    - {module}Repository: Repository
    + findAll(): Promise<{Module}[]>
    + findOne(id: string): Promise<{Module}>
    + create(dto: Create{Module}Dto): Promise<{Module}>
  }

  class {Module} <<Entity>> {
    + id: string
    + createdAt: Date
    + updatedAt: Date
  }
}
```

### Python/FastAPI

```plantuml
skinparam class {
  BackgroundColor<<APIRouter>> #E1F5FE
  BackgroundColor<<Service>> #F3E5F5
  BackgroundColor<<Model>> #E8F5E9
  BackgroundColor<<Schema>> #FFF3E0
}

package "{module} module" {
  class {module}_router <<APIRouter>> {
    + get_{module}s(): List[{Module}Response]
    + get_{module}(id: int): {Module}Response
    + create_{module}(data: {Module}Create): {Module}Response
  }

  class {Module}Service <<Service>> {
    - db: Session
    + get_all(): List[{Module}]
    + get_by_id(id: int): {Module}
    + create(data: {Module}Create): {Module}
  }

  class {Module} <<Model>> {
    + id: int
    + created_at: datetime
    + updated_at: datetime
  }
}
```

### Java/Spring Boot

```plantuml
skinparam class {
  BackgroundColor<<RestController>> #E1F5FE
  BackgroundColor<<Service>> #F3E5F5
  BackgroundColor<<JpaEntity>> #E8F5E9
  BackgroundColor<<Repository>> #FCE4EC
}

package "{module} module" {
  class {Module}Controller <<RestController>> {
    - {module}Service: {Module}Service
    + findAll(): ResponseEntity<List<{Module}Dto>>
    + findById(id: Long): ResponseEntity<{Module}Dto>
    + create(dto: Create{Module}Dto): ResponseEntity<{Module}Dto>
  }

  class {Module}Service <<Service>> {
    - {module}Repository: {Module}Repository
    + findAll(): List<{Module}>
    + findById(id: Long): Optional<{Module}>
    + save(entity: {Module}): {Module}
  }

  class {Module} <<JpaEntity>> {
    - id: Long
    - createdAt: LocalDateTime
    - updatedAt: LocalDateTime
  }

  interface {Module}Repository <<Repository>> {
    + findAll(): List<{Module}>
    + findById(id: Long): Optional<{Module}>
    + save(entity: {Module}): {Module}
  }
}
```

---

## PlantUML Template

```plantuml
@startuml 04-code-{module}
' Generated by C4 Diagram Generator on {YYYY-MM-DD}
' Agent: C4 Diagram Generator
' System: {system_name} v{version}
' Stack: {stack.backend.language}, {stack.backend.framework}

title {system_name} - Code Diagram ({Module} Module)

' Color scheme based on discovered stack
skinparam class {
  BackgroundColor<<Controller>> #E1F5FE
  BackgroundColor<<Service>> #F3E5F5
  BackgroundColor<<Entity>> #E8F5E9
  BackgroundColor<<DTO>> #FFF3E0
  BackgroundColor<<Repository>> #FCE4EC
}

' USE STACK-SPECIFIC TEMPLATE BASED ON discovery.stack.backend

package "{Module} Module" {
  ' GENERATE CLASSES FROM DISCOVERED COMPONENTS
  ' READ ACTUAL FILE TO EXTRACT METHODS AND PROPERTIES
  
  class {Module}Controller <<{stereotype}>> {
    ' Properties from constructor/injection
    ' Methods from class definition
  }

  class {Module}Service <<Service>> {
    ' Properties
    ' Methods
  }

  class {Module} <<{entity_stereotype}>> {
    ' Entity properties
  }
}

' Relationships
{Module}Controller --> {Module}Service : uses
{Module}Service --> {Module} : manages

@enduml
```

---

## Output File

`docs/diagrams/c4/04-code-{module}.puml`

Where `{module}` is from `components.backend[].module`.

---

## Validation

Delegate to `@c4-validation.md`:

- [ ] Stereotypes match discovered stack
- [ ] No generic types in properties or relationships
- [ ] All methods extracted from actual code
- [ ] Color scheme consistent with stack
- [ ] Relationships reflect actual dependencies
