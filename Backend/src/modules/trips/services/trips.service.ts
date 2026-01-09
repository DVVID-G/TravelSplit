import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { validate as isUUID } from 'uuid';
import { Trip } from '../entities/trip.entity';
import { TripParticipant } from '../entities/trip-participant.entity';
import { User } from '../../users/entities/user.entity';
import { CreateTripDto } from '../dto/create-trip.dto';
import { TripResponseDto } from '../dto/trip-response.dto';
import { TripListQueryDto } from '../dto/trip-list-query.dto';
import { TripListItemDto } from '../dto/trip-list-item.dto';
import { ParticipantsPaginationMeta } from '../dto/trip-detail-response.dto';
import { TripStatsResponseDto } from '../dto/trip-stats-response.dto';
import { TripStatus } from '../enums/trip-status.enum';
import { ParticipantRole } from '../enums/participant-role.enum';
import { TripMapper } from '../../../common/mappers/trip.mapper';

/**
 * Service de Trips.
 * Responsabilidad: Contener la lógica de negocio y acceso a datos mediante TypeORM.
 */
@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(TripParticipant)
    private readonly tripParticipantRepository: Repository<TripParticipant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
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

  /**
   * Retrieves all trips where the authenticated user is a participant.
   * Returns only non-deleted trips (soft delete).
   * Optionally filters by trip status.
   *
   * @param userId - ID of the authenticated user
   * @param queryDto - DTO with optional filters (status)
   * @returns List of trips with extended information (user role and participant count)
   */
  async findAllByUser(
    userId: string,
    queryDto: TripListQueryDto,
  ): Promise<TripListItemDto[]> {
    // Interface for raw query result typing
    interface TripQueryRawResult {
      participantCount: string; // COUNT returns string in PostgreSQL
      userRole: ParticipantRole; // Role from userParticipant
    }

    // Build query with Query Builder for JOIN and aggregation
    let query = this.tripRepository
      .createQueryBuilder('trip')
      .innerJoin(
        'trip.participants',
        'userParticipant',
        'userParticipant.userId = :userId AND userParticipant.deletedAt IS NULL',
        { userId },
      )
      .leftJoin(
        'trip.participants',
        'allParticipants',
        'allParticipants.deletedAt IS NULL',
      )
      .where('trip.deletedAt IS NULL')
      .select([
        'trip.id',
        'trip.name',
        'trip.currency',
        'trip.status',
        'trip.code',
        'trip.createdAt',
        'trip.updatedAt',
      ])
      .addSelect('userParticipant.role', 'userRole')
      .addSelect('COUNT(DISTINCT allParticipants.id)', 'participantCount')
      .groupBy('trip.id')
      .addGroupBy('userParticipant.id')
      .addGroupBy('userParticipant.role')
      .orderBy('trip.createdAt', 'DESC');

    // Apply status filter if provided
    if (queryDto.status) {
      query = query.andWhere('trip.status = :status', {
        status: queryDto.status,
      });
    }

    // Execute query
    const results = await query.getRawAndEntities();

    // Map results to TripListItemDto
    return results.entities.map((trip, index) => {
      const raw = results.raw[index] as TripQueryRawResult;

      return TripMapper.toListItemDto(
        trip,
        raw.userRole,
        parseInt(raw.participantCount, 10),
      );
    });
  }

  /**
   * Permite a un usuario autenticado unirse a un viaje existente usando su código.
   * Solo se puede unir a viajes con estado ACTIVE.
   * El usuario se agrega como participante con rol MEMBER.
   *
   * @param code - Código único del viaje (8 caracteres alfanuméricos)
   * @param userId - ID del usuario autenticado que quiere unirse
   * @returns Entidad Trip al que se unió el usuario
   * @throws NotFoundException si el viaje no existe o no está activo
   * @throws ConflictException si el usuario ya es participante del viaje
   */
  async joinByCode(code: string, userId: string): Promise<Trip> {
    // Buscar el viaje por código (solo viajes activos y no eliminados)
    const trip = await this.tripRepository.findOne({
      where: {
        code,
        deletedAt: IsNull(),
        status: TripStatus.ACTIVE,
      },
    });

    if (!trip) {
      this.logger.warn(
        `Intento fallido de unirse: código ${code}, usuario ${userId}, razón: Viaje no encontrado o no está activo`,
      );
      throw new NotFoundException('El viaje no existe o está cerrado');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!user) {
      this.logger.warn(
        `Intento fallido de unirse: código ${code}, usuario ${userId}, razón: Usuario no encontrado`,
      );
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si el usuario ya es participante del viaje
    const existingParticipant = await this.tripParticipantRepository.findOne({
      where: {
        tripId: trip.id,
        userId: user.id,
        deletedAt: IsNull(),
      },
    });

    if (existingParticipant) {
      this.logger.warn(
        `Intento fallido de unirse: código ${code}, usuario ${userId}, viaje ${trip.id}, razón: Ya es participante`,
      );
      throw new ConflictException('Ya eres participante de este viaje');
    }

    // Crear TripParticipant con rol MEMBER
    const newParticipant = this.tripParticipantRepository.create({
      trip,
      tripId: trip.id,
      user,
      userId: user.id,
      role: ParticipantRole.MEMBER,
    });

    await this.tripParticipantRepository.save(newParticipant);

    this.logger.log(
      `Usuario ${userId} se unió exitosamente al viaje ${trip.id} (${trip.name}) usando código ${code}`,
    );

    // Invalidar caché del trip
    await this.invalidateTripCache(trip.id);

    return trip;
  }

  /**
   * Obtiene los detalles de un viaje por ID incluyendo participantes paginados.
   * Solo los participantes del viaje pueden acceder a sus detalles.
   * Usa caché para optimizar performance.
   *
   * @param tripId - ID del viaje
   * @param userId - ID del usuario autenticado
   * @param participantsPage - Número de página para participantes (default: 1)
   * @param participantsLimit - Límite de participantes por página (default: 20, max: 100)
   * @returns Trip entity con participantes y metadatos de paginación
   * @throws BadRequestException si el tripId no es un UUID válido
   * @throws ForbiddenException si el usuario no es participante del viaje
   * @throws NotFoundException si el viaje no existe
   */
  async findOneById(
    tripId: string,
    userId: string,
    participantsPage: number = 1,
    participantsLimit: number = 20,
  ): Promise<{ trip: Trip; paginationMeta: ParticipantsPaginationMeta }> {
    // Validar formato UUID
    if (!isUUID(tripId)) {
      throw new BadRequestException('ID de viaje inválido');
    }

    // Validar parámetros de paginación
    const safePage = Math.max(1, participantsPage);
    const safeLimit = Math.min(Math.max(1, participantsLimit), 100);

    // Verificar caché
    const cacheKey = `trip-detail:${tripId}:${userId}:${safePage}:${safeLimit}`;
    const cached = await this.cacheManager.get<{
      trip: Trip;
      paginationMeta: ParticipantsPaginationMeta;
    }>(cacheKey);

    if (cached) {
      this.logger.debug(`Cache hit for trip ${tripId}, page ${safePage}`);
      return cached;
    }

    // Verificar que el usuario es participante del viaje
    const userParticipation =
      await this.tripParticipantRepository.findOne({
        where: {
          tripId,
          userId,
          deletedAt: IsNull(),
        },
      });

    if (!userParticipation) {
      throw new ForbiddenException('No tienes acceso a este viaje');
    }

    // Obtener total de participantes para paginación
    const totalParticipants = await this.tripParticipantRepository.count({
      where: {
        tripId,
        deletedAt: IsNull(),
      },
    });

    // Construir query con paginación para participantes
    const skip = (safePage - 1) * safeLimit;
    const trip = await this.tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect(
        'trip.participants',
        'participant',
        'participant.deletedAt IS NULL',
      )
      .leftJoinAndSelect('participant.user', 'user')
      .where('trip.id = :tripId', { tripId })
      .andWhere('trip.deletedAt IS NULL')
      .select([
        'trip',
        'participant.id',
        'participant.userId',
        'participant.role',
        'participant.createdAt',
        'user.id',
        'user.nombre',
        'user.email',
      ])
      .skip(skip)
      .take(safeLimit)
      .getOne();

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // Calcular metadatos de paginación
    const paginationMeta: ParticipantsPaginationMeta = {
      total: totalParticipants,
      page: safePage,
      limit: safeLimit,
      hasMore: safePage * safeLimit < totalParticipants,
    };

    const result = { trip, paginationMeta };

    // Guardar en caché por 5 minutos
    await this.cacheManager.set(cacheKey, result, 300);

    this.logger.log(
      `Usuario ${userId} obtuvo detalles del viaje ${tripId}, página ${safePage}`,
    );

    return result;
  }

  /**
   * Obtiene las estadísticas de un viaje.
   * Solo los participantes del viaje pueden acceder a sus estadísticas.
   * Usa caché con TTL más corto (60s) porque las stats cambian frecuentemente.
   *
   * @param tripId - ID del viaje
   * @param userId - ID del usuario autenticado
   * @returns Estadísticas del viaje
   * @throws BadRequestException si el tripId no es un UUID válido
   * @throws ForbiddenException si el usuario no es participante del viaje
   * @throws NotFoundException si el viaje no existe
   */
  async getTripStats(
    tripId: string,
    userId: string,
  ): Promise<TripStatsResponseDto> {
    // Validar formato UUID
    if (!isUUID(tripId)) {
      throw new BadRequestException('ID de viaje inválido');
    }

    // Verificar caché (TTL: 60 segundos)
    const cacheKey = `trip-stats:${tripId}:${userId}`;
    const cached =
      await this.cacheManager.get<TripStatsResponseDto>(cacheKey);

    if (cached) {
      this.logger.debug(`Cache hit for trip stats ${tripId}`);
      return cached;
    }

    // Verificar que el usuario es participante del viaje
    const userParticipation =
      await this.tripParticipantRepository.findOne({
        where: {
          tripId,
          userId,
          deletedAt: IsNull(),
        },
      });

    if (!userParticipation) {
      throw new ForbiddenException('No tienes acceso a este viaje');
    }

    // Verificar que el viaje existe
    const trip = await this.tripRepository.findOne({
      where: { id: tripId, deletedAt: IsNull() },
    });

    if (!trip) {
      throw new NotFoundException('Viaje no encontrado');
    }

    // Obtener total de participantes
    const totalParticipants = await this.tripParticipantRepository.count({
      where: {
        tripId,
        deletedAt: IsNull(),
      },
    });

    // TODO: Cuando se implemente el módulo de expenses, agregar consultas para:
    // - totalExpenses: COUNT de expenses WHERE tripId = :tripId AND deletedAt IS NULL
    // - totalAmount: SUM de expenses.amount WHERE tripId = :tripId AND deletedAt IS NULL
    // - userBalance: Cálculo complejo basado en expense_beneficiaries y payments

    // Por ahora, retornar valores en 0
    const stats = TripMapper.toStatsDto({
      totalExpenses: 0, // TODO: Implementar cuando exista módulo de expenses
      totalAmount: 0, // TODO: Implementar cuando exista módulo de expenses
      totalParticipants,
      userBalance: 0, // TODO: Implementar cálculo de balances
    });

    // Guardar en caché por 60 segundos (stats cambian más frecuentemente)
    await this.cacheManager.set(cacheKey, stats, 60);

    this.logger.log(`Usuario ${userId} obtuvo estadísticas del viaje ${tripId}`);

    return stats;
  }

  /**
   * Invalida el caché de un viaje específico.
   * Elimina todas las entradas de caché relacionadas con el trip.
   * Debe llamarse después de cualquier operación que modifique el trip o sus participantes.
   *
   * @param tripId - ID del viaje cuyo caché se invalidará
   */
  private async invalidateTripCache(tripId: string): Promise<void> {
    try {
      // En cache-manager in-memory, no hay método para buscar por patrón
      // Por simplicidad, no eliminamos claves específicas aquí
      // En producción con Redis, se usaría: await this.cacheManager.store.keys(`trip-*:${tripId}:*`)
      // y luego se eliminaría cada clave

      this.logger.debug(`Cache invalidation requested for trip ${tripId}`);
      // TODO: Implementar invalidación por patrón cuando se migre a Redis
    } catch (error) {
      this.logger.error(
        `Error al invalidar caché del viaje ${tripId}:`,
        error,
      );
    }
  }
}

