# UI/UX Audit Report - HomePage Visual Issues

**Fecha:** 2025-01-30  
**Componente Auditado:** `Frontend/src/pages/HomePage.tsx` - Sección "Total Gastado" y "Gastos Recientes"  
**Auditor:** Architect UI/X  
**Alcance:** Auditoría de alineación del icono DollarSign y simetría de contenedores de gastos recientes

---

## Summary

- 🟠 High: 2 issues

---

## 🟠 High Priority Issues

### 1. Icono DollarSign mal alineado en contenedor "Total Gastado"

> 🟠 **UI Issue:** El icono DollarSign está posicionado en la esquina superior derecha usando `justify-between`, causando desalineación visual y mala distribución del espacio

> **Location:** `Frontend/src/pages/HomePage.tsx` alrededor de líneas 228-230

> **Description:**
> El contenedor "Total Gastado" usa `flex items-center justify-between` para colocar el título a la izquierda y el icono DollarSign a la derecha. Esto posiciona el icono en la esquina superior derecha, creando una distribución visual desequilibrada. El icono debería estar mejor integrado visualmente, posiblemente alineado verticalmente con el título o en una posición más apropiada que no lo separe tanto del contenido principal.

> **Impact:**
> Desalineación visual del icono reduce la percepción de calidad y coherencia del diseño. El icono en la esquina superior derecha puede parecer desconectado del contenido principal, afectando la jerarquía visual y la percepción de profesionalismo de la interfaz.

> **Fix Prompt:**
> En `Frontend/src/pages/HomePage.tsx` alrededor de líneas 228-230, reestructurar el layout del contenedor "Total Gastado". Opciones: 1) Mover el icono al lado del título usando `flex items-center gap-2` en lugar de `justify-between`, 2) Colocar el icono debajo del título en una estructura vertical, o 3) Integrar el icono de manera más sutil (por ejemplo, como parte del fondo o en una posición que no compita con el contenido principal). La opción recomendada es mover el icono al lado del título: cambiar `flex items-center justify-between` a `flex items-center gap-2` y mover el icono antes del título.

### 2. Contenedores de gastos recientes no son simétricos horizontalmente

> 🟠 **UI Issue:** Los contenedores `RecentExpenseCard` no tienen ancho mínimo o máximo definido, causando asimetría horizontal cuando el contenido varía en longitud

> **Location:** `Frontend/src/components/molecules/RecentExpenseCard.tsx` alrededor de líneas 84-108 y `Frontend/src/pages/HomePage.tsx` línea 313

> **Description:**
> El componente `RecentExpenseCard` usa un layout flex con `flex-1 min-w-0` en la sección central, pero no tiene restricciones de ancho mínimo o máximo para mantener simetría. Cuando los títulos de gastos tienen diferentes longitudes, o cuando el monto tiene diferentes formatos (COP vs USD), los contenedores pueden tener anchos diferentes, creando una apariencia asimétrica y desalineada.

> **Impact:**
> Asimetría horizontal en los contenedores de gastos recientes afecta la percepción visual de orden y profesionalismo. Los usuarios pueden notar que los cards no están alineados uniformemente, lo que reduce la calidad percibida de la interfaz. Esto es especialmente problemático cuando hay múltiples gastos con diferentes longitudes de texto.

> **Fix Prompt:**
> En `Frontend/src/components/molecules/RecentExpenseCard.tsx` alrededor de la línea 75, agregar `w-full` al Container para asegurar que todos los cards ocupen el mismo ancho. En la línea 91, verificar que `flex-1 min-w-0` esté correctamente aplicado. En `Frontend/src/pages/HomePage.tsx` línea 313, asegurar que el contenedor padre tenga `w-full` o que los cards tengan un ancho consistente. Alternativamente, agregar `max-w-full` al Container y asegurar que el layout flex mantenga la simetría usando `items-stretch` en el contenedor padre si es necesario.

---

## Reglas Utilizadas

- `.cursor/rules/ui-ux/design-system.mdc` - Estándares de alineación y simetría de contenedores
- `.cursor/rules/ui-ux/accessibility.mdc` - Estándares WCAG
- `.cursor/agents/UI-UX-Auditor.md` - Proceso de auditoría y formato de feedback
- `docs/ui-ux/DESIGN_SYSTEM_GUIDE.md` - Guía del sistema de diseño

---

## Recomendaciones Adicionales

1. **Consistencia Visual:** Revisar otros componentes similares (TripCard, BalanceCard) para asegurar que sigan el mismo patrón de alineación y simetría.

2. **Testing Visual:** Verificar el layout en diferentes tamaños de pantalla y con diferentes longitudes de contenido para asegurar que la simetría se mantenga.

3. **Iconografía:** Considerar si el icono DollarSign es necesario o si puede ser removido para simplificar el diseño, ya que el símbolo "$" ya está presente en el formato de moneda.

---

**Fin del Reporte**
