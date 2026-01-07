# TravelSplit - Diseño de Interfaz Visual Coherente
## Mock y Flujos de Navegación

**Versión:** 2.0  
**Fecha:** 2025-01-02  
**Principio:** La interfaz debe reflejar la jerarquía de negocio: **Viaje → Gastos**

---

## 🎯 Principios de Diseño

### 1. Jerarquía Clara
- **Viaje es el contenedor principal** - Sin viaje, no hay gastos
- Los gastos solo existen dentro de un viaje
- La navegación debe reflejar esta dependencia

### 2. Acciones Contextuales
- **Crear Viaje**: Acción primaria cuando no hay viaje activo
- **Crear Gasto**: Solo visible cuando estás dentro de un viaje (tab de Gastos)
- Todas las acciones están integradas en las vistas correspondientes

### 3. Flujo Natural

**Flujo completo desde entrada sin autenticación:**
```
Home (no auth) → Login/Register → Home (auth) → Viajes → [Crear Viaje] → Detalle Viaje → Tab Gastos → [Crear Gasto]
```

**Navegación entre autenticación:**
- Home (no auth) → Login → Home (auth)
- Home (no auth) → Register → Login → Home (auth)
- Login → [←] → Home (no auth)
- Register → [←] → Home (no auth)

---

## 📱 Estructura de Navegación

### Bottom Tab Bar

**Items (3 fijos):**

1. **Home/Resumen** (Icono: Home)
   - Vista de resumen general o empty state
   - Acceso rápido a viajes recientes (si existen)

2. **Mis Viajes** (Icono: Map) 
   - Lista de todos los viajes
   - **Acción principal**: Crear nuevo viaje (botón en header)

3. **Perfil** (Icono: User)
   - Configuración de usuario

**Nota:** El FAB ha sido eliminado. La acción "Nuevo Gasto" está integrada directamente en el tab de Gastos del detalle del viaje.

---

## 🎨 Mock Visual - Flujos Completos

### FLUJO 0: Autenticación (Punto de Entrada)

**Nota**: Las páginas de autenticación (Login y Register) NO muestran BottomTabBar. Son páginas independientes que redirigen a la aplicación principal tras autenticación exitosa. Ambas tienen botón "←" en el header para regresar a HomePage.

