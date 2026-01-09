import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TripStatus } from '../enums/trip-status.enum';

/**
 * DTO para filtrar la lista de viajes del usuario.
 * Todos los campos son opcionales.
 */
export class TripListQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado del viaje',
    enum: TripStatus,
    example: TripStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(TripStatus, {
    message: 'El estado debe ser ACTIVE o CLOSED',
  })
  status?: TripStatus;
}
