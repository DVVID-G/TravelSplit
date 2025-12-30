import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';

/**
 * Service de Users.
 * Responsabilidad: Contener la lógica de negocio.
 * NO debe acceder directamente a la base de datos (eso va en el Repository).
 */
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Crea un nuevo usuario en el sistema.
   * Valida que el email no esté duplicado y hashea la contraseña.
   * 
   * @param createUserDto - DTO con los datos del usuario a crear
   * @returns Usuario creado (sin la contraseña)
   * @throws ConflictException si el email ya existe
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(
      createUserDto.contraseña,
      saltRounds,
    );

    // Crear la entidad User
    const user = new User();
    user.nombre = createUserDto.nombre;
    user.email = createUserDto.email;
    user.passwordHash = passwordHash;

    // Guardar en la base de datos
    return await this.usersRepository.create(user);
  }
}

