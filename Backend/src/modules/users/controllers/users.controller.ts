import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

/**
 * Controller de Users.
 * 
 * Este controlador maneja las peticiones HTTP relacionadas con usuarios.
 * Su responsabilidad principal es manejar peticiones HTTP y validaciones de entrada,
 * delegando toda la lógica de negocio al UsersService.
 * 
 * @class UsersController
 * @description Controlador para gestionar usuarios
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Crea una instancia del UsersController.
   * 
   * @constructor
   * @param {UsersService} usersService - Servicio inyectado para gestionar usuarios
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuevo usuario en el sistema.
   * 
   * Este método maneja las peticiones POST al endpoint /users y delega
   * la creación del usuario al UsersService. No contiene lógica de negocio,
   * solo actúa como intermediario entre la petición HTTP y el servicio.
   * 
   * @method create
   * @param {CreateUserDto} createUserDto - DTO con los datos del usuario a crear
   * @returns {UserResponseDto} Usuario creado (sin información sensible)
   * @example
   * // POST /users
   * // Body: { nombre: "Juan Pérez", email: "juan@example.com", contraseña: "password123" }
   * // Respuesta: { id: "...", nombre: "Juan Pérez", email: "juan@example.com", createdAt: "..." }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos (validación fallida)',
  })
  @ApiConflictResponse({
    description: 'El email ya está registrado',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // El controller solo delega al service
    const user = await this.usersService.create(createUserDto);

    // Mapear la entidad a DTO de respuesta (sin información sensible)
    const response: UserResponseDto = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      createdAt: user.createdAt,
    };

    return response;
  }
}

