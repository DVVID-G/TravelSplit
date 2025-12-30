# TravelSplit MVP - Design System Guide

**Versión:** 1.0.0 (Release Candidate)  
**Autor:** Architect UI/X  
**Stack:** React (TS) + TailwindCSS + Lucide Icons + Shadcn/ui (Base)

---

## 🎨 1. Visual Language (Look & Feel)

### 1.1 Dirección de Arte: "Modern Friendly"

El diseño busca reducir la tensión social que genera el dinero. No debe parecer una hoja de cálculo aburrida, ni un banco intimidante.

- **Mood:** Colaborativo, Claro, Lúdico pero funcional
- **Formas:** Bordes redondeados generosos (`rounded-xl` o `rounded-2xl`) para evocar amabilidad
- **Estética:** "Clean UI" con toques de color vibrante para acciones principales

### 1.2 Paleta de Color (Tailwind Config)

Diseñado para Light Mode por defecto, con tokens semánticos listos para Dark Mode.

#### Brand Colors (Violeta - Creatividad y Confianza Social)

El violeta se diferencia de los bancos tradicionales (azul) y apps de contabilidad (verde).

```css
/* Tailwind: violet-600 como Primary */
--primary: #7C3AED;              /* Botones, Links, Elementos activos */
--primary-foreground: #FFFFFF;
--primary-light: #DDD6FE;         /* Fondos de items seleccionados (violet-200) */
```

#### Colores Semánticos (Funcionales)

| Uso | Color | Código | Tailwind | Notas |
|-----|-------|--------|----------|-------|
| Deuda (Negativo) | Rojo | `#EF4444` | `red-500` | Usar con moderación para no estresar |
| A favor (Positivo) | Verde | `#10B981` | `emerald-500` | Para saldos a recibir |
| Neutral/Subtle | Gris | `#64748B` | `slate-500` | Textos secundarios, fechas |

#### Fondos y Superficies

- **Background:** `#F8FAFC` (`slate-50`) → Evitar blanco puro `#FFF` para reducir fatiga visual
- **Surface (Cards):** `#FFFFFF` (White) + Sombra suave

### 1.3 Tipografía

Combinación moderna que asegura legibilidad en números y personalidad en títulos.

#### Headings
- **Fuente:** 'Plus Jakarta Sans' (Google Fonts)
- **Características:** Geométrica y moderna
- **Weights:** 600 (Semibold), 700 (Bold)

#### Body & Numbers
- **Fuente:** 'Inter' (Google Fonts)
- **Características:** Indispensable para tablas numéricas (Tabular nums)
- **Weights:** 400 (Regular), 500 (Medium)

---

## 📱 2. Layout & Navegación (Mobile First)

### 2.1 Estructura del Viewport

El diseño asume que el 90% del uso será en móviles (360px - 430px width).

- **Área Segura (Safe Area):** Respetar el notch superior y la barra de home inferior en iOS

**Contenedor Principal:**

```css
.main-container {
  @apply max-w-md mx-auto min-h-screen bg-slate-50 relative pb-24; 
  /* pb-24 asegura espacio para el Bottom Nav */
}
```

### 2.2 Bottom Tab Bar (Navegación Principal)

- **Posición:** Barra fija en la parte inferior (`z-50 fixed bottom-0`)
- **Altura:** 64px - 80px

**Items (4):**

1. **Home/Resumen:** Icono Home
2. **Mis Viajes:** Icono Map
3. **Nuevo Gasto (FAB):** Botón central flotante, elevado, color Primario. Icono Plus
4. **Perfil:** Icono User

**Estados:**

- **Activo:** Icono y texto en color Primary (`violet-600`)
- **Inactivo:** Color `slate-400`

---

## 🧩 3. Componentes Clave (Atomic Specs)

### 3.1 Tarjetas de Gasto (Expense Card)

El componente más repetido en el feed.

- **Layout:** Flex row (Izquierda: Icono/Categoría | Centro: Título y Pagador | Derecha: Monto)
- **Iconografía:** Círculo con fondo suave (`bg-slate-100`) + Icono de categoría (Ej: Utensils para comida)
- **Microinteracción:** Active: `scale-98` al tocar para ver detalles

#### Formato de Moneda (COP)

- ✅ **SIEMPRE sin decimales:** `$ 25.000` (No `$25.000,00`)
- ✅ Usar separador de miles (punto)

### 3.2 Visualización de Saldos (Texto Simple)

Para cumplir con el requerimiento de claridad:

- **Contenedor:** Card con borde suave
- **List Item:**
  - **Texto:** "Juan debe a Pedro" (Pedro en negrita)
  - **Valor:** Badge/Pastilla a la derecha

**Estados de Badge:**

