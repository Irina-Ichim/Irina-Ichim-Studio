import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Colores ANSI para una salida premium en terminal
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

const IssueSchema = z.object({
  type: z.enum(['spelling', 'grammar', 'seo', 'geo', 'style']),
  severity: z.enum(['error', 'warning']),
  line: z.number().describe('El número de línea aproximado donde se encuentra el problema, o 0 si no aplica.'),
  original: z.string().describe('El fragmento exacto de texto donde se detectó el problema.'),
  replacement: z.string().describe('La sugerencia de corrección.'),
  explanation: z.string().describe('Una explicación breve de por qué se debe corregir y qué regla o buena práctica incumple.'),
});

const FileReportSchema = z.object({
  isValid: z.boolean().describe('false si se detectó al menos un problema que se considera un error bloqueante (ej: faltas de ortografía graves, valores por defecto de SEO, idioma incorrecto).'),
  issues: z.array(IssueSchema),
});

type Issue = z.infer<typeof IssueSchema>;
type FileReport = {
  filePath: string;
  isValid: boolean;
  issues: Issue[];
};

// 1. Cargar variables de entorno manualmente desde .env
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
        // Limpiar comillas
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  }
  
  // Mapear GEMINI_API_KEY a la variable que espera el SDK de Google
  if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = process.env.GEMINI_API_KEY;
  }
}

// 2. Obtener archivos modificados por Git con sus estados
function getChangedFiles(): { path: string; status: string }[] {
  try {
    const stdout = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!stdout.trim()) return [];
    
    return stdout
      .split('\n')
      .map(line => {
        if (!line.trim()) return null;
        const status = line.slice(0, 2).trim();
        let filePath = line.slice(2).trim();
        // Manejar renombrados (ej. R old -> new)
        if (status.startsWith('R')) {
          const parts = filePath.split(' -> ');
          filePath = parts[parts.length - 1].trim();
        }
        // Limpiar comillas si las hay
        if (filePath.startsWith('"') && filePath.endsWith('"')) {
          filePath = filePath.slice(1, -1);
        }
        return { path: filePath, status };
      })
      .filter((file): file is { path: string; status: string } => file !== null);
  } catch {
    console.error(`${colors.yellow}Advertencia: No se pudo ejecutar git status. Escaneando archivos principales por defecto.${colors.reset}`);
    return [];
  }
}

// 3. Obtener todos los archivos relevantes en caso de no haber cambios en Git
function getAllProjectFiles(dir: string = 'src'): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllProjectFiles(filePath));
    } else {
      const ext = path.extname(filePath);
      if (['.ts', '.tsx', '.md', '.mdx', '.js', '.jsx'].includes(ext)) {
        results.push(filePath);
      }
    }
  }
  return results;
}

// 4. Obtener sólo el diff agregado para evitar mandar todo el archivo (ahorro de tokens y mayor foco)
function getFileContentOrDiff(filePath: string, status: string): { content: string; isDiff: boolean } {
  // Solo para archivos modificados que no sean nuevos
  if (status.includes('M') && !status.includes('A') && !status.includes('?')) {
    try {
      const diff = execSync(`git diff HEAD -- "${filePath}"`, { encoding: 'utf8' });
      const addedLines = diff
        .split('\n')
        .filter(line => line.startsWith('+') && !line.startsWith('+++'))
        .map(line => line.slice(1)) // Quitar el símbolo '+'
        .join('\n');
      
      if (addedLines.trim().length > 10) {
        return { content: addedLines, isDiff: true };
      }
    } catch {
      // Fallback a leer el archivo completo si falla el diff
    }
  }
  return { content: fs.readFileSync(filePath, 'utf8'), isDiff: false };
}

