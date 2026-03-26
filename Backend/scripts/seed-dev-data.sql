-- =============================================================================
-- TravelSplit – Development seed data (PostgreSQL)
-- =============================================================================
-- Run after all TypeORM migrations (including expense_categories seed).
--
-- Prerequisites:
--   - Database created; migrations applied (`npm run migration:run` from Backend/).
--   - Uses existing expense_categories rows id 1–5 from migration
--     1735689602000-CreateExpenseCategoriesTable.
--
-- Login hint (all seeded users share this password for local dev only):
--   Password: ViajeBogota2025!
--   (bcrypt cost 10, generated with the same rounds as UsersService)
--
-- Idempotency: safe to re-run if you truncate domain tables first in DEV ONLY.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1) users (no FKs) – five travelers with realistic Latin American names
-- -----------------------------------------------------------------------------
INSERT INTO users (id, nombre, email, password_hash, created_at, updated_at, deleted_at)
VALUES
  (
    'a1000000-0000-4000-8000-000000000001',
    'Ana Ruiz',
    'ana.ruiz.travel@example.com',
    '$2b$10$SdepxrVAWTDUR1YsKToZx.lYdJIDWzKu5Fuv/J1No9To1qFaTP8Pu',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'a1000000-0000-4000-8000-000000000002',
    'Carlos Méndez',
    'carlos.mendez.travel@example.com',
    '$2b$10$SdepxrVAWTDUR1YsKToZx.lYdJIDWzKu5Fuv/J1No9To1qFaTP8Pu',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'a1000000-0000-4000-8000-000000000003',
    'Laura Soto',
    'laura.soto.travel@example.com',
    '$2b$10$SdepxrVAWTDUR1YsKToZx.lYdJIDWzKu5Fuv/J1No9To1qFaTP8Pu',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'a1000000-0000-4000-8000-000000000004',
    'Diego Herrera',
    'diego.herrera.travel@example.com',
    '$2b$10$SdepxrVAWTDUR1YsKToZx.lYdJIDWzKu5Fuv/J1No9To1qFaTP8Pu',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'a1000000-0000-4000-8000-000000000005',
    'Elena Vargas',
    'elena.vargas.travel@example.com',
    '$2b$10$SdepxrVAWTDUR1YsKToZx.lYdJIDWzKu5Fuv/J1No9To1qFaTP8Pu',
    NOW(),
    NOW(),
    NULL
  )
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2) trips (no FK to users in schema) – five distinct trips, unique codes
-- -----------------------------------------------------------------------------
INSERT INTO trips (id, name, currency, status, code, created_at, updated_at, deleted_at)
VALUES
  (
    'b2000000-0000-4000-8000-000000000001',
    'Fin de semana histórico en Cartagena',
    'COP',
    'ACTIVE',
    'TRP-CTG-7K2M',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'b2000000-0000-4000-8000-000000000002',
    'Retiro de equipo Q1 – Medellín',
    'COP',
    'ACTIVE',
    'TRP-MDE-9P1Q',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'b2000000-0000-4000-8000-000000000003',
    'Trekking y kayak en Patagonia',
    'USD',
    'ACTIVE',
    'TRP-PAT-3N8R',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'b2000000-0000-4000-8000-000000000004',
    'Cena fin de año – restaurantes Bogotá',
    'COP',
    'ACTIVE',
    'TRP-BOG-5L4W',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'b2000000-0000-4000-8000-000000000005',
    'Semana playa Santa Marta',
    'COP',
    'ACTIVE',
    'TRP-SMR-2H6J',
    NOW(),
    NOW(),
    NULL
  )
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3) trip_participants – memberships (unique per trip_id + user_id)
-- -----------------------------------------------------------------------------
INSERT INTO trip_participants (
  id,
  trip_id,
  user_id,
  role,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  ('c3000000-0000-4000-8000-000000000001', 'b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'CREATOR', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000002', 'b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000002', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000003', 'b2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000003', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000004', 'b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', 'CREATOR', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000005', 'b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000004', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000006', 'b2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000005', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000007', 'b2000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000004', 'CREATOR', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000008', 'b2000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000001', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000009', 'b2000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000003', 'CREATOR', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000010', 'b2000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000005', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000011', 'b2000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000001', 'CREATOR', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000012', 'b2000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000002', 'MEMBER', NOW(), NOW(), NULL),
  ('c3000000-0000-4000-8000-000000000013', 'b2000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000003', 'MEMBER', NOW(), NOW(), NULL)
ON CONFLICT (trip_id, user_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4) expenses – category_id 1–5 must exist (migration seed)
-- -----------------------------------------------------------------------------
INSERT INTO expenses (
  id,
  trip_id,
  payer_id,
  category_id,
  title,
  amount,
  receipt_url,
  expense_date,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  (
    'd4000000-0000-4000-8000-000000000001',
    'b2000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    2,
    'Vuelos ida y vuelta Bogotá–Cartagena (reserva grupal)',
    1890000.00,
    NULL,
    '2025-02-14',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'd4000000-0000-4000-8000-000000000002',
    'b2000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000002',
    1,
    'Almuerzo en La Cevichería – Getsemaní',
    285000.00,
    NULL,
    '2025-02-15',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'd4000000-0000-4000-8000-000000000003',
    'b2000000-0000-4000-8000-000000000002',
    'a1000000-0000-4000-8000-000000000002',
    3,
    'Hotel El Poblado – 3 noches facturadas a empresa',
    2450000.00,
    NULL,
    '2025-03-02',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'd4000000-0000-4000-8000-000000000004',
    'b2000000-0000-4000-8000-000000000003',
    'a1000000-0000-4000-8000-000000000004',
    4,
    'Excursión glaciar Perito Moreno (entradas + guía)',
    185.50,
    NULL,
    '2025-01-18',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'd4000000-0000-4000-8000-000000000005',
    'b2000000-0000-4000-8000-000000000004',
    'a1000000-0000-4000-8000-000000000003',
    1,
    'Cena Andrés Carne de Res – celebración fin de año',
    890000.00,
    NULL,
    '2024-12-20',
    NOW(),
    NOW(),
    NULL
  ),
  (
    'd4000000-0000-4000-8000-000000000006',
    'b2000000-0000-4000-8000-000000000005',
    'a1000000-0000-4000-8000-000000000001',
    1,
    'Mercado y bebidas para apartamento frente al mar',
    412500.00,
    NULL,
    '2025-07-08',
    NOW(),
    NOW(),
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 5) expense_splits – amounts coherent with trip currency / expense totals
-- -----------------------------------------------------------------------------
INSERT INTO expense_splits (
  id,
  expense_id,
  user_id,
  amount_owed,
  created_at,
  updated_at,
  deleted_at
)
VALUES
  -- Flight total 1,890,000 COP split equally among Ana, Carlos, Laura
  ('e5000000-0000-4000-8000-000000000001', 'd4000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 630000.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000002', 'd4000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000002', 630000.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000003', 'd4000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000003', 630000.00, NOW(), NOW(), NULL),
  -- Lunch total 285,000 COP: Carlos paid; split 95k each
  ('e5000000-0000-4000-8000-000000000004', 'd4000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 95000.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000005', 'd4000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', 95000.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000006', 'd4000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000003', 95000.00, NOW(), NOW(), NULL),
  -- Hotel: corporate payer Carlos; internal split for reporting
  ('e5000000-0000-4000-8000-000000000007', 'd4000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000002', 816666.67, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000008', 'd4000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000004', 816666.67, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000009', 'd4000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000005', 816666.66, NOW(), NOW(), NULL),
  -- Patagonia USD split Diego + Ana
  ('e5000000-0000-4000-8000-000000000010', 'd4000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000004', 92.75, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000011', 'd4000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 92.75, NOW(), NOW(), NULL),
  -- Bogotá dinner Laura + Elena
  ('e5000000-0000-4000-8000-000000000012', 'd4000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000003', 445000.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000013', 'd4000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000005', 445000.00, NOW(), NOW(), NULL),
  -- Santa Marta groceries split three ways
  ('e5000000-0000-4000-8000-000000000014', 'd4000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000001', 137500.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000015', 'd4000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000002', 137500.00, NOW(), NOW(), NULL),
  ('e5000000-0000-4000-8000-000000000016', 'd4000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000003', 137500.00, NOW(), NOW(), NULL)
ON CONFLICT (id) DO NOTHING;

COMMIT;
