# Design: Implementación de Login con JWT

## Context

El sistema actualmente permite el registro de usuarios mediante `POST /auth/login`, pero no tiene funcionalidad de autenticación real. Los usuarios registrados no pueden iniciar sesión para obtener tokens de acceso. Esta propuesta implementa el flujo de autenticación completo usando JWT (JSON Web Tokens) siguiendo las mejores prácticas de seguridad.

**Restricciones:**
- El backend usa NestJS con arquitectura en capas (Controller-Service-Repository)
- Las contraseñas ya están hasheadas con bcrypt (salt rounds: 10)
- El sistema debe operar exclusivamente en COP (no afecta este cambio)
- Debe seguir el patrón CSR establecido

## Goals / Non-Goals

### Goals
- Implementar autenticación segura de usuarios registrados
- Generar tokens JWT válidos y firmados
- Validar credenciales contra la base de datos
- Retornar respuestas HTTP apropiadas (200 para éxito, 401 para credenciales inválidas)
- Mantener separación de responsabilidades (CSR pattern)

### Non-Goals
- Implementar refresh tokens (solo access token en MVP)
- Implementar estrategias de almacenamiento de token en frontend (eso es responsabilidad del frontend)
- Implementar guards de autenticación para proteger endpoints (se hará en cambio futuro)

## Decisions

### Decision: Usar `/auth/login` para autenticación y mover registro a `/auth/register`
**Rationale:** El endpoint `/auth/login` actualmente realiza registro de usuarios, lo cual es semánticamente incorrecto. Se modifica `/auth/login` para realizar autenticación (login real) y se mueve la funcionalidad de registro a `/auth/register`. Esto corrige la semántica de la API y sigue las convenciones REST estándar donde `/login` significa autenticación y `/register` significa registro.

**Alternatives considered:**
- Mantener `/auth/login` para registro y crear `/auth/signin` para login: ❌ Semánticamente confuso, `/login` debería hacer login
- Usar `/auth/authenticate`: ⚠️ Válido pero menos común que `/login`
- Separar completamente: `/auth/register` y `/auth/login`: ✅ Mejor semántica y convención estándar (DECIDIDO)

### Decision: Usar @nestjs/jwt en lugar de implementación manual
**Rationale:** NestJS proporciona `@nestjs/jwt` que integra perfectamente con el ecosistema NestJS, maneja configuración, y sigue las mejores prácticas. Es la solución estándar recomendada.

**Alternatives considered:**
- Implementar JWT manualmente con `jsonwebtoken`: ❌ Más código, más propenso a errores
- Usar Passport con estrategia JWT: ✅ Buena opción, pero más complejo para MVP. Se puede migrar después si es necesario

### Decision: Payload JWT mínimo: `{ sub: user.id, email: user.email }`
**Rationale:** Para el MVP, solo necesitamos identificar al usuario. El `sub` (subject) es el estándar para el ID del usuario. El email se incluye para facilitar debugging y logs.

**Alternatives considered:**
- Incluir más datos (nombre, roles): ⚠️ Puede hacer el token más grande, se puede agregar después si es necesario
- Solo `sub`: ✅ Suficiente, pero email ayuda en desarrollo

### Decision: Tiempo de expiración configurable vía variable de entorno
**Rationale:** Permite ajustar según el ambiente (desarrollo vs producción) sin cambiar código. Valor por defecto razonable: 1 hora (3600 segundos).

**Alternatives considered:**
- Hardcodear expiración: ❌ No flexible
- Configuración en archivo de config: ✅ Similar, pero variables de entorno son más estándar para secrets

### Decision: Usar `UnauthorizedException` de NestJS para credenciales inválidas
**Rationale:** NestJS automáticamente retorna HTTP 401 cuando se lanza `UnauthorizedException`. Es la excepción estándar para problemas de autenticación.

**Alternatives considered:**
- `BadRequestException`: ❌ 400 es para errores de formato, no autenticación
- `NotFoundException`: ❌ 404 es para recursos no encontrados, no aplica aquí
- Excepción personalizada: ⚠️ Posible, pero `UnauthorizedException` es suficiente

## Risks / Trade-offs

### Risk: Token JWT sin refresh mechanism
**Mitigation:** Para MVP es aceptable. Los usuarios pueden hacer login nuevamente si el token expira. En el futuro se puede agregar refresh tokens.

### Risk: Secret JWT en variable de entorno sin validación
**Mitigation:** Documentar claramente en `env.example.txt` y README que `JWT_SECRET` debe ser fuerte y único. En producción, usar secret management.

### Risk: No hay rate limiting en el endpoint de login
**Mitigation:** Aceptable para MVP. En producción se debe agregar rate limiting para prevenir brute force attacks.

### Trade-off: Simplicidad vs Seguridad avanzada
**Decision:** Priorizar simplicidad para MVP. No implementar 2FA, OTP, o otros mecanismos avanzados. El sistema básico de JWT es suficiente para el MVP.

## Migration Plan

### Fase 1: Implementación (este cambio)
- Modificar endpoint `/auth/login` para autenticación
- Mover registro a `/auth/register`
- Configurar JWT
- Implementar validación de credenciales
- Actualizar specs de user-registration para usar `/auth/register`

### Fase 2: Futuro (fuera de scope)
- Implementar guards de autenticación para proteger endpoints
- Agregar refresh tokens si es necesario
- Implementar rate limiting

### Rollback
**BREAKING CHANGE:** Este cambio modifica el comportamiento del endpoint `/auth/login` (de registro a autenticación) y requiere actualizar el frontend. Para rollback, sería necesario revertir los cambios y restaurar el comportamiento original. Se recomienda coordinar con el frontend antes de desplegar.

## Open Questions

- [ ] ¿Qué tiempo de expiración es apropiado para el MVP? (Sugerencia: 1 hora)
- [ ] ¿Debe el token incluir información adicional como roles? (Respuesta: No para MVP, solo sub y email)
- [ ] ¿Se debe implementar logout? (Respuesta: No para MVP, el frontend simplemente descarta el token)

