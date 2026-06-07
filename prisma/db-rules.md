# Reglas de Desarrollo: Base de Datos y Backend (Prisma & PostgreSQL)

Este archivo define las directrices y estándares para la capa de persistencia de datos de **Irina Ichim Studio**.

---

## 1. Seguridad de Datos Sensibles (Dotenv)
* **Nunca expongas credenciales:** Bajo ninguna circunstancia se deben subir contraseñas, URLs de base de datos o API Keys al control de versiones (Git).
* **Uso obligatorio de `.env`:** La cadena de conexión a la base de datos debe leerse exclusivamente mediante la variable de entorno `DATABASE_URL` declarada en [.env](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/.env).
* **Control de versiones:** El archivo `.env` debe permanecer listado en [.gitignore](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/.gitignore). Sólo se permite subir `.env.example` con valores ficticios como referencia.

---

## 2. Definición del Esquema Prisma
* **Nombres en inglés y minúsculas/snake_case:** Los nombres de las tablas (modelos) en la base de datos se definirán en PascalCase en el esquema, pero deben mapearse a nombres físicos en plural y minúsculas o snake_case utilizando la directiva `@@map`.
  ```prisma
  model User {
    id        String   @id @default(uuid())
    email     String   @unique
    createdAt DateTime @default(now()) @map("created_at")

    @@map("users")
  }
  ```
* **Tipos explícitos:** Usa identificadores robustos (como UUID o CUID) para claves primarias en lugar de enteros autoincrementales simples para evitar enumeración de recursos y facilitar integraciones en Railway.
* **Relaciones explícitas:** Define siempre relaciones bidireccionales y utiliza políticas de borrado (`onDelete: Cascade` o `onDelete: SetNull`) explícitas para evitar inconsistencias de datos.

---

## 3. Consultas y Arquitectura
* **SOLID - Responsabilidad Única:** No realices consultas directas de Prisma (`prisma.user.findMany()`) dentro de los componentes visuales de React o páginas. Toda interacción con la base de datos debe encapsularse en:
    - **Servicios/Controladores:** Clases o funciones de servicio dedicadas (ej. `src/services/db/users.ts`).
    - **Server Actions:** Acciones del servidor de Next.js aisladas (ej. `src/app/actions/users.ts`).
* **Manejo de Conexión Única (Singleton):** Asegúrate de reutilizar una única instancia de `PrismaClient` en desarrollo para evitar agotar el pool de conexiones de PostgreSQL por culpa de la recarga rápida de Next.js. Implementa el patrón Singleton estándar para Prisma.
* **Manejo de Errores:** Toda consulta a la base de datos debe estar envuelta en bloques `try/catch` con logs estructurados para depuración, devolviendo respuestas controladas (nunca expongas el error interno raw de la base de datos al cliente por seguridad).
