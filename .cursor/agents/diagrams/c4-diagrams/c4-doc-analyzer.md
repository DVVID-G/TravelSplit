# C4 Documentation Analyzer

## Purpose

Analyze project documentation (PRD, Technical Backlog, specifications) to extract architectural requirements for the Design Mode. This sub-agent performs semantic analysis to identify users, external systems, containers, components, and technology requirements from natural language documentation.

---

## Documentation Sources

Search for and analyze documentation in this priority order:

| Priority | File/Location | Content Type |
|----------|---------------|--------------|
| 1 | `docs/PRD.md` | Product Requirements Document |
| 2 | `docs/Technical_Backlog.md` | Technical specifications |
| 3 | `docs/stack.md` | Technology stack definition |
| 4 | `docs/UseCaseDiagram.md` | Use Cases |
| 5 | `docs/user-stories.md` | User Stories |
| 6 | `docs/user-personas.md` | User Personas |
| 8 | `README.md` | Project overview |
| 9 | `docs/*.md` | Any other documentation |

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

The PRD is the primary source for architectural requirements. Extract from these sections:

#### 2.1 Executive Summary / Problem Statement

**Extract:**
- System purpose and context
- Core functionality that defines the system
- Key domain concepts

**Example Analysis:**

```markdown
# PRD Section
"TravelSplit es una plataforma web que permite a grupos de amigos 
gestionar y dividir gastos durante viajes compartidos."

# Extracted Information
- System Name: "TravelSplit"
- System Type: "Web Platform"
- Domain: "Expense Management for Group Travel"
- Core Capability: "Expense tracking and splitting"
```

#### 2.2 Stakeholders and User Roles

**Extract:**
- User types -> Person elements in C4 Context
- User descriptions -> Person descriptions
- User interactions -> Relationships with system

**Example Analysis:**

```markdown
# PRD Section
"Usuarios:
- Viajero Administrador: Crea y gestiona viajes
- Viajero Participante: Se une a viajes y registra gastos"

# Extracted C4 Elements
- Person: "Trip Administrator" - "Creates and manages trips"
- Person: "Trip Participant" - "Joins trips and records expenses"
```

#### 2.3 Integrations and External Systems

**Extract:**
- Third-party services -> System_Ext elements
- APIs consumed -> External system relationships
- Infrastructure services -> Infrastructure hints

**Example Analysis:**

```markdown
# PRD Section
"Integraciones:
- Servicio de email para notificaciones
- Almacenamiento de archivos para recibos (S3 compatible)
- OAuth providers (Google, Apple) para autenticacion"

# Extracted C4 Elements
- System_Ext: "Email Service" - "SMTP/API for notifications"
- System_Ext: "File Storage" - "S3-compatible storage for receipts"
- System_Ext: "OAuth Provider" - "Google/Apple authentication"
```

#### 2.4 Modules and Features

**Extract:**
- Application modules -> Container and Component hints
- Feature groupings -> Module structure
- Data flows -> Relationships between components

**Example Analysis:**

```markdown
# PRD Section
"Modulos del Sistema:
1. Autenticacion: Login, registro, OAuth
2. Gestion de Viajes: CRUD de viajes, codigos de invitacion
3. Gestion de Gastos: Registro, division, categorias
4. Liquidacion: Calculo de balances, pagos"

# Extracted Modules
- Module: "auth" (Authentication)
  - Components: AuthController, AuthService
- Module: "trips" (Trip Management)
  - Components: TripsController, TripsService
- Module: "expenses" (Expense Management)
  - Components: ExpensesController, ExpensesService
- Module: "settlements" (Settlement)
  - Components: SettlementsController, SettlementsService
```

#### 2.5 Non-Functional Requirements

**Extract:**
- Performance requirements -> Infrastructure decisions
- Security requirements -> Architecture patterns
- Scalability needs -> Container structure

**Example Analysis:**

```markdown
# PRD Section
"Requisitos No Funcionales:
- Tiempo de respuesta < 200ms
- Soporte para 1000 usuarios concurrentes
- Datos encriptados en reposo y transito
- Alta disponibilidad (99.9%)"

# Extracted Infrastructure Hints
- Deployment: Consider load balancing, caching
- Security: HTTPS, encryption, secure auth
- Database: Consider read replicas
```

### Phase 3: Technical Backlog Analysis

Extract technical specifications:

#### 3.1 Technology Stack

**Extract:**
- Backend technology -> Stack definition
- Frontend technology -> Stack definition
- Database choice -> Container type
- Infrastructure -> Deployment hints

**Example Analysis:**

