# Especificación Técnica: Sistema de Diseño y Accesibilidad (WCAG 2.1/2.2 AAA/AA)

Este documento define la especificación arquitectónica del sistema de diseño de **Irina Ichim Studio**, garantizando que cumpla con el nivel más alto de accesibilidad: **WCAG AAA** (con degradación controlada a **AA** donde AAA no sea técnicamente viable).

---

## 1. Diseño Visual y Contraste de Colores (AAA)

Para cumplir con el estándar AAA, todo el contenido de texto legible debe cumplir con las siguientes relaciones de contraste de color frente a su fondo:
* **Texto normal (inferior a 18pt o 24px):** Contraste mínimo de **7:1**.
* **Texto grande (superior a 18pt/24px, o negrita de 14pt/18.67px):** Contraste mínimo de **4.5:1**.
* **Elementos de interfaz gráficos y estados activos (bordes de input, iconos):** Contraste mínimo de **3:1** (Nivel AA/AAA).

### Tokens de Color del Sistema (Espacio de Color OKLCH)
Definiremos los colores en [globals.css](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/app/globals.css) usando coordenadas OKLCH para asegurar un contraste matemático y una consistencia perfecta:

| Token | Propósito | Valor Claro (OKLCH) | Valor Oscuro (OKLCH) | Ratio de Contraste vs Fondo |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | Fondo principal | `oklch(1 0 0)` (Blanco) | `oklch(0.145 0 0)` (Negro) | N/A |
| `--foreground` | Texto primario | `oklch(0.145 0 0)` (Negro) | `oklch(0.985 0 0)` (Gris ultra claro) | ~19:1 (AAA) |
| `--primary` | Botones, elementos destacados | `oklch(0.15 0 0)` (Negro puro) | `oklch(0.95 0 0)` (Blanco hueso) | ~19:1 (AAA) |
| `--muted-foreground`| Texto secundario, descripciones | `oklch(0.38 0 0)` (Gris oscuro) | `oklch(0.80 0 0)` (Gris claro) | ~7.2:1 (AAA) |
| `--destructive` | Alertas y errores | `oklch(0.48 0.20 28)` (Rojo oscuro) | `oklch(0.85 0.16 28)` (Rojo pastel oscuro) | ~7.1:1 (AAA) |

> [!NOTE]
> Hemos ajustado `--muted-foreground` de un L-value de `0.556` a `0.38` en modo claro. Esto asegura que el texto secundario mantenga el contraste estricto de **7:1** frente al fondo blanco.

---

## 2. Tipografía y Legibilidad

* **Tamaño base de fuente:** Mínimo `1rem` (16px) para textos de lectura. Ningún texto visualizable debe ser inferior a `0.875rem` (14px).
* **Interlineado (Line-height):** Mínimo de `1.5` para párrafos de texto (clase Tailwind `leading-relaxed` o `leading-loose`).
* **Espaciado entre párrafos:** Debe ser de al menos `1.5 veces` el tamaño de la fuente.
* **Redimensionamiento:** Todo el texto debe ser escalable hasta un 200% sin romper el diseño de la página.

---

## 3. Navegación por Teclado e Indicadores de Foco

Nadie debe requerir de un ratón para navegar por el sitio de Irina Ichim Studio.
* **Foco visible obligatorio:** Todos los elementos enfocables (enlaces, botones, inputs) deben tener un indicador de foco altamente visible al usar el teclado. No se permite ocultar el foco (`outline: none`) a menos que sea reemplazado por un estilo de anillo de foco accesible.
  * *Estilo estándar:* `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-offset-2`.
* **Orden de Tabulación (Tab-order):** Debe seguir estrictamente el orden lógico visual (de arriba a abajo, de izquierda a derecha).
* **Bypass (Saltar contenido):** Se implementará un componente `SkipLink` al inicio de cada página para permitir que usuarios con teclado o lectores de pantalla salten directamente al bloque `<main>`, evitando el menú de navegación.

---

## 4. Animaciones y Reducción de Movimiento (AAA)

Las animaciones excesivas pueden causar mareos o distracciones a usuarios con trastornos vestibulares.
* **Movimiento no esencial:** Toda animación que implique desplazamiento, escala o rotación debe desactivarse automáticamente si el sistema del usuario tiene activada la opción de reducción de movimiento.
* **Implementación:**
  * Usar `@media (prefers-reduced-motion: reduce)` en CSS para desactivar transiciones.
  * Usar la directiva `useReducedMotion` de Framer Motion en React para simplificar animaciones de desvanecimiento simple (`opacity: 0` a `1`) en lugar de desplazamientos complejos.

---

## 5. Accesibilidad en Formularios y Controles Interactivos

* **Labels Asociadas:** Todos los controles de formulario deben tener una etiqueta de texto descriptiva asociada a través del atributo `htmlFor` del `<label>`.
* **Identificación del propósito de los inputs (AAA):** Todos los campos de entrada de datos personales comunes del usuario deben incluir el atributo `autocomplete` (ej. `autocomplete="name"`, `autocomplete="email"`). Esto ayuda a personas con dificultades cognitivas a autorrellenar formularios.
* **Mensajes de error y ayuda:** Las alertas de formulario deben usar `role="alert"` y estar asociadas al input correspondiente mediante `aria-describedby` y `aria-invalid="true"`.
