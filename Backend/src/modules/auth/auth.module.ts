import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';

/**
 * Módulo de Auth.
 * 
 * Este módulo gestiona la autenticación y registro de usuarios.
 * Importa UsersModule para utilizar UsersService.
 */
@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