#### Pantalla 0.1: LoginPage
```
┌─────────────────────────────────────┐
│  [←] Iniciar sesión                  │ ← Header con botón atrás (navega a /)
├─────────────────────────────────────┤
│                                     │
│  (Fondo: bg-slate-50)               │
│                                     │
│         ┌─────────────────────┐     │ ← Card centrado (bg-white, rounded-2xl, shadow-lg)
│         │                     │     │    (p-6 md:p-8, max-w-md, w-full)
│         │  Iniciar sesión     │     │ ← Título (text-2xl md:text-3xl, font-heading, bold)
│         │                     │     │
│         │  Ingresa tus        │     │ ← Subtítulo (text-slate-500, mb-6)
│         │  credenciales para  │     │
│         │  acceder            │     │
│         │                     │     │
│         │  Email              │     │ ← Label (text-sm font-medium text-slate-700)
│         │  ┌───────────────┐  │     │
│         │  │ juan@example  │  │     │ ← Input (h-12, rounded-xl, text-base, border)
│         │  └───────────────┘  │     │    placeholder: "juan@example.com"
│         │                     │     │
│         │  Contraseña         │     │
│         │  ┌───────────────┐  │     │
│         │  │ ••••••••      │  │     │ ← Input password (h-12, rounded-xl)
│         │  └───────────────┘  │     │    placeholder: "Tu contraseña"
│         │                     │     │
│         │  [Mensaje error]     │     │ ← Si hay error: bg-red-50, border-red-200
│         │                     │     │    (text-red-500, rounded-xl, p-3)
│         │                     │     │
│         │  ┌───────────────┐  │     │
│         │  │ Iniciar sesión│  │     │ ← Botón primario (h-12, full-width, bg-violet-600)
│         │  └───────────────┘  │     │    Loading: spinner + "Iniciando sesión..."
│         │                     │     │
│         │  ¿No tienes cuenta? │     │ ← Texto (text-sm text-slate-600, text-center)
│         │  Regístrate        │     │ ← Link (text-violet-600, font-medium, hover)
│         │                     │     │
│         └─────────────────────┘     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Características:**
- Header con botón "←" para regresar a HomePage (`/`)
- Fondo: `bg-slate-50` (no blanco puro)
- Card centrado vertical y horizontalmente
- Sin BottomTabBar (páginas de autenticación)
- Inputs con altura mínima 48px (h-12) para evitar zoom en iOS
- Manejo de errores: Card rojo con mensaje descriptivo
- Estado de carga: Botón muestra spinner y texto "Iniciando sesión..."
- Link a registro en la parte inferior centrado

**Acción**: Click en "Iniciar sesión" → `/` (HomePage autenticada)
**Acción alternativa**: Click en "Regístrate" → `/register`
**Acción alternativa**: Click en botón "←" → `/` (HomePage no autenticada)

**Estados y Validaciones:**
- **Credenciales inválidas**: Muestra error "Email o contraseña incorrectos" (bg-red-50, border-red-200)
- **Errores de red**: Muestra mensaje "No pudimos conectarnos con el servidor"
- **Éxito**: Redirección automática a `/` (HomePage)
- **Loading**: Botón muestra spinner y texto "Iniciando sesión..." (disabled)

---

#### Pantalla 0.2: RegisterPage
```
┌─────────────────────────────────────┐
│  [←] Crear cuenta                    │ ← Header con botón atrás (navega a /)
├─────────────────────────────────────┤
│                                     │
│  (Fondo: bg-slate-50)               │
│                                     │
│         ┌─────────────────────┐     │ ← Card centrado (bg-white, rounded-2xl, shadow-lg)
│         │                     │     │    (p-6 md:p-8, max-w-md, w-full)
│         │  Crear cuenta       │     │ ← Título (text-2xl md:text-3xl, font-heading, bold)
│         │                     │     │
│         │  Regístrate para     │     │ ← Subtítulo (text-slate-500, mb-6)
│         │  empezar a dividir   │     │
│         │  gastos              │     │
│         │                     │     │
│         │  Nombre              │     │ ← Label (text-sm font-medium text-slate-700)
│         │  ┌───────────────┐  │     │
│         │  │ Juan Pérez    │  │     │ ← Input (h-12, rounded-xl, text-base, border)
│         │  └───────────────┘  │     │    placeholder: "Juan Pérez"
│         │                     │     │
│         │  Email              │     │
│         │  ┌───────────────┐  │     │
│         │  │ juan@example  │  │     │ ← Input email (h-12, rounded-xl)
│         │  └───────────────┘  │     │    placeholder: "juan@example.com"
│         │                     │     │
│         │  Contraseña         │     │
│         │  ┌───────────────┐  │     │
│         │  │ ••••••••      │  │     │ ← Input password (h-12, rounded-xl)
│         │  └───────────────┘  │     │    placeholder: "Al menos 8 caracteres"
│         │                     │     │
│         │  [Mensaje error]     │     │ ← Si hay error: bg-red-50, border-red-200
│         │                     │     │    (text-red-500, rounded-xl, p-3)
│         │                     │     │
│         │  ┌───────────────┐  │     │
│         │  │ Registrarse   │  │     │ ← Botón primario (h-12, full-width, bg-violet-600)
│         │  └───────────────┘  │     │    Loading: spinner + "Registrando..."
│         │                     │     │
│         │  ¿Ya tienes cuenta? │     │ ← Texto (text-sm text-slate-600, text-center)
│         │  Inicia sesión      │     │ ← Link (text-violet-600, font-medium, hover)
│         │                     │     │
│         └─────────────────────┘     │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Características:**
- Header con botón "←" para regresar a HomePage (`/`)
- Mismo estilo que LoginPage para coherencia visual
- Card centrado con mismo padding y border radius
- Tres campos: Nombre, Email, Contraseña
- Validación visual de errores (email duplicado, contraseña corta, etc.)
- Estado de carga: Botón muestra spinner y texto "Registrando..."
- Link a login en la parte inferior centrado

**Acción**: Click en "Registrarse" → `/login` (redirige a login tras registro exitoso)
**Acción alternativa**: Click en "Inicia sesión" → `/login`
**Acción alternativa**: Click en botón "←" → `/` (HomePage no autenticada)

**Estados y Validaciones:**
- **Email duplicado**: Muestra error en el campo email "Este email ya está registrado" (text-red-500)
- **Contraseña corta**: Muestra error "La contraseña debe tener al menos 8 caracteres"
- **Errores de red**: Muestra mensaje general "No pudimos conectarnos con el servidor" (bg-red-50, border-red-200)
- **Éxito**: Toast de confirmación + redirección automática a `/login`
- **Loading**: Botón muestra spinner y texto "Registrando..." (disabled)

---

### FLUJO 1: Usuario Nuevo (Sin Viajes)

#### Pantalla 1: HomePage - Usuario No Autenticado
```
┌─────────────────────────────────────┐
│  TravelSplit                         │ ← Header estándar (sin acciones)
├─────────────────────────────────────┤
│                                     │
│         [Map Icon - 64px]           │ ← Icono grande, color slate-300
│                                     │
│    ¿Planeando una escapada?        │ ← Título h2, font-heading, bold
│                                     │
│  Inicia sesión o regístrate para    │ ← Descripción, text-slate-600
│     empezar a dividir gastos        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Iniciar sesión            │   │ ← Botón primario, full-width max-w-xs
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   Crear cuenta               │   │ ← Botón secundario, full-width max-w-xs
│  └─────────────────────────────┘   │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Acciones**:
- Click en "Iniciar sesión" → `/login`
- Click en "Crear cuenta" → `/register`

**Nota**: Esta pantalla es accesible sin autenticación. No muestra BottomTabBar.

---

#### Pantalla 1b: HomePage - Usuario Autenticado (Sin Viajes)
```
┌─────────────────────────────────────┐
│  TravelSplit                         │ ← Header estándar (sin acciones)
├─────────────────────────────────────┤
│                                     │
│         [Map Icon - 64px]           │ ← Icono grande, color slate-300
│                                     │
│    ¿Planeando una escapada?        │ ← Título h2, font-heading, bold
│                                     │
│  Crea tu primer viaje para empezar │ ← Descripción, text-slate-600
│     a dividir gastos fácilmente     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   + Crear mi primer viaje   │   │ ← Botón primario, full-width max-w-xs
│  └─────────────────────────────┘   │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │ ← BottomTabBar (3 items)
└─────────────────────────────────────┘
```

**Acción**: Click en "Crear mi primer viaje" → `/trips/new`

**Nota**: Esta pantalla solo se muestra si el usuario está autenticado. Muestra BottomTabBar.

---

#### Pantalla 2: CreateTripPage
```
┌─────────────────────────────────────┐
│  [←] Crear Viaje                    │ ← Header estándar con botón atrás
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │ ← Card (bg-white, rounded-xl, p-6)
│  │                             │   │
│  │  Nombre del viaje           │   │ ← Label, text-sm font-medium
│  │  ┌───────────────────────┐ │   │
│  │  │ Ej: Viaje a Cartagena  │ │   │ ← Input (h-12, rounded-xl)
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  │  ℹ️ Moneda: COP             │   │ ← Info text, text-slate-500
│  │  ℹ️ Se generará un código   │   │
│  │     único para invitar     │   │
│  │                             │   │
│  │  ┌───────────────────────┐ │   │
│  │  │    Crear Viaje        │ │   │ ← Botón primario (h-12, full-width)
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │
└─────────────────────────────────────┘
```

**Acción**: Crear viaje → Redirige a `/trips/:tripId`

---

### FLUJO 2: Usuario con Viajes

#### Pantalla 3: TripsListPage
```
┌─────────────────────────────────────┐
│  Mis Viajes          [+ Crear Viaje] │ ← Header sticky, botón derecha
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │ ← TripCard (bg-white, rounded-xl, p-6)
│  │ [Map Icon] Viaje a Cartagena│   │ ← Icono + Título (font-semibold)
│  │                             │   │
│  │ [Users] 4 participantes     │   │ ← Icono + Texto (text-slate-500)
│  │ [Dollar] $ 1.250.000        │   │ ← Monto (font-semibold)
│  │ [Calendar] Hace 2 días      │   │ ← Fecha relativa (text-slate-500)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Map Icon] Fin de semana    │   │
│  │         Bogotá              │   │
│  │                             │   │
│  │ [Users] 3 participantes     │   │
│  │ [Dollar] $ 450.000          │   │
│  │ [Calendar] Hace 1 semana    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │ ← BottomTabBar (Map activo)
└─────────────────────────────────────┘
```

**Acciones**:
- Click en TripCard → `/trips/:tripId`
- Click en "+ Crear Viaje" → `/trips/new`

---

#### Pantalla 4: TripDetailPage - Tab Gastos
```
┌─────────────────────────────────────┐
│  [←] Viaje a Cartagena      [⋮]    │ ← Header estándar + menú (solo CREATOR)
├─────────────────────────────────────┤
│                                     │
│  [Gastos] [Saldos] [Participantes] │ ← Tabs sticky (bg-white, border-b)
│  ─────────────────────────────────  │ ← Tab activo: violet-600 + border-b-2
│                                     │
│  ┌─────────────────────────────┐   │
│  │  [+ Nuevo Gasto]            │   │ ← Botón primario (h-12, full-width, mb-6)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← ExpenseCard (bg-white, rounded-xl, p-4)
│  │ [Utensils] Cena restaurante │   │ ← Icono categoría (círculo bg-slate-100)
│  │    Pagado por: Juan          │   │ ← Texto secundario (text-slate-500)
│  │    $ 120.000          Hoy    │   │ ← Monto (font-semibold) + Fecha
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Car] Taxi aeropuerto       │   │
│  │    Pagado por: María         │   │
│  │    $ 45.000          Ayer     │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │
└─────────────────────────────────────┘
```

**Acciones**:
- Click en "Nuevo Gasto" → `/trips/:tripId/expenses/new`
- Click en ExpenseCard → Ver detalle (opcional)
- Tab "Saldos" → Ver balances
- Tab "Participantes" → Ver/Invitar

---

#### Pantalla 5: ExpenseFormPage (Dentro del Viaje)
```
┌─────────────────────────────────────┐
│  [←] Nuevo Gasto                    │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │  Título del gasto           │   │
│  │  ┌───────────────────────┐ │   │
│  │  │ Ej: Cena restaurante  │ │   │
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  │  Monto (COP)                │   │
│  │  ┌───────────────────────┐ │   │
│  │  │        $ 120.000     │ │   │ ← Input grande
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  │  Categoría                  │   │
│  │  [🍽️] [🚗] [🏨] [🎬] [📦] │   │ ← Pills horizontales
│  │                             │   │
│  │  Pagador                    │   │
│  │  ┌───────────────────────┐ │   │
│  │  │ 👤 Juan (Tú)    [▼]  │ │   │
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  │  Beneficiarios              │   │
│  │  ☑️ Todos                   │   │
│  │  ☑️ Juan                    │   │
│  │  ☑️ María                   │   │
│  │  ☑️ Pedro                   │   │
│  │                             │   │
│  │  📷 Foto (Opcional)         │   │
│  │  [📷 Añadir foto]           │   │
│  │                             │   │
│  │  ┌───────────────────────┐ │   │
│  │  │    Crear Gasto        │ │   │
│  │  └───────────────────────┘ │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [🏠] [🗺️] [👤]                      │
└─────────────────────────────────────┘
```

**Acción**: Crear gasto → Vuelve a `/trips/:tripId` con toast de éxito

---

### FLUJO 3: Ver Saldos

#### Pantalla 6: TripDetailPage - Tab Saldos
```
┌─────────────────────────────────────┐
│  [←] Viaje a Cartagena      [⋮]    │ ← Header estándar
├─────────────────────────────────────┤
│                                     │
│  [Gastos] [Saldos] [Participantes] │ ← Tabs (Saldos activo)
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │ ← Card destacado (bg-white, rounded-xl, p-6)
│  │  Tu Balance                 │   │ ← Título sección (font-semibold)
│  │                             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │  Te deben $ 25.000   │  │   │ ← Badge verde (bg-emerald-100, text-emerald-700)
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │ ← Card lista (bg-white, rounded-xl, p-6)
│  │  Resumen de Deudas           │   │ ← Título sección
│  │                             │   │
│  │  Juan debe a Pedro          │   │ ← Texto (font-medium)
│  │              $ 50.000       │   │ ← Badge rojo (bg-red-100, text-red-700)
│  │  ────────────────────────   │   │ ← Separador (border-b border-slate-200)
│  │  María debe a Juan          │   │
│  │              $ 30.000       │   │
│  │  ────────────────────────   │   │
│  │  Pedro debe a María         │   │
│  │              $ 20.000       │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │
└─────────────────────────────────────┘
```

---

### FLUJO 4: Invitar Participantes

#### Pantalla 7: TripDetailPage - Tab Participantes
```
┌─────────────────────────────────────┐
│  [←] Viaje a Cartagena      [⋮]    │ ← Header estándar
├─────────────────────────────────────┤
│                                     │
│  [Gastos] [Saldos] [Participantes] │ ← Tabs (Participantes activo)
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐   │ ← ParticipantCard (bg-white, rounded-xl, p-4)
│  │ [Avatar] Juan (Tú)          │   │ ← Avatar/Iniciales + Nombre (font-medium)
│  │     [Badge: Creador]        │   │ ← Badge violeta (bg-violet-100, text-violet-700)
│  │     juan@example.com       │   │ ← Email (text-slate-500, text-sm)
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] María               │   │
│  │     [Badge: Participante]    │   │ ← Badge gris (bg-slate-100, text-slate-700)
│  │     maria@example.com        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Avatar] Pedro               │   │
│  │     [Badge: Participante]    │   │
│  │     pedro@example.com        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  + Invitar Participante     │   │ ← Botón secundario (solo CREATOR)
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ [Home] [Map] [User]                 │
└─────────────────────────────────────┘
```

**Acción**: Click en "Invitar Participante" → Modal de invitación

---

#### Pantalla 8: Modal Invitar Participante
```
┌─────────────────────────────────────┐
│  [Overlay oscuro bg-black/50]       │ ← Overlay para destacar modal
│         ┌─────────────────────┐    │
│         │  Invitar            │    │ ← Título (font-heading, font-bold, text-xl)
│         │  Participante       │    │
│         │                     │    │
│         │  Email              │    │ ← Label (text-sm font-medium)
│         │  ┌───────────────┐  │    │
│         │  │ email@...     │  │    │ ← Input (h-12, rounded-xl)
│         │  └───────────────┘  │    │
│         │                     │    │
│         │  ┌───────────────┐  │    │
│         │  │  Enviar        │  │    │ ← Botón primario (h-12, full-width)
│         │  └───────────────┘  │    │
│         │                     │    │
│         │  [Cancelar]         │    │ ← Botón secundario/ghost
│         │                     │    │
│         └─────────────────────┘    │ ← Modal (bg-white, rounded-2xl, p-6, max-w-sm, shadow-2xl)
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Ubicación del Botón "Nuevo Gasto"

