# TravelSplit - Especificación Técnica de Interfaz
## Implementación de Navegación Coherente

**Versión:** 2.0  
**Fecha:** 2025-01-02

---

## 🎯 Objetivo

Refactorizar la navegación para que refleje la jerarquía de negocio: **Viaje → Gastos**

---

## 📋 Cambios Requeridos

### 1. BottomTabBar - Sin FAB (Simplificado)

**Estado Actual:**
- FAB siempre visible apuntando a `/expenses/new`

**Estado Deseado:**
- BottomTabBar simplificado con solo 3 items fijos (Home, Viajes, Perfil)
- Sin FAB
- Grid de 3 columnas iguales

**Archivo**: `Frontend/src/components/organisms/BottomTabBar.tsx`

---

### 2. HomePage - Empty State y Resumen

**Estado Actual:**
- Solo muestra título y descripción estática

**Estado Deseado:**
- **Sin viajes:** Empty state con icono, mensaje motivacional y botón "Crear mi primer viaje"
- **Con viajes:** Resumen con total gastado + lista de viajes recientes (máximo 3) + botón "Ver todos mis viajes"

**Componentes nuevos necesarios**:
- `TripCard` (molecule) - Para mostrar viaje en lista
- `formatCurrency` (util) - Para formatear montos

**Archivo**: `Frontend/src/pages/HomePage.tsx`

---

### 3. TripsListPage - Nueva Vista

**Características:**
- Header sticky con título "Mis Viajes" + botón "Crear Viaje" (derecha)
- Lista de `TripCard` con todos los viajes del usuario
- Empty state si no hay viajes (con botón para crear)
- Scroll vertical para lista larga

**Archivo**: `Frontend/src/pages/TripsListPage.tsx` (nuevo)

---

### 4. CreateTripPage - Nueva Vista

**Características:**
- Header con botón "Atrás" y título "Crear Viaje"
- Formulario en Card con:
  - Input para nombre del viaje
  - Información sobre moneda COP (fija)
  - Información sobre código único
  - Botón "Crear Viaje" (full-width)
- Al crear: Redirige a `/trips/:tripId` con toast de éxito

**Servicio necesario**:
- `createTrip` en `Frontend/src/services/trip.service.ts`

**Archivo**: `Frontend/src/pages/CreateTripPage.tsx` (nuevo)

---

### 5. TripDetailPage - Nueva Vista con Tabs

**Características:**
- Header con nombre del viaje + botón "Atrás" + menú acciones (solo CREATOR)
- Tabs sticky: [Gastos] [Saldos] [Participantes]
- **Tab Gastos:**
  - Botón "Nuevo Gasto" full-width arriba de la lista
  - Lista de `ExpenseCard` ordenada por fecha (más reciente primero)
  - Empty state si no hay gastos
- **Tab Saldos:**
  - Card destacado con "Tu Balance"
  - Lista de deudas con `BalanceItem`
- **Tab Participantes:**
  - Lista de `ParticipantCard`
  - Botón "Invitar Participante" (solo CREATOR)

**Componentes nuevos necesarios**:
- `ExpenseCard` (molecule)
- `BalanceItem` (molecule)
- `ParticipantCard` (molecule)
- `ExpensesTab` (componente interno)
- `BalancesTab` (componente interno)
- `ParticipantsTab` (componente interno)

**Archivo**: `Frontend/src/pages/TripDetailPage.tsx` (nuevo)

---

### 6. Rutas - Actualizar Router

**Rutas a agregar:**
- `/trips` → `TripsListPage`
- `/trips/new` → `CreateTripPage`
- `/trips/:tripId` → `TripDetailPage`

**Rutas a eliminar:**
- `/expenses/new` (sin tripId)

**Rutas a mantener:**
- `/trips/:tripId/expenses/new` → `ExpenseFormPage`

**Archivo**: `Frontend/src/routes/index.tsx` o `Frontend/src/App.tsx`

---

## 📦 Componentes Nuevos a Crear

### 1. TripCard (molecule)
- Muestra: Nombre, número de participantes, total gastado, fecha relativa
- Clickable para navegar a detalle
- Estilo: Card con bordes redondeados, sombra suave

### 2. ExpenseCard (molecule)
- Muestra: Icono de categoría, título, pagador, monto, fecha
- Acciones (solo CREATOR): Botones "Editar" y "Eliminar" pequeños
- Estilo: Flex row, icono circular con fondo suave

### 3. BalanceItem (molecule)
- Muestra: "X debe a Y" con badge de monto
- Badge rojo si el usuario es deudor, verde si es acreedor
- Estilo: Lista con separadores

### 4. ParticipantCard (molecule)
- Muestra: Avatar/iniciales, nombre, rol (badge), email
- Acción (solo CREATOR): Botón eliminar si no es el creador
- Estilo: Card horizontal

### 5. EmptyState (molecule)
- Props: icon, title, description, action (opcional)
- Estilo: Centrado vertical y horizontalmente
- Reutilizable para diferentes contextos

---

## 🔧 Servicios a Actualizar/Crear

### 1. trip.service.ts - Agregar createTrip
- Endpoint: `POST /trips`
- Body: `{ name: string }`
- Retorna: `TripResponse`

---

## ✅ Checklist de Implementación

- [ ] Actualizar `BottomTabBar` - Eliminar FAB, mantener solo 3 items fijos
- [ ] Refactorizar `HomePage` con empty state y resumen
- [ ] Crear `TripsListPage` nueva
- [ ] Crear `CreateTripPage` nueva
- [ ] Crear `TripDetailPage` con tabs + Botón "Nuevo Gasto" en tab de Gastos
- [ ] Actualizar rutas en router
- [ ] Crear componente `TripCard`
- [ ] Crear componente `ExpenseCard`
- [ ] Crear componente `BalanceItem`
- [ ] Crear componente `ParticipantCard`
- [ ] Crear componente `EmptyState`
- [ ] Agregar `createTrip` al servicio
- [ ] Eliminar ruta `/expenses/new` sin tripId
- [ ] Actualizar navegación en todos los componentes

---

## 🎯 Resultado Esperado

Después de estos cambios:

1. ✅ El FAB ha sido eliminado completamente
2. ✅ El botón "Nuevo Gasto" está dentro del tab de Gastos, arriba de la lista (solo visible en ese contexto)
3. ✅ La creación de viajes es prominente y accesible
4. ✅ El flujo refleja la jerarquía: Viaje → Gastos
5. ✅ No hay opciones que no tienen sentido en el contexto
6. ✅ La navegación es clara y coherente con la lógica de negocio
7. ✅ BottomTabBar simplificado a 3 items fijos
8. ✅ El botón "Nuevo Gasto" es contextual y está donde el usuario lo necesita
