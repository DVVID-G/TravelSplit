import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
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

  /**
   * Obtiene todos los usuarios activos del sistema.
   *
   * @returns Lista de usuarios activos (sin información sensible)
   */
  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  /**
   * Obtiene un usuario por su ID.
   *
   * @param id - ID del usuario a buscar
   * @returns Usuario encontrado
   * @throws NotFoundException si el usuario no existe
   */
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Actualiza un usuario existente.
   * Valida que el email no esté duplicado (si se actualiza) y hashea la contraseña (si se actualiza).
   *
   * @param id - ID del usuario a actualizar
   * @param updateUserDto - DTO con los datos a actualizar
   * @returns Usuario actualizado
   * @throws NotFoundException si el usuario no existe
   * @throws ConflictException si el email ya está en uso por otro usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Verificar que el usuario existe
    const existingUser = await this.usersRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si se actualiza el email, verificar que no esté duplicado
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithEmail = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Preparar datos para actualizar
    const updateData: Partial<User> = {};

    if (updateUserDto.nombre !== undefined) {
      updateData.nombre = updateUserDto.nombre;
    }

    if (updateUserDto.email !== undefined) {
      updateData.email = updateUserDto.email;
    }

    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.contraseña) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(
        updateUserDto.contraseña,
        saltRounds,
      );
    }

    // Actualizar el usuario
    const updatedUser = await this.usersRepository.update(id, updateData);

    if (!updatedUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return updatedUser;
  }

  /**
   * Elimina un usuario de forma lógica (soft delete).
   *
   * @param id - ID del usuario a eliminar
   * @throws NotFoundException si el usuario no existe
   */
  async remove(id: string): Promise<void> {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Eliminar de forma lógica
    const deleted = await this.usersRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
