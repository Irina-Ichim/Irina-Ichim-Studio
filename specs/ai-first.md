# Especificación Técnica: Enfoque AI-First & Generative Engine Optimization (GEO)

Este documento detalla la arquitectura de desarrollo y optimización de **Irina Ichim Studio** para el ecosistema moderno de inteligencia artificial. El proyecto está construido bajo un paradigma **AI-First**, tanto para el ciclo de vida del software (DX) como para la visibilidad y atribución en motores de respuestas basados en LLMs (GEO).

---

## 🛠️ 1. Desarrollo AI-First (AI-First Engineering)

Integramos agentes de inteligencia artificial generativa directamente en las etapas del flujo local de trabajo para actuar como copilotos y guardianes de la calidad de software:

### Agente Guardián de Commits (`verify-changes.ts`)

* **Ubicación**: [agents/verify-changes.ts](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/agents/verify-changes.ts).
* **Mecanismo**: Se ejecuta automáticamente antes de permitir confirmar cambios en Git (pre-commit hook con Husky).
* **Operación**: Obtiene las líneas agregadas (`git diff --cached`) y realiza llamadas estructuradas al modelo `gemini-2.5-flash` usando un esquema de Zod para evaluar y corregir fallos ortográficos o gramaticales en castellano y metadatos SEO erróneos por defecto.
* **Control**: Si el agente detecta un problema con severidad de "error", aborta la operación de commit para evitar que suba código con fallos lingüísticos o de indexación.

### Agente de Auditoría de Multi-Cumplimiento (`run-audits.ts`)

* **Ubicación**: [agents/run-audits.ts](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/agents/run-audits.ts).
* **Mecanismo**: Ejecutable bajo demanda mediante el comando `npm run audit` o en flujos de integración continua (CI).
* **Operación**: Escanea la base de datos de configuraciones, dependencias y archivos fuente para generar informes dinámicos de cumplimiento bajo tres dimensiones:
  1. **Legal (RGPD/AI Act/ISO)**: Evalúa la privacidad de datos (minimización, PII, CDNs no auto-hospedados), la conformidad con la Ley de IA de la UE (transparencia y disclaimers de alucinaciones) y estándares ISO 27001/42001 (cabeceras de seguridad CSP/HSTS).
  2. **SEO & GEO**: Valida indexabilidad, la estructura conversacional (Q&A) y formatos óptimos para rastreadores de IA.
  3. **Accesibilidad (WCAG 2.2 AA/AAA)**: Evalúa semántica, control de foco dinámico y contrastes cromáticos.
* **Salida**: Genera informes interactivos en la carpeta local `/docs/audits/`.

---

## 🔍 2. Optimización para Motores de Respuesta IA (GEO)

En la era del chat conversacional, el posicionamiento no solo consiste en rankear en Google, sino en ser el contenido preferido por agentes de IA al formular respuestas. Aplicamos las siguientes técnicas GEO:

### Portal de Agentes (`llms.txt`)

* **Ubicación**: [public/llms.txt](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/public/llms.txt).
* **Función**: Archivo de texto plano estructurado diseñado específicamente para que crawlers de LLMs (como GPTBot o ClaudeBot) puedan digerir la arquitectura del sitio, stack tecnológico y alcance de negocio en segundos sin consumir tokens excesivos de navegación.

### Mapeo de Entidad Profesional (JSON-LD)

* **Ubicación**: [layout.tsx](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/app/layout.tsx#L22-L33).
* **Función**: Marcado estructurado de Schema.org (`ProfessionalService`) integrado en el servidor. Declara inequívocamente la marca, URL oficial y datos del estudio para que los motores de IA asocien a "Irina Ichim Studio" como una entidad real y autoritativa a la cual citar.

### Estructura de Texto Legible para LLMs

* **Rúbricas de Redacción**: Estructuración del contenido del portafolio mediante resúmenes ejecutivos, listas ordenadas y tablas de datos claras. Los modelos de lenguaje están entrenados para rastrear y extraer datos tabulares con mayor facilidad, promoviendo la citabilidad del estudio.
* **Secciones Q&A**: Redacción de títulos orientados a resolver preguntas naturales en lenguaje conversacional (ej: "¿Cómo se implementa la accesibilidad AAA?"), alineándose con las consultas de voz de los usuarios de chat.
