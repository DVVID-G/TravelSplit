# ER Code Extractor

## Purpose

Extract data model information from existing code in a stack-agnostic manner. This sub-agent reads entity/model files and extracts entities, properties, types, keys, and relationships.

---

## Input Requirements

This sub-agent requires the **Stack Summary** from `@er-stack-detector.md`:

```yaml
Required fields:
  - orm: "TypeORM"
  - entity_pattern: "*.entity.ts"
  - entity_locations: ["Backend/src/modules/*/entities/"]
  - relationship_decorators: {...}
  - column_decorators: {...}
```

---

## Extraction Process

### Phase 1: Locate Entity Files

Using the Stack Summary, find all entity files:

```bash
# Based on entity_locations from Stack Summary
glob_search "{entity_location}/{entity_pattern}"

# Example for TypeORM:
glob_search "Backend/src/modules/*/entities/*.entity.ts"
glob_search "Backend/src/common/entities/*.entity.ts"
```

### Phase 2: Parse Each Entity

For each entity file, extract:

1. **Entity Name** - Class/model name
2. **Table Name** - Database table name (if specified)
3. **Properties** - All columns/fields
4. **Primary Key** - PK field(s)
5. **Foreign Keys** - FK references
6. **Relationships** - Relations to other entities
7. **Inheritance** - Base class if any

### Phase 3: Build Entity Summary

Compile all extracted information into a structured format.

---

## Extraction Patterns by ORM

### TypeORM Extraction

```typescript
// Source Pattern
@Entity('table_name')
export class EntityName extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => Parent, (parent) => parent.children)
  @JoinColumn({ name: 'parent_id' })
  parent!: Parent;

  @OneToMany(() => Child, (child) => child.entity)
  children!: Child[];
}
```

**Extraction Rules:**

| Decorator | Extracted As |
|-----------|--------------|
| `@Entity('name')` | Table name |
| `@PrimaryGeneratedColumn` | Primary Key |
| `@Column()` | Regular column |
| `@CreateDateColumn` | Audit column (created_at) |
| `@UpdateDateColumn` | Audit column (updated_at) |
| `@DeleteDateColumn` | Soft delete column |
| `@Index()` | Indexed column |
| `@ManyToOne` | FK relationship (N:1) |
| `@OneToMany` | Inverse relationship (1:N) |
| `@OneToOne` | One-to-one relationship |
| `@ManyToMany` | Many-to-many relationship |
| `@JoinColumn` | FK column name |
| `extends BaseEntity` | Inherited properties |

### Prisma Extraction

```prisma
// Source Pattern
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now()) @map("created_at")
  deletedAt DateTime? @map("deleted_at")
  
  posts     Post[]
  profile   Profile?
  
  @@map("users")
  @@index([email])
}
```

**Extraction Rules:**

| Directive | Extracted As |
|-----------|--------------|
| `model Name` | Entity name |
| `@@map("table")` | Table name |
| `@id` | Primary Key |
| `@unique` | Unique constraint |
| `@default()` | Default value |
| `@map("column")` | Column name |
| `Type[]` | One-to-many relationship |
| `Type?` | Optional one-to-one |
| `@relation` | Foreign key definition |
| `@@index` | Index definition |

### Django ORM Extraction

```python
# Source Pattern
class User(models.Model):
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'users'
        indexes = [models.Index(fields=['email'])]

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
```

**Extraction Rules:**

| Pattern | Extracted As |
|---------|--------------|
| `class Name(models.Model)` | Entity name |
| `db_table = 'name'` | Table name |
| `models.AutoField` / implicit id | Primary Key |
| `unique=True` | Unique constraint |
| `ForeignKey()` | FK relationship (N:1) |
| `ManyToManyField()` | M:N relationship |
| `OneToOneField()` | 1:1 relationship |
| `related_name` | Inverse relationship name |
| `null=True` | Nullable column |

### SQLAlchemy Extraction

```python
# Source Pattern
class User(Base):
    __tablename__ = 'users'
    
    id = Column(UUID, primary_key=True, default=uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    
    posts = relationship("Post", back_populates="author")
```

**Extraction Rules:**

| Pattern | Extracted As |
|---------|--------------|
| `class Name(Base)` | Entity name |
| `__tablename__` | Table name |
| `primary_key=True` | Primary Key |
| `ForeignKey('table.column')` | Foreign Key |
| `relationship()` | Relationship definition |
| `back_populates` | Bidirectional relationship |
| `unique=True` | Unique constraint |
| `nullable=False` | NOT NULL constraint |
| `index=True` | Indexed column |

