# ER Stack Detector

## Purpose

Detect the technology stack of any project to enable stack-agnostic entity extraction. This sub-agent identifies the language, framework, ORM, and database type used in the project.

---

## Detection Process

### Phase 1: Language Detection

Identify the primary programming language:

```
Search for configuration files:
- package.json -> JavaScript/TypeScript
- requirements.txt, pyproject.toml, setup.py -> Python
- pom.xml, build.gradle -> Java
- go.mod -> Go
- Cargo.toml -> Rust
- composer.json -> PHP
- Gemfile -> Ruby
- *.csproj, *.sln -> C# / .NET
```

### Phase 2: Framework Detection

Identify the backend framework based on dependencies:

| Config File | Dependency Pattern | Framework |
|-------------|-------------------|-----------|
| `package.json` | `@nestjs/*` | NestJS |
| `package.json` | `express` | Express.js |
| `package.json` | `fastify` | Fastify |
| `package.json` | `@hapi/hapi` | Hapi |
| `requirements.txt` | `django` | Django |
| `requirements.txt` | `flask` | Flask |
| `requirements.txt` | `fastapi` | FastAPI |
| `pom.xml` | `spring-boot` | Spring Boot |
| `build.gradle` | `org.springframework.boot` | Spring Boot |
| `go.mod` | `github.com/gin-gonic/gin` | Gin |
| `go.mod` | `github.com/gofiber/fiber` | Fiber |

### Phase 3: ORM/ODM Detection

Identify the data access layer:

| Indicator | ORM/ODM | Language |
|-----------|---------|----------|
| `typeorm` in package.json | TypeORM | TypeScript |
| `@prisma/client` in package.json | Prisma | TypeScript |
| `sequelize` in package.json | Sequelize | TypeScript/JS |
| `mongoose` in package.json | Mongoose | TypeScript/JS |
| `mikro-orm` in package.json | MikroORM | TypeScript |
| `sqlalchemy` in requirements.txt | SQLAlchemy | Python |
| `django.db` imports | Django ORM | Python |
| `tortoise-orm` in requirements.txt | Tortoise ORM | Python |
| `spring-data-jpa` in pom.xml | Spring Data JPA | Java |
| `hibernate` in pom.xml | Hibernate | Java |
| `gorm.io/gorm` in go.mod | GORM | Go |
| `ent` in go.mod | Ent | Go |

### Phase 4: Database Type Detection

Identify the database type:

| Indicator | Database Type | Database |
|-----------|--------------|----------|
| `pg`, `postgres` in dependencies | SQL | PostgreSQL |
| `mysql`, `mysql2` in dependencies | SQL | MySQL |
| `sqlite3` in dependencies | SQL | SQLite |
| `mssql` in dependencies | SQL | SQL Server |
| `mongodb`, `mongoose` in dependencies | NoSQL | MongoDB |
| `redis` in dependencies | Cache/NoSQL | Redis |
| `docker-compose.yml` with `postgres:` | SQL | PostgreSQL |
| `docker-compose.yml` with `mysql:` | SQL | MySQL |
| `docker-compose.yml` with `mongo:` | NoSQL | MongoDB |
| `.env` with `POSTGRES`, `PG_` | SQL | PostgreSQL |
| `.env` with `MONGO` | NoSQL | MongoDB |

### Phase 5: Entity File Pattern Detection

Identify where entities/models are located:

| ORM | File Pattern | Typical Location |
|-----|--------------|------------------|
| TypeORM | `*.entity.ts` | `src/modules/*/entities/`, `src/entities/` |
| Prisma | `schema.prisma` | `prisma/schema.prisma` |
| Sequelize | `*.model.ts`, `*.model.js` | `src/models/`, `models/` |
| Mongoose | `*.schema.ts` | `src/schemas/`, `src/models/` |
| Django | `models.py` | `*/models.py`, `apps/*/models.py` |
| SQLAlchemy | `models.py`, `*.py` with Base | `src/models/`, `app/models/` |
| Spring JPA | `*.java` with @Entity | `src/main/java/**/entity/`, `**/model/` |
| GORM | `*.go` with gorm tags | `internal/models/`, `models/` |

