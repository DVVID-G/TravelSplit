import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear un nuevo usuario.
 * Contiene las validaciones necesarias para los campos de entrada.
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez',
    type: String,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre!: string;

  @ApiProperty({
    description: 'Email del usuario (debe ser un formato válido)',
    example: 'juan.perez@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'miPassword123',
    type: String,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  contraseña!: string;
}
