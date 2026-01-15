# C4 Architecture Designer

## Purpose

Design a complete C4 architecture from requirements as an expert Software Architect. This sub-agent takes the Requirements Summary from `@c4-doc-analyzer.md` and produces a professional-grade architecture design following industry best practices.

---

## Input Requirements

This sub-agent requires the **Requirements Summary** from `@c4-doc-analyzer.md`:

```yaml
Required fields:
  - project_name: string
  - users: list of user types
  - modules: list of application modules
  - stack: technology stack (may be partial)
  - architecture: pattern hints (may be partial)
  - external_systems: list of integrations (optional)
  - business_rules: constraints and rules (optional)
```

---

## Design Process

### Phase 1: System Context Design (Level 1)

#### 1.1 Define System Boundary

From Requirements Summary, establish:

| Element | Source | Design Decision |
|---------|--------|-----------------|
| System Name | `project_name` | Use as-is or refine |
| System Description | `project_description` | Summarize core functionality |
| System Type | Infer from modules | Web App, API, Platform, etc. |

#### 1.2 Map Users to Persons

For each user in `requirements_summary.users`:

```yaml
design:
  context:
    users:
      - id: "{user_name_snake_case}"
        name: "{user_name}"
        description: "{user_description}"
        relationship: "Uses"
        protocol: "HTTPS"
```

**Design Guidelines:**
- Combine similar user types if interactions are identical
- Distinguish users by their primary interactions with the system
- External users vs internal users should be clearly separated

#### 1.3 Map External Systems

For each external in `requirements_summary.external_systems`:

```yaml
design:
  context:
    external_systems:
      - id: "{external_name_snake_case}"
        name: "{external_name}"
        description: "{external_description}"
        relationship: "{action_verb}"
        protocol: "{SMTP | API | HTTPS | S3 | OAuth}"
```

**Design Guidelines:**
- Group related services (e.g., multiple OAuth providers -> single "OAuth Provider")
- Specify protocols for clarity in diagrams
- Include only systems that directly interact with the main system

### Phase 2: Container Design (Level 2)

#### 2.1 Identify Containers

Based on project type and stack:

| Project Type | Recommended Containers |
|--------------|------------------------|
| **Web Application** | Frontend SPA + Backend API + Database |
| **API Only** | Backend API + Database |
| **Full Stack with Files** | Frontend + Backend + Database + File Storage |
| **Real-time App** | Frontend + Backend + Database + Cache/WebSocket |
| **Microservices** | Multiple APIs + Databases + Message Queue |

#### 2.2 Frontend Container Design

If frontend stack is defined:

```yaml
container:
  id: "frontend"
  name: "Frontend Web Application"
  technology: "{framework}, {build_tool}, {styling}"
  type: "web"
  description: "Single-page application providing the user interface"
  relationships:
    - target: "backend"
      description: "Makes API requests"
      protocol: "HTTPS/REST"
```

**Technology String Examples:**
- React + Vite + Tailwind: "React, Vite, Tailwind CSS"
- Vue + Webpack: "Vue.js, Webpack"
- Angular + CLI: "Angular, Angular CLI"

#### 2.3 Backend Container Design

If backend stack is defined:

```yaml
container:
  id: "backend"
  name: "Backend API"
  technology: "{framework}, {language}, {runtime}"
  type: "api"
  description: "REST API providing business logic and data access"
  relationships:
    - target: "database"
      description: "Reads and writes data"
      protocol: "{ORM}/{database_type}"
    - target: "{external_system}"
      description: "{action}"
      protocol: "{protocol}"
```

**Technology String Examples:**
- NestJS: "NestJS, TypeScript, Node.js"
- Express: "Express.js, JavaScript, Node.js"
- FastAPI: "FastAPI, Python 3.11"
- Spring Boot: "Spring Boot, Java 21"
- Django: "Django, Python 3.11"

#### 2.4 Database Container Design

```yaml
container:
  id: "database"
  name: "{database_name} Database"
  technology: "{database_type}"
  type: "database"
  description: "Stores {domain_entities}"
```

**Technology String Examples:**
- PostgreSQL: "PostgreSQL v17"
- MySQL: "MySQL 8"
- MongoDB: "MongoDB"
- SQLite: "SQLite"

#### 2.5 Additional Containers (if needed)

| Need | Container Type | Example |
|------|---------------|---------|
| File uploads | File Storage | "File Storage (S3 Compatible)" |
| Caching | Cache | "Redis Cache" |
| Background jobs | Queue | "Message Queue (RabbitMQ)" |
| Search | Search Engine | "Elasticsearch" |

### Phase 3: Component Design (Level 3)

#### 3.1 Apply Architecture Pattern

Based on `requirements_summary.architecture.backend.pattern`:

##### CSED Pattern (NestJS, similar)

For each module in `requirements_summary.modules`:

