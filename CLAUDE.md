# Guías del Proyecto - Irina Ichim Studio

Este archivo define las directivas generales del proyecto. Para el desarrollo en áreas específicas, **debes leer y seguir estrictamente** las guías de cada directorio:

📂 **Frontend & UI:** [src/frontend-rules.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/frontend-rules.md)  
📂 **Base de Datos & Backend:** [prisma/db-rules.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/prisma/db-rules.md)  
📂 **Agentes de IA & Scripts:** [agents/agent-rules.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/agents/agent-rules.md)

---

## 🛡️ Reglas Generales de Seguridad y Código

1. **Datos Sensibles:** Nunca expongas contraseñas, URLs de base de datos o claves de API en el código. Lee siempre estas variables desde [.env](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/.env).
2. **TypeScript Estricto:** Prohibido el uso de `any`. Define interfaces o tipos explícitos para todo.
3. **No console.log:** Prohibido el uso de `console.log` en el código de producción dentro de `src/` (forzado por ESLint). Se permite `console.warn` y `console.error` para reportes de error/advertencia controlados.
4. **Principios Arquitectónicos:**
   - **SOLID:** Componentes y funciones con responsabilidad única.
   - **DRY (Don't Repeat Yourself):** Reutiliza lógica y modulariza.
   - **KISS (Keep It Simple, Stupid):** Prioriza la legibilidad y simplicidad antes que soluciones complejas innecesarias.
5. **Calidad y Accesibilidad (WCAG AAA/AA):** Todo el desarrollo web debe priorizar la accesibilidad e idioma español de España de acuerdo a la especificación [design-system-and-accessibility.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/specs/design-system-and-accessibility.md).

---

## 🔄 Flujo de Trabajo (Git & GitHub)

Para detalles completos, consulta [docs/workflow.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/docs/workflow.md):
* **Ramas:** Todo el desarrollo empieza desde la rama `develop` (staging). La rama `main` (producción) solo recibe actualizaciones mediante Pull Request desde `develop`.
* **Issues:** El título de cada issue en GitHub debe seguir estrictamente el formato `#XX - [Área] Descripción` (ej: `#01 - [Frontend] Implementar SkipLink`). Las descripciones deben detallar requisitos y aceptación sin volcar código fuente. Al crearlas mediante CLI, es obligatorio asignarlas al desarrollador (`--assignee "@me"`) y validar/crear previamente las etiquetas correspondientes si no existen en el repositorio.


---

## 🛠️ Comandos Frecuentes

* **Desarrollo local:** `npm run dev` (Next.js con Turbopack)
* **Validación ortográfica/SEO/GEO local:** `npm run verify`
* **Compilación:** `npm run build`
* **Linter:** `npm run lint`
* **Prisma Studio:** `npx prisma studio`