---

## Detection Commands

Execute these commands to gather stack information:

```bash
# Phase 1: Check for config files
list_dir .

# Phase 2-3: Read package manager files
read_file package.json           # Node.js
read_file requirements.txt       # Python
read_file pyproject.toml         # Python (modern)
read_file pom.xml                # Java Maven
read_file build.gradle           # Java Gradle
read_file go.mod                 # Go

# Phase 4: Check database configuration
read_file docker-compose.yml
read_file .env.example
read_file .env.local

# Phase 5: Find entity files
glob_search "*.entity.ts"
glob_search "schema.prisma"
glob_search "models.py"
glob_search "**/entities/*.ts"
```

---

## Output Format

Generate a Stack Summary in this format:

```yaml
stack_summary:
  # Language Information
  language: "TypeScript"
  language_version: "5.6+"
  
  # Framework Information
  framework: "NestJS"
  framework_version: "11.x"
  
  # ORM/ODM Information
  orm: "TypeORM"
  orm_version: "0.3.x"
  orm_type: "ORM"  # ORM | ODM
  
  # Database Information
  database_type: "SQL"  # SQL | NoSQL
  database: "PostgreSQL"
  database_version: "17"
  
  # Entity Detection
  entity_pattern: "*.entity.ts"
  entity_decorator: "@Entity()"
  entity_locations:
    - "Backend/src/modules/*/entities/"
    - "Backend/src/common/entities/"
  
  # Relationship Decorators (for extraction phase)
  relationship_decorators:
    one_to_one: "@OneToOne"
    one_to_many: "@OneToMany"
    many_to_one: "@ManyToOne"
    many_to_many: "@ManyToMany"
  
  # Column Decorators
  column_decorators:
    primary_key: "@PrimaryGeneratedColumn"
    column: "@Column"
    create_date: "@CreateDateColumn"
    update_date: "@UpdateDateColumn"
    delete_date: "@DeleteDateColumn"
```

---

## Stack-Specific Extraction Guides

### TypeORM (TypeScript)

```typescript
// Entity Detection
@Entity('table_name')
export class EntityName extends BaseEntity {
  
  // Primary Key
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  // Regular Column
  @Column({ type: 'varchar', length: 255 })
  name!: string;
  
  // Relationships
  @OneToMany(() => Related, (related) => related.entity)
  relations!: Related[];
  
  @ManyToOne(() => Parent, (parent) => parent.children)
  parent!: Parent;
}
```

### Prisma (TypeScript)

```prisma
// Entity Detection
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  posts     Post[]   // One-to-Many
  profile   Profile? // One-to-One
}

model Post {
  id       String @id @default(uuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String // Foreign Key
}
```

### Django (Python)

```python
# Entity Detection
class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'users'

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
```

### SQLAlchemy (Python)

```python
# Entity Detection
class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID, primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(UUID, primary_key=True)
    author_id = Column(UUID, ForeignKey('users.id'))
    author = relationship("User", back_populates="posts")
```

### Spring Data JPA (Java)

```java
// Entity Detection
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(unique = true)
    private String email;
    
    @OneToMany(mappedBy = "author")
    private List<Post> posts;
}
```

### GORM (Go)

```go
// Entity Detection
type User struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key"`
    Email     string    `gorm:"uniqueIndex"`
    Name      string
    Posts     []Post    `gorm:"foreignKey:AuthorID"`
    CreatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}
```

---

## Validation Checkpoints

After detection, verify:

- [ ] Language identified from config file
- [ ] Framework identified from dependencies
- [ ] ORM/ODM identified and version noted
- [ ] Database type determined (SQL/NoSQL)
- [ ] Entity file pattern established
- [ ] At least one entity location found
- [ ] Relationship decorators documented
- [ ] Column/field decorators documented

---

## Error Handling

| Scenario | Action |
|----------|--------|
| No config files found | Ask user for project type |
| Multiple ORMs detected | Ask user which is primary |
| No entity files found | Switch to Design Mode |
| Unknown ORM | Provide generic extraction based on patterns |
| Mixed stack (monorepo) | Detect per-project and aggregate |
