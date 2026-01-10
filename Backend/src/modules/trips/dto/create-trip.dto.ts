import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsEmail,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new trip.
 * Contains all necessary validations for trip creation input fields.
 *
 * @class CreateTripDto
 * @description This DTO is used to validate and structure trip creation data
 * before it is processed by the trip service. The currency is always COP and
 * cannot be changed.
 */
export class CreateTripDto {
  /**
   * Trip name.
   * Must be a non-empty string.
   *
   * @type {string}
   * @memberof CreateTripDto
   * @example "Viaje a Cartagena"
   */
  @ApiProperty({
    description: 'Nombre del viaje',
    example: 'Viaje a Cartagena',
    type: String,
  })
  @Transform(({ value }) => String(value ?? '').trim())
  @IsString()
  @IsNotEmpty({ message: 'El nombre del viaje es requerido' })
  @MaxLength(255, { message: 'El nombre del viaje no puede exceder 255 caracteres' })
  name!: string;

  /**
   * Optional array of email addresses to invite as members.
   * Users must already be registered in the system.
   *
   * @type {string[]}
   * @memberof CreateTripDto
   * @example ["maria@example.com", "pedro@example.com"]
   */
  @ApiProperty({
    description: 'Lista opcional de emails de usuarios a invitar como miembros',
    example: ['maria@example.com', 'pedro@example.com'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Los emails deben ser un array' })
  @ArrayMinSize(0, {
    message: 'El array de emails no puede estar vacío si se proporciona',
  })
  @IsEmail(
    {},
    { each: true, message: 'Cada email debe tener un formato válido' },
  )
  memberEmails?: string[];
}
