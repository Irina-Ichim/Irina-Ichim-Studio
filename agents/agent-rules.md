# Reglas de Desarrollo: Agentes y Automatización (AI SDK)

Este archivo define las directrices para el desarrollo de scripts de IA, validadores automáticos y agentes locales de **Irina Ichim Studio**.

---

## 1. Integración de IA con Vercel AI SDK
* **Modelo Estándar:** Para tareas rápidas de análisis y validación de texto o código, utiliza el modelo `gemini-2.5-flash` a través de `@ai-sdk/google`.
* **Seguridad de API Keys:** La clave de API de Gemini (`GEMINI_API_KEY`) debe leerse exclusivamente del archivo [.env](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/.env). Nunca hardcodees claves.
* **Tipado de Respuestas (Zod):** No utilices análisis de texto plano o expresiones regulares manuales para estructurar las respuestas de la IA. Usa siempre `generateObject` especificando un esquema de `zod` estricto para garantizar la robustez del flujo.

---

## 2. Ejecución Local Exclusiva
* **Ámbito del Script:** Los validadores locales (como [verify-changes.ts](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/agents/verify-changes.ts)) están diseñados para ejecutarse exclusivamente en el entorno de desarrollo local (`npm run verify`).
* **Independencia de Producción:** Ningún proceso de despliegue o ejecución en Railway debe depender de APIs de IA de terceros para evitar fallos de compilación por límites de cuota o caídas de red externas.

---

## 3. Eficiencia y Tokens
* **Análisis de Diffs:** Cuando sea posible, procesa únicamente las líneas agregadas o modificadas mediante `git diff` en lugar de enviar archivos completos. Esto minimiza el consumo de tokens y acelera los tiempos de respuesta del agente.
* **Ignorar Sintaxis de Programación:** En los prompts de validación, indica claramente a la IA que ignore palabras clave de código, imports, variables y clases CSS para evitar falsos positivos lingüísticos.
