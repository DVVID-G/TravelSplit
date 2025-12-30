## 1. Configuración y Dependencias
- [x] 1.1 Instalar dependencias JWT: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `@types/passport-jwt`
- [x] 1.2 Agregar variables de entorno para JWT (`JWT_SECRET`, `JWT_EXPIRES_IN`) en `env.example.txt`
- [x] 1.3 Crear configuración JWT en `app.config.ts` o crear `jwt.config.ts` separado

## 2. DTOs y Validaciones
- [x] 2.1 Modificar `LoginDto` para usar solo email y contraseña (remover campo `nombre`)
- [x] 2.2 Crear `RegisterDto` con campos: nombre, email y contraseña (mover validaciones de LoginDto actual)
- [x] 2.3 Crear `AuthResponseDto` con campos: `accessToken` (string) y `user` (UserResponseDto)
- [x] 2.4 Agregar documentación Swagger a todos los DTOs

## 3. Implementación del Servicio
- [x] 3.1 Renombrar método `createLogin` a `register` en `AuthService` (mover lógica de registro)
- [x] 3.2 Agregar método `login(loginDto: LoginDto)` en `AuthService` para autenticación
- [x] 3.3 Implementar búsqueda de usuario por email usando `UsersRepository.findByEmail()`
- [x] 3.4 Validar que el usuario exista, lanzar `UnauthorizedException` si no existe
- [x] 3.5 Comparar contraseña proporcionada con `passwordHash` usando `bcrypt.compare()`
- [x] 3.6 Lanzar `UnauthorizedException` si la contraseña no coincide
- [x] 3.7 Generar token JWT con `JwtService.sign()` incluyendo payload: `{ sub: user.id, email: user.email }`
- [x] 3.8 Retornar `AuthResponseDto` con token y datos del usuario (sin passwordHash)

## 4. Implementación del Controlador
- [x] 4.1 Modificar método `createLogin` a `login` en `AuthController` (cambiar de registro a autenticación)
- [x] 4.2 Cambiar decorador `@Post('login')` para retornar HTTP 200 (OK) en lugar de 201
- [x] 4.3 Agregar método `register(@Body() registerDto: RegisterDto)` en `AuthController`
- [x] 4.4 Configurar decorador `@Post('register')` con código HTTP 201 (Created)
- [x] 4.5 Agregar documentación Swagger para `login`: `@ApiOperation`, `@ApiResponse` (200), `@ApiUnauthorizedResponse` (401)
- [x] 4.6 Agregar documentación Swagger para `register`: `@ApiOperation`, `@ApiResponse` (201), `@ApiConflictResponse` (409)
- [x] 4.7 Delegar lógica de login a `AuthService.login()` y registro a `AuthService.register()`

## 5. Configuración del Módulo
- [x] 5.1 Importar `JwtModule` en `AuthModule`
- [x] 5.2 Configurar `JwtModule.register()` con secret y expiresIn desde variables de entorno
- [x] 5.3 Asegurar que `UsersModule` esté importado (ya está importado)

## 6. Testing y Validación
- [ ] 6.1 Crear test unitario para `AuthService.login()` - caso exitoso
- [ ] 6.2 Crear test unitario para `AuthService.login()` - usuario no existe
- [ ] 6.3 Crear test unitario para `AuthService.login()` - contraseña incorrecta
- [ ] 6.4 Crear test unitario para `AuthService.register()` - verificar que funcione correctamente
- [ ] 6.5 Crear test E2E para `POST /auth/login` - caso exitoso
- [ ] 6.6 Crear test E2E para `POST /auth/login` - credenciales inválidas (401)
- [ ] 6.7 Crear test E2E para `POST /auth/register` - verificar que registro funcione
- [ ] 6.8 Validar que el token JWT generado sea válido y decodificable

## 7. Actualización de Specs
- [x] 7.1 Actualizar `openspec/specs/user-registration/spec.md` para cambiar referencias de `/auth/login` a `/auth/register`
- [x] 7.2 Verificar que todas las referencias al endpoint de registro estén actualizadas

## 8. Documentación
- [x] 8.1 Actualizar documentación Swagger con los endpoints modificados
- [x] 8.2 Verificar que los ejemplos en Swagger sean correctos
- [ ] 8.3 Actualizar `README.md` del backend con instrucciones de configuración JWT si es necesario
- [ ] 8.4 Documentar el breaking change: `/auth/login` ahora es para autenticación, registro movido a `/auth/register`

