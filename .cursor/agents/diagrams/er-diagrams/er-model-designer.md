# ER Model Designer

## Purpose

Design a complete, normalized data model from requirements as an expert Data Architect. This sub-agent takes the Requirements Summary from `@er-doc-analyzer.md` and produces a professional-grade database design following industry best practices.

---

## Input Requirements

This sub-agent requires the **Requirements Summary** from `@er-doc-analyzer.md`:

```yaml
Required fields:
  - entities: list of entity hints
  - business_rules: constraints and rules
  - relationships: relationship hints
```

---

## Design Process

### Phase 1: Entity Identification and Classification

#### 1.1 Classify Entity Types

| Entity Type | Description | Example |
|-------------|-------------|---------|
| **Strong Entity** | Independent, has own PK | User, Trip, Expense |
| **Weak Entity** | Depends on strong entity | ExpenseSplit (depends on Expense) |
| **Junction Table** | Resolves M:N relationships | TripParticipant |
| **Lookup Table** | Reference/catalog data | ExpenseCategory |
| **Audit Entity** | Tracks changes/history | AuditLog |

#### 1.2 Entity Naming Conventions

| Convention | Rule | Example |
|------------|------|---------|
| Table Name | snake_case, plural | `users`, `trip_participants` |
| Entity Name | PascalCase, singular | `User`, `TripParticipant` |
| Junction Tables | Both entity names | `trip_participants`, `expense_splits` |

### Phase 2: Attribute Definition

#### 2.1 Standard Attribute Types

| Concept | SQL Type | Notes |
|---------|----------|-------|
| Identifier | `UUID` | Preferred for PKs |
| Short Text | `VARCHAR(n)` | Names, codes, titles |
| Long Text | `TEXT` | Descriptions, content |
| Email | `VARCHAR(255)` | With format validation |
| Password | `VARCHAR(255)` | Hashed, never plain |
| Money | `DECIMAL(12,2)` | Financial amounts |
| Integer | `INTEGER` | Counts, quantities |
| Boolean | `BOOLEAN` | Flags, status |
| Date | `DATE` | Calendar dates |
| Timestamp | `TIMESTAMP` | Date and time |
| Enum | `VARCHAR(20)` | Status, type, role |
| URL | `VARCHAR(500)` | Links, file paths |

#### 2.2 Common Column Patterns

| Pattern | Columns | Purpose |
|---------|---------|---------|
| **Audit** | `created_at`, `updated_at` | Track record lifecycle |
| **Soft Delete** | `deleted_at` | Logical deletion |
| **Status** | `is_active`, `status` | Record state |
| **Ownership** | `created_by`, `owner_id` | Record ownership |

#### 2.3 Attribute Constraints

| Constraint | When to Use | SQL |
|------------|-------------|-----|
| `PRIMARY KEY` | Every table must have one | `PRIMARY KEY` |
| `NOT NULL` | Required fields | `NOT NULL` |
| `UNIQUE` | Business keys, emails | `UNIQUE` |
| `FOREIGN KEY` | Relationships | `REFERENCES table(column)` |
| `DEFAULT` | Auto-populated values | `DEFAULT value` |
| `CHECK` | Value validation | `CHECK (condition)` |
| `INDEX` | Frequently queried columns | `CREATE INDEX` |

### Phase 3: Key Design

#### 3.1 Primary Key Strategy

| Strategy | Type | Use Case |
|----------|------|----------|
| **UUID** | `uuid` | Distributed systems, security |
| **Auto-increment** | `SERIAL` | Simple, sequential |
| **Composite** | Multiple columns | Junction tables (optional) |

**Recommendation:** Use UUID for all main entities for:
- Security (non-guessable IDs)
- Distributed generation
- Easy data migration

#### 3.2 Foreign Key Design

| Rule | Example |
|------|---------|
| Name: `{table_singular}_id` | `user_id`, `trip_id` |
| Always reference PK | `REFERENCES users(id)` |
| Define ON DELETE action | `ON DELETE CASCADE` or `SET NULL` |
| Create index on FK | Improves join performance |

#### 3.3 Unique Key / Natural Key

Identify business-level unique identifiers:

| Entity | Natural Key | Purpose |
|--------|-------------|---------|
| User | `email` | Login identifier |
| Trip | `invite_code` | Shareable join code |
| ExpenseCategory | `name` | Category lookup |

### Phase 4: Relationship Modeling

#### 4.1 Cardinality Determination

| Relationship | Cardinality | Implementation |
|--------------|-------------|----------------|
| User creates Trip | 1:N | FK `created_by` in Trip |
| Trip has Expenses | 1:N | FK `trip_id` in Expense |
| User pays Expense | 1:N | FK `payer_id` in Expense |
| User participates in Trip | M:N | Junction: TripParticipant |
| Expense split among Users | M:N | Junction: ExpenseSplit |

#### 4.2 Junction Table Design

For M:N relationships, create junction tables with:

```yaml
junction_table:
  name: "{entity1}_{entity2}s"  # or domain-specific name
  columns:
    - id: UUID (PK) - optional, can use composite PK
    - entity1_id: FK
    - entity2_id: FK
    - additional_attributes: if needed
    - created_at: TIMESTAMP
  constraints:
    - UNIQUE(entity1_id, entity2_id) - prevent duplicates
```

#### 4.3 Self-Referencing Relationships

For hierarchical data (e.g., categories, org structure):

```yaml
self_reference:
  column: "parent_id"
  references: "same_table(id)"
  constraint: "parent_id != id"  # prevent self-loop
```

### Phase 5: Normalization Assessment

#### 5.1 First Normal Form (1NF)

**Requirements:**
- All columns contain atomic (indivisible) values
- No repeating groups or arrays
- Each row is unique (has PK)

**Violations to Fix:**
- Multi-valued attributes -> Create separate table
- Composite attributes -> Split into individual columns

#### 5.2 Second Normal Form (2NF)

**Requirements:**
- Must be in 1NF
- No partial dependencies (for composite PKs)
- All non-key attributes depend on the entire PK

**Violations to Fix:**
- Partial dependency -> Move to separate table

#### 5.3 Third Normal Form (3NF)

**Requirements:**
- Must be in 2NF
- No transitive dependencies
- Non-key attributes depend only on PK, not on other non-key attributes

**Violations to Fix:**
- Transitive dependency -> Create lookup table

#### 5.4 Denormalization Decisions

Sometimes denormalization is justified for:

| Reason | Example | Trade-off |
|--------|---------|-----------|
| Read Performance | Caching totals | Write complexity |
| Reduced Joins | Embedding names | Data duplication |
| Historical Data | Snapshot at time | Storage increase |

**Document all denormalization decisions with justification.**

### Phase 6: Model Output

Generate the complete model design:

