import { registerAs } from '@nestjs/config';

/**
 * Configuración de JWT.
 */
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '3600', // Default: 1 hora en segundos
}));