El botón "Nuevo Gasto" está integrado directamente en el tab de Gastos del detalle del viaje:

| Página | Botón "Nuevo Gasto" | Ubicación | Ruta Destino |
|--------|-------------------|-----------|--------------|
| `/` (Home - No autenticado) | ❌ No | - | - |
| `/` (Home - Autenticado) | ❌ No | - | - |
| `/login` | ❌ No | - | - |
| `/register` | ❌ No | - | - |
| `/trips` (Lista) | ❌ No | - | - |
| `/trips/new` (Crear) | ❌ No | - | - |
| `/trips/:tripId` (Tab Gastos) | ✅ Sí | Dentro del tab, arriba de la lista | `/trips/:tripId/expenses/new` |
| `/trips/:tripId` (Tab Saldos) | ❌ No | - | - |
| `/trips/:tripId` (Tab Participantes) | ❌ No | - | - |
| `/trips/:tripId/expenses/new` | ❌ No | - | - |
| `/profile` | ❌ No | - | - |

**Nota:** El botón solo aparece en el tab de Gastos, donde tiene sentido contextual. El FAB ha sido eliminado.

---

## ✅ Ventajas de este Diseño

1. **Coherencia con Lógica de Negocio**
   - Viaje primero, gastos después
   - Botón "Nuevo Gasto" visible solo en el contexto correcto (tab de Gastos)

