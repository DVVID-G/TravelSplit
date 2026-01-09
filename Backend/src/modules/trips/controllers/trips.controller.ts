import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { TripsService } from '../services/trips.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { TripResponseDto } from '../dto/trip-response.dto';
import { TripListQueryDto } from '../dto/trip-list-query.dto';
import { TripListItemDto } from '../dto/trip-list-item.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../../../common/interfaces/authenticated-request.interface';

/**
 * Controller de Trips.
 *
 * Este controlador maneja las peticiones HTTP relacionadas con la gestión de viajes.
 * Su responsabilidad principal es manejar peticiones HTTP y validaciones de entrada,
 * delegando toda la lógica de negocio al TripsService.
 *
 * @class TripsController
 * @description Controlador para gestionar viajes
 */
@ApiTags('trips')
@Controller('trips')
@UseGuards(JwtAuthGuard)
export class TripsController {
  /**
   * Crea una instancia del TripsController.
   *
   * @constructor
   * @param {TripsService} tripsService - Servicio inyectado para gestionar viajes
   */
  constructor(private readonly tripsService: TripsService) {}

  /**
   * Crea un nuevo viaje y asocia automáticamente al usuario autenticado como CREATOR.
   * La moneda siempre es COP y no puede cambiarse.
   * Opcionalmente puede invitar usuarios por email como miembros.
   *
   * @method create
   * @param {CreateTripDto} createTripDto - DTO con los datos del viaje a crear
   * @param {AuthenticatedRequest} req - Request con el usuario autenticado
   * @returns {TripResponseDto} Viaje creado con el usuario como CREATOR
   * @example
   * // POST /trips
   * // Headers: Authorization: Bearer {token}
   * // Body: { name: "Viaje a Cartagena", memberEmails: ["maria@example.com"] }
   * // Respuesta: { id: "...", name: "...", currency: "COP", status: "ACTIVE", code: "...", createdAt: "...", updatedAt: "..." }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo viaje',
    description:
      'Crea un viaje con nombre y moneda fija COP. El usuario autenticado se asocia automáticamente como CREATOR. Opcionalmente puede invitar usuarios por email como miembros.',
  })
  @ApiCreatedResponse({
    description: 'Viaje creado exitosamente',
    type: TripResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Se requiere autenticación.',
  })
  async create(
    @Body() createTripDto: CreateTripDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TripResponseDto> {
    return this.tripsService.create(createTripDto, req.user!.id);
  }

  /**
   * Retrieves all trips where the authenticated user is a participant.
   * Allows optional filtering by trip status (ACTIVE/CLOSED).
   *
   * @method findAll
   * @param {TripListQueryDto} queryDto - DTO with optional filters
   * @param {AuthenticatedRequest} req - Request with authenticated user
   * @returns {TripListItemDto[]} List of trips with user role and participant count
   * @example
   * // GET /trips
   * // Headers: Authorization: Bearer {token}
   * // Response: [{ id: "...", name: "...", currency: "COP", status: "ACTIVE", code: "...", createdAt: "...", updatedAt: "...", userRole: "CREATOR", participantCount: 3 }]
   * @example
   * // GET /trips?status=ACTIVE
   * // Headers: Authorization: Bearer {token}
   * // Response: [{ ... active trips only ... }]
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user trips',
    description:
      'Returns all trips where the authenticated user is a participant (CREATOR or MEMBER). Can be filtered by trip status.',
  })
  @ApiOkResponse({
    description: 'Trip list retrieved successfully',
    type: [TripListItemDto],
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Authentication required.',
  })
  async findAll(
    @Query() queryDto: TripListQueryDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TripListItemDto[]> {
    return this.tripsService.findAllByUser(req.user!.id, queryDto);
  }
}