### Sequelize Extraction

```typescript
// Source Pattern
@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @Column(DataType.STRING(255))
  email!: string;

  @HasMany(() => Post)
  posts!: Post[];
}
```

**Extraction Rules:**

| Decorator | Extracted As |
|-----------|--------------|
| `@Table({ tableName })` | Table name |
| `@PrimaryKey` | Primary Key |
| `@Column(DataType)` | Column with type |
| `@Unique` | Unique constraint |
| `@ForeignKey` | Foreign Key |
| `@BelongsTo` | N:1 relationship |
| `@HasMany` | 1:N relationship |
| `@HasOne` | 1:1 relationship |
| `@BelongsToMany` | M:N relationship |

---

## Entity Summary Output Format

Generate an Entity Summary for each entity:

```yaml
entities:
  - name: "User"
    table_name: "users"
    source_file: "Backend/src/modules/users/entities/user.entity.ts"
    inherits_from: "BaseEntity"
    
    properties:
      - name: "id"
        type: "UUID"
        db_type: "uuid"
        constraints:
          - "PRIMARY KEY"
        
      - name: "email"
        type: "string"
        db_type: "VARCHAR(255)"
        constraints:
          - "UNIQUE"
          - "NOT NULL"
          - "INDEX"
        
      - name: "name"
        type: "string"
        db_type: "VARCHAR(100)"
        constraints:
          - "NOT NULL"
        
      - name: "createdAt"
        column_name: "created_at"
        type: "Date"
        db_type: "TIMESTAMP"
        constraints:
          - "DEFAULT CURRENT_TIMESTAMP"
        
      - name: "deletedAt"
        column_name: "deleted_at"
        type: "Date | null"
        db_type: "TIMESTAMP"
        constraints:
          - "NULLABLE"
    
    primary_key:
      column: "id"
      type: "UUID"
      generation: "auto"
    
    foreign_keys: []
    
    relationships:
      - name: "trips"
        type: "OneToMany"
        target_entity: "Trip"
        inverse_property: "creator"

  - name: "Trip"
    table_name: "trips"
    source_file: "Backend/src/modules/trips/entities/trip.entity.ts"
    inherits_from: "BaseEntity"
    
    properties:
      - name: "id"
        type: "UUID"
        db_type: "uuid"
        constraints:
          - "PRIMARY KEY"
        
      - name: "name"
        type: "string"
        db_type: "VARCHAR(255)"
        constraints:
          - "NOT NULL"
        
      - name: "code"
        type: "string"
        db_type: "VARCHAR(20)"
        constraints:
          - "UNIQUE"
          - "NOT NULL"
    
    primary_key:
      column: "id"
      type: "UUID"
    
    foreign_keys:
      - column: "created_by"
        references:
          table: "users"
          column: "id"
    
    relationships:
      - name: "participants"
        type: "OneToMany"
        target_entity: "TripParticipant"
        inverse_property: "trip"
```

---

## Inheritance Resolution

When an entity extends a base class, merge inherited properties:

### Step 1: Identify Base Entity

```typescript
// BaseEntity provides common fields
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;
}
```

### Step 2: Merge Properties

For entities that `extends BaseEntity`:
1. Include all base entity properties
2. Mark them as `inherited: true`
3. Do not duplicate in diagram (show inheritance)

---

## Relationship Cardinality Detection

| ORM Pattern | Cardinality | Notation |
|-------------|-------------|----------|
| `@OneToOne` | 1:1 | `\|\|--\|\|` |
| `@OneToMany` / `@ManyToOne` | 1:N | `\|\|--o{` |
| `@ManyToMany` | M:N | `}o--o{` |
| `ForeignKey` (Django) | N:1 | `}o--\|\|` |
| `relationship()` + `ForeignKey` | Depends | Check both sides |

---

## Validation Checkpoints

After extraction, verify:

- [ ] All entity files were processed
- [ ] Each entity has at least one primary key
- [ ] All foreign keys reference existing entities
- [ ] Relationships are properly paired (both sides defined)
- [ ] Column types are correctly mapped
- [ ] Constraints are properly identified
- [ ] Inheritance is resolved

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Entity file parse error | Log error, continue with others |
| Unknown column type | Map to generic type, add warning |
| Circular relationship | Detect and document |
| Missing FK target | Add warning to summary |
| Unparseable decorator | Skip and add to warnings |
