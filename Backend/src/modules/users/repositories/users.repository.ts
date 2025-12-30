import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * Repositorio para la entidad User.
 * Responsabilidad: Gestionar el acceso a datos y consultas a la base de datos.
 * NO debe contener lógica de negocio (eso va en el Service).
 */
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param user - Entidad User a crear
   * @returns Usuario creado con todos sus campos
   */
  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /**
   * Busca un usuario por su email.
   * @param email - Email del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  /**
   * Busca un usuario por su ID.
   * @param id - ID del usuario a buscar
   * @returns Usuario encontrado o null si no existe
   */
  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }
}

