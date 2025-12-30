import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';

/**
 * Módulo de Health Check.
 * Ejemplo de implementación del patrón CSR (Controller-Service-Repository).
 *
 * Estructura:
 * - Controller: Maneja las peticiones HTTP
 * - Service: Contiene la lógica de negocio
 * - Repository: (No necesario en este caso simple, pero la estructura está lista)
 */
@Module({
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}
