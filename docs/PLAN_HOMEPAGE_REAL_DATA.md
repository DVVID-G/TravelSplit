# Plan: HomePage con Información Real

**Fecha:** 2025-01-30  
**Objetivo:** Implementar información real en HomePage cuando el usuario está logueado, reemplazando datos mockeados con datos del backend.

---

## USED RULES

- `.cursor/rules/frontend/state-management.mdc` - Gestión de estado con TanStack Query
- `.cursor/rules/frontend/react-core.mdc` - Estándares React v19
- `.cursor/rules/ui-ux/design-system.mdc` - Principios de Atomic Design
- `docs/ui-ux/DESIGN_SYSTEM_GUIDE.md` - Especificaciones del Design System (sección 2.3 HomePage)
- `.cursor/rules/common/code-style.mdc` - Estándares de código TypeScript

---

## LOGIC BREAKDOWN

### Problema
El HomePage actualmente muestra datos mockeados (`MOCK_BALANCES` y `MOCK_RECENT_EXPENSES`) cuando el usuario está autenticado y tiene viajes. Necesitamos reemplazar estos datos con información real del backend.

### Casos Edge
1. **Usuario sin viajes:** Ya está manejado (empty state)
2. **Viajes sin gastos:** No mostrar balances ni gastos recientes, solo viajes
3. **Múltiples viajes:** Agregar balances y mostrar gastos más recientes de todos los viajes
4. **Errores en carga:** Manejar errores por viaje individual sin bloquear toda la página
5. **Diferentes monedas:** Cada viaje puede tener diferente moneda (COP/USD)
6. **Sin balances:** Si no hay deudas, no mostrar sección de balances
7. **Sin gastos recientes:** Si no hay gastos, no mostrar sección de gastos recientes

### Lógica Paso a Paso

1. **Obtener viajes del usuario** (ya implementado)
   - Usar `getUserTrips()` que ya está en el componente
   - Ordenar por `createdAt` descendente para obtener los más recientes

2. **Obtener balances de todos los viajes**
   - Para cada viaje, obtener balances usando `getTripBalances(tripId)`
   - Usar `getTripSettledBalances(tripId)` para obtener transacciones simplificadas
   - Agregar balances de todos los viajes (considerando diferentes monedas)
   - Mapear a formato `Balance[]` usando `mapSettleTransactionsToBalances()`

3. **Obtener gastos recientes de todos los viajes**
   - Para cada viaje, obtener gastos usando `getExpensesByTrip(tripId, { limit: 10 })`
   - Combinar todos los gastos de todos los viajes
   - Ordenar por `expense_date` o `createdAt` descendente
   - Tomar los 3 más recientes
   - Mapear a formato `RecentExpense[]`

4. **Calcular total gastado**
   - Sumar `totalAmount` de todos los viajes
   - Considerar diferentes monedas (mostrar por separado o convertir)

5. **Mostrar viajes recientes**
   - Mostrar máximo 3 viajes más recientes
   - Cada viaje debe tener link a `/trips/:tripId`

---

## Plan de Implementación

### Fase 1: Crear Hook Personalizado para Datos del HomePage

**Archivo:** `Frontend/src/hooks/useHomePageData.ts`

**Responsabilidades:**
- Obtener viajes del usuario
- Obtener balances de todos los viajes (usando `useTripBalances` para cada viaje)
- Obtener gastos recientes de todos los viajes (usando `useExpensesList` para cada viaje)
- Agregar y transformar datos
- Manejar estados de carga y errores

**Estructura:**
```typescript
interface UseHomePageDataResult {
  trips: TripListItem[];
  balances: Balance[];
  recentExpenses: RecentExpense[];
  totalSpent: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}
```

**Consideraciones:**
- Usar `useQueries` de TanStack Query para obtener balances y gastos de múltiples viajes en paralelo
- Manejar errores individuales sin bloquear toda la carga
- Optimizar: solo obtener datos de los 3 viajes más recientes si hay muchos viajes

### Fase 2: Crear Funciones de Transformación

**Archivo:** `Frontend/src/utils/homePageData.ts`

**Funciones:**
1. `mapExpenseListItemToRecentExpense(expense: ExpenseListItem, tripName: string, currency: TripCurrency): RecentExpense`
   - Transforma `ExpenseListItem` a `RecentExpense`
   - Mapea `category_name` a `ExpenseCategory`
   - Obtiene nombre del pagador de `payer` relation o `payer_id`
   - Calcula `participantCount` desde `beneficiaries.length`

