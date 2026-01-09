import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripParticipant } from './entities/trip-participant.entity';
import { User } from '../users/entities/user.entity';
import { TripsController } from './controllers/trips.controller';
import { TripsService } from './services/trips.service';

/**
 * Módulo de Trips.
 *
 * Este módulo gestiona las operaciones relacionadas con viajes y participantes.
 *
 * Estructura (Patrón CSED):
 * - Controller: Maneja las peticiones HTTP de gestión de viajes
 * - Service: Contiene la lógica de negocio y acceso a datos mediante TypeORM
 * - Entity: Define los modelos de datos de Trip y TripParticipant
 * - DTO: Define los contratos de validación y respuesta de la API
 *
 * Endpoints:
 * - POST /trips - Crear un nuevo viaje (requiere autenticación)
 */
@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripParticipant, User])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