```markdown
# Technical_Backlog Section
"Stack Tecnologico:
- Backend: NestJS (Node.js), TypeORM, PostgreSQL
- Frontend: React, Vite, Tailwind CSS
- Infraestructura: Docker, GitHub Actions"

# Extracted Stack
stack:
  backend:
    language: "TypeScript"
    runtime: "Node.js"
    framework: "NestJS"
    orm: "TypeORM"
    database: "PostgreSQL"
  frontend:
    language: "TypeScript"
    framework: "React"
    build_tool: "Vite"
    styling: "Tailwind CSS"
```

#### 3.2 Architecture Pattern

**Extract:**
- Code organization pattern -> Architecture pattern
- Layer structure -> Component types
- Module organization -> Component grouping

**Example Analysis:**

```markdown
# Technical_Backlog Section
"Arquitectura Backend:
- Patron CSED (Controller-Service-Entity-DTO)
- Organizacion modular por dominio
- Inyeccion de dependencias con NestJS"

# Extracted Architecture
architecture:
  backend:
    pattern: "CSED"
    layers:
      - "Controllers (HTTP Layer)"
      - "Services (Business Logic)"
      - "Entities (Data Model)"
      - "DTOs (Data Transfer)"
```

### Phase 4: User Stories and Use Cases Analysis

Extract interaction patterns:

**Extract:**
- User actions -> System capabilities
- System responses -> Container responsibilities
- Data operations -> Component functions

**Example Analysis:**

```markdown
# User Story
"Como Participante, quiero registrar un gasto compartido, 
para que se divida automaticamente entre los participantes del viaje."

# Extracted Interactions
- User: "Trip Participant"
- Action: "Records shared expense"
- System Response: "Automatically splits expense"
- Implied Components: ExpensesService, SplitCalculator
```

---

## Semantic Extraction Rules

### User/Person Identification

| Document Pattern | C4 Element | Example |
|-----------------|------------|---------|
| "usuario", "user", "actor" | Person | "Usuario registrado" -> Person |
| "administrador", "admin" | Person (admin type) | "Admin del viaje" -> Person |
| "sistema externo", "servicio" | System_Ext | "Servicio de email" -> System_Ext |
| "API externa", "integracion" | System_Ext | "API de pagos" -> System_Ext |

### Container Identification

| Document Pattern | Container Type | Example |
|-----------------|----------------|---------|
| "aplicacion web", "frontend", "SPA" | Web Application | Container(web) |
| "API", "backend", "servidor" | API Application | Container(api) |
| "base de datos", "database" | Database | ContainerDb |
| "cola de mensajes", "queue" | Message Queue | ContainerQueue |
| "cache", "redis" | Cache | Container(cache) |
| "almacenamiento", "storage" | File Storage | Container(storage) |

### Component Identification

| Document Pattern | Component Type | Example |
|-----------------|----------------|---------|
| "modulo de X", "gestion de X" | Module with components | Module: auth |
| "controlador", "endpoint" | Controller | AuthController |
| "servicio", "logica de negocio" | Service | AuthService |
| "entidad", "modelo" | Entity | User entity |
| "validacion", "DTO" | DTO | CreateUserDto |

### Technology Identification

| Document Pattern | Technology | Example |
|-----------------|------------|---------|
| "NestJS", "Nest" | NestJS Framework | framework: "NestJS" |
| "React", "ReactJS" | React | framework: "React" |
| "PostgreSQL", "Postgres" | PostgreSQL | database: "PostgreSQL" |
| "TypeORM" | TypeORM | orm: "TypeORM" |
| "Docker", "contenedores" | Docker | deployment: "Docker" |

---

## Output Format

Generate a Requirements Summary:

