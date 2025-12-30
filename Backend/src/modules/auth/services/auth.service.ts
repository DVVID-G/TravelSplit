import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Service de Auth.
 * Responsabilidad: Contener la lógica de negocio relacionada con autenticación.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema y genera un token JWT automáticamente.
   * El usuario queda autenticado tras registrarse.
   *
   * @param registerDto - DTO con los datos del usuario a crear
   * @returns Token JWT y datos del usuario (sin información sensible)
   * @throws ConflictException si el email ya está registrado
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Mapear RegisterDto a CreateUserDto
    const createUserDto: CreateUserDto = {
      nombre: registerDto.nombre,
      email: registerDto.email,
      contraseña: registerDto.contraseña,
    };

    // Crear el usuario usando el servicio de usuarios
    const user = await this.usersService.create(createUserDto);

    // Generar token JWT y mapear respuesta
    const accessToken = await this.generateToken(user);
    const userResponse = this.mapToUserResponse(user);

    // Retornar token y datos del usuario
    return {
      accessToken,
      user: userResponse,
    };
  }

  /**
   * Autentica un usuario con email y contraseña.
   * Valida las credenciales y genera un token JWT.
   *
   * @param loginDto - DTO con email y contraseña
   * @returns Token JWT y datos del usuario
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuario por email
    const user = await this.usersService.findByEmail(loginDto.email);

    // Validar que el usuario exista
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar contraseña proporcionada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(
      loginDto.contraseña,
      user.passwordHash,
    );

    // Validar que la contraseña coincida
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT y mapear respuesta
    const accessToken = await this.generateToken(user);
    const userResponse = this.mapToUserResponse(user);

    // Retornar token y datos del usuario
    return {
      accessToken,
      user: userResponse,
    };
  }

  /**
   * Genera un token JWT para un usuario.
   * Construye el payload con el ID y email del usuario.
   *
   * @param user - Entidad User para generar el token
   * @returns Token JWT firmado
   */
  private async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * Mapea una entidad User a UserResponseDto.
   * Excluye información sensible como passwordHash.
   *
   * @param user - Entidad User a mapear
   * @returns UserResponseDto sin información sensible
   */
  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
