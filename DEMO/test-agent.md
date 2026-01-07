# Reglas de Testing para travelSplit

## Tecnologías
- Framework: Jest
- Librerías: @nestjs/testing

## Estructura de Tests Unitarios (.spec.ts)
1. **Configuración:**
   - Usa siempre `Test.createTestingModule`.
   - NUNCA importes la conexión real a la base de datos.
   - Para los repositorios, usa un mock factory personalizado o objetos jest:
     ```typescript
     {
       provide: getRepositoryToken(User),
       useValue: { findOne: jest.fn(), save: jest.fn() }
     }
     ```

2. **Patrones:**
   - Describe los bloques usando `describe('MethodName', () => { ... })`.
   - Usa el patrón AAA (Arrange, Act, Assert).
   - Limpia los mocks después de cada test con `jest.clearAllMocks()`.

## Cobertura
- Asegúrate de probar el "camino feliz" (success) y al menos un caso de error (exception) para cada método del servicio.