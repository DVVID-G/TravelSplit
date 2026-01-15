# C4 Discovery Process

## Purpose

Global auto-discovery process to analyze any codebase and extract information needed to generate accurate C4 diagrams. This process is stack-agnostic and adapts diagram generation based on discovered technologies.

---

## Phase 1: Project Detection

### Objective

Identify project type, structure, and primary configuration files.

### Commands

```
list_dir .                    # Root structure
list_dir */ --depth=1         # First-level directories
```

### Detection Matrix

| File Found | Project Type |
|------------|--------------|
| `package.json` | Node.js / JavaScript / TypeScript |
| `requirements.txt`, `pyproject.toml`, `setup.py` | Python |
| `pom.xml`, `build.gradle` | Java |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `composer.json` | PHP |
| `.csproj`, `.sln` | .NET / C# |
| `Gemfile` | Ruby |

### Structure Patterns

| Pattern | Structure Type |
|---------|----------------|
| Multiple `package.json` in subdirs | Monorepo |
| Single root config | Single Project |
| `apps/`, `packages/`, `services/` dirs | Workspace/Monorepo |
| `frontend/`, `backend/`, `client/`, `server/` | Multi-tier Application |
| `docker-compose.yml` with multiple services | Microservices |

### Output

```yaml
project_type: [monorepo | single | microservices]
primary_language: [typescript | python | java | go | ...]
structure:
  - name: "Backend"
    path: "/backend"
    type: "api"
  - name: "Frontend"  
    path: "/frontend"
    type: "web"
```

---

## Phase 2: Tech Stack Discovery

### Objective

Identify languages, frameworks, databases, and dependencies for each detected component.

### Detection by Config File

#### Node.js / TypeScript (`package.json`)

```
read_file {path}/package.json
```

| Dependency | Technology |
|------------|------------|
| `@nestjs/*` | NestJS Framework |
| `express` | Express.js |
| `fastify` | Fastify |
| `react`, `react-dom` | React |
| `vue` | Vue.js |
| `@angular/core` | Angular |
| `next` | Next.js |
| `typeorm` | TypeORM ORM |
| `prisma` | Prisma ORM |
| `sequelize` | Sequelize ORM |
| `mongoose` | MongoDB ODM |
| `pg` | PostgreSQL |
| `mysql2` | MySQL |
| `redis` | Redis |

#### Python (`requirements.txt`, `pyproject.toml`)

```
read_file {path}/requirements.txt
read_file {path}/pyproject.toml
```

| Dependency | Technology |
|------------|------------|
| `django` | Django Framework |
| `flask` | Flask Framework |
| `fastapi` | FastAPI Framework |
| `sqlalchemy` | SQLAlchemy ORM |
| `django-rest-framework` | DRF |
| `celery` | Task Queue |
| `psycopg2` | PostgreSQL |

#### Java (`pom.xml`, `build.gradle`)

```
read_file {path}/pom.xml
read_file {path}/build.gradle
```

| Dependency | Technology |
|------------|------------|
| `spring-boot` | Spring Boot |
| `spring-webflux` | Reactive Spring |
| `hibernate` | Hibernate ORM |
| `quarkus` | Quarkus |

#### Go (`go.mod`)

```
read_file {path}/go.mod
```

| Dependency | Technology |
|------------|------------|
| `gin-gonic/gin` | Gin Framework |
| `go-fiber/fiber` | Fiber Framework |
| `gorm.io/gorm` | GORM ORM |

### Database Detection

| Indicator | Database |
|-----------|----------|
| `.env` contains `POSTGRES`, `PG_` | PostgreSQL |
| `.env` contains `MYSQL`, `MARIADB` | MySQL/MariaDB |
| `.env` contains `MONGO` | MongoDB |
| `.env` contains `REDIS` | Redis |
| `docker-compose.yml` service `postgres:` | PostgreSQL |
| `docker-compose.yml` service `mysql:` | MySQL |
| `docker-compose.yml` service `mongo:` | MongoDB |

### Output

```yaml
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
```

---

## Phase 3: Architecture Discovery

### Objective

Identify architectural patterns based on discovered stack and code structure.

### Pattern Detection by Stack

#### NestJS (TypeScript)

```
grep "@Controller" {backend_path}/src
grep "@Injectable" {backend_path}/src
grep "@Entity" {backend_path}/src
list_dir {backend_path}/src/modules
```

| Structure Found | Pattern |
|-----------------|---------|
| `modules/*/controllers/`, `modules/*/services/` | CSED (Controller-Service-Entity-DTO) |
| `domain/`, `application/`, `infrastructure/` | Hexagonal / Clean Architecture |
| `modules/*/` with flat structure | Modular Monolith |

#### Django (Python)

```
grep "class.*View" {path}
grep "class.*Model" {path}
list_dir {path}/apps
```

| Structure Found | Pattern |
|-----------------|---------|
| `apps/*/views.py`, `apps/*/models.py` | MTV (Model-Template-View) |
| `domain/`, `services/` | DDD |

#### Spring Boot (Java)

```
grep "@RestController" {path}/src
grep "@Service" {path}/src
grep "@Repository" {path}/src
```

| Structure Found | Pattern |
|-----------------|---------|
| `controller/`, `service/`, `repository/` | Layered Architecture |
| `domain/`, `application/`, `infrastructure/` | Hexagonal |

#### React/Vue/Angular (Frontend)

```
list_dir {frontend_path}/src/components
list_dir {frontend_path}/src/pages
```

| Structure Found | Pattern |
|-----------------|---------|
| `atoms/`, `molecules/`, `organisms/` | Atomic Design |
| `components/`, `pages/`, `hooks/` | Feature-based |
| `features/*/` | Feature Slices |

### Output

```yaml
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
```

---

## Phase 4: Infrastructure Discovery

### Objective

Identify deployment infrastructure, external services, and cloud resources.

### Detection Sources

```
read_file docker-compose.yml
read_file Dockerfile
read_file .env.example
list_dir .github/workflows
list_dir infrastructure/
list_dir terraform/
list_dir k8s/
```

### Infrastructure Indicators

| File/Config | Infrastructure |
|-------------|----------------|
| `docker-compose.yml` | Docker Compose |
| `Dockerfile` | Containerized |
| `kubernetes/`, `k8s/` | Kubernetes |
| `terraform/` | Terraform IaC |
| `.github/workflows/` | GitHub Actions CI/CD |
| `gitlab-ci.yml` | GitLab CI/CD |
| `Jenkinsfile` | Jenkins CI/CD |
| `serverless.yml` | Serverless Framework |
| `vercel.json` | Vercel |
| `netlify.toml` | Netlify |

### External Services Detection

```
grep "S3\|AWS\|BUCKET" .env.example
grep "SMTP\|EMAIL\|MAIL" .env.example
grep "STRIPE\|PAYMENT" .env.example
grep "TWILIO\|SMS" .env.example
grep "FIREBASE\|FCM" .env.example
```

| Environment Variable Pattern | External Service |
|------------------------------|------------------|
| `AWS_*`, `S3_*` | AWS S3 / Cloud Storage |
| `SMTP_*`, `EMAIL_*`, `SENDGRID_*` | Email Service |
| `STRIPE_*`, `PAYPAL_*` | Payment Gateway |
| `TWILIO_*` | SMS Service |
| `FIREBASE_*`, `FCM_*` | Firebase / Push Notifications |
| `REDIS_*` | Redis Cache |
| `ELASTICSEARCH_*` | Elasticsearch |
| `RABBITMQ_*`, `AMQP_*` | Message Queue |

### Output

```yaml
infrastructure:
  deployment: "Docker Compose"
  ci_cd: "GitHub Actions"
  cloud_provider: "AWS"
  external_services:
    - name: "Email Service"
      type: "SMTP"
    - name: "File Storage"
      type: "S3 Compatible"
    - name: "Cache"
      type: "Redis"
```

---

## Phase 5: Component Mapping

### Objective

Map all discovered modules/components for diagram generation.

### Backend Component Discovery

Based on detected architecture pattern:

#### CSED Pattern (NestJS)

```
list_dir {backend_path}/src/modules
```

For each module:
```
list_dir {backend_path}/src/modules/{module}/controllers
list_dir {backend_path}/src/modules/{module}/services
list_dir {backend_path}/src/modules/{module}/entities
```

#### Layered Pattern (Spring, Django)

```
list_dir {backend_path}/src/main/java/**/controller
list_dir {backend_path}/src/main/java/**/service
list_dir {backend_path}/src/main/java/**/repository
```

### Frontend Component Discovery

```
list_dir {frontend_path}/src/pages
list_dir {frontend_path}/src/components
list_dir {frontend_path}/src/hooks
list_dir {frontend_path}/src/services
```

### Output

```yaml
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
  frontend:
    - name: "LoginPage"
      type: "page"
    - name: "Button"
      type: "atom"
```

---

## Phase 6: Diagram Strategy

### Objective

Define how to generate each C4 level based on discovered information.

### Strategy Matrix

| Discovered | Context Diagram | Container Diagram | Component Diagram |
|------------|-----------------|-------------------|-------------------|
| Single backend + frontend | System with 2 containers | Both containers shown | Separate per container |
| Microservices | System boundary | Each service as container | Per service |
| Monolith | Single system | Single container | All modules |
| Monorepo | Multiple systems or one | Multiple containers | Per application |

### Level-Specific Strategy

#### Context Diagram (Level 1)

- **System:** Use project name from config file
- **Users:** Extract from README, docs, or user-related code
- **External Systems:** From Phase 4 external services

#### Container Diagram (Level 2)

- **Containers:** One per detected application/service
- **Technologies:** From Phase 2 stack discovery
- **Databases:** From Phase 2 database detection
- **Relationships:** Based on API calls, imports

#### Component Diagram (Level 3)

- **Pattern-based:** Use architecture pattern from Phase 3
- **CSED:** Controller → Service → Entity flow
- **Layered:** Controller → Service → Repository → Database
- **Grouping:** By module/feature

### Output

```yaml
diagram_strategy:
  context:
    system_name: "TravelSplit"
    users:
      - "Travel Administrator"
      - "Trip Participant"
    external_systems:
      - "Email Service"
      - "File Storage"
  containers:
    - name: "Frontend Web App"
      technology: "React, Vite, Tailwind"
      type: "web"
    - name: "Backend API"
      technology: "NestJS, TypeORM"
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

## Discovery Summary Template

After completing all phases, generate this summary:

```markdown
# Discovery Summary

## Project Overview
- **Type:** [Monorepo | Single Project | Microservices]
- **Primary Language:** [TypeScript | Python | Java | Go | ...]

## Tech Stack

### Backend
| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Runtime | Node.js 22 |
| Framework | NestJS |
| ORM | TypeORM |
| Database | PostgreSQL |

### Frontend
| Category | Technology |
|----------|------------|
| Language | TypeScript |
| Framework | React |
| Build Tool | Vite |
| Styling | Tailwind CSS |

## Architecture
- **Backend Pattern:** CSED (Controller-Service-Entity-DTO)
- **Frontend Pattern:** Atomic Design

## Infrastructure
- **Deployment:** Docker Compose
- **CI/CD:** GitHub Actions

## External Systems
- Email Service (SMTP)
- File Storage (S3 Compatible)

## Modules Discovered

### Backend
| Module | Controller | Service | Entity |
|--------|------------|---------|--------|
| auth | AuthController | AuthService | - |
| users | UsersController | UsersService | User |
| trips | TripsController | TripsService | Trip |

### Frontend
| Type | Components |
|------|------------|
| Pages | LoginPage, HomePage, TripPage |
| Hooks | useAuth, useUser, useTrips |

## Diagram Strategy
- **Context:** Single system with 2 user types, 2 external systems
- **Container:** 3 containers (Frontend, Backend, Database)
- **Component Backend:** CSED pattern, grouped by module
- **Component Frontend:** Atomic pattern, grouped by type
```

---

## Validation Checkpoints

### Phase 1 Checkpoint
- [ ] Project type identified
- [ ] Primary language detected
- [ ] Directory structure mapped

### Phase 2 Checkpoint
- [ ] All config files read
- [ ] Frameworks identified
- [ ] Database detected
- [ ] Dependencies cataloged

### Phase 3 Checkpoint
- [ ] Architecture pattern identified
- [ ] Layers mapped
- [ ] Module structure understood

### Phase 4 Checkpoint
- [ ] Infrastructure detected
- [ ] External services identified
- [ ] CI/CD pipeline found

### Phase 5 Checkpoint
- [ ] All modules listed
- [ ] Components per module mapped
- [ ] Relationships identified

### Phase 6 Checkpoint
- [ ] Diagram strategy defined
- [ ] Level-specific approach documented
- [ ] Ready for generation
