import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables de entorno (prioridad: .env.local luego .env)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

/**
 * DataSource configuration for TypeORM CLI.
 * This file is used by TypeORM CLI commands (migration:run, migration:revert, etc.)
 * and must be separate from NestJS's configuration.
 *
 * Usage:
 *   typeorm migration:run -d data-source.ts
 *   typeorm migration:revert -d data-source.ts
 *   typeorm migration:show -d data-source.ts
 *
 * Note: Environment variables should be loaded from .env or .env.local files.
 * TypeORM CLI will automatically load them, or you can use dotenv-cli:
 *   npx dotenv-cli -e .env.local -- typeorm migration:run -d data-source.ts
 */

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'travelsplit',
  entities: [path.join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '**', '*.{ts,js}')],
  synchronize: false, // Never use synchronize with migrations
  logging: process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
});