2. **Claridad Visual**
   - Acciones integradas directamente en las vistas
   - No hay elementos flotantes que confundan
   - Botón "Nuevo Gasto" contextual y visible donde se necesita

3. **Flujo Natural**
   - **Usuario no autenticado**: Home → Login/Register → Home (autenticado) → Crear Viaje → Detalle Viaje → Tab Gastos → Botón "Nuevo Gasto"
   - **Usuario nuevo autenticado**: Home → Crear Viaje → Detalle Viaje → Tab Gastos → Botón "Nuevo Gasto"
   - **Usuario existente**: Viajes → Seleccionar → Detalle Viaje → Tab Gastos → Botón "Nuevo Gasto"

4. **Cumple Casos de Uso**
   - UC2: Crear Viaje (desde lista o home)
   - UC4: Registrar Gasto (botón visible en tab de Gastos)
   - UC6: Ver Saldos (dentro de viaje)
   - UC7: Invitar (dentro de viaje)

---

## 🎯 Resumen de Cambios Necesarios

### Páginas ya Implementadas
- ✅ **LoginPage**: Implementada y funcional
- ✅ **RegisterPage**: Implementada y funcional
- ✅ **ExpenseFormPage**: Implementada (requiere ajuste de ruta)

### Páginas Pendientes de Implementar
1. **HomePage**: 
   - Refactorizar para mostrar dos estados:
     - **No autenticado**: Botones "Iniciar sesión" y "Crear cuenta" (sin BottomTabBar)
     - **Autenticado sin viajes**: Empty state con botón "Crear mi primer viaje" (con BottomTabBar)
     - **Autenticado con viajes**: Resumen con viajes recientes (con BottomTabBar)
