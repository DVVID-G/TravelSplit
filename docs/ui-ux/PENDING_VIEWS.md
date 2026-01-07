# TravelSplit - Vistas Pendientes por Desarrollar

**Versión:** 1.0  
**Fecha:** 2025-01-02  
**Basado en:** `docs/UI_FLOW_DESIGN.md`

---

## 📋 Resumen Ejecutivo

Este documento lista todas las vistas y componentes pendientes de implementar según el diseño de interfaz visual coherente definido en `UI_FLOW_DESIGN.md`.

**Total de tareas:** 4 vistas nuevas + 3 refactorizaciones + 5 componentes nuevos = 12 tareas principales

---

## 🎯 Vistas Pendientes por Desarrollar

### 1. HomePage - Refactorización Completa

**Estado Actual:** Implementada básicamente (solo muestra título y descripción)

**Archivo:** `Frontend/src/pages/HomePage.tsx`

**Pendiente:**

#### Estado 1: Usuario No Autenticado
- Botones "Iniciar sesión" y "Crear cuenta"
- Sin BottomTabBar
- Icono grande (Map, 64px, color slate-300)
- Mensaje: "¿Planeando una escapada?"
- Descripción: "Inicia sesión o regístrate para empezar a dividir gastos"
- Fondo: `bg-slate-50`

#### Estado 2: Usuario Autenticado Sin Viajes
- Empty state con botón "Crear mi primer viaje"
- Con BottomTabBar
- Mismo estilo visual que estado 1
- Icono grande (Map, 64px)
- Mensaje: "¿Planeando una escapada?"
- Descripción: "Crea tu primer viaje para empezar a dividir gastos fácilmente"

