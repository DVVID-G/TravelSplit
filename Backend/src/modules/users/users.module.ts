import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';

/**
 * Módulo de Users.
 * Ejemplo de implementación del patrón CSR (Controller-Service-Repository).
 *
 * Estructura:
 * - Controller: Maneja las peticiones HTTP
 * - Service: Contiene la lógica de negocio
 * - Repository: Gestiona el acceso a datos y consultas a la base de datos
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}

