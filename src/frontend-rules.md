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
* **DRY (Don't Repeat Yourself):** Abstrae lógica común o estilos repetitivos en componentes reutilizables o hooks personalizados (`src/hooks/`). No dupliques clases de Tailwind idénticas en múltiples lugares si puedes encapsularlas.
* **Responsabilidad Única (S de SOLID):** Cada componente debe hacer una sola cosa bien. Si un componente excede las 150 líneas, evalúa dividirlo en subcomponentes más pequeños.

---

## 3. TypeScript Estricto
* **Prohibido el uso de `any`:** Todo tipo debe estar definido de forma explícita. Si el tipo es dinámico o desconocido, usa genéricos (`<T>`) o `unknown`, nunca `any`.
* **Tipos sobre Interfaces:** Usa `type` para props y uniones de tipos complejos. Usa `interface` principalmente para extender objetos de API o modelos.
* **Valores nulos:** Usa encadenamiento opcional (`?.`) y operador de coalescencia nula (`??`) de manera explícita.

---

## 4. Accesibilidad Estricta (WCAG AAA / AA)
* **Contraste:** Todo texto debe cumplir con el ratio de contraste 7:1 (AAA) utilizando los tokens del sistema.
* **Semántica:** Usa etiquetas HTML5 semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) en lugar de abusar de `<div>`.
* **Foco:** Asegura que todos los elementos interactivos tengan un estilo de foco visible mediante teclado.
* **Reducción de movimiento:** Si usas Framer Motion, implementa animaciones alternativas simplificadas (ej: fade simple en lugar de desplazamientos complejos) cuando se detecte `useReducedMotion()`.

---

## 5. Idioma y Localización (España)
* **Idioma HTML:** La etiqueta `<html>` en el layout raíz debe tener siempre `lang="es"`.
* **Idioma de los textos:** Todo texto de interfaz visualizado por el usuario debe estar escrito en **Español de España (Castellano)**.
  * Usa tildes correctamente (ej: *más, dirección, imágenes*).
  * Usa modismos españoles (*ordenador, móvil, empezar, guardar*).