- **Si soy Juan (Debo):** Badge Rojo suave (`bg-red-100 text-red-700`) → `$ 50.000`
- **Si soy Pedro (Me deben):** Badge Verde suave (`bg-emerald-100 text-emerald-700`) → `$ 50.000`

### 3.3 Inputs de Formulario (Mobile Optimized)

- **Altura mínima:** 48px (Touch target estándar)
- **Font Size:** 16px (Evita zoom automático en iOS)

#### Input de Monto

- Tamaño grande (`text-3xl`)
- Centrado o alineado a la derecha
- Prefijo "$" fijo en color gris

#### Selector de Categoría

Scroll horizontal de "Pills" (Pastillas) o Grid de Iconos grandes.

### 3.4 Carga de Evidencia (Opcional)

- **UI:** Botón secundario/Ghost con icono de cámara (`Camera`)
- **Texto:** "Añadir foto (Opcional)"
- **Estado Cargado:** Muestra miniatura pequeña (thumbnail) de 48x48px rounded + botón "X" para quitar

---

## ⚡ 4. UX Patterns & Feedback

### 4.1 Manejo de Error: Strict User Policy (Active Help)

Cuando el creador intenta agregar un email no registrado (ej: `user@travelsplit.com`):

#### Validación

- **Trigger:** OnBlur (al salir del campo) o al intentar agregar

#### UI Feedback

1. El input se marca en rojo
2. Aparece un **Actionable Alert** (Toast/Modal):

   > "El usuario `user@travelsplit.com` no está registrado en TravelSplit."
   > 
   > [ **Botón Primario:** Copiar invitación ]  
   > [ **Botón Secundario:** Corregir email ]

#### Copy sugerido para invitación

> "¡Hola! Únete a nuestro viaje en TravelSplit para dividir gastos fácilmente. Regístrate aquí: [LINK]"

### 4.2 Empty States

No dejar pantallas en blanco.

- **Sin Viajes:** Ilustración simple + "¿Planeando una escapada? Crea tu primer viaje"
- **Sin Gastos:** "Todo tranquilo por aquí. Toca el botón + para agregar el primer gasto"

---

## 🛠️ 5. Implementación Técnica (Dev Guidelines)

### 5.1 Librerías Recomendadas

| Categoría | Librería | Propósito |
|-----------|----------|-----------|
| Iconos | `lucide-react` | Consistencia y peso ligero |
| Validación | `zod` + `react-hook-form` | Crucial para manejo de montos y emails |
| UI Base | `shadcn/ui` | Components: Button, Input, Dialog, Card, Toast |
| Fechas | `date-fns` | Formato: "Hoy", "Ayer", "29 Dic" |

### 5.2 Responsive & Tailwind Classes

Usar prefijos `md:` y `lg:` solo para adaptar el layout en escritorio (centrar el contenedor móvil en el medio de la pantalla), pero diseñar el interior pensando 100% en móvil.

**Ejemplo de Wrapper para simular app en desktop:**

```jsx
<div className="min-h-screen bg-slate-200 flex justify-center items-center">
  <div className="w-full max-w-md h-screen bg-slate-50 overflow-y-auto shadow-2xl">
    {/* App Content */}
  </div>
</div>
```

---

## ✅ Implementation Checklist

Entregar esta lista al equipo de desarrollo:

### Fase 0: Setup

- [ ] Configurar Tailwind con la paleta de colores (violet, slate, emerald, red)
- [ ] Instalar tipografías Plus Jakarta Sans y Inter
- [ ] Configurar shadcn/ui y componentes base (Button, Input, Card)

### Fase 1: Autenticación & Onboarding

- [ ] Pantalla de Login/Registro (Mobile friendly, inputs grandes)
- [ ] Manejo de tokens JWT y persistencia de sesión

### Fase 2: Core - Viajes

- [ ] Crear Viaje: Formulario simple (Nombre + Moneda fija COP)
- [ ] Lista de Viajes (Cards con resumen)
- [ ] Feature Crítica: Lógica de invitación de usuarios + Modal de "Active Help" para usuarios no registrados

### Fase 3: Core - Gastos

- [ ] Bottom Tab Navigation implementada
- [ ] Formulario de Gasto (Monto grande, Categorías, Selección de pagador)
- [ ] Feed de Gastos (Lista cronológica)
- [ ] Carga de imágenes (Input file hidden estilizado)

### Fase 4: Core - Saldos

- [ ] Algoritmo de cálculo en Backend
- [ ] Visualización Frontend: Lista de texto "Quién debe a Quién"
- [ ] Badges de colores para diferenciar deudas vs. cobros

---

## 💡 Nota Final de Architect UI/X

> El éxito de este MVP radica en la fluidez del formulario de gasto. Si un usuario borracho en un bar puede registrar una cerveza en 5 segundos, el producto será un éxito. **Prioricen la velocidad de interacción en el "Botón +".**
