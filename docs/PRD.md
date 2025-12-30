# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Proyecto: Sistema de Gestión de Gastos de Viaje (TravelSplit MVP)
**Versión:** 1.0 | **Estado:** Aprobado para Desarrollo | **Fecha:** 29/12/2025

---

### 1. RESUMEN EJECUTIVO
* **Elevator Pitch:** Una plataforma web centralizada que elimina la fricción financiera en viajes grupales, permitiendo el rastreo transparente de gastos en COP y la liquidación de cuentas clara entre amigos registrados.
* **Problema:** Los grupos de amigos sufren para consolidar gastos dispersos, perdiendo recibos y generando tensiones por cálculos manuales erróneos.
* **Solución:** Un sistema web que obliga al registro previo para garantizar la identidad, centraliza la evidencia de gastos (fotos) y ofrece una visualización simple de saldos "quién debe a quién".

### 2. OBJETIVOS DE NEGOCIO (BUSINESS GOALS)
* **Corto Plazo (MVP):** Entregar un sistema funcional que permita el ciclo completo: Registro -> Creación Viaje -> Carga Gastos -> Visualización Saldos.
* **KPI Principal:** Tasa de finalización de viajes (Viajes donde se usa el botón "Equilibrar gastos").

### 3. STAKEHOLDERS
| Rol | Descripción | Nivel de Acceso |
| :--- | :--- | :--- |
| **Viajero Administrador (Creador)** | Usuario que crea el viaje. | **Alto:** Crea viajes, invita usuarios, gestiona (edita/elimina) TODOS los gastos. |
| **Viajero Participante** | Usuario invitado al viaje. | **Medio:** Visualiza data, sube gastos propios (pero no puede editarlos tras crearlos, según regla de negocio). |
| **Sistema (Backend)** | NestJS API. | **N/A:** Procesa validaciones, cálculos y notificaciones. |

### 4. REGLAS DE NEGOCIO CRÍTICAS (SCOPE)
1.  **Strict User Policy (Opción A):** No se pueden agregar participantes a un viaje si su email no está previamente registrado en la base de datos. El sistema bloqueará la invitación.
2.  **Centralized Control:** Solo el **Creador del Viaje** tiene permisos de escritura (Edición/Eliminado) sobre los gastos y la configuración del viaje.
3.  **Moneda Única:** Todo el sistema opera exclusivamente en **COP** (Pesos Colombianos).
4.  **Soft Delete:** Ningún dato se borra físicamente; se usa borrado lógico (`deleted_at`).

### 5. CARACTERÍSTICAS Y FUNCIONALIDADES (FEATURES)

#### Módulo 1: Autenticación (Auth)
* Registro (Email, Nombre, Password > 6 chars).
* Login (JWT Strategy).

#### Módulo 2: Gestión de Viajes (Trips)
* Listado de mis viajes (activos e históricos).
* Crear Viaje (Nombre, Divisa fija COP, Agregar participantes por email validado).
* Unirse a Viaje (Vía código alfanumérico generado por el sistema).

#### Módulo 3: Gestión de Gastos (Expenses)
* Registro de Gasto: Título, Monto, Pagador, Beneficiarios (Split), Categoría, Foto (Opcional).
* **Categorías:** Comida, Transporte, Alojamiento, Entretenimiento, Varios.
* Feed de Gastos: Orden descendente por fecha.

#### Módulo 4: Saldos (Balances)
* Cálculo matemático directo: Total gastado por usuario vs. Cuota justa (Fair share).
* Visualización: Lista simple de deudas (Ej: "Juan debe $50.000 a Pedro").

### 6. HISTORIAS DE USUARIO CLAVE
1.  *Como Creador*, quiero invitar a mis amigos por correo, para que el sistema me alerte si alguno no se ha registrado aún y así pedirle que lo haga.
2.  *Como Participante*, quiero subir una foto del recibo de la cena, para que exista evidencia del monto cobrado.
3.  *Como Creador*, quiero poder editar un gasto mal ingresado por otro amigo, para mantener las cuentas claras (Permiso exclusivo).
4.  *Como Usuario*, quiero ver un gráfico o lista simple que me diga cuánto debo en total, para transferir el dinero y cerrar el viaje.
5.  *Como Sistema*, quiero enviar una alerta por email cuando alguien es agregado a un viaje, para que se enteren inmediatamente.

### 7. REQUISITOS TÉCNICOS (ALTO NIVEL)
* **Frontend:** React (TypeScript) + TailwindCSS. Diseño Responsive full pautas WCAG.
* **Backend:** NestJS (Node.js). Estructura modular estricta.
* **Patrón de Diseño:** CSEC
* **Arquitectura:** Layered Architecture (Arquitectura en Capas)
El sistema no es un bloque de código desordenado; está dividido en "estratos" horizontales. Cada capa tiene una responsabilidad única y solo puede comunicarse con la capa inmediatamente inferior.

- Principio: Separation of Concerns (Separación de Responsabilidades).

- Regla de Oro: El Controlador nunca habla directamente con la Base de Datos; debe pasar por el Servicio.
* **Base de Datos:** PostgreSQL(Relacional obligatoria para integridad financiera).
* **Almacenamiento:** Sistema de archivos local o servicio Cloud (S3/Cloudinary) para las fotos de recibos.

---