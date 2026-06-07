# 📝 Plantilla de Pull Request

## Descripción
Proporciona un resumen de los cambios introducidos por este Pull Request.

Resuelve: # (ej. Closes #01)

---

## Cambios Introducidos
- [ ] Descripción del cambio 1
- [ ] Descripción del cambio 2

---

## Lista de Verificación (Checklist)

### Ramas y Destino
- [ ] La rama origen parte de `develop`.
- [ ] La rama destino de este PR es **`develop`** (para características/errores) o **`main`** (solo para lanzamientos probados desde `develop`).

### Calidad de Código y Pruebas
- [ ] He ejecutado `npm run lint` localmente y pasa sin advertencias ni errores.
- [ ] He ejecutado `npm run verify` localmente para validar ortografía, SEO y GEO.
- [ ] Me he asegurado de que **no existen `console.log`** en el código de producción en la carpeta `src/`.
- [ ] El tipado de TypeScript es estricto y no contiene variables declaradas como `any`.

### Accesibilidad (WCAG AAA/AA)
- [ ] Las interfaces modificadas respetan el contraste mínimo de 7:1 para texto.
- [ ] Se han configurado etiquetas ARIA y focos visibles en los nuevos elementos de UI interactivos.

