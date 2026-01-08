import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { TripParticipant } from './entities/trip-participant.entity';

/**
 * Módulo de Trips.
 *
 * Este módulo gestiona las entidades relacionadas con viajes y participantes.
 * Por ahora solo registra las entidades para que puedan ser utilizadas por otros módulos.
 *
 * Estructura (Patrón CSED):
 * - Controller: (Pendiente - se implementará en TCK-TRIP-002)
 * - Service: (Pendiente - se implementará en TCK-TRIP-002)
 * - Entity: Trip y TripParticipant definidas
 * - DTO: (Pendiente - se implementará en TCK-TRIP-002)
 */
@Module({
  imports: [TypeOrmModule.forFeature([Trip, TripParticipant])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TripsModule {}