```yaml
requirements_summary:
  project_name: "TravelSplit"
  project_description: "Expense management platform for group travel"
  domain: "Travel Expense Management"
  
  # Users identified from documentation
  users:
    - name: "Trip Administrator"
      description: "Creates and manages trips, invites participants"
      source: "PRD Section 3 - Stakeholders"
      interactions:
        - "Creates trips"
        - "Invites participants"
        - "Manages trip settings"
        
    - name: "Trip Participant"
      description: "Joins trips, records expenses, views balances"
      source: "PRD Section 3 - Stakeholders"
      interactions:
        - "Joins trips via invite code"
        - "Records expenses"
        - "Views balances and settlements"
  
  # External systems identified
  external_systems:
    - name: "Email Service"
      type: "SMTP/API"
      description: "Sends notifications and invitations"
      source: "PRD Section 4 - Integrations"
      
    - name: "File Storage"
      type: "S3 Compatible"
      description: "Stores receipt images"
      source: "PRD Section 4 - Integrations"
      
    - name: "OAuth Provider"
      type: "OAuth 2.0"
      description: "Google/Apple authentication"
      source: "Technical_Backlog - Authentication"
  
  # Stack from Technical_Backlog or inferred
  stack:
    backend:
      language: "TypeScript"
      runtime: "Node.js"
      framework: "NestJS"
      orm: "TypeORM"
      database: "PostgreSQL"
      source: "Technical_Backlog - Stack"
      
    frontend:
      language: "TypeScript"
      framework: "React"
      build_tool: "Vite"
      styling: "Tailwind CSS"
      source: "Technical_Backlog - Stack"
  
  # Architecture from Technical_Backlog or inferred
  architecture:
    backend:
      pattern: "CSED"
      layers:
        - "Controllers"
        - "Services"
        - "Entities"
        - "DTOs"
      source: "Technical_Backlog - Architecture"
      
    frontend:
      pattern: "Atomic Design"
      layers:
        - "Atoms"
        - "Molecules"
        - "Organisms"
        - "Pages"
      source: "Technical_Backlog - Frontend Structure"
  
  # Modules identified from PRD features
  modules:
    - name: "auth"
      description: "Authentication and authorization"
      source: "PRD Module 1"
      features:
        - "User registration"
        - "Login/logout"
        - "OAuth integration"
        - "JWT tokens"
      implied_components:
        - type: "controller"
          name: "AuthController"
        - type: "service"
          name: "AuthService"
        
    - name: "users"
      description: "User profile management"
      source: "PRD Module 1"
      features:
        - "Profile viewing"
        - "Profile editing"
      implied_components:
        - type: "controller"
          name: "UsersController"
        - type: "service"
          name: "UsersService"
        - type: "entity"
          name: "User"
        
    - name: "trips"
      description: "Trip management"
      source: "PRD Module 2"
      features:
        - "Create trip"
        - "Join trip via code"
        - "Manage participants"
      implied_components:
        - type: "controller"
          name: "TripsController"
        - type: "service"
          name: "TripsService"
        - type: "entity"
          name: "Trip"
        - type: "entity"
          name: "TripParticipant"
        
    - name: "expenses"
      description: "Expense management"
      source: "PRD Module 3"
      features:
        - "Record expense"
        - "Split expense"
        - "Categorize expense"
        - "Upload receipt"
      implied_components:
        - type: "controller"
          name: "ExpensesController"
        - type: "service"
          name: "ExpensesService"
        - type: "entity"
          name: "Expense"
        - type: "entity"
          name: "ExpenseSplit"
        - type: "entity"
          name: "ExpenseCategory"
  
  # Infrastructure hints from non-functional requirements
  infrastructure:
    deployment: "Docker Compose"
    ci_cd: "GitHub Actions"
    hints:
      - "Load balancing for high availability"
      - "HTTPS for secure communication"
      - "Database backups"
    source: "Technical_Backlog - Infrastructure"
  
  # Business rules that affect architecture
  business_rules:
    - rule: "Single Currency"
      description: "System operates in COP only"
      architectural_impact: "No multi-currency support needed"
      
    - rule: "Soft Delete"
      description: "No physical deletion of records"
      architectural_impact: "All entities need deleted_at column"
      
    - rule: "Contextual Roles"
      description: "User roles are per-trip, not global"
      architectural_impact: "TripParticipant junction table with role"
```

---

## Validation Checkpoints

After analysis, verify:

- [ ] PRD was found and analyzed
- [ ] At least 2 user types identified
- [ ] System name and description extracted
- [ ] At least 2 modules/features identified
- [ ] Technology stack defined or inferable
- [ ] Architecture pattern identified or defaultable
- [ ] External systems documented (if any)
- [ ] Business rules captured

---

## Error Handling

| Scenario | Action |
|----------|--------|
| No PRD found | Search for alternative docs (README, openspec), ask user |
| PRD too vague | Request clarification on specific sections |
| No stack defined | Propose default or ask user preference |
| No architecture pattern | Infer from stack (e.g., NestJS -> CSED) |
| Missing module details | Infer from features, mark as "needs clarification" |
| Conflicting information | Document conflict, ask user to resolve |

---

## Inference Rules

When information is not explicitly stated:

### Stack Inference

| Hint | Inferred Stack |
|------|----------------|
| "API REST moderna" | Backend: NestJS or Express |
| "SPA", "aplicacion de una pagina" | Frontend: React or Vue |
| "tiempo real", "websockets" | Consider Socket.io integration |
| "escalable", "microservicios" | Consider modular monolith or microservices |

### Architecture Inference

| Stack | Default Pattern |
|-------|-----------------|
| NestJS | CSED (Controller-Service-Entity-DTO) |
| Express | Layered (Router-Controller-Service) |
| Django | MTV (Model-Template-View) |
| Spring Boot | Layered (Controller-Service-Repository) |
| FastAPI | Layered (Router-Service-Model) |

### Container Inference

| Project Type | Default Containers |
|--------------|-------------------|
| Web Application | Frontend (SPA) + Backend (API) + Database |
| API Only | Backend (API) + Database |
| Full Stack | Frontend + Backend + Database + (optional: Cache, Queue) |
