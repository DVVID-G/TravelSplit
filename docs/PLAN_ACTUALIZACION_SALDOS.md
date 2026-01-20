# Plan de Actualización - Sección de Saldos en TripDetailPage

## Objetivo
Actualizar la sección "Saldos" en la página de detalle de trips para mostrar información completa de balances entre participantes, incluyendo quién debe a quién y los montos detallados por participante.

## Estado Actual
- La sección de saldos solo muestra `TripStats` básico:
  - Balance del usuario actual
  - Total de gastos
  - Monto total
  - Cantidad de participantes
- No muestra balances detallados por participante
- No muestra quién debe a quién

## Estado Deseado
- Mostrar resumen de gastos totales y participantes
- Mostrar balance del usuario actual (ya existe)
- Mostrar lista de balances por participante con:
  - Total gastado
  - Total que debe
  - Balance neto
- Mostrar saldos simplificados entre participantes (quién debe a quién)
- Usar el componente `BalanceCard` para mostrar las deudas

## Tareas de Implementación

### 1. Crear Tipos TypeScript para Balances (Frontend)
**Archivo:** `Frontend/src/types/balance.types.ts`

- Crear interfaz `ParticipantBalance` basada en `ParticipantBalanceDto`
- Crear interfaz `BalancesResponse` basada en `BalancesResponseDto`
- Incluir campos:
  - `user_id`, `user_name`, `user_email`
  - `total_spent`, `total_owed`, `balance`

### 2. Crear Servicio de Balances (Frontend)
**Archivo:** `Frontend/src/services/balance.service.ts`

- Crear función `getTripBalances(tripId: string): Promise<BalancesResponse>`
- Usar endpoint: `GET /trips/:trip_id/balances`
- Crear función `getTripSettledBalances(tripId: string): Promise<SettleResponse>`
- Usar endpoint: `POST /trips/:trip_id/balances/settle`
- Crear función helper `mapSettleTransactionsToBalances(transactions: SettleTransactionDto[]): Balance[]`
- Manejar errores y autenticación
- Seguir el patrón de `trip.service.ts`

### 3. Crear Hooks para Balances (Frontend)
**Archivo:** `Frontend/src/hooks/useTripBalances.ts`

- Crear hook `useTripBalances(tripId: string | undefined)`
- Usar TanStack Query para manejar estado
- Retornar: `balances`, `isLoading`, `error`, `refetch`
- Crear hook `useTripSettledBalances(tripId: string | undefined)`
- Retornar: `settledBalances`, `isLoading`, `error`, `refetch`
- Configurar `staleTime` y `retry` apropiados
- Los saldos simplificados pueden tener `staleTime` más corto ya que se calculan

### 4. Crear Componente de Balance de Participante (Frontend)
**Archivo:** `Frontend/src/components/molecules/ParticipantBalanceCard.tsx`

- Componente para mostrar balance de un participante
- Mostrar: nombre, total gastado, total que debe, balance neto
- Usar colores según balance (verde si positivo, rojo si negativo)
- Seguir Design System: `bg-white`, `rounded-xl`, `p-4`, `shadow-sm`

### 5. Actualizar TripDetailPage (Frontend)
**Archivo:** `Frontend/src/pages/TripDetailPage.tsx`

- Importar `useTripBalances` y `useTripSettledBalances` hooks
- Complementar `useTripDetail` stats con balances detallados
- Actualizar la sección de saldos para mostrar:
  - Resumen (total gastos, participantes) - mantener StatCard usando datos de balances
  - Balance del usuario actual - mantener, pero obtener de balances si está disponible
  - Lista de balances por participante usando `ParticipantBalanceCard`
  - Título: "Balances por Participante"
  - Saldos simplificados usando `BalanceCard` (quién debe a quién)
  - Título: "Saldos Simplificados" o "Quién debe a quién"
- Manejar estados de loading y error para ambos hooks
- Mantener botón de actualizar que refresque ambos queries
- Mostrar mensaje cuando no hay saldos (sin gastos o todos en cero)

### 6. Crear Servicio para Saldos Simplificados (Frontend)
**Archivo:** `Frontend/src/services/balance.service.ts` (extender)

- Crear función `getTripSettledBalances(tripId: string): Promise<SettleResponse>`
- Usar endpoint: `POST /trips/:trip_id/balances/settle`
- Crear función helper para mapear `SettleTransactionDto` a `Balance[]`
- El mapeo debe incluir:
  - `id`: generar UUID o usar combinación de from_user_id + to_user_id
  - `fromName`: `from_user_name`
  - `toName`: `to_user_name`
  - `amount`: `amount`
  - `badgeColor`: determinar según contexto (usar 'red' por defecto para deudas)

### 7. Actualizar Estilos y Layout
- Asegurar que la sección de saldos sea responsive
- Usar grid o lista vertical para balances de participantes
- Mantener consistencia con otros tabs (gastos, participantes)
- Aplicar colores según balance (verde/rojo/neutro)

## Estructura de Datos

### Backend Response (BalancesResponseDto)
```typescript
{
  trip_id: string;
  total_expenses: number;
  participant_count: number;
  balances: ParticipantBalanceDto[];
}
```

### ParticipantBalanceDto
```typescript
{
  user_id: string;
  user_name: string;
  user_email: string;
  total_spent: number;
  total_owed: number;
  balance: number; // total_spent - total_owed
}
```

### Backend Response (SettleResponseDto)
```typescript
{
  trip_id: string;
  transactions: SettleTransactionDto[];
  total_transactions: number;
}
```

### SettleTransactionDto
```typescript
{
  from_user_id: string;
  from_user_name: string;
  to_user_id: string;
  to_user_name: string;
  amount: number;
}
```

### Frontend Balance (para BalanceCard)
```typescript
{
  id: string; // Generar o combinar IDs
  fromName: string; // from_user_name
  toName: string; // to_user_name
  amount: number; // amount
  badgeColor: 'red' | 'green' | 'blue'; // Determinar según contexto
}
```

## Componentes a Usar/Modificar

1. **TripDetailPage**: Actualizar sección de saldos
2. **BalanceCard**: Ya existe, usar para mostrar deudas entre participantes
3. **ParticipantBalanceCard**: Nuevo componente para balance individual
4. **StatCard**: Mantener para resumen

## Consideraciones

- El endpoint `/trips/:trip_id/balances` ya existe en el backend
- El endpoint `/trips/:trip_id/balances/settle` existe para saldos simplificados
- Mantener compatibilidad con `TripStats` actual
- Manejar casos edge: sin gastos, sin participantes, balance cero
- Asegurar que los montos se formateen correctamente según la moneda del viaje

## Orden de Implementación

1. ✅ Crear tipos TypeScript
2. ✅ Crear servicio de balances
3. ✅ Crear hook useTripBalances
4. ✅ Crear componente ParticipantBalanceCard
5. ✅ Actualizar TripDetailPage
6. ✅ Probar y ajustar estilos

## Criterios de Aceptación

- ✅ La sección de saldos muestra balances detallados por participante
- ✅ Se muestra quién debe a quién usando BalanceCard
- ✅ Los montos se formatean correctamente según la moneda
- ✅ Se manejan estados de loading y error apropiadamente
- ✅ El diseño es consistente con el resto de la aplicación
- ✅ La funcionalidad es responsive
