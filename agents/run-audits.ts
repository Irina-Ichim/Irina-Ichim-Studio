import fs from 'fs';
import path from 'path';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Colores ANSI para terminal premium
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// ============================================================================
// 1. ESQUEMAS DE VALIDACIÓN ZOD PARA AUDITORÍAS
// ============================================================================

const CheckStatusSchema = z.enum(['compliant', 'warning', 'non_compliant']);

const AuditCheckSchema = z.object({
  criterion: z.string().describe('El nombre del criterio evaluado.'),
  status: CheckStatusSchema.describe('El estado resultante de la evaluación.'),
  findings: z.string().describe('Explicación detallada de lo que se encontró en el código y configuración.')
});

const A11yCheckSchema = AuditCheckSchema.extend({
  level: z.enum(['A', 'AA', 'AAA']).describe('Nivel de conformidad de la pauta WCAG.')
});

const ThirdPartyServiceSchema = z.object({
  service: z.string().describe('Nombre del servicio o API de terceros.'),
  function: z.string().describe('Función que cumple en el proyecto.'),
  dataProcessed: z.string().describe('Qué tipo de datos procesa y transfiere.'),
  riskLevel: z.enum(['bajo', 'medio', 'alto']).describe('Nivel de riesgo de privacidad/seguridad.')
});

// Esquema para la Auditoría Legal (RGPD, AI Act, ISO)
const LegalReportSchema = z.object({
  score: z.number().min(0).max(100).describe('Puntuación de cumplimiento legal de 0 a 100.'),
  status: z.enum(['compliant', 'warning', 'non_compliant']).describe('Estado general.'),
  gdprChecks: z.array(AuditCheckSchema).describe('Evaluaciones del RGPD.'),
  aiActChecks: z.array(AuditCheckSchema).describe('Evaluaciones de la Ley de IA de la UE.'),
  isoChecks: z.array(AuditCheckSchema).describe('Evaluaciones de seguridad y normas ISO.'),
  thirdPartyRegistry: z.array(ThirdPartyServiceSchema).describe('Inventario de proveedores externos.'),
  actionPlan: z.array(z.string()).describe('Lista ordenada de recomendaciones y tareas a corregir.')
});

// Esquema para la Auditoría SEO & GEO
const SeoGeoReportSchema = z.object({
  scoreSEO: z.number().min(0).max(100).describe('Puntuación de SEO de 0 a 100.'),
  scoreGEO: z.number().min(0).max(100).describe('Puntuación de GEO (motores de IA) de 0 a 100.'),
  status: z.enum(['compliant', 'warning', 'non_compliant']).describe('Estado general.'),
  seoChecks: z.array(AuditCheckSchema).describe('Controles de SEO tradicional.'),
  geoChecks: z.array(AuditCheckSchema).describe('Controles de optimización de motores de respuesta de IA (GEO).'),
  actionPlan: z.array(z.string()).describe('Lista ordenada de recomendaciones y tareas a corregir.')
});

// Esquema para la Auditoría de Accesibilidad (WCAG 2.2)
const AccessibilityReportSchema = z.object({
  score: z.number().min(0).max(100).describe('Puntuación de accesibilidad de 0 a 100.'),
  status: z.enum(['compliant', 'warning', 'non_compliant']).describe('Estado general.'),
  semanticChecks: z.array(A11yCheckSchema).describe('Evaluaciones de semántica y estructura.'),
  keyboardChecks: z.array(A11yCheckSchema).describe('Evaluaciones de navegación por teclado.'),
  screenReaderChecks: z.array(A11yCheckSchema).describe('Evaluaciones de compatibilidad con lectores de pantalla.'),
  designMotionChecks: z.array(A11yCheckSchema).describe('Evaluaciones de diseño visual, contraste y reducción de movimiento.'),
  actionPlan: z.array(z.string()).describe('Lista ordenada de recomendaciones y tareas a corregir.')
});

// ============================================================================
// 2. CONFIGURACIÓN DE ENTORNO Y ARCHIVOS
// ============================================================================

// Cargar variables de entorno del archivo .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        process.env[key] = value;
      }
    }
  }
  if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }
}

// Leer archivos clave para pasárselos como contexto al agente de IA
function collectProjectContext(): string {
  const filesToRead = [
    { name: 'package.json', path: 'package.json' },
    { name: 'tsconfig.json', path: 'tsconfig.json' },
    { name: 'next.config.ts', path: 'next.config.ts' },
    { name: 'postcss.config.mjs', path: 'postcss.config.mjs' },
    { name: 'prisma/schema.prisma', path: 'prisma/schema.prisma' },
    { name: 'src/app/layout.tsx', path: 'src/app/layout.tsx' },
    { name: 'src/app/page.tsx', path: 'src/app/page.tsx' },
    { name: 'src/app/globals.css', path: 'src/app/globals.css' },
    { name: 'src/app/robots.ts', path: 'src/app/robots.ts' },
    { name: 'src/app/sitemap.ts', path: 'src/app/sitemap.ts' },
    { name: 'public/llms.txt', path: 'public/llms.txt' },
    { name: 'src/components/ui/skip-link.tsx', path: 'src/components/ui/skip-link.tsx' },
    { name: 'src/components/ui/button.tsx', path: 'src/components/ui/button.tsx' },
    { name: 'src/lib/db.ts', path: 'src/lib/db.ts' },
    { name: 'src/env.ts', path: 'src/env.ts' }
  ];

  let context = 'ESTRUCTURA Y CÓDIGO DE ARCHIVOS CLAVE DEL PROYECTO:\n\n';

  for (const file of filesToRead) {
    const fullPath = path.resolve(process.cwd(), file.path);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      context += `=========================================\n`;
      context += `ARCHIVO: ${file.name} (Ruta: ${file.path})\n`;
      context += `=========================================\n`;
      context += `${content}\n\n`;
    } else {
      context += `=========================================\n`;
      context += `ARCHIVO: ${file.name} (Ruta: ${file.path})\n`;
      context += `=========================================\n`;
      context += `[EL ARCHIVO NO EXISTE O AÚN NO HA SIDO CREADO EN EL PROYECTO]\n\n`;
    }
  }

  // Comprobar si existen páginas legales típicas (de forma virtual para el análisis)
  const privacyPath = path.resolve(process.cwd(), 'src/app/privacidad/page.tsx');
  const cookiesPath = path.resolve(process.cwd(), 'src/app/cookies/page.tsx');
  context += `=========================================\n`;
  context += `ESTADO DE PÁGINAS LEGALES:\n`;
  context += `=========================================\n`;
  context += `- Página de Privacidad (src/app/privacidad/page.tsx): ${fs.existsSync(privacyPath) ? 'EXISTE' : 'NO EXISTE'}\n`;
  context += `- Página de Cookies (src/app/cookies/page.tsx): ${fs.existsSync(cookiesPath) ? 'EXISTE' : 'NO EXISTE'}\n\n`;

  return context;
}

// Helper para convertir el estado visual en un emoji/icono Markdown
function getStatusEmoji(status: string): string {
  switch (status) {
    case 'compliant': return '🟢 Conforme';
    case 'warning': return '🟡 Advertencia';
    case 'non_compliant': return '🔴 No Conforme';
    default: return '⚪ N/A';
  }
}

// Helper para formatear puntuaciones generales
function getScoreStatus(score: number): string {
  if (score >= 90) return '🟢 EXCELENTE';
  if (score >= 70) return '🟡 ACEPTABLE (Requiere mejoras)';
  return '🔴 DEFICIENTE (Requiere acción inmediata)';
}

// ============================================================================
// 3. LOGICA DE AUDITORÍAS (LLAMADAS GEMINI)
// ============================================================================

async function runLegalAudit(projectContext: string): Promise<string> {
  console.log(`  - Ejecutando auditoría legal (RGPD, AI Act, ISO)...`);
  const prompt = `
Analiza el contexto del proyecto y realiza una auditoría legal detallada bajo las normativas vigentes europeas:
1. **RGPD (Reglamento General de Protección de Datos)**:
   - Presencia de páginas de Privacidad/Cookies obligatorias.
   - Mecanismos de Cookies (si no hay pre-selección en consentimientos de formularios).
   - Minimización de datos en la base de datos (Prisma schema) y campos del formulario de contacto.
   - Captura de IPs indirectas o Google Fonts CDN no auto-hospedados ( harvesting de IPs sin consentimiento).
   - Anonimización de datos de consentimiento de cookies/auditoría.
2. **Ley de IA de la UE (EU AI Act)**:
   - Identificar si se usa IA (Gemini API, OpenAI API en package.json).
   - Nivel de riesgo (Bajo riesgo por ser asistente/generativo en portafolio de diseño).
   - Requisitos de transparencia: obligación de informar explícitamente a los usuarios si interactúan con una IA o ven contenido generado por IA.
   - Declaración de responsabilidad / disclaimers de alucinaciones.
3. **ISO 27001 / ISO 42001 (Seguridad & Gestión de IA)**:
   - Cabeceras HTTP CSP/HSTS estrictas configuradas en next.config.ts.
   - Seguridad de credenciales (.env y env.ts).
   - Silenciado de logs internos (console.log) en producción.
   - Inventario detallado de APIs de terceros (subencargados de tratamiento, ej: Google Gemini).

Genera un JSON estructurado según el esquema solicitado.
`;

  const model = google('gemini-2.5-flash');
  const { object } = await generateObject({
    model,
    schema: LegalReportSchema,
    prompt: `${projectContext}\n\n${prompt}`,
    temperature: 0.1
  });

  // Convertir el resultado JSON a un reporte Markdown formateado
  let md = `# Informe de Auditoría de Cumplimiento Legal (RGPD, AI Act, ISO)

*Última actualización: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}*

Este informe recopila el estado de cumplimiento normativo del proyecto **Irina Ichim Studio**, evaluando el Reglamento General de Protección de Datos (RGPD), la Ley de Inteligencia Artificial de la UE (EU AI Act) y los estándares de seguridad de la información relacionados con ISO 27001 e ISO 42001.

---

## 📊 Resumen Ejecutivo

* **Estado de Cumplimiento General**: ${getStatusEmoji(object.status)}
* **Fecha de Última Ejecución**: ${new Date().toLocaleString('es-ES')}
* **Puntuación de Cumplimiento**: **${object.score}%** (${getScoreStatus(object.score)})

---

## ⚖️ 1. Reglamento General de Protección de Datos (RGPD / GDPR)

| Criterio de Evaluación | Estado | Hallazgos / Detalles |
| :--- | :---: | :--- |
`;

  for (const check of object.gdprChecks) {
    md += `| **${check.criterion}** | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 🤖 2. Ley de Inteligencia Artificial de la UE (EU AI Act)

| Criterio de Evaluación | Estado | Hallazgos / Detalles |
| :--- | :---: | :--- |
`;

  for (const check of object.aiActChecks) {
    md += `| **${check.criterion}** | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 🔒 3. Seguridad y Estándares ISO (ISO 27001 / ISO 42001)

| Criterio de Evaluación | Estado | Hallazgos / Detalles |
| :--- | :---: | :--- |
`;

  for (const check of object.isoChecks) {
    md += `| **${check.criterion}** | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 🔌 4. Inventario de Proveedores y Servicios de Terceros (Subencargados)

*Este inventario identifica las APIs y herramientas externas que procesan o transfieren datos del usuario:*

| Servicio Externo | Función | Tratamiento de Datos | Nivel de Riesgo (AI Act) |
| :--- | :--- | :--- | :---: |
`;

  for (const service of object.thirdPartyRegistry) {
    md += `| **${service.service}** | ${service.function} | ${service.dataProcessed} | **${service.riskLevel.toUpperCase()}** |\n`;
  }

  md += `
---

## 📋 Plan de Acción y Correcciones Recomendadas

Aquí se listan las tareas priorizadas para solventar las brechas de cumplimiento detectadas por el agente de IA:

`;

  if (object.actionPlan.length === 0) {
    md += `🟢 **¡Felicidades!** El sistema no tiene acciones correctivas pendientes bajo estas directivas.\n`;
  } else {
    object.actionPlan.forEach((task, idx) => {
      md += `${idx + 1}. [ ] **${task}**\n`;
    });
  }

  return md;
}

async function runSeoGeoAudit(projectContext: string): Promise<string> {
  console.log(`  - Ejecutando auditoría de SEO & GEO (Generative Engine Optimization)...`);
  const prompt = `
Analiza el contexto del proyecto y realiza una auditoría de optimización de posicionamiento tradicional (SEO) y optimización para motores de respuesta basados en Inteligencia Artificial (GEO):
1. **SEO Tradicional**:
   - Estructura de títulos y metadatos en layout.tsx.
   - Jerarquía lógica de encabezados (un solo h1, h2-h6 anidados).
   - Presencia de marcado estructurado JSON-LD con tipos y datos reales del estudio.
   - Sitemap y robots.txt válidos y bien enrutados.
   - Presencia de textos alternativos descriptivos en etiquetas de imagen/Image de Next.js.
2. **GEO (Generative Engine Optimization)**:
   - Presencia y tamaño del archivo public/llms.txt y su idoneidad para agentes LLM.
   - Configuración de robots.txt permitiendo explícitamente rastreadores de IA clave (GPTBot, ClaudeBot, PerplexityBot) para páginas públicas.
   - Estructura y legibilidad de textos para LLMs: uso de tablas informativas, resúmenes estructurados y datos claros para que las respuestas sean fáciles de extraer.
   - Citabilidad: presencia inequívoca de marcas, referencias de autoría y descripciones que permitan a las IAs citar al estudio como fuente oficial.
   - Estructura amigable para búsquedas conversacionales y de voz (secciones Q&A/preguntas frecuentes e introducciones claras).

Genera un JSON estructurado según el esquema solicitado.
`;

  const model = google('gemini-2.5-flash');
  const { object } = await generateObject({
    model,
    schema: SeoGeoReportSchema,
    prompt: `${projectContext}\n\n${prompt}`,
    temperature: 0.1
  });

  let md = `# Informe de Auditoría de SEO & GEO (Generative Engine Optimization)

*Última actualización: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}*

Este informe evalúa el nivel de optimización de **Irina Ichim Studio** para buscadores tradicionales (SEO en Google, Bing) y la optimización para motores de respuesta de Inteligencia Artificial (GEO en ChatGPT, Claude, Gemini, Perplexity y SearchGPT).

---

## 📊 Resumen Ejecutivo

* **Estado de Optimización General**: ${getStatusEmoji(object.status)}
* **Fecha de Última Ejecución**: ${new Date().toLocaleString('es-ES')}
* **Puntuación de SEO Técnico**: **${object.scoreSEO}%** (${getScoreStatus(object.scoreSEO)})
* **Puntuación de GEO (Motores IA)**: **${object.scoreGEO}%** (${getScoreStatus(object.scoreGEO)})

---

## 🔍 1. SEO Tradicional (Search Engine Optimization)

| Criterio de Evaluación | Estado | Hallazgos / Detalles |
| :--- | :---: | :--- |
`;

  for (const check of object.seoChecks) {
    md += `| **${check.criterion}** | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 🤖 2. GEO (Generative Engine Optimization - Optimización para IA)

*La optimización GEO asegura que los modelos de lenguaje (LLMs) puedan indexar el sitio y citarlo como fuente verídica en sus respuestas:*

| Criterio de Evaluación | Estado | Hallazgos / Detalles |
| :--- | :---: | :--- |
`;

  for (const check of object.geoChecks) {
    md += `| **${check.criterion}** | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 📋 Plan de Acción y Correcciones Recomendadas

Aquí se listan las tareas de optimización recomendadas para mejorar la visibilidad orgánica en Google y en los chats de IA:

`;

  if (object.actionPlan.length === 0) {
    md += `🟢 **¡Felicidades!** El sitio está totalmente optimizado para buscadores tradicionales y de IA.\n`;
  } else {
    object.actionPlan.forEach((task, idx) => {
      md += `${idx + 1}. [ ] **${task}**\n`;
    });
  }

  return md;
}

async function runAccessibilityAudit(projectContext: string): Promise<string> {
  console.log(`  - Ejecutando auditoría de accesibilidad (WCAG 2.2)...`);
  const prompt = `
Analiza el contexto del proyecto y realiza una auditoría estricta de Accesibilidad según las directrices WCAG 2.2:
1. **Semántica y Estructura**:
   - Jerarquía de títulos (presencia de H1 único, no saltar niveles).
   - Uso de marcas de estructura semántica (main, nav, header, footer).
2. **Navegación por Teclado e Interacción**:
   - Presencia de un SkipLink al inicio del body.
   - Visibilidad de foco (:focus-visible) en componentes clave de globals.css.
   - Control de foco en interactivos (focus trap para modales).
   - Tamaño del touch target de elementos clicables (mínimo 44x44px o margen equivalente en mobile).
3. **Lector de Pantalla y Accesibilidad Textual**:
   - Presencia y descriptividad de textos alternativos (alt) en Image/img.
   - Atributos aria (aria-label, aria-expanded, roles correctos).
   - Anuncio de errores y estados dinámicos con aria-live.
4. **Diseño y Movimiento**:
   - Ajustes de Framer Motion / CSS para respetar reduced motion (prefers-reduced-motion).
   - Contrastes cromáticos altos de textos principales y secundarios (al menos 4.5:1 para AA y 7:1 para AAA).

Genera un JSON estructurado según el esquema solicitado.
`;

  const model = google('gemini-2.5-flash');
  const { object } = await generateObject({
    model,
    schema: AccessibilityReportSchema,
    prompt: `${projectContext}\n\n${prompt}`,
    temperature: 0.1
  });

  let md = `# Informe de Auditoría de Accesibilidad (WCAG 2.2 AA/AAA)

*Última actualización: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}*

Este informe recopila el cumplimiento de las pautas de accesibilidad para el contenido web (WCAG 2.2) niveles AA y AAA del sitio **Irina Ichim Studio**, garantizando que sea usable por personas con diversidad funcional.

---

## 📊 Resumen Ejecutivo

* **Estado de Accesibilidad General**: ${getStatusEmoji(object.status)}
* **Fecha de Última Ejecución**: ${new Date().toLocaleString('es-ES')}
* **Puntuación de Accesibilidad**: **${object.score}%** (${getScoreStatus(object.score)})

---

## ♿ Criterios de Accesibilidad Evaluados (WCAG 2.2)

### 1. Semántica y Estructura del Documento

| Criterio | Nivel | Estado | Hallazgos / Detalles |
| :--- | :---: | :---: | :--- |
`;

  for (const check of object.semanticChecks) {
    md += `| **${check.criterion}** | ${check.level} | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
### 2. Navegación por Teclado e Interacción

| Criterio | Nivel | Estado | Hallazgos / Detalles |
| :--- | :---: | :---: | :--- |
`;

  for (const check of object.keyboardChecks) {
    md += `| **${check.criterion}** | ${check.level} | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
### 3. Lector de Pantalla y Contenido Textual

| Criterio | Nivel | Estado | Hallazgos / Detalles |
| :--- | :---: | :---: | :--- |
`;

  for (const check of object.screenReaderChecks) {
    md += `| **${check.criterion}** | ${check.level} | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
### 4. Diseño Adaptativo y Movimiento

| Criterio | Nivel | Estado | Hallazgos / Detalles |
| :--- | :---: | :---: | :--- |
`;

  for (const check of object.designMotionChecks) {
    md += `| **${check.criterion}** | ${check.level} | ${getStatusEmoji(check.status)} | ${check.findings} |\n`;
  }

  md += `
---

## 📋 Plan de Acción y Correcciones Recomendadas

Aquí se listan las correcciones recomendadas para cumplir con los estándares WCAG 2.2 AA y AAA:

`;

  if (object.actionPlan.length === 0) {
    md += `🟢 **¡Felicidades!** El sitio es completamente accesible bajo las directivas WCAG 2.2.\n`;
  } else {
    object.actionPlan.forEach((task, idx) => {
      md += `${idx + 1}. [ ] **${task}**\n`;
    });
  }

  return md;
}

// ============================================================================
// 4. FUNCIÓN PRINCIPAL DE EJECUCIÓN
// ============================================================================

async function main() {
  loadEnv();

  console.log(`${colors.bold}${colors.cyan}====================================================`);
  console.log(`🤖 AGENTE DE AUDITORÍAS MULTI-CUMPLIMIENTO`);
  console.log(`   (Legal RGPD/AI Act, SEO/GEO & Accesibilidad WCAG)`);
  console.log(`====================================================${colors.reset}\n`);

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error(`${colors.red}${colors.bold}Error: No se encontró GEMINI_API_KEY en el archivo .env.${colors.reset}`);
    console.error(`Por favor, añade tu clave al archivo .env para poder continuar.\n`);
    process.exit(1);
  }

  console.log(`⌛ Recopilando código fuente y configuraciones del proyecto...`);
  const projectContext = collectProjectContext();
  console.log(`${colors.green}✔ Contexto recopilado correctamente.${colors.reset}\n`);

  const auditsDir = path.resolve(process.cwd(), 'docs', 'audits');
  if (!fs.existsSync(auditsDir)) {
    fs.mkdirSync(auditsDir, { recursive: true });
  }

  // 1. Auditoría Legal
  try {
    const legalMd = await runLegalAudit(projectContext);
    fs.writeFileSync(path.join(auditsDir, 'legal-compliance.md'), legalMd, 'utf8');
    console.log(`${colors.green}✔ Auditoría Legal completada. Informe guardado en docs/audits/legal-compliance.md${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✘ Error al ejecutar auditoría Legal: ${(error as Error).message}${colors.reset}\n`);
  }

  // Pequeño retardo entre peticiones para respetar rate-limits de la API de Gemini
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 2. Auditoría SEO & GEO
  try {
    const seoGeoMd = await runSeoGeoAudit(projectContext);
    fs.writeFileSync(path.join(auditsDir, 'seo-geo-report.md'), seoGeoMd, 'utf8');
    console.log(`${colors.green}✔ Auditoría SEO & GEO completada. Informe guardado en docs/audits/seo-geo-report.md${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✘ Error al ejecutar auditoría SEO & GEO: ${(error as Error).message}${colors.reset}\n`);
  }

  await new Promise(resolve => setTimeout(resolve, 3000));

  // 3. Auditoría de Accesibilidad
  try {
    const accessibilityMd = await runAccessibilityAudit(projectContext);
    fs.writeFileSync(path.join(auditsDir, 'accessibility.md'), accessibilityMd, 'utf8');
    console.log(`${colors.green}✔ Auditoría de Accesibilidad completada. Informe guardado en docs/audits/accessibility.md${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✘ Error al ejecutar auditoría de Accesibilidad: ${(error as Error).message}${colors.reset}\n`);
  }

  console.log(`====================================================`);
  console.log(`${colors.bold}${colors.green}🎉 AUDITORÍAS COMPLETADAS CON ÉXITO.${colors.reset}`);
  console.log(`Los informes detallados se encuentran en: ${colors.bold}docs/audits/${colors.reset}`);
  console.log(`====================================================\n`);
}

main().catch(err => {
  console.error(`${colors.red}Error fatal en el agente de auditoría:${colors.reset}`, err);
  process.exit(1);
});
