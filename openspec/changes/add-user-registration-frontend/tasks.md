## 1. Setup y Dependencias

- [ ] 1.1 Instalar dependencias: `react-hook-form`, `zod`, `@tanstack/react-query`
- [ ] 1.2 Verificar/actualizar configuración de Tailwind con paleta del Design System (violet-600, slate-50, emerald-500, red-500)
- [ ] 1.3 Configurar fuentes Google Fonts (Plus Jakarta Sans para headings, Inter para body) si no están

## 2. Servicios y API

- [ ] 2.1 Crear `Frontend/src/services/auth.service.ts` con función `registerUser()`
- [ ] 2.2 Configurar cliente HTTP base (fetch o axios) con manejo de errores
- [ ] 2.3 Definir tipos TypeScript para request/response de registro

## 3. Componentes Atómicos (Alineación con Design System)

- [ ] 3.1 Actualizar `Input.tsx`:
  - Altura mínima 48px (touch target)
  - Font size 16px (evitar zoom en iOS)
  - Colores según Design System (violet para focus)
  - Soporte para errores visuales
- [ ] 3.2 Actualizar `Button.tsx`:
  - Variante primary con color violet-600
  - Tamaños según Design System
  - Estados hover/focus/disabled

## 4. Página de Registro

- [ ] 4.1 Crear `RegisterPage.tsx` con estructura mobile-first
- [ ] 4.2 Implementar formulario con react-hook-form:
  - Campo nombre (text)
  - Campo email (email)
  - Campo contraseña (password)
- [ ] 4.3 Implementar validación con zod:
  - Email válido y único (validación backend)
  - Contraseña > 6 caracteres (alineado con ProductBacklog, aunque backend tiene 8)
  - Nombre requerido
- [ ] 4.4 Implementar manejo de errores:
  - Mostrar errores de validación en tiempo real
  - Manejar error 409 (email duplicado) con mensaje claro
  - Manejar errores de red/500 con mensaje genérico
- [ ] 4.5 Implementar estados de carga (loading durante submit)
- [ ] 4.6 Redirigir a `/login` después de registro exitoso

## 5. Navegación

- [ ] 5.1 Agregar ruta `/register` al router
- [ ] 5.2 Agregar link "¿No tienes cuenta? Regístrate" en LoginPage (opcional pero recomendado)

## 6. Testing y Validación

- [ ] 6.1 Probar flujo completo: registro exitoso → redirección
- [ ] 6.2 Probar validaciones: email inválido, contraseña corta, campos vacíos
- [ ] 6.3 Probar error de email duplicado (409)
- [ ] 6.4 Verificar diseño responsive (mobile-first, 360px-430px)
- [ ] 6.5 Verificar accesibilidad básica (labels, focus states)