```yaml
model_design:
  metadata:
    designed_by: "ER Data Architect Agent"
    mode: "DESIGN"
    normalization_level: "3NF"
    timestamp: "2026-01-15T12:00:00Z"
  
  entities:
    - name: "User"
      table_name: "users"
      type: "strong"
      description: "Registered user of the system"
      
      columns:
        - name: "id"
          type: "UUID"
          constraints: ["PRIMARY KEY"]
          default: "uuid_generate_v4()"
          
        - name: "email"
          type: "VARCHAR(255)"
          constraints: ["UNIQUE", "NOT NULL"]
          index: true
          
        - name: "password_hash"
          type: "VARCHAR(255)"
          constraints: ["NOT NULL"]
          
        - name: "first_name"
          type: "VARCHAR(100)"
          constraints: ["NOT NULL"]
          
        - name: "last_name"
          type: "VARCHAR(100)"
          constraints: ["NOT NULL"]
          
        - name: "is_active"
          type: "BOOLEAN"
          constraints: ["NOT NULL"]
          default: "true"
          
        - name: "created_at"
          type: "TIMESTAMP"
          constraints: ["NOT NULL"]
          default: "CURRENT_TIMESTAMP"
          
        - name: "updated_at"
          type: "TIMESTAMP"
          constraints: ["NOT NULL"]
          default: "CURRENT_TIMESTAMP"
          
        - name: "deleted_at"
          type: "TIMESTAMP"
          constraints: ["NULLABLE"]
      
      primary_key: "id"
      unique_keys: ["email"]
      indexes: ["email"]
      
    - name: "Trip"
      table_name: "trips"
      type: "strong"
      description: "A group trip for expense sharing"
      
      columns:
        - name: "id"
          type: "UUID"
          constraints: ["PRIMARY KEY"]
          
        - name: "name"
          type: "VARCHAR(255)"
          constraints: ["NOT NULL"]
          
        - name: "description"
          type: "TEXT"
          constraints: ["NULLABLE"]
          
        - name: "invite_code"
          type: "VARCHAR(20)"
          constraints: ["UNIQUE", "NOT NULL"]
          index: true
          
        - name: "status"
          type: "VARCHAR(20)"
          constraints: ["NOT NULL"]
          default: "'ACTIVE'"
          check: "status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')"
          
        - name: "created_by"
          type: "UUID"
          constraints: ["NOT NULL"]
          foreign_key:
            references: "users(id)"
            on_delete: "RESTRICT"
          
        - name: "created_at"
          type: "TIMESTAMP"
          constraints: ["NOT NULL"]
          default: "CURRENT_TIMESTAMP"
          
        - name: "updated_at"
          type: "TIMESTAMP"
          constraints: ["NOT NULL"]
          default: "CURRENT_TIMESTAMP"
          
        - name: "deleted_at"
          type: "TIMESTAMP"
          constraints: ["NULLABLE"]
      
      primary_key: "id"
      unique_keys: ["invite_code"]
      foreign_keys:
        - column: "created_by"
          references: "users(id)"
      indexes: ["invite_code", "created_by"]
      
    - name: "TripParticipant"
      table_name: "trip_participants"
      type: "junction"
      description: "Junction table for User-Trip M:N relationship"
      connects: ["User", "Trip"]
      
      columns:
        - name: "id"
          type: "UUID"
          constraints: ["PRIMARY KEY"]
          
        - name: "trip_id"
          type: "UUID"
          constraints: ["NOT NULL"]
          foreign_key:
            references: "trips(id)"
            on_delete: "CASCADE"
          
        - name: "user_id"
          type: "UUID"
          constraints: ["NOT NULL"]
          foreign_key:
            references: "users(id)"
            on_delete: "CASCADE"
          
        - name: "role"
          type: "VARCHAR(20)"
          constraints: ["NOT NULL"]
          default: "'MEMBER'"
          check: "role IN ('CREATOR', 'MEMBER')"
          
        - name: "joined_at"
          type: "TIMESTAMP"
          constraints: ["NOT NULL"]
          default: "CURRENT_TIMESTAMP"
          
        - name: "is_active"
          type: "BOOLEAN"
          constraints: ["NOT NULL"]
          default: "true"
      
      primary_key: "id"
      unique_keys: [["trip_id", "user_id"]]
      foreign_keys:
        - column: "trip_id"
          references: "trips(id)"
        - column: "user_id"
          references: "users(id)"
      indexes: ["trip_id", "user_id"]
  
  relationships:
    - name: "user_creates_trip"
      from: "User"
      to: "Trip"
      cardinality: "1:N"
      foreign_key: "created_by"
      
    - name: "user_participates_trip"
      from: "User"
      to: "Trip"
      cardinality: "M:N"
      through: "TripParticipant"
      
    - name: "trip_has_expenses"
      from: "Trip"
      to: "Expense"
      cardinality: "1:N"
      foreign_key: "trip_id"
  
  normalization_notes:
    - level: "3NF"
      violations: []
      denormalizations:
        - table: "none"
          reason: "No intentional denormalization required"
```

---

## Design Best Practices Applied

### Data Integrity

- All tables have a single-column UUID primary key
- Foreign keys are properly defined with referential actions
- Unique constraints on business keys
- NOT NULL on required fields

### Audit Trail

- `created_at` on all tables
- `updated_at` on modifiable tables
- `deleted_at` for soft delete support

### Performance

- Indexes on foreign keys
- Indexes on frequently queried columns
- Composite unique constraints instead of composite PKs

### Security

- Password stored as hash, never plain text
- UUIDs prevent ID enumeration attacks
- Soft delete preserves data for audit

---

## Validation Checkpoints

Before finalizing the design, verify:

- [ ] All entities have a UUID primary key
- [ ] All required fields are NOT NULL
- [ ] All foreign keys reference valid PKs
- [ ] All M:N relationships have junction tables
- [ ] Audit columns (created_at, updated_at) present
- [ ] Soft delete column (deleted_at) where required
- [ ] No 1NF, 2NF, or 3NF violations (unless justified)
- [ ] Indexes defined for FKs and frequent queries
- [ ] Naming conventions are consistent

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Ambiguous entity | Request clarification from user |
| Missing relationship info | Infer from context, mark for review |
| Conflicting requirements | Document conflict, propose resolution |
| Complex hierarchy | Suggest self-referencing or separate tables |
| Performance concern | Document potential denormalization |
