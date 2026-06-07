import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL debe ser una URL válida de conexión"),
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY es obligatorio para el agente de validación local"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

// Parsear las variables de entorno de forma segura
const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsed.success) {
  console.error("\n❌ ERROR DE CONFIGURACIÓN EN LAS VARIABLES DE ENTORNO:");
  const errors = parsed.error.format();
  for (const [key, value] of Object.entries(errors)) {
    if (key === "_errors") continue;
    const errorDetails = (value as { _errors: string[] })._errors.join(", ");
    console.error(`  - ${key}: ${errorDetails}`);
  }
  console.error("\nPor favor, revisa tu archivo .env y asegúrate de declarar todas las variables necesarias.\n");
  throw new Error("Variables de entorno inválidas o faltantes.");
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
