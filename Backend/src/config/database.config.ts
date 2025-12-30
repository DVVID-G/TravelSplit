import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * Configuración de TypeORM para PostgreSQL.
 * Utiliza variables de entorno para la conexión.
 *
 * Características:
 * - Soporte para Soft Delete global (con deleted_at)
 * - Sincronización automática de esquema en desarrollo
 * - Logging de consultas SQL en desarrollo
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'travelsplit'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Solo en desarrollo
    logging: configService.get<boolean>('DB_LOGGING', false),
    // TypeORM automáticamente respeta @DeleteDateColumn para Soft Delete
  };
};
