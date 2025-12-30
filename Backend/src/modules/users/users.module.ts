import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';

/**
 * Módulo de Users.
 *
 * Este módulo gestiona las operaciones CRUD de usuarios (excepto creación, que se maneja en AuthModule).
 *
 * Estructura:
 * - Controller: Maneja las peticiones HTTP de gestión de usuarios (GET, PUT, DELETE)
 * - Service: Contiene la lógica de negocio para usuarios
 * - Repository: Gestiona el acceso a datos y consultas a la base de datos
 *
 * Endpoints:
 * - GET /users - Obtener todos los usuarios activos
 * - GET /users/:id - Obtener un usuario por ID
 * - PUT /users/:id - Actualizar un usuario
 * - DELETE /users/:id - Eliminar un usuario (soft delete)
 *
 * NOTA: El registro de usuarios (POST) se maneja en AuthModule (POST /auth/register).
 * Este módulo también es utilizado por AuthModule para:
 * - Crear usuarios durante el registro (a través de UsersService)
 * - Buscar usuarios durante el login (a través de UsersRepository)
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
