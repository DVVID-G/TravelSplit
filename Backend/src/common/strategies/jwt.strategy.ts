import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../interfaces/authenticated-request.interface';

/**
 * Estrategia JWT de Passport para validar tokens JWT.
 * 
 * Esta estrategia:
 * 1. Extrae el token JWT del header Authorization (Bearer token)
 * 2. Valida y decodifica el token usando el secret configurado
 * 3. Retorna el payload del token que será asignado a req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extrae el token del header Authorization como "Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Indica si el secret debe ser verificado en cada request
      ignoreExpiration: false,
      // Secret usado para verificar la firma del token
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  /**
   * Valida el payload del token JWT.
   * Este método se ejecuta automáticamente después de que Passport valida el token.
   * 
   * @param payload - Payload decodificado del token JWT
   * @returns Usuario autenticado que será asignado a req.user
   * @throws UnauthorizedException si el payload es inválido
   */
  async validate(payload: any): Promise<AuthenticatedUser> {
    // Validar que el payload tenga los campos mínimos requeridos
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token inválido: payload incompleto');
    }

    // Retornar el usuario autenticado
    // El payload del token debe contener: { sub: user.id, email: user.email }
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}