#### Estado 3: Usuario Autenticado Con Viajes
- Resumen con total gastado
- Lista de viajes recientes (máximo 3) usando `TripCard`
- Botón "Ver todos mis viajes" que navega a `/trips`
- Con BottomTabBar

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 1 y Pantalla 1b
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md`

---

### 2. LoginPage - Mejora

**Estado Actual:** Implementada y funcional

**Archivo:** `Frontend/src/pages/LoginPage.tsx`

**Pendiente:**
- Agregar header con botón "←" que navegue a `/` (HomePage no autenticada)
- El header debe seguir el patrón estándar: `[←] Iniciar sesión`
- Altura: 64px (h-16)
- Padding: 24px horizontal (px-6)
- Fondo: Blanco (bg-white)
- Borde: 1px slate-200 inferior (border-b)

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 0.1
- Especificaciones de Header: `docs/UI_FLOW_DESIGN.md` - Sección "Headers Estándar"

---

### 3. RegisterPage - Mejora

**Estado Actual:** Implementada y funcional

**Archivo:** `Frontend/src/pages/RegisterPage.tsx`

**Pendiente:**
- Agregar header con botón "←" que navegue a `/` (HomePage no autenticada)
- El header debe seguir el patrón estándar: `[←] Crear cuenta`
- Mismas especificaciones de header que LoginPage

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 0.2
- Especificaciones de Header: `docs/UI_FLOW_DESIGN.md` - Sección "Headers Estándar"

---

### 4. TripsListPage - Nueva Vista

**Estado Actual:** No existe

**Archivo:** `Frontend/src/pages/TripsListPage.tsx` (crear nuevo)

**Pendiente:**
- Header sticky con título "Mis Viajes" + botón "Crear Viaje" (derecha)
- Lista de `TripCard` con todos los viajes del usuario
- Empty state si no hay viajes (con botón para crear)
- Scroll vertical para lista larga
- Con BottomTabBar (tab "Map" activo)
- Espaciado: `px-6 py-8` (24px horizontal, 32px vertical)
- Espaciado entre cards: `space-y-4` o `space-y-6`

**Ruta:** `/trips`

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 3
- Especificación técnica: `docs/UI_IMPLEMENTATION_SPEC.md` - Sección 3

---

### 5. CreateTripPage - Nueva Vista

**Estado Actual:** No existe

**Archivo:** `Frontend/src/pages/CreateTripPage.tsx` (crear nuevo)

**Pendiente:**
- Header con botón "←" y título "Crear Viaje"
- Formulario en Card con:
  - Input para nombre del viaje (h-12, rounded-xl)
  - Información sobre moneda COP (fija) - texto informativo
  - Información sobre código único - texto informativo
  - Botón "Crear Viaje" (h-12, full-width, bg-violet-600)
- Al crear: Redirige a `/trips/:tripId` con toast de éxito
- Con BottomTabBar
- Validación: Nombre requerido, mínimo 3 caracteres

**Ruta:** `/trips/new`

**Servicio necesario:**
- `createTrip` en `Frontend/src/services/trip.service.ts`
- Endpoint: `POST /trips`
- Body: `{ name: string }`
- Retorna: `TripResponse`

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 2
- Especificación técnica: `docs/UI_IMPLEMENTATION_SPEC.md` - Sección 4

---

### 6. TripDetailPage - Nueva Vista

**Estado Actual:** No existe

**Archivo:** `Frontend/src/pages/TripDetailPage.tsx` (crear nuevo)

**Pendiente:**

#### Header
- Nombre del viaje + botón "←" + menú acciones (solo CREATOR)
- Menú acciones: Editar viaje, Eliminar viaje, etc.

#### Tabs Sticky
- [Gastos] [Saldos] [Participantes]
- Tab activo: `text-violet-600 font-semibold border-b-2 border-violet-600`
- Tab inactivo: `text-slate-500 font-medium`
- Fondo sticky: `bg-white border-b border-slate-200`
- Transición: `transition-colors duration-200`

#### Tab Gastos
- Botón "Nuevo Gasto" full-width arriba de la lista (h-12, bg-violet-600)
- Lista de `ExpenseCard` ordenada por fecha (más reciente primero)
- Empty state si no hay gastos
- Click en ExpenseCard → Ver detalle (opcional, modal o página)

#### Tab Saldos
- Card destacado con "Tu Balance"
  - Badge verde si el usuario es acreedor (bg-emerald-100, text-emerald-700)
  - Badge rojo si el usuario es deudor (bg-red-100, text-red-700)
- Lista de deudas con `BalanceItem`
- Separadores entre items: `border-b border-slate-200`

#### Tab Participantes
- Lista de `ParticipantCard`
- Botón "Invitar Participante" (solo CREATOR)
- Click en "Invitar Participante" → Modal de invitación

#### General
- Con BottomTabBar
- Scroll vertical para contenido largo

**Ruta:** `/trips/:tripId`

**Referencias:**
- Mockup: `docs/UI_FLOW_DESIGN.md` - Pantalla 4, 6, 7
- Especificación técnica: `docs/UI_IMPLEMENTATION_SPEC.md` - Sección 5

---

### 7. BottomTabBar - Refactorización

**Estado Actual:** Implementado con FAB

**Archivo:** `Frontend/src/components/organisms/BottomTabBar.tsx`

**Pendiente:**
- Eliminar FAB completamente
- Mantener solo 3 items fijos:
  1. **Home** (Icono: Home) → `/`
  2. **Viajes** (Icono: Map) → `/trips`
  3. **Perfil** (Icono: User) → `/profile`
- Grid de 3 columnas iguales
- Indicador visual de tab activo:
  - Activo: Icono y texto en `violet-600` + posible línea inferior
  - Inactivo: Icono y texto en `slate-400`
  - Hover: Transición suave a `slate-500`
- Altura fija: 64px (h-16)
- Fondo: Blanco (bg-white)
- Borde superior: 1px slate-200 (border-t)
- Sticky: bottom-0 z-40

**Referencias:**
- Especificación técnica: `docs/UI_IMPLEMENTATION_SPEC.md` - Sección 1
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Sección 2.3

---

##  Componentes Nuevos Necesarios

### Molecules

#### 1. TripCard

**Archivo:** `Frontend/src/components/molecules/TripCard.tsx` (crear nuevo)

**Props:**
```typescript
interface TripCardProps {
  trip: {
    id: string;
    name: string;
    participantCount: number;
    totalAmount: number;
    currency: string;
    updatedAt: string;
  };
  onClick?: () => void;
}
```

**Características:**
- Muestra: Nombre, número de participantes, total gastado, fecha relativa
- Clickable para navegar a detalle
- Estilo: Card con bordes redondeados (rounded-xl), sombra suave (shadow-md)
- Padding: p-6 (24px todos los lados)
- Fondo: bg-white
- Iconos: Map, Users, DollarSign, Calendar (lucide-react)

**Referencias:**
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Componente TripCard

---

#### 2. ExpenseCard

**Archivo:** `Frontend/src/components/molecules/ExpenseCard.tsx` (crear nuevo)

**Props:**
```typescript
interface ExpenseCardProps {
  expense: {
    id: string;
    title: string;
    category: string;
    amount: number;
    currency: string;
    paidBy: {
      id: string;
      name: string;
    };
    createdAt: string;
  };
  currentUserId: string;
  isCreator: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Características:**
- Muestra: Icono de categoría, título, pagador, monto, fecha
- Acciones (solo CREATOR): Botones "Editar" y "Eliminar" pequeños
- Estilo: Flex row, icono circular con fondo suave (bg-slate-100)
- Padding: p-4 (16px todos los lados)
- Fondo: bg-white
- Border radius: rounded-xl

**Referencias:**
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Componente ExpenseCard

---

#### 3. BalanceItem

**Archivo:** `Frontend/src/components/molecules/BalanceItem.tsx` (crear nuevo)

**Props:**
```typescript
interface BalanceItemProps {
  debtor: {
    id: string;
    name: string;
  };
  creditor: {
    id: string;
    name: string;
  };
  amount: number;
  currency: string;
  currentUserId: string;
}
```

**Características:**
- Muestra: "X debe a Y" con badge de monto
- Badge rojo si el usuario es deudor (bg-red-100, text-red-700)
- Badge verde si el usuario es acreedor (bg-emerald-100, text-emerald-700)
- Estilo: Lista con separadores (border-b border-slate-200)
- Padding: py-3 (12px vertical)

**Referencias:**
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Componente BalanceItem

---

#### 4. ParticipantCard

**Archivo:** `Frontend/src/components/molecules/ParticipantCard.tsx` (crear nuevo)

**Props:**
```typescript
interface ParticipantCardProps {
  participant: {
    id: string;
    name: string;
    email: string;
    role: 'CREATOR' | 'PARTICIPANT';
  };
  isCurrentUser: boolean;
  isCreator: boolean;
  onRemove?: () => void;
}
```

**Características:**
- Muestra: Avatar/iniciales, nombre, rol (badge), email
- Badge violeta para CREATOR (bg-violet-100, text-violet-700)
- Badge gris para PARTICIPANT (bg-slate-100, text-slate-700)
- Acción (solo CREATOR): Botón eliminar si no es el creador
- Estilo: Card horizontal
- Padding: p-4 (16px todos los lados)
- Fondo: bg-white
- Border radius: rounded-xl

**Referencias:**
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Componente ParticipantCard

---

#### 5. EmptyState

**Archivo:** `Frontend/src/components/molecules/EmptyState.tsx` (crear nuevo)

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Características:**
- Props: icon, title, description, action (opcional)
- Estilo: Centrado vertical y horizontalmente
- Reutilizable para diferentes contextos
- Icono por defecto: Map (64px, color slate-300)
- Espaciado: py-12 (48px vertical)

**Referencias:**
- Design System: `docs/DESIGN_SYSTEM_GUIDE.md` - Sección 4.2 Empty States

---

### Componentes Internos de TripDetailPage

#### 6. ExpensesTab

**Archivo:** `Frontend/src/pages/TripDetailPage.tsx` (componente interno)

**Características:**
- Renderiza el contenido del tab "Gastos"
- Incluye botón "Nuevo Gasto" arriba
- Lista de ExpenseCard o EmptyState

---

#### 7. BalancesTab

**Archivo:** `Frontend/src/pages/TripDetailPage.tsx` (componente interno)

**Características:**
- Renderiza el contenido del tab "Saldos"
- Card destacado con balance del usuario
- Lista de BalanceItem

---

#### 8. ParticipantsTab

**Archivo:** `Frontend/src/pages/TripDetailPage.tsx` (componente interno)

**Características:**
- Renderiza el contenido del tab "Participantes"
- Lista de ParticipantCard
- Botón "Invitar Participante" (solo CREATOR)

---

## Resumen por Prioridad

### 🔴 Alta Prioridad (Core del Sistema)

1. **HomePage** (Refactorización completa)
   - Base de la aplicación
   - Punto de entrada para usuarios autenticados y no autenticados
   - Requiere lógica condicional basada en estado de autenticación

2. **TripsListPage** (Nueva vista)
   - Vista principal de navegación
   - Acceso a todos los viajes
   - Requiere componente TripCard

3. **CreateTripPage** (Nueva vista)
   - Permite crear viajes (caso de uso UC2)
   - Requiere servicio `createTrip`

4. **TripDetailPage** (Nueva vista)
   - Vista central del sistema
   - Muestra gastos, saldos y participantes
   - Requiere múltiples componentes (ExpenseCard, BalanceItem, ParticipantCard)
   - Requiere tabs de navegación

---

### 🟡 Media Prioridad (Mejoras de UX)

5. **BottomTabBar** (Refactorización)
   - Simplificar navegación
   - Eliminar FAB
   - Mejorar indicadores visuales

6. **LoginPage** (Mejora)
   - Agregar header con botón atrás
   - Mejorar navegación

7. **RegisterPage** (Mejora)
   - Agregar header con botón atrás
   - Mejorar navegación

---

### 🟢 Baja Prioridad (Componentes de Soporte)

8. **TripCard** (Nuevo componente)
   - Requerido para TripsListPage y HomePage

9. **ExpenseCard** (Nuevo componente)
   - Requerido para TripDetailPage - Tab Gastos

10. **BalanceItem** (Nuevo componente)
    - Requerido para TripDetailPage - Tab Saldos

11. **ParticipantCard** (Nuevo componente)
    - Requerido para TripDetailPage - Tab Participantes

12. **EmptyState** (Nuevo componente)
    - Reutilizable para múltiples vistas
    - Mejora UX en estados vacíos

---

## 🔧 Servicios a Actualizar/Crear

### 1. trip.service.ts - Agregar createTrip

**Archivo:** `Frontend/src/services/trip.service.ts`

**Función:**
```typescript
export async function createTrip(data: { name: string }): Promise<TripResponse> {
  // Endpoint: POST /trips
  // Body: { name: string }
  // Retorna: TripResponse
}
```

---

## 📝 Checklist de Implementación

### Fase 1: Componentes Base
- [ ] Crear componente `EmptyState`
- [ ] Crear componente `TripCard`
- [ ] Crear componente `ExpenseCard`
- [ ] Crear componente `BalanceItem`
- [ ] Crear componente `ParticipantCard`

### Fase 2: Servicios
- [ ] Agregar `createTrip` al servicio `trip.service.ts`

### Fase 3: Vistas Principales
- [ ] Refactorizar `HomePage` (3 estados)
- [ ] Crear `TripsListPage`
- [ ] Crear `CreateTripPage`
- [ ] Crear `TripDetailPage` (con tabs)

### Fase 4: Mejoras de Navegación
- [ ] Refactorizar `BottomTabBar` (eliminar FAB)
- [ ] Mejorar `LoginPage` (agregar header con botón atrás)
- [ ] Mejorar `RegisterPage` (agregar header con botón atrás)

### Fase 5: Rutas
- [ ] Actualizar router con nuevas rutas:
  - `/trips` → `TripsListPage`
  - `/trips/new` → `CreateTripPage`
  - `/trips/:tripId` → `TripDetailPage`
- [ ] Eliminar ruta `/expenses/new` sin tripId (si existe)
- [ ] Mantener ruta `/trips/:tripId/expenses/new` → `ExpenseFormPage`

---

## 📚 Referencias

- **Diseño Visual:** `docs/UI_FLOW_DESIGN.md`
- **Especificación Técnica:** `docs/UI_IMPLEMENTATION_SPEC.md`
- **Design System:** `docs/DESIGN_SYSTEM_GUIDE.md`
- **Auditoría UX/UI:** `docs/UX_UI_AUDIT.md`
- **Product Backlog:** `docs/ProductBacklog.md`
- **Use Case Diagram:** `docs/UseCaseDiagram.md`

---

## 🎯 Resultado Esperado

Después de completar todas las tareas:

1. ✅ HomePage muestra estados apropiados según autenticación
2. ✅ LoginPage y RegisterPage tienen navegación de regreso
3. ✅ BottomTabBar simplificado sin FAB
4. ✅ TripsListPage permite ver y crear viajes
5. ✅ CreateTripPage permite crear nuevos viajes
6. ✅ TripDetailPage muestra gastos, saldos y participantes con tabs
7. ✅ Botón "Nuevo Gasto" está contextualmente en el tab de Gastos
8. ✅ Todos los componentes reutilizables están creados
9. ✅ La navegación refleja la jerarquía: Viaje → Gastos
10. ✅ El flujo es coherente con la lógica de negocio

---

**Última actualización:** 2025-01-02