// Helper para hacer pausas (sleep)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 5. Analizar un archivo con Gemini usando generateObject (Función Base)
async function analyzeFileRaw(filePath: string, status: string): Promise<FileReport> {
  const { content, isDiff } = getFileContentOrDiff(filePath, status);
  const contentDescription = isDiff ? "únicamente las líneas modificadas (git diff)" : "el contenido completo del archivo";

  const prompt = `
Analiza el siguiente contenido del archivo para verificar la calidad lingüística en español de España (Castellano), las mejores prácticas de SEO y la optimización para buscadores de IA (GEO).

Nombre del archivo: ${filePath}
Tipo de análisis: Analizando ${contentDescription}.

Contenido a analizar:
"""
${content}
"""

Debes aplicar estas reglas estrictamente:
1. Ortografía y gramática en español de España (Castellano):
   - Uso correcto de tildes (acentuación, ej. "comunicación", "diseño", "imágenes").
   - Conjugación correcta de verbos y concordancia de género y número.
   - Expresiones y términos naturales de España (ej. "ordenador" en lugar de "computadora", "móvil" en lugar de "celular").
   - IMPORTANTE: Ignora importaciones, variables de código, nombres de funciones, clases de CSS/Tailwind, URLs y rutas de archivos. Solo analiza textos visibles para el usuario final (JSX, strings literales, o Markdown).
   - IMPORTANTE: Todas las detecciones de tipo "spelling", "grammar" y "style" deben tener severidad "warning" (advertencia no bloqueante), ya que pueden ser falsos positivos o modismos válidos del proyecto.

2. Buenas prácticas de SEO y GEO (AI Search Engine Optimization):
   - Evitar valores por defecto de Next.js (como "Create Next App", "Generated by create next app" o la etiqueta de idioma "lang=\\"en\\"" en lugar de "lang=\\"es\\""). Estos valores por defecto deben considerarse errores ("error").
   - Jerarquía de encabezados coherente (un solo H1 principal, orden lógico H2, H3).
   - Presencia de atributos 'alt' significativos en etiquetas de imágenes.
   - Marcado estructurado (JSON-LD) si es una página o layout principal.
`;

  try {
    const model = google('gemini-2.5-flash');
    const { object } = await generateObject({
      model,
      schema: FileReportSchema,
      prompt,
      temperature: 0.1,
    });

    return {
      filePath,
      isValid: object.isValid,
      issues: object.issues || []
    };
  } catch (error) {
    const errorMsg = (error as Error).message;
    return {
      filePath,
      isValid: false,
      issues: [
        {
          type: 'style',
          severity: 'warning',
          line: 0,
          original: '',
          replacement: '',
          explanation: `Error al procesar el archivo con la IA: ${errorMsg}`
        }
      ]
    };
  }
}

// 6. Envoltura con reintentos y esperas para evitar límites de cuota (Rate-Limits)
async function analyzeFile(filePath: string, status: string, retries = 3): Promise<FileReport> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const report = await analyzeFileRaw(filePath, status);
      // Comprobar si falló debido a problemas de cuota
      const rateLimitIssue = report.issues.find(i => 
        i.explanation.includes("Quota exceeded") || 
        i.explanation.includes("rate-limits") ||
        i.explanation.includes("Resource has been exhausted") ||
        i.explanation.includes("limit")
      );
      if (rateLimitIssue) {
        throw new Error(rateLimitIssue.explanation);
      }
      return report;
    } catch (error) {
      if (attempt === retries) {
        return {
          filePath,
          isValid: true, // No bloqueamos el commit si el API de Gemini falla temporalmente
          issues: [
            {
              type: 'style',
              severity: 'warning',
              line: 0,
              original: '',
              replacement: '',
              explanation: `Advertencia de API tras ${retries} intentos: ${(error as Error).message}`
            }
          ]
        };
      }
      const waitTime = attempt * 6000; // 6s, 12s...
      console.log(`\n  ⚠️ Límite de API alcanzado en ${filePath}. Reintentando intento ${attempt + 1}/${retries} en ${waitTime/1000}s...`);
      await sleep(waitTime);
    }
  }
  return { filePath, isValid: true, issues: [] };
}

// 7. Función principal
async function main() {
  loadEnv();
  
  console.log(`${colors.bold}${colors.cyan}====================================================`);
  console.log(`🤖 AGENTE DE VALIDACIÓN LOCAL (SEO, GEO & ORTOGRAFÍA)`);
  console.log(`====================================================${colors.reset}\n`);

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error(`${colors.red}${colors.bold}Error: No se encontró GEMINI_API_KEY en el archivo .env.${colors.reset}`);
    console.error(`Por favor, añade tu clave al archivo .env para poder continuar.\n`);
    process.exit(1);
  }

  // Detectar archivos
  const changedFiles = getChangedFiles();
  let filesToAnalyze = changedFiles.filter(file => {
    const ext = path.extname(file.path);
    const isCodeOrDoc = ['.ts', '.tsx', '.md', '.mdx', '.js', '.jsx'].includes(ext);
    const isNotConfig = !file.path.includes('next.config') && !file.path.includes('eslint') && !file.path.includes('tailwind.config') && !file.path.includes('tsconfig');
    const isNotNodeModules = !file.path.startsWith('node_modules') && !file.path.startsWith('.next') && !file.path.startsWith('docs/');
    return isCodeOrDoc && isNotConfig && isNotNodeModules;
  });

  if (filesToAnalyze.length === 0) {
    console.log(`${colors.yellow}No se detectaron archivos modificados en Git. Escaneando la carpeta 'src' al completo...${colors.reset}\n`);
    const allFiles = getAllProjectFiles('src');
    filesToAnalyze = allFiles.map(filePath => ({ path: filePath, status: '??' }));
  }

  if (filesToAnalyze.length === 0) {
    console.log(`${colors.green}✔ No hay archivos para analizar.${colors.reset}`);
    process.exit(0);
  }

  console.log(`Archivos a analizar (${filesToAnalyze.length}):`);
  filesToAnalyze.forEach(file => console.log(`  - ${file.path} [Status: ${file.status}]`));
  console.log('\n⌛ Analizando cambios con Gemini...');

  let hasErrors = false;
  let totalIssues = 0;
  const reports: FileReport[] = [];

  for (const file of filesToAnalyze) {
    process.stdout.write(`  Análisis de ${file.path}... `);
    const report = await analyzeFile(file.path, file.status);
    reports.push(report);

    if (report.isValid && report.issues.length === 0) {
      console.log(`${colors.green}✔ Todo correcto${colors.reset}`);
    } else {
      const errors = report.issues.filter(i => i.severity === 'error');
      const warnings = report.issues.filter(i => i.severity === 'warning');
      
      if (errors.length > 0) {
        console.log(`${colors.red}✘ Encontrados ${errors.length} errores${colors.reset}`);
        hasErrors = true;
      } else {
        console.log(`${colors.yellow}⚠ Encontradas ${warnings.length} advertencias${colors.reset}`);
      }
      totalIssues += report.issues.length;
    }
    
    // Espera de seguridad para no agotar la cuota de RPM (Requests Per Minute) de la API gratuita de Gemini (15 RPM)
    await sleep(4500);
  }

  // 7. Validaciones estructurales del proyecto
  console.log(`\n⌛ Ejecutando validaciones estructurales de GEO/AI...`);
  
  // Validar llms.txt
  const llmsPath = path.resolve(process.cwd(), 'public', 'llms.txt');
  if (!fs.existsSync(llmsPath)) {
    console.log(`${colors.yellow}⚠ GEO Warning: El archivo 'public/llms.txt' no existe. Es recomendable para que rastreadores de IA conozcan tu sitio.${colors.reset}`);
    totalIssues++;
  } else {
    const llmsContent = fs.readFileSync(llmsPath, 'utf8');
    if (llmsContent.length < 150) {
      console.log(`${colors.yellow}⚠ GEO Warning: El archivo 'public/llms.txt' es muy corto (${llmsContent.length} bytes). Considera enriquecerlo con descripciones de tus páginas y arquitectura.${colors.reset}`);
      totalIssues++;
    } else {
      console.log(`${colors.green}✔ public/llms.txt presente y bien dimensionado.${colors.reset}`);
    }
  }

  // Imprimir resumen detallado de problemas
  if (totalIssues > 0) {
    console.log(`\n${colors.bold}${colors.red}================ DETALLE DE DETECCIONES ================${colors.reset}`);
    for (const report of reports) {
      if (report.issues.length === 0) continue;
      
      console.log(`\n${colors.bold}${colors.cyan}Archivo: [${report.filePath}]${colors.reset}`);
      for (const issue of report.issues) {
        const prefix = issue.severity === 'error' 
          ? `${colors.red}[ERROR]` 
          : `${colors.yellow}[WARNING]`;
          
        console.log(`  ${prefix} (Línea ${issue.line || 'N/A'}) - Tipo: ${issue.type.toUpperCase()}`);
        console.log(`    Encontrado: "${colors.red}${issue.original}${colors.reset}"`);
        console.log(`    Sugerencia: "${colors.green}${issue.replacement}${colors.reset}"`);
        console.log(`    Explicación: ${issue.explanation}`);
      }
    }
    console.log(`\n${colors.bold}${colors.red}========================================================${colors.reset}`);
  }

  console.log(`\n====================================================`);
  console.log(`RESUMEN FINAL:`);
  console.log(`  - Archivos analizados: ${filesToAnalyze.length}`);
  console.log(`  - Total de problemas encontrados: ${totalIssues}`);
  console.log(`====================================================`);

  if (hasErrors) {
    console.log(`\n${colors.red}${colors.bold}❌ VALIDACIÓN FALLIDA: Hay errores graves que bloquean el despliegue.${colors.reset}`);
    console.log(`Por favor, corrige los problemas señalados arriba.\n`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}✔ VALIDACIÓN EXITOSA: Los cambios cumplen con los estándares de calidad.${colors.reset}\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error(`\nError fatal en el agente:`, err);
  process.exit(1);
});