2. `aggregateBalancesFromTrips(balancesResponses: BalancesResponse[], currentUserId: string): Balance[]`
   - Agrega balances de múltiples viajes
   - Filtra balances donde el usuario actual está involucrado
   - Determina `badgeColor` basado en si el usuario debe o le deben

3. `getTotalSpentFromTrips(trips: TripListItem[]): number`
   - Suma `totalAmount` de todos los viajes
   - Considera diferentes monedas (por ahora, asumir misma moneda o mostrar por separado)

### Fase 3: Actualizar HomePage Component

**Archivo:** `Frontend/src/pages/HomePage.tsx`

**Cambios:**
1. Remover `MOCK_BALANCES` y `MOCK_RECENT_EXPENSES`
2. Importar y usar `useHomePageData` hook
3. Actualizar `HomePageWithTrips` para usar datos reales
4. Agregar manejo de estados de carga para balances y gastos
5. Agregar manejo de errores individuales
6. Mostrar mensaje cuando no hay balances o gastos

### Fase 4: Mejorar UI según Design System Guide

**Cambios en `HomePageWithTrips`:**
1. Agregar sección de "Total Gastado" (card destacada)
2. Mostrar viajes recientes (máximo 3) con cards clickeables
3. Agregar link "Ver todos mis viajes" → `/trips`
4. Mejorar empty states cuando no hay balances o gastos
5. Agregar indicadores de carga para cada sección

---

## Estructura de Datos

### Balance Agregado
```typescript
interface Balance {
  id: string;
  fromName: string;
  toName: string;
  amount: number;
  badgeColor: 'red' | 'green' | 'blue';
  tripId?: string; // Opcional: para navegación
  tripName?: string; // Opcional: para contexto
}
```

### RecentExpense Transformado
```typescript
interface RecentExpense {
  id: string;
  category: ExpenseCategory;
  title: string;
  paidBy: string;
  date: string;
  amount: number;
  participantCount: number;
  tripId?: string; // Para navegación
  tripName?: string; // Para contexto
}
```

---

## Optimizaciones

1. **Lazy Loading:** Solo cargar balances y gastos de los 3 viajes más recientes inicialmente
2. **Caching:** Usar `staleTime` apropiado en queries (30s para gastos, 60s para balances)
3. **Error Handling:** Si un viaje falla al cargar, continuar con los demás
4. **Loading States:** Mostrar skeletons por sección en lugar de bloqueo total

---

## Testing

1. **Usuario sin viajes:** Verificar empty state
2. **Usuario con 1 viaje:** Verificar que muestra balances y gastos correctamente
3. **Usuario con múltiples viajes:** Verificar agregación de balances y ordenamiento de gastos
4. **Viaje sin gastos:** Verificar que no muestra sección de gastos recientes
5. **Viaje sin balances:** Verificar que no muestra sección de balances
6. **Errores de red:** Verificar manejo de errores sin bloquear página

---

## Checklist de Implementación

- [ ] Crear hook `useHomePageData`
- [ ] Crear funciones de transformación en `utils/homePageData.ts`
- [ ] Actualizar `HomePage.tsx` para usar datos reales
- [ ] Remover datos mockeados (`MOCK_BALANCES`, `MOCK_RECENT_EXPENSES`)
- [ ] Agregar manejo de estados de carga por sección
- [ ] Agregar manejo de errores individuales
- [ ] Agregar sección de "Total Gastado"
- [ ] Agregar cards de viajes recientes
- [ ] Agregar link "Ver todos mis viajes"
- [ ] Mejorar empty states
- [ ] Probar con diferentes escenarios (sin viajes, con viajes, con errores)
- [ ] Verificar accesibilidad y responsive design

---

## Notas Adicionales

1. **Monedas Múltiples:** Por ahora, asumir que todos los viajes usan la misma moneda o mostrar totales por moneda. La conversión de monedas puede ser una mejora futura.

2. **Performance:** Si el usuario tiene muchos viajes, considerar paginación o límite de viajes a procesar.

3. **Actualización en Tiempo Real:** Considerar usar `refetchInterval` o `refetchOnWindowFocus` para mantener datos actualizados.

4. **Navegación:** Los balances y gastos recientes deben ser clickeables y navegar al viaje correspondiente.
