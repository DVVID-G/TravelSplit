import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import jwtConfig from '../../config/jwt.config';

/**
 * Módulo de Auth.
 *
 * Este módulo gestiona la autenticación y registro de usuarios.
 * Importa UsersModule para utilizar UsersService y UsersRepository.
 * Configura JwtModule para generar tokens de autenticación.
 */
@Module({
  imports: [
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInSeconds = parseInt(
          configService.get<string>('jwt.expiresIn') || '3600',
          10,
        );
        return {
          secret: configService.get<string>('jwt.secret') || 'default-secret',
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
