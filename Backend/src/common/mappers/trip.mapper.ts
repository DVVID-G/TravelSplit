import { Trip } from '../../modules/trips/entities/trip.entity';
import { TripResponseDto } from '../../modules/trips/dto/trip-response.dto';
import { TripListItemDto } from '../../modules/trips/dto/trip-list-item.dto';
import { ParticipantRole } from '../../modules/trips/enums/participant-role.enum';

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

  /**
   * Maps a Trip entity to TripListItemDto with additional metadata.
   * Used for list endpoints where we need to include user's role and participant count.
   *
   * @param trip - Trip entity to map
   * @param userRole - Role of the authenticated user in this trip
   * @param participantCount - Total number of participants in the trip
   * @returns TripListItemDto with extended information
   */
  static toListItemDto(
    trip: Trip,
    userRole: ParticipantRole,
    participantCount: number,
  ): TripListItemDto {
    return {
      ...this.toResponseDto(trip),
      userRole,
      participantCount,
      totalAmount: 0, // TODO: Calculate from expenses when expense module is implemented
    };
  }
}
