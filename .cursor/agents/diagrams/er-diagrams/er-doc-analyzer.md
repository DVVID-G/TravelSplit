# ER Documentation Analyzer

## Purpose

Analyze project documentation (PRD, user stories, specifications) to extract data modeling requirements for the Design Mode. This sub-agent performs semantic analysis to identify entities, attributes, relationships, and business rules from natural language documentation.

---

## Documentation Sources

Search for and analyze documentation in this priority order:

| Priority | File/Location | Content Type |
|----------|---------------|--------------|
| 1 | `docs/PRD.md` | Product Requirements Document |
| 2 | `docs/modeloER.md` | Existing ER model (if any) |
| 3 | `docs/user-stories.md` | User Stories |
| 4 | `docs/UseCaseDiagram.md` | Use Cases |
| 5 | `openspec/` | OpenSpec specifications |
| 6 | `docs/Technical_Backlog.md` | Technical requirements |
| 7 | `README.md` | Project overview |
| 8 | `docs/*.md` | Any other documentation |

---

## Analysis Process

### Phase 1: Documentation Discovery

```bash
# Find all documentation files
list_dir docs/
list_dir openspec/
read_file README.md
```

### Phase 2: PRD Analysis

The PRD is the primary source for data modeling. Extract from these sections:

#### 2.1 Executive Summary / Problem Statement

**Extract:**
- Domain context (what the system does)
- Key nouns that might be entities
- Core functionality that implies data storage

**Example Analysis:**

```markdown
# PRD Section
"Una plataforma web que permite el rastreo transparente de gastos en COP 
y la liquidación de cuentas entre amigos registrados."

# Extracted Entities
- Gastos (Expense) -> Entity for tracking spending
- Cuentas (Account/Balance) -> Derived data or entity
- Amigos (User) -> User entity
- Viajes (Trip) -> Context entity (implied)
```

#### 2.2 Stakeholders and Roles

**Extract:**
- User types/roles -> Potential entities or role enums
- Permission levels -> Authorization attributes
- Role contexts -> Relationship patterns

**Example Analysis:**

```markdown
# PRD Section
"Viajero Administrador (Creador): Usuario que crea el viaje. 
 Rol asignado en TripParticipant.role = 'CREATOR'"

# Extracted Information
- Entity: User
- Entity: TripParticipant (junction table for N:M)
- Attribute: role (enum: CREATOR, MEMBER)
- Relationship: User participates in Trip through TripParticipant
```

#### 2.3 Business Rules

**Extract:**
- Constraints (UNIQUE, NOT NULL, CHECK)
- Soft delete requirements
- Data validation rules
- Referential integrity rules

**Example Analysis:**

```markdown
# PRD Section
"Soft Delete: Ningún dato se borra físicamente; se usa borrado lógico (deleted_at)"
"Moneda Única: Todo el sistema opera exclusivamente en COP"

# Extracted Rules
- All entities need: deleted_at TIMESTAMP NULLABLE
- Currency field should be: DEFAULT 'COP' or removed (fixed value)
```

#### 2.4 Features and Modules

**Extract:**
- Core entities from module names
- Attributes from feature descriptions
- Relationships from data flows

**Example Analysis:**

```markdown
# PRD Section
"Módulo 3: Gestión de Gastos (Expenses)
 - Registro de Gasto: Título, Monto, Pagador, Beneficiarios (Split), Categoría, Foto"

# Extracted Entity: Expense
- title: VARCHAR (from "Título")
- amount: DECIMAL (from "Monto")
- payer_id: FK to User (from "Pagador")
- category_id: FK to Category (from "Categoría")
- receipt_url: VARCHAR (from "Foto")

# Extracted Entity: ExpenseSplit (from "Beneficiarios Split")
- expense_id: FK to Expense
- user_id: FK to User
- amount_owed: DECIMAL
```

#### 2.5 User Stories

**Extract:**
- Actions that imply CRUD operations
- Data that needs to be stored
- Relationships between actors and objects

**Example Analysis:**