2. **LoginPage**: Agregar header con botón "←" que navegue a `/`
3. **RegisterPage**: Agregar header con botón "←" que navegue a `/`
4. **BottomTabBar**: Eliminar FAB, mantener solo 3 items fijos (Home, Viajes, Perfil)
5. **TripsListPage**: Crear nueva vista con botón "Crear Viaje" en header
6. **CreateTripPage**: Crear nueva vista para formulario de creación de viaje
7. **TripDetailPage**: Crear nueva vista con tabs (Gastos, Saldos, Participantes)
8. **Botón "Nuevo Gasto"**: Integrado dentro del tab de Gastos, arriba de la lista de gastos

---

## 📝 Notas de Implementación

- El FAB ha sido eliminado completamente
- El botón "Nuevo Gasto" está dentro del tab de Gastos, arriba de la lista (solo visible en ese tab)
- El botón "Crear Viaje" debe ser prominente en la lista de viajes
- Los empty states deben guiar al usuario hacia la creación de viajes
- La navegación debe reflejar la jerarquía: Viaje → Gastos
- El botón "Nuevo Gasto" debe ser full-width y estar justo antes de la lista de gastos

---

## 🎨 Especificaciones de Diseño Visual

### Headers Estándar
- **Patrón**: `[←] Título [Acciones]`
- **Altura**: 64px (h-16)
- **Padding**: 24px horizontal (px-6)
- **Fondo**: Blanco (bg-white)
- **Borde**: 1px slate-200 inferior (border-b)
- **Sticky**: top-0 z-40 cuando aplica

### Espaciado Estándar
- **Contenedor principal**: px-6 py-8 (24px horizontal, 32px vertical)
- **Cards**: p-6 (24px todos los lados)
- **Espaciado entre elementos**: space-y-4 o space-y-6
- **Border radius**: rounded-xl (12px) para cards, rounded-2xl (16px) para modales

### Iconos
- **Sistema**: lucide-react (NO emojis)
- **Tamaños**: 20px (botones), 24px (header), 64px (empty states)
- **Colores**: slate-300 (empty states), slate-500 (secundarios), violet-600 (activos)

### Tabs
- **Activo**: text-violet-600 font-semibold border-b-2 border-violet-600
- **Inactivo**: text-slate-500 font-medium
- **Transición**: transition-colors duration-200
- **Fondo sticky**: bg-white border-b border-slate-200

### Botones
- **Primario**: h-12, bg-violet-600, text-white, rounded-xl, font-semibold
- **Secundario**: h-12, bg-slate-200, text-slate-900, rounded-xl, font-medium
- **Full-width**: w-full en formularios y acciones principales

---

## 📚 Referencias

- **Auditoría UX/UI Completa**: Ver `docs/UX_UI_AUDIT.md` para análisis detallado
- **Design System Guide**: Ver `docs/DESIGN_SYSTEM_GUIDE.md` para especificaciones completas
- **Especificación Técnica**: Ver `docs/UI_IMPLEMENTATION_SPEC.md` para detalles de implementación
