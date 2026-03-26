# TravelSplit – Technical Data Dictionary (Core Domain)

## Purpose and source

This dictionary reflects the **PostgreSQL** schema created by TypeORM migrations under `Backend/src/migrations/`. There are **no `CHECK` constraints** defined in those migrations; validation of enumerated strings (e.g. trip `status`, participant `role`) is enforced primarily in the application layer unless the database adds them later.

## Database-level business rules (summary)

| Mechanism | Effect |
|-----------|--------|
| **Soft delete** | `deleted_at` nullable on domain tables that extend the shared entity pattern; rows are not physically removed by default when the app soft-deletes. |
| **Unique `(trip_id, user_id)`** | A user can appear at most once per trip as a participant (`UQ_trip_participants_trip_user`). |
| **`ON DELETE CASCADE`** | Removing a **trip** removes its **participants** and **expenses** (and **expense_splits** via expenses). Removing a **user** removes their **participant** rows, **expenses** where they are payer, and **expense_splits** where they appear. Removing an **expense** removes its **splits**. |
| **`ON DELETE RESTRICT`** | An **expense category** cannot be deleted while any **expense** still references it (`FK_expenses_category`). Protects referential integrity of categorized spend. |
| **Defaults** | Trip **currency** defaults to `COP`, **status** to `ACTIVE`; participant **role** defaults to `MEMBER`; category **is_active** defaults to `true`; UUID PKs use `gen_random_uuid()`; timestamps default to `CURRENT_TIMESTAMP`. |
| **Seed data** | Migration inserts five baseline rows into `expense_categories` (Comida, Transporte, Alojamiento, Entretenimiento, Varios). |

---

## Data dictionary (columns)

| Tabla | Campo | Tipo de dato | Llave (PK/FK) | Constraints (NOT NULL, UNIQUE, DEFAULT, CHECK) |
|-------|-------|--------------|---------------|--------------------------------------------------|
| `users` | `id` | `uuid` | **PK** | NOT NULL; DEFAULT `gen_random_uuid()` |
| `users` | `nombre` | `varchar(255)` | | NOT NULL |
| `users` | `email` | `varchar(255)` | | NOT NULL; **UNIQUE**; index `IDX_users_email` |
| `users` | `password_hash` | `varchar(255)` | | NOT NULL |
| `users` | `created_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `users` | `updated_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `users` | `deleted_at` | `timestamp` | | NULL allowed (soft delete) |
| `trips` | `id` | `uuid` | **PK** | NOT NULL; DEFAULT `gen_random_uuid()` |
| `trips` | `name` | `varchar(255)` | | NOT NULL |
| `trips` | `currency` | `varchar(3)` | | NOT NULL; DEFAULT `'COP'` |
| `trips` | `status` | `varchar(20)` | | NOT NULL; DEFAULT `'ACTIVE'` (app enums; no DB CHECK) |
| `trips` | `code` | `varchar(20)` | | NOT NULL; **UNIQUE**; index `IDX_trips_code` |
| `trips` | `created_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `trips` | `updated_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `trips` | `deleted_at` | `timestamp` | | NULL allowed (soft delete) |
| `trip_participants` | `id` | `uuid` | **PK** | NOT NULL; DEFAULT `gen_random_uuid()` |
| `trip_participants` | `trip_id` | `uuid` | **FK** → `trips.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_trip_participants_trip_id`; **UNIQUE** composite with `user_id` (`UQ_trip_participants_trip_user`) |
| `trip_participants` | `user_id` | `uuid` | **FK** → `users.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_trip_participants_user_id`; **UNIQUE** composite with `trip_id` (`UQ_trip_participants_trip_user`) |
| `trip_participants` | `role` | `varchar(20)` | | NOT NULL; DEFAULT `'MEMBER'` (app enums; no DB CHECK) |
| `trip_participants` | `created_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `trip_participants` | `updated_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `trip_participants` | `deleted_at` | `timestamp` | | NULL allowed (soft delete) |
| `expense_categories` | `id` | `integer` (auto-increment) | **PK** | NOT NULL; generated identity / serial |
| `expense_categories` | `name` | `varchar(50)` | | NOT NULL; **UNIQUE** (`UQ_expense_categories_name`); index `IDX_expense_categories_name` |
| `expense_categories` | `icon` | `varchar(50)` | | NULL allowed |
| `expense_categories` | `is_active` | `boolean` | | NOT NULL; DEFAULT `true` |
| `expenses` | `id` | `uuid` | **PK** | NOT NULL; DEFAULT `gen_random_uuid()` |
| `expenses` | `trip_id` | `uuid` | **FK** → `trips.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_expenses_trip_id` |
| `expenses` | `payer_id` | `uuid` | **FK** → `users.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_expenses_payer_id` |
| `expenses` | `category_id` | `integer` | **FK** → `expense_categories.id` | NOT NULL; **ON DELETE RESTRICT**; index `IDX_expenses_category_id` |
| `expenses` | `title` | `varchar(255)` | | NOT NULL |
| `expenses` | `amount` | `decimal(12,2)` | | NOT NULL |
| `expenses` | `receipt_url` | `varchar(500)` | | NULL allowed |
| `expenses` | `expense_date` | `date` | | NOT NULL |
| `expenses` | `created_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `expenses` | `updated_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `expenses` | `deleted_at` | `timestamp` | | NULL allowed (soft delete) |
| `expense_splits` | `id` | `uuid` | **PK** | NOT NULL; DEFAULT `gen_random_uuid()` |
| `expense_splits` | `expense_id` | `uuid` | **FK** → `expenses.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_expense_splits_expense_id` |
| `expense_splits` | `user_id` | `uuid` | **FK** → `users.id` | NOT NULL; **ON DELETE CASCADE**; index `IDX_expense_splits_user_id` |
| `expense_splits` | `amount_owed` | `decimal(12,2)` | | NOT NULL |
| `expense_splits` | `created_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `expense_splits` | `updated_at` | `timestamp` | | NOT NULL; DEFAULT `CURRENT_TIMESTAMP` |
| `expense_splits` | `deleted_at` | `timestamp` | | NULL allowed (soft delete) |

## Related artifacts

- Entity-relationship overview: [`data-model-erd.md`](./data-model-erd.md)
- Migration source files: `Backend/src/migrations/1735689599000-CreateUsersTable.ts` through `1735689604000-CreateExpenseSplitsTable.ts`
