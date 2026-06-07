# Irina Ichim Studio

[![Integración Continua](https://github.com/Irina-Ichim/Irina-Ichim-Studio/actions/workflows/ci.yml/badge.svg)](https://github.com/Irina-Ichim/Irina-Ichim-Studio/actions/workflows/ci.yml)
[![GitHub issues](https://img.shields.io/github/issues/Irina-Ichim/Irina-Ichim-Studio?style=flat-square&color=blue)](https://github.com/Irina-Ichim/Irina-Ichim-Studio/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Irina-Ichim/Irina-Ichim-Studio?style=flat-square&color=green)](https://github.com/Irina-Ichim/Irina-Ichim-Studio/pulls)
[![Accesibilidad: WCAG AAA](https://img.shields.io/badge/Accesibilidad-WCAG%20AAA-brightgreen?style=flat-square)](specs/design-system-and-accessibility.md)

Este es el proyecto oficial de **Irina Ichim Studio**, un estudio de diseño y desarrollo web especializado en interfaces de usuario interactivas, de alto rendimiento y accesibles bajo el estándar **WCAG AAA**.

---

## Tecnologías Principales (Tech Stack)

* **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript.
* **Estilos:** Tailwind CSS v4 + shadcn/ui + Framer Motion.
* **Base de Datos & Backend:** PostgreSQL + Prisma ORM (con conexión optimizada mediante Singleton).
* **IA & Validación:** Vercel AI SDK + Google Gemini API (agente de validación local).
* **Infraestructura:** Despliegue continuo en Railway.

---

## Desarrollo Local (Quick Start)

### 1. Variables de Entorno
Asegúrate de copiar tu configuración en el archivo [.env](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/.env):
```env
DATABASE_URL="tu-url-de-base-de-datos-postgresql"
GEMINI_API_KEY="tu-clave-gratuita-de-google-ai-studio"
```
*Nota: La aplicación validará estas variables de forma estricta al arrancar en [env.ts](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/env.ts).*

### 2. Arrancar el Servidor de Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Comandos Útiles de Calidad y Git
* **Auditoría Local de Ortografía y SEO/GEO:**
  ```bash
  npm run verify
  ```
  *(Analiza mediante Gemini tus archivos modificados antes de hacer commit).*
* **Análisis Estático (Linter):**
  ```bash
  npm run lint
  ```
  *(Prohíbe el uso de `console.log` en archivos de producción bajo `src/`)*.
* **Explorar la Base de Datos con Prisma Studio:**
  ```bash
  npx prisma studio
  ```

---

## Flujo de Trabajo (Git & GitHub)

Para asegurar la calidad y estabilidad del despliegue en Railway, seguimos estas reglas:
* **Rama `develop` (Staging):** Todos los desarrollos inician y se integran aquí.
* **Rama `main` (Producción):** De uso exclusivo para versiones probadas. Railway despliega automáticamente cada push a esta rama.
* **Husky Hooks:** Los commits locales se validan automáticamente. No se permitirá confirmar cambios si existen fallas de compilación, linter o el agente de IA reporta errores.
* **GitHub Issues:** Deben seguir el formato `#XX - [Área] Título de la tarea` sin exponer código fuente.

*Para más detalles del flujo, consulta la guía privada [docs/workflow.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/docs/workflow.md).*

---

## Estructura de Documentación

* **Especificaciones de Diseño y Accesibilidad:** [design-system-and-accessibility.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/specs/design-system-and-accessibility.md) (WCAG AAA/AA).
* **Estado de Trabajo Local:** [docs/current-state.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/docs/current-state.md).
* **Tareas Pendientes (Backlog):** [docs/todo.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/docs/todo.md).
* **Guía de Dependencias (Zod & Prisma):** [docs/dependencies.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/docs/dependencies.md).
