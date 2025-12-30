import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

/**
 * Controller de Auth.
 * 
 * Este controlador maneja las peticiones HTTP relacionadas con autenticación.
 * Su responsabilidad principal es manejar peticiones HTTP y validaciones de entrada,
 * delegando toda la lógica de negocio al AuthService.
 * 
 * @class AuthController
 * @description Controlador para gestionar autenticación
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * Crea una instancia del AuthController.
   * 
   * @constructor
   * @param {AuthService} authService - Servicio inyectado para gestionar autenticación
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Crea un nuevo login (registro de usuario) en el sistema.
   * 
   * Este método maneja las peticiones POST al endpoint /auth/login y delega
   * la creación del usuario al AuthService. No contiene lógica de negocio,
   * solo actúa como intermediario entre la petición HTTP y el servicio.
   * 
   * @method createLogin
   * @param {LoginDto} loginDto - DTO con los datos del usuario a crear
   * @returns {UserResponseDto} Usuario creado (sin información sensible)
   * @example
   * // POST /auth/login
   * // Body: { nombre: "Juan Pérez", email: "juan@example.com", contraseña: "password123" }
   * // Respuesta: { id: "...", nombre: "Juan Pérez", email: "juan@example.com", createdAt: "..." }
   */
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo login (registro de usuario)' })
  @ApiResponse({
    status: 201,
    description: 'Login creado exitosamente',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos (validación fallida)',
  })
  @ApiConflictResponse({
    description: 'El email ya está registrado',
  })
  async createLogin(@Body() loginDto: LoginDto): Promise<UserResponseDto> {
    // El controller solo delega al service
    return await this.authService.createLogin(loginDto);
  }
}