```yaml
module:
  name: "{module_name}"
  components:
    - name: "{Module}Controller"
      type: "controller"
      technology: "NestJS Controller"
      description: "Handles {module} HTTP requests"
      
    - name: "{Module}Service"
      type: "service"
      technology: "NestJS Service"
      description: "{Module} business logic"
      
    - name: "{Module} Entity"
      type: "entity"
      technology: "TypeORM Entity"
      description: "{Module} data model"
```

##### Layered Pattern (Spring, Django)

```yaml
module:
  name: "{module_name}"
  components:
    - name: "{Module}Controller"
      type: "controller"
      technology: "{framework} Controller"
      
    - name: "{Module}Service"
      type: "service"
      technology: "{framework} Service"
      
    - name: "{Module}Repository"
      type: "repository"
      technology: "{ORM} Repository"
```

##### Hexagonal Pattern

```yaml
module:
  name: "{module_name}"
  components:
    - name: "{Module}Adapter"
      type: "adapter"
      technology: "Input Adapter"
      
    - name: "{Module}UseCase"
      type: "usecase"
      technology: "Application Service"
      
    - name: "{Module}Port"
      type: "port"
      technology: "Interface"
      
    - name: "{Module}Repository"
      type: "repository"
      technology: "Output Adapter"
```

#### 3.2 Common Components

Add cross-cutting components:

```yaml
common_components:
  - name: "AuthGuard"
    type: "guard"
    technology: "{framework} Guard"
    description: "JWT authentication guard"
    
  - name: "HttpExceptionFilter"
    type: "filter"
    technology: "{framework} Filter"
    description: "Global exception handling"
    
  - name: "ValidationPipe"
    type: "pipe"
    technology: "{framework} Pipe"
    description: "Request validation"
```

#### 3.3 Frontend Components (if applicable)

Based on `requirements_summary.architecture.frontend.pattern`:

##### Atomic Design Pattern

```yaml
frontend_components:
  atoms:
    - "Button"
    - "Input"
    - "Card"
  molecules:
    - "FormField"
    - "SearchBar"
  organisms:
    - "Header"
    - "Footer"
    - "Sidebar"
  pages:
    - "LoginPage"
    - "DashboardPage"
    - "{Module}Page"
```

### Phase 4: Relationship Design

#### 4.1 User-to-System Relationships

```yaml
relationships:
  - from: "{user_id}"
    to: "frontend"
    description: "Uses"
    protocol: "HTTPS"
```

#### 4.2 Container-to-Container Relationships

```yaml
relationships:
  - from: "frontend"
    to: "backend"
    description: "Makes API requests"
    protocol: "HTTPS/REST"
    
  - from: "backend"
    to: "database"
    description: "Reads and writes data"
    protocol: "SQL/TypeORM"
```

#### 4.3 System-to-External Relationships

```yaml
relationships:
  - from: "backend"
    to: "{external_id}"
    description: "{action}"
    protocol: "{protocol}"
```

#### 4.4 Component-to-Component Relationships

Based on architecture pattern:

| Pattern | Relationship Flow |
|---------|-------------------|
| CSED | Controller -> Service -> Entity |
| Layered | Controller -> Service -> Repository -> Database |
| Hexagonal | Adapter -> UseCase -> Port <- Repository |

### Phase 5: Infrastructure Design

#### 5.1 Deployment Strategy

Based on `requirements_summary.infrastructure`:

| Hint | Recommended Deployment |
|------|------------------------|
| "Docker", "contenedores" | Docker Compose |
| "Kubernetes", "k8s" | Kubernetes |
| "serverless" | AWS Lambda / Vercel |
| "cloud" | Cloud provider services |
| No hint | Default: Docker Compose |

#### 5.2 CI/CD Pipeline

| Hint | Recommended CI/CD |
|------|-------------------|
| GitHub repository | GitHub Actions |
| GitLab repository | GitLab CI |
| No hint | GitHub Actions (default) |

---

## Output Format

Generate an Architecture Design Summary compatible with Discovery Summary:

```yaml
architecture_design_summary:
  metadata:
    designed_by: "C4 Architecture Designer Agent"
    mode: "DESIGN"
    timestamp: "2026-01-15T12:00:00Z"
    source_documents:
      - "docs/PRD.md"
      - "docs/Technical_Backlog.md"
  
  # Same structure as Discovery Summary for compatibility
  project_type: "single"
  primary_language: "TypeScript"
  
  stack:
    backend:
      language: "TypeScript"
      runtime: "Node.js 22"
      framework: "NestJS"
      orm: "TypeORM"
      database: "PostgreSQL"
    frontend:
      language: "TypeScript"
      framework: "React"
      build_tool: "Vite"
      styling: "Tailwind CSS"
  
  architecture:
    backend:
      pattern: "CSED"
      layers:
        - "Controllers (HTTP Layer)"
        - "Services (Business Logic)"
        - "Entities (Data Model)"
        - "DTOs (Data Transfer)"
    frontend:
      pattern: "Atomic Design"
      layers:
        - "Atoms"
        - "Molecules"
        - "Organisms"
        - "Pages"
  
  infrastructure:
    deployment: "Docker Compose"
    ci_cd: "GitHub Actions"
    external_services:
      - name: "Email Service"
        type: "SMTP"
      - name: "File Storage"
        type: "S3 Compatible"
  
  components:
    backend:
      - module: "auth"
        components:
          - name: "AuthController"
            type: "controller"
          - name: "AuthService"
            type: "service"
      - module: "users"
        components:
          - name: "UsersController"
            type: "controller"
          - name: "UsersService"
            type: "service"
          - name: "User"
            type: "entity"
      - module: "trips"
        components:
          - name: "TripsController"
            type: "controller"
          - name: "TripsService"
            type: "service"
          - name: "Trip"
            type: "entity"
          - name: "TripParticipant"
            type: "entity"
      - module: "expenses"
        components:
          - name: "ExpensesController"
            type: "controller"
          - name: "ExpensesService"
            type: "service"
          - name: "Expense"
            type: "entity"
          - name: "ExpenseSplit"
            type: "entity"
    frontend:
      - name: "LoginPage"
        type: "page"
      - name: "DashboardPage"
        type: "page"
      - name: "TripPage"
        type: "page"
      - name: "ExpensePage"
        type: "page"
  
  diagram_strategy:
    context:
      system_name: "TravelSplit"
      system_description: "Expense management platform for group travel"
      users:
        - name: "Trip Administrator"
          description: "Creates and manages trips"
        - name: "Trip Participant"
          description: "Joins trips and records expenses"
      external_systems:
        - name: "Email Service"
          type: "SMTP"
        - name: "File Storage"
          type: "S3 Compatible"
    containers:
      - name: "Frontend Web App"
        technology: "React, Vite, Tailwind CSS"
        type: "web"
      - name: "Backend API"
        technology: "NestJS, TypeScript, Node.js"
        type: "api"
      - name: "PostgreSQL Database"
        technology: "PostgreSQL v17"
        type: "database"
    components:
      backend:
        pattern: "CSED"
        grouping: "by_module"
      frontend:
        pattern: "atomic"
        grouping: "by_type"
```

---

## Design Best Practices Applied

### Separation of Concerns

- Clear boundaries between containers
- Single responsibility per component
- Layered communication (no layer skipping)

### Scalability Considerations

- Stateless backend for horizontal scaling
- Database as separate container
- Cache layer for performance (when applicable)

### Security by Design

- Authentication at API gateway
- Authorization per endpoint
- Encrypted communication (HTTPS)

### Maintainability

- Modular structure for easy updates
- Clear naming conventions
- Documented relationships

---

## Validation Checkpoints

Before finalizing the design, verify:

- [ ] System name and description defined
- [ ] All users from requirements mapped to Persons
- [ ] All external systems mapped to System_Ext
- [ ] At least one container per architectural tier
- [ ] All modules have corresponding components
- [ ] Relationships defined between all containers
- [ ] Technology strings are accurate and complete
- [ ] Architecture pattern consistently applied
- [ ] Output format matches Discovery Summary structure

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Missing stack information | Propose default based on project type, ask user to confirm |
| Unknown architecture pattern | Default to CSED for Node.js, Layered for Java/Python |
| No modules defined | Infer from features, create basic structure |
| Conflicting requirements | Document trade-offs, ask user to decide |
| Incomplete infrastructure | Use sensible defaults (Docker, GitHub Actions) |

---

## Technology Defaults

When technology is not specified:

### Backend Defaults

| Requirement Hint | Default Stack |
|------------------|---------------|
| "TypeScript", "Node" | NestJS, TypeORM, PostgreSQL |
| "Python", "API" | FastAPI, SQLAlchemy, PostgreSQL |
| "Java", "enterprise" | Spring Boot, Hibernate, PostgreSQL |
| "Go", "performance" | Gin, GORM, PostgreSQL |
| No hint | NestJS, TypeORM, PostgreSQL |

### Frontend Defaults

| Requirement Hint | Default Stack |
|------------------|---------------|
| "React" | React, Vite, Tailwind CSS |
| "Vue" | Vue 3, Vite, Tailwind CSS |
| "Angular" | Angular, Angular CLI |
| "mobile-first" | React, Vite, Tailwind CSS |
| No hint | React, Vite, Tailwind CSS |

### Architecture Defaults

| Stack | Default Pattern |
|-------|-----------------|
| NestJS | CSED |
| Express | Layered |
| FastAPI | Layered |
| Spring Boot | Layered |
| Django | MTV |
| Go (Gin) | Layered |

---

## Proposal vs Confirmation Flow

For critical design decisions without clear requirements:

1. **Propose** the default with justification
2. **Ask** user to confirm or modify
3. **Document** the decision in metadata

Example:

```markdown
**Stack Proposal:**
The PRD does not specify a technology stack. Based on the requirements 
for a web application with REST API, I recommend:

- Backend: NestJS + TypeORM + PostgreSQL
- Frontend: React + Vite + Tailwind CSS

This stack provides:
- Type safety (TypeScript)
- Mature ecosystem
- Good documentation
- Alignment with project rules

**Confirm or specify alternative?**
```
