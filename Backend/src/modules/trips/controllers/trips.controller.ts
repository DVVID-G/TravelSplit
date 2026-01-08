import {
  Controller,
  Post,
  Body,
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
} from '@nestjs/swagger';
import { TripsService } from '../services/trips.service';
import { CreateTripDto } from '../dto/create-trip.dto';
import { TripResponseDto } from '../dto/trip-response.dto';
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
}
