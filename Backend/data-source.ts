import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

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

// Simple env file loader (fallback if dotenv is not available)
const loadEnvFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      }
    });
  }
};

// Try to load .env files (optional, TypeORM CLI may handle this)
try {
  loadEnvFile('.env.local');
  loadEnvFile('.env');
} catch (error) {
  // Ignore errors, environment variables may be set elsewhere
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'travelsplit',
  entities: [path.join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '**', '*.{.ts,.js}')],
  synchronize: false, // Never use synchronize with migrations
  logging: process.env.DB_LOGGING === 'true',
  migrationsTableName: 'migrations',
});
