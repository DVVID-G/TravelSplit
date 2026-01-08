import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { TripParticipant } from '../entities/trip-participant.entity';
import { User } from '../../users/entities/user.entity';
import { CreateTripDto } from '../dto/create-trip.dto';
import { TripResponseDto } from '../dto/trip-response.dto';
import { TripStatus } from '../enums/trip-status.enum';
import { ParticipantRole } from '../enums/participant-role.enum';
import { TripMapper } from '../../../common/mappers/trip.mapper';

/**
 * Service de Trips.
 * Responsabilidad: Contener la lógica de negocio y acceso a datos mediante TypeORM.
 */
@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripParticipant)
    private readonly tripParticipantRepository: Repository<TripParticipant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Genera un código alfanumérico único para un viaje.
   * El código tiene 8 caracteres y se verifica que no exista en la base de datos.
   *
   * @returns Código alfanumérico único
   */
  private async generateUniqueCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    let exists = true;

    // Intentar generar un código único (máximo 10 intentos)
    let attempts = 0;
    while (exists && attempts < 10) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      // Verificar si el código ya existe
      const existingTrip = await this.tripRepository.findOne({
        where: { code, deletedAt: IsNull() },
      });

      if (!existingTrip) {
        exists = false;
      }
      attempts++;
    }

    if (exists) {
      throw new Error(
        'No se pudo generar un código único después de varios intentos',
      );
    }

    return code!;
  }

  /**
   * Crea un nuevo viaje y asocia automáticamente al usuario como CREATOR.
   * La moneda siempre es COP y no puede cambiarse.
   * Opcionalmente puede invitar usuarios por email como miembros.
   *
   * @param createTripDto - DTO con los datos del viaje a crear
   * @param userId - ID del usuario autenticado que crea el viaje
   * @returns Viaje creado con el usuario como CREATOR
   * @throws NotFoundException si algún email invitado no existe en el sistema
   */
  async create(
    createTripDto: CreateTripDto,
    userId: string,
  ): Promise<TripResponseDto> {
    // Verificar que el usuario existe
    const creator = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!creator) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Generar código único para el viaje
    const code = await this.generateUniqueCode();

    // Crear el viaje con moneda fija COP
    const trip = this.tripRepository.create({
      name: createTripDto.name,
      currency: 'COP', // Siempre COP, sin posibilidad de cambio
      status: TripStatus.ACTIVE,
      code,
    });

    const savedTrip = await this.tripRepository.save(trip);

    // Crear TripParticipant para el creador con rol CREATOR
    const creatorParticipant = this.tripParticipantRepository.create({
      trip: savedTrip,
      tripId: savedTrip.id,
      user: creator,
      userId: creator.id,
      role: ParticipantRole.CREATOR,
    });

    await this.tripParticipantRepository.save(creatorParticipant);

    // Si se proporcionaron emails para invitar, crear participantes MEMBER
    if (createTripDto.memberEmails && createTripDto.memberEmails.length > 0) {
      const memberParticipants: TripParticipant[] = [];

      for (const email of createTripDto.memberEmails) {
        // Buscar usuario por email
        const user = await this.userRepository.findOne({
          where: { email, deletedAt: IsNull() },
        });

        if (!user) {
          throw new NotFoundException(
            `El usuario con email ${email} no está registrado. Debe registrarse primero.`,
          );
        }

        // Verificar que el usuario no sea el creador
        if (user.id === userId) {
          continue; // Saltar si es el mismo creador
        }

        // Verificar que no sea ya participante
        const existingParticipant =
          await this.tripParticipantRepository.findOne({
            where: {
              tripId: savedTrip.id,
              userId: user.id,
              deletedAt: IsNull(),
            },
          });

        if (existingParticipant) {
          continue; // Ya es participante, saltar
        }

        // Crear participante MEMBER
        const memberParticipant = this.tripParticipantRepository.create({
          trip: savedTrip,
          tripId: savedTrip.id,
          user,
          userId: user.id,
          role: ParticipantRole.MEMBER,
        });

        memberParticipants.push(memberParticipant);
      }

      // Guardar todos los participantes miembros
      if (memberParticipants.length > 0) {
        await this.tripParticipantRepository.save(memberParticipants);
      }
    }

    // Retornar el viaje como DTO
    return TripMapper.toResponseDto(savedTrip);
  }
}