```markdown
# User Story
"Como Participante, quiero subir una foto del recibo de la cena, 
para que exista evidencia del monto cobrado."

# Extracted Requirements
- Entity: Expense needs receipt_url field
- Constraint: receipt_url should be optional (nullable)
- Storage: External file storage (S3/Cloudinary)
```

### Phase 3: Existing Model Analysis

If `docs/modeloER.md` exists, parse it to understand:

- Already defined entities
- Existing relationships
- Business rules embedded in comments
- Gaps between documentation and model

### Phase 4: Technical Requirements Analysis

Extract from technical documentation:

- Database type preferences
- Performance requirements (indexes)
- Audit requirements (timestamps)
- Compliance requirements (encryption, PII)

---

## Semantic Extraction Rules

### Entity Identification

| Document Pattern | Entity Type | Example |
|-----------------|-------------|---------|
| "gestión de X" | Core Entity | "gestión de Viajes" -> Trip |
| "X tiene múltiples Y" | 1:N Relationship | "Trip has multiple Expenses" |
| "X pertenece a Y" | N:1 Relationship | "Expense belongs to Trip" |
| "X e Y se relacionan" | M:N Relationship | "User and Trip" -> TripParticipant |
| "tipos de X" | Enum or Category | "tipos de gasto" -> ExpenseCategory |
| "historial de X" | Audit/Log Entity | "historial de cambios" |

### Attribute Identification

| Document Pattern | Attribute Type | Example |
|-----------------|----------------|---------|
| "nombre", "título" | VARCHAR | name, title |
| "monto", "cantidad", "precio" | DECIMAL | amount, quantity, price |
| "fecha", "momento" | DATE/TIMESTAMP | date, created_at |
| "email", "correo" | VARCHAR + validation | email (UNIQUE) |
| "estado", "status" | ENUM/VARCHAR | status |
| "código", "identificador" | VARCHAR (UNIQUE) | code, identifier |
| "descripción", "detalle" | TEXT | description |
| "activo/inactivo" | BOOLEAN | is_active |
| "foto", "imagen", "archivo" | VARCHAR (URL) | image_url, file_url |

### Relationship Identification

| Document Pattern | Cardinality | Junction Table |
|-----------------|-------------|----------------|
| "un X tiene un Y" | 1:1 | No |
| "un X tiene múltiples Y" | 1:N | No |
| "múltiples X tienen múltiples Y" | M:N | Yes |
| "X participa en Y" | M:N | Yes (with attributes) |
| "X crea Y" | 1:N | No (with FK) |

### Constraint Identification

| Document Pattern | Constraint | SQL |
|-----------------|------------|-----|
| "único", "no repetido" | UNIQUE | UNIQUE |
| "obligatorio", "requerido" | NOT NULL | NOT NULL |
| "opcional" | NULLABLE | NULL |
| "por defecto" | DEFAULT | DEFAULT value |
| "máximo X caracteres" | LENGTH | VARCHAR(X) |
| "valor entre X y Y" | CHECK | CHECK (col BETWEEN X AND Y) |

---

## Output Format

Generate a Requirements Summary:

```yaml
requirements_summary:
  project_name: "TravelSplit"
  domain: "Expense Management for Group Travel"
  
  # Entities identified from documentation
  entities:
    - name: "User"
      source: "PRD Section 3 - Stakeholders"
      description: "Registered user of the system"
      attributes_hints:
        - name: "email"
          type: "VARCHAR(255)"
          constraints: ["UNIQUE", "NOT NULL"]
          source: "Auth module - registration"
        - name: "password_hash"
          type: "VARCHAR(255)"
          constraints: ["NOT NULL"]
          source: "Auth module - security"
        - name: "first_name"
          type: "VARCHAR(100)"
          source: "Registration feature"
        - name: "last_name"
          type: "VARCHAR(100)"
          source: "Registration feature"
      
    - name: "Trip"
      source: "PRD Section 5 - Module 2"
      description: "A group trip that contains expenses"
      attributes_hints:
        - name: "name"
          type: "VARCHAR(255)"
          constraints: ["NOT NULL"]
        - name: "invite_code"
          type: "VARCHAR(20)"
          constraints: ["UNIQUE", "NOT NULL"]
          source: "Join trip by code feature"
        - name: "status"
          type: "ENUM"
          values: ["ACTIVE", "COMPLETED", "CANCELLED"]
      
    - name: "TripParticipant"
      source: "PRD Section 3 - Roles are contextual by trip"
      description: "Junction table for User-Trip M:N relationship with role"
      type: "junction"
      connects: ["User", "Trip"]
      attributes_hints:
        - name: "role"
          type: "ENUM"
          values: ["CREATOR", "MEMBER"]
          source: "PRD Section 3"
      
    - name: "ExpenseCategory"
      source: "PRD Section 5 - Module 3"
      description: "Categories for expenses"
      type: "lookup"
      attributes_hints:
        - name: "name"
          type: "VARCHAR(50)"
          source: "Categorías: Comida, Transporte, Alojamiento..."
      
    - name: "Expense"
      source: "PRD Section 5 - Module 3"
      description: "An expense record within a trip"
      attributes_hints:
        - name: "title"
          type: "VARCHAR(255)"
        - name: "amount"
          type: "DECIMAL(12,2)"
          source: "Monto total en COP"
        - name: "receipt_url"
          type: "VARCHAR(500)"
          constraints: ["NULLABLE"]
          source: "Foto opcional"
        - name: "expense_date"
          type: "DATE"
      
    - name: "ExpenseSplit"
      source: "PRD Section 5 - Beneficiarios (Split)"
      description: "How an expense is split among participants"
      type: "junction"
      connects: ["Expense", "User"]
      attributes_hints:
        - name: "amount_owed"
          type: "DECIMAL(12,2)"
          source: "Fair share calculation"
  
  # Business rules that affect the model
  business_rules:
    - rule: "Soft Delete"
      description: "All entities must have deleted_at column"
      affects: ["all entities"]
      implementation: "deleted_at TIMESTAMP NULLABLE"
      
    - rule: "Single Currency"
      description: "System operates in COP only"
      affects: ["Expense", "ExpenseSplit"]
      implementation: "No currency column needed or DEFAULT 'COP'"
      
    - rule: "Contextual Roles"
      description: "User roles are per-trip, not global"
      affects: ["User", "TripParticipant"]
      implementation: "Role stored in TripParticipant, not User"
      
    - rule: "Audit Timestamps"
      description: "Track creation and modification"
      affects: ["all entities"]
      implementation: "created_at, updated_at TIMESTAMP columns"
  
  # Relationships identified
  relationships:
    - from: "User"
      to: "Trip"
      type: "M:N"
      through: "TripParticipant"
      description: "Users participate in trips"
      
    - from: "User"
      to: "Trip"
      type: "1:N"
      description: "User creates trips (ownership)"
      fk_column: "created_by"
      
    - from: "Trip"
      to: "Expense"
      type: "1:N"
      description: "Trip contains expenses"
      fk_column: "trip_id"
      
    - from: "User"
      to: "Expense"
      type: "1:N"
      description: "User pays for expenses"
      fk_column: "payer_id"
      
    - from: "ExpenseCategory"
      to: "Expense"
      type: "1:N"
      description: "Category classifies expenses"
      fk_column: "category_id"
      
    - from: "Expense"
      to: "ExpenseSplit"
      type: "1:N"
      description: "Expense is divided into splits"
      
    - from: "User"
      to: "ExpenseSplit"
      type: "1:N"
      description: "User owes amounts from splits"
```

---

## Validation Checkpoints

After analysis, verify:

- [ ] PRD was found and analyzed
- [ ] At least 3 core entities identified
- [ ] All entities have at least one attribute hint
- [ ] Relationships between entities are clear
- [ ] Business rules are documented
- [ ] No orphan entities (all connected)
- [ ] Junction tables identified for M:N relationships

---

## Error Handling

| Scenario | Action |
|----------|--------|
| No PRD found | Search for alternative docs, ask user |
| PRD too vague | Request clarification on specific sections |
| Conflicting requirements | Document conflict, ask user to resolve |
| Missing entity details | Infer from context, mark as "needs clarification" |
| Unclear relationships | Default to 1:N, mark for review |
