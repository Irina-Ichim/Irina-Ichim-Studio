# GitHub Copilot Instructions for Irina Ichim Studio

- Consulta siempre las directrices jerárquicas descritas en [CLAUDE.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/CLAUDE.md) antes de proponer o escribir código.
- Sigue las reglas por carpeta específicas para frontend ([src/frontend-rules.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/frontend-rules.md)) y base de datos/backend ([prisma/db-rules.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/prisma/db-rules.md)).
- Aplica los principios **SOLID, DRY y KISS** en todos los componentes y servicios.
- Prohibido el uso de `any` en TypeScript. Usa tipado estricto y seguro.
- Todo texto visible de interfaz debe estar redactado en **Español de España (Castellano)** con acentuación y ortografía correctas.
- Todo desarrollo de UI debe alinearse con el estándar de accesibilidad **WCAG AAA/AA** definido en [design-system-and-accessibility.md](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/specs/design-system-and-accessibility.md) (contraste 7:1, focos claros, reducción de movimiento y etiquetas ARIA).
- Nunca expongas datos sensibles; lee credenciales de APIs y bases de datos usando variables en `.env`.
- Al crear Issues en GitHub mediante el CLI `gh`, es obligatorio asignar la tarea al desarrollador (`--assignee "@me"`) y validar si la etiqueta asociada existe. Si la etiqueta no existe en el repositorio remoto, debe crearse previamente (`gh label create <nombre> --color <color>`) antes de poder asociarla a la issue.
