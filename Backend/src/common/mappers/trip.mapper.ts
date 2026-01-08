import { Trip } from '../../modules/trips/entities/trip.entity';
import { TripResponseDto } from '../../modules/trips/dto/trip-response.dto';

/**
 * Mapper utility for converting Trip entities to DTOs.
 * Centralizes the mapping logic to avoid code duplication.
 */
export class TripMapper {
  /**
   * Maps a Trip entity to TripResponseDto.
   * Includes all public fields of the trip.
   *
   * @param trip - Trip entity to map
   * @returns TripResponseDto with public fields only
   */
  static toResponseDto(trip: Trip): TripResponseDto {
    return {
      id: trip.id,
      name: trip.name,
      currency: trip.currency,
      status: trip.status,
      code: trip.code,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
    };
  }
}
