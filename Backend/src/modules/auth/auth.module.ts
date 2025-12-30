import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import jwtConfig from '../../config/jwt.config';

/**
 * Módulo de Auth.
 *
 * Este módulo gestiona la autenticación y registro de usuarios.
 * Importa UsersModule para utilizar UsersService.
 * Configura JwtModule para generar tokens de autenticación.
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
