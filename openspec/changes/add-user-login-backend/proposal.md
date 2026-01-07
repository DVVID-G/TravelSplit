# Change: Implementar Login de Usuario en Backend

## Why

El ProductBacklog especifica la Historia de Usuario TS-004 "Login con JWT" como crítica para el MVP. Actualmente, el backend tiene un endpoint `POST /auth/login` que en realidad realiza el registro de usuarios, pero falta la funcionalidad real de autenticación que permita a los usuarios registrados iniciar sesión con sus credenciales y obtener un token JWT para acceder a recursos protegidos. Esta funcionalidad es esencial para el flujo de autenticación del sistema y es un requisito previo para proteger los endpoints de la API.

## What Changes

- Modificar endpoint `POST /auth/login` para realizar autenticación (cambiar de registro a login)
- Mover funcionalidad de registro a nuevo endpoint `POST /auth/register`
- Implementar validación de credenciales (email y contraseña) contra la base de datos
- Integrar JWT (JSON Web Tokens) para generar tokens de autenticación
- Implementar comparación segura de contraseñas usando bcrypt
- Retornar token JWT en la respuesta del login exitoso
- Manejar errores 401 (Unauthorized) para credenciales inválidas
- Crear DTO para el request de login (`LoginDto` - reutilizar existente pero cambiar propósito)
- Crear DTO para la respuesta con token (`AuthResponseDto`)
- Configurar módulo JWT de NestJS con secret y tiempo de expiración
- Agregar validaciones de entrada (email válido, contraseña requerida)
- **BREAKING:** El endpoint `/auth/login` cambia de registro (201) a autenticación (200 con token)

## Impact

- **Affected specs:** Nueva capacidad `user-authentication` (backend)
- **Affected code:**
  - `Backend/src/modules/auth/controllers/auth.controller.ts` (modificar método `createLogin` → `login` y agregar `register`)
  - `Backend/src/modules/auth/services/auth.service.ts` (modificar `createLogin` → `register` y agregar `login` con lógica de autenticación)
  - `Backend/src/modules/auth/dto/login.dto.ts` (modificar para usar solo email y contraseña, sin nombre)
  - `Backend/src/modules/auth/dto/register.dto.ts` (nuevo, con nombre, email y contraseña)
  - `Backend/src/modules/auth/dto/auth-response.dto.ts` (nuevo)
  - `Backend/src/modules/auth/auth.module.ts` (configurar JwtModule)
  - `Backend/src/modules/users/repositories/users.repository.ts` (ya tiene `findByEmail`, se reutiliza)
  - `Backend/package.json` (agregar dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`)
  - `Backend/src/config/app.config.ts` (agregar configuración JWT si es necesario)
  - `Backend/env.example.txt` (agregar variables de entorno para JWT_SECRET y JWT_EXPIRES_IN)
- **Affected specs:** 
  - `openspec/specs/user-registration/spec.md` (actualizar referencias de `/auth/login` a `/auth/register`)

