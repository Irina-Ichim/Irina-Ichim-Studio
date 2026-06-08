# Reglas de Desarrollo: Frontend (Next.js & React)

Este archivo define las directrices y estándares de desarrollo para la interfaz de usuario de **Irina Ichim Studio**.

---

## 1. Stack Tecnológico

* **Framework:** Next.js 16 (App Router).
* **Renderizado:** Server Components por defecto. Usa `'use client'` únicamente cuando requieras interactividad (hooks como `useState`, `useEffect`) o APIs del navegador.
* **Estilos:** Tailwind CSS v4. Usa variables de tema configuradas en [globals.css](file:///c:/Users/proye/.gemini/antigravity/playground/irina-ichim-studio/src/app/globals.css).
* **Componentes base:** shadcn/ui (reutilizables e integrados en `src/components/ui/`).
* **Animaciones:** Framer Motion (siempre respetando la reducción de movimiento del usuario).

---

## 2. Principios de Diseño y Limpieza (SOLID, KISS, DRY)

* **KISS (Keep It Simple, Stupid):** No sobrediseñes componentes. Si un componente puede ser una función pura simple sin estado, mantenlo así.
* **DRY (Don't Repeat Yourself) & Cohesión Estética:** Abstrae lógica común o estilos repetitivos en componentes reutilizables o hooks personalizados (`src/hooks/`). No dupliques clases de Tailwind idénticas ni agregues estilos ad-hoc si ya existen componentes configurados. Reutiliza siempre los tokens de color del sistema en lugar de usar valores hexadecimales directos o clases de color arbitrarias (ej: usa `text-muted-foreground` en vez de `text-[#6b7280]`).
* **Responsabilidad Única (S de SOLID):** Cada componente debe hacer una sola cosa bien. Si un componente excede las 150 líneas, evalúa dividirlo en subcomponentes más pequeños.
* **Prohibición de Estilos en Línea:** Queda prohibido el uso de la propiedad `style={{ ... }}` en JSX para estilos estáticos o dinámicos que puedan ser cubiertos por clases de Tailwind o variables CSS en la hoja de estilos. Para previsualizaciones de color en caliente o cálculos en tiempo real muy específicos, utiliza referencias de React (`useRef` o callbacks de `ref`) para alterar el estilo del elemento de forma directa o inyecta variables CSS, previniendo así ensuciar el marcado y violar las reglas de análisis estático del linter.

---

## 3. TypeScript Estricto

* **Prohibido el uso de `any`:** Todo tipo debe estar definido de forma explícita. Si el tipo es dinámico o desconocido, usa genéricos (`<T>`) o `unknown`, nunca `any`.
* **Tipos sobre Interfaces:** Usa `type` para props y uniones de tipos complejos. Usa `interface` principalmente para extender objetos de API o modelos.
* **Valores nulos:** Usa encadenamiento opcional (`?.`) y operador de coalescencia nula (`??`) de manera explícita.

---

## 4. Accesibilidad Estricta (WCAG AAA / AA)

* **Contraste:** Todo texto debe cumplir con el ratio de contraste 7:1 (AAA) utilizando los tokens del sistema.
* **Semántica Estricta:** Usa etiquetas HTML5 semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) en su contexto jerárquico correcto. Está prohibido el uso de múltiples landmarks `<main>` en una misma vista (debe haber uno solo por página, típicamente en el RootLayout o envolviendo el contenido dinámico).
* **Foco:** Asegura que todos los elementos interactivos tengan un estilo de foco visible mediante teclado.
* **Área Táctil Mínima (WCAG 2.2 AAA):** Todo elemento interactivo (botones, enlaces de navegación, inputs, toggles) debe garantizar un área de clic/toque de al menos **44x44px**. Si el diseño visual requiere un tamaño menor (por ejemplo, botones compactos 'xs', 'sm' o iconos de 32px), es obligatorio utilizar pseudoelementos `::after` (`relative after:absolute after:content-[''] after:inset-y-[-6px] after:inset-x-[-6px]` o equivalente) para expandir el objetivo táctil de forma transparente sin alterar la presentación visual.
* **Determinismo en el Renderizado de Temas (FOUC & Hydration Mismatch):** La inicialización del tema claro/oscuro no debe causar parpadeos de carga (Flash of Unstyled Content) ni errores de hidratación de React. El estado del tema debe leerse de forma síncrona y bloqueante en un script ligero inyectado en el `<head>` antes de pintar el DOM. En componentes cliente que dependan del tema, posterga el renderizado de los controles dinámicos hasta que el componente esté montado (`mounted === true`) usando `requestAnimationFrame` para evitar saltos en la interfaz.
* **Reducción de movimiento:** Si usas Framer Motion, implementa animaciones alternativas simplificadas (ej: fade simple en lugar de desplazamientos complejos) cuando se detecte `useReducedMotion()`.

---

## 5. Idioma y Localización (España)

* **Idioma HTML:** La etiqueta `<html>` en el layout raíz debe tener siempre `lang="es"`.
* **Idioma de los textos:** Todo texto de interfaz visualizado por el usuario debe estar escrito en **Español de España (Castellano)**.
  * Usa tildes correctamente (ej: *más, dirección, imágenes*).
  * Usa modismos españoles (*ordenador, móvil, empezar, guardar*).
