---
globs:
  - "**/controllers/**/*.ts"
  - "**/services/**/*.ts"
  - "**/repositories/**/*.ts"
  - "**/dto/**/*.ts"
  - "**/modules/**/*.module.ts"
alwaysApply: false
---

# Regla de Arquitectura: Patrón Controller-Direct (Arquitectura Simplificada)

## Regla de Oro
El Controller DEBE acceder directamente a TypeORM usando @InjectRepository. Toda la lógica de negocio, validación y acceso a datos debe estar en el Controller. NO se deben crear capas intermedias de Service ni Repository personalizado.

## Estructura Obligatoria
Al crear un nuevo endpoint, SIEMPRE debes:
1. Crear/actualizar el Controller en src/modules/[module]/controllers/
2. Crear/actualizar el DTO en src/modules/[module]/dto/
3. Inyectar directamente el Repository de TypeORM en el Controller usando @InjectRepository
4. Colocar TODA la lógica (validación, negocio, acceso a datos) en el Controller

## Prohibiciones
- NO crear archivos de Service personalizado
- NO crear archivos de Repository personalizado
- NO separar la lógica en múltiples capas
- NO delegar operaciones a Services
- NO usar capas intermedias entre Controller y TypeORM

## Estructura del Código
El Controller debe tener esta estructura:
- Inyectar el Repository de TypeORM: `@InjectRepository(Entity) private repository: Repository<Entity>`
- Implementar toda la lógica en los métodos del Controller
- Usar el DTO solo para validación de entrada
- Realizar todas las operaciones de base de datos directamente desde el Controller