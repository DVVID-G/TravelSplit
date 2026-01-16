# Diagramas C4 - TravelSplit

Este directorio contiene los diagramas de arquitectura C4 del sistema TravelSplit, generados automáticamente mediante el agente C4 Diagram Generator.

## Modelo C4

El modelo C4 consiste en cuatro niveles de abstracción:

| Nivel | Nombre | Descripción | Archivo |
|-------|--------|-------------|---------|
| 1 | Context | Sistema en su entorno con usuarios y sistemas externos | `01-context.puml` |
| 2 | Container | Aplicaciones, bases de datos y sistemas que componen el software | `02-containers.puml` |
| 3 | Component | Componentes dentro de cada contenedor y sus relaciones | `03-components-backend.puml`, `03-components-frontend.puml` |
| 4 | Code | Clases, funciones y relaciones detalladas (opcional) | `04-code-*.puml` |

## Diagramas Disponibles

### Nivel 1: Context Diagram
**Archivo:** `01-context.puml`

Muestra el sistema TravelSplit en su contexto, incluyendo:
- **Usuarios:**
  - Viajero Administrador (CREATOR)
  - Viajero Participante (MEMBER)
- **Sistemas Externos:**
  - Email Service (notificaciones)
  - File Storage System (almacenamiento de imágenes)

### Nivel 2: Container Diagram
**Archivo:** `02-containers.puml`

Muestra los contenedores principales del sistema:
- **Frontend Web App:** Aplicación React SPA
- **Backend API:** API REST con NestJS
- **PostgreSQL Database:** Base de datos relacional

### Nivel 3: Component Diagrams

#### Backend Components
**Archivo:** `03-components-backend.puml`

Muestra los componentes del backend organizados por módulos:
- **Auth Module:** Autenticación y registro
- **Users Module:** Gestión de usuarios
- **Trips Module:** Gestión de viajes y participantes
- **Health Module:** Health checks
- **Common Components:** Guards, Filters, Mappers, Strategies

#### Frontend Components
**Archivo:** `03-components-frontend.puml`

Muestra los componentes del frontend organizados por patrón Atomic Design:
- **Pages:** Páginas principales de la aplicación
- **Organisms:** Componentes complejos (Header, BottomTabBar, Modals)
- **Molecules:** Componentes compuestos (Cards, Forms, Selectors)
- **Atoms:** Componentes básicos (Button, Input, etc.)
- **Hooks:** Lógica de negocio reutilizable
- **Services:** Comunicación con la API
- **Contexts:** Gestión de estado global

## Tecnologías Detectadas

### Backend
- **Lenguaje:** TypeScript
- **Runtime:** Node.js 22
- **Framework:** NestJS v11
- **ORM:** TypeORM v0.3
- **Base de Datos:** PostgreSQL 17
- **Patrón Arquitectónico:** CSED (Controller-Service-Entity-DTO)
- **Autenticación:** JWT con Passport Strategy

### Frontend
- **Lenguaje:** TypeScript
- **Framework:** React v19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Patrón Arquitectónico:** Atomic Design
- **State Management:** TanStack Query (servidor), Context API (cliente)
- **Formularios:** React Hook Form + Zod
- **Routing:** React Router v7

## Cómo Visualizar los Diagramas

### Opción 1: PlantUML Online
1. Copia el contenido de cualquier archivo `.puml`
2. Visita [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
3. Pega el contenido y visualiza

### Opción 2: Extensión VS Code
1. Instala la extensión "PlantUML" en VS Code
2. Abre cualquier archivo `.puml`
3. Presiona `Alt+D` para previsualizar

### Opción 3: Herramienta Local
```bash
# Instalar PlantUML (requiere Java)
npm install -g @plantuml/plantuml

# Generar imágenes PNG
plantuml docs/diagrams/c4/*.puml
```

## Actualización de Diagramas

Los diagramas se generan automáticamente mediante el agente C4 Diagram Generator. Para regenerarlos:

1. Ejecuta el comando: `/c4-diagram` o solicita "Generar diagramas C4"
2. El agente detectará automáticamente el código fuente
3. Extraerá la arquitectura actual
4. Generará los diagramas actualizados

## Notas

- Los diagramas reflejan la arquitectura actual del código fuente
- Los sistemas externos marcados como "(Futuro)" aún no están implementados
- Los diagramas de nivel 4 (Code) se generan solo cuando se solicitan explícitamente

## Referencias

- [C4 Model](https://c4model.com/)
- [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML)
- [PlantUML](https://plantuml.com/)
