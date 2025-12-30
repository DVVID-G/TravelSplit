import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';

/**
 * Service de Auth.
 * Responsabilidad: Contener la lógica de negocio relacionada con autenticación.
 */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuevo usuario (registro/login).
   * Delega la creación al UsersService.
   * 
   * @param loginDto - DTO con los datos del usuario a crear
   * @returns Usuario creado (sin información sensible)
   */
  async createLogin(loginDto: LoginDto): Promise<UserResponseDto> {
    // Mapear LoginDto a CreateUserDto
    const createUserDto: CreateUserDto = {
      nombre: loginDto.nombre,
      email: loginDto.email,
      contraseña: loginDto.contraseña,
    };

    // Crear el usuario usando el servicio de usuarios
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

