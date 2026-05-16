# CV Web (Recruiter‑first) — Diseño

**Fecha:** 2026-05-16  
**Repositorio:** valanhyr/valanhyr  
**Owner:** @valanhyr  

## 1) Contexto
Este proyecto es un CV/portfolio **one-page** hecho en **vanilla web** (HTML/CSS/JS) usando **Web Components** (Custom Elements + Shadow DOM) y un store reactivo (`src/store/state.js`). El contenido se carga desde `src/store/cv.json` vía `loadCv()` y se consume desde los componentes de sección.

El objetivo acordado es **conseguir entrevistas (reclutadores)**, por lo que el diseño prioriza:
- escaneabilidad en 10–30s,
- señal de seniority/impacto,
- links claros (LinkedIn/GitHub/email),
- “deep dives” opcionales sin bloquear el screening.

## 2) Objetivo (Goals)
1. Convertir el CV web en una página **recruiter-first**: contenido claro, directo y medible.
2. Posicionamiento explícito: **arquitectura técnica + evolución tecnológica en microfrontends** (con experiencia como front/lead).
3. Estandarizar el formato de logros en Experience/Projects: **Acción + Alcance + Impacto** (idealmente con métrica).
4. Mantener el repo “high-level vanilla”: **sin frameworks** y sin dependencias nuevas.

## 3) No‑objetivos (Non-goals)
- No construir un blog completo / CMS.
- No añadir build step, bundler o framework.
- No implementar tracking/analytics de terceros en esta iteración.

## 4) Audiencia y criterio de éxito
**Audiencia primaria:** reclutadores/HR + hiring managers que escanean rápido.  
**Criterio de éxito:**
- En 10s se entiende: “quién eres / qué rol / qué aportas / dónde ver pruebas / cómo contactarte”.
- En 60s se entiende: experiencia y foco (microfronts, DS, evolución) con 2–3 ejemplos concretos.

## 5) Arquitectura de información (orden de secciones)
Orden aprobado:
1. **Hero** (con particle graph de fondo) — **Layout A**: titular + propuesta + 3 “proof bullets” + CTAs.
2. **About** — 2 párrafos + highlights.
3. **Platform / Architecture** — sección nueva (ver §6).
4. **Skills** — agrupadas por dominio y priorizando “daily drivers”.
5. **Experience** — timeline con logros accionables (impact bullets).
6. **Projects** — 2–3 seleccionados con formato caso breve.
7. **Education** — solo si aporta señal (si no, se mantiene corto o se oculta).
8. **Contact** — CTA + links.

## 6) Sección nueva: “Platform / Architecture”
**Propósito:** convertir tu narrativa (“lidero evolución tecnológica en microfronts”) en una sección escaneable con 3–6 puntos.

### Contenido recomendado
- **Qué has liderado/creado:** design system/librería, servicios de consumo, guidelines para microfronts.
- **Qué has evolucionado:** arquitectura, boundaries, migraciones, compat, DX.
- **Operación/delivery:** pipelines, entornos, observabilidad, “trabajo de campo”.

### Formato
- Título: `Platform & Architecture` (o `Technical Leadership`).
- 4–6 bullets cortos, cada uno con:
  - acción (“Diseñé…”, “Definí…”, “Estandaricé…”) + alcance (microfronts/equipos) + resultado.

## 7) Reglas de copy (muy importante)
### 7.1 Bullets de Experience / Projects
Formato canónico:
- **Acción** (verbo fuerte) + **Alcance** (qué tocaste / cuánta superficie) + **Impacto** (métrica o resultado observable).

Ejemplos (plantillas):
- “Estandaricé **librería de componentes** para microfrontends, reduciendo **regresiones UI** y acelerando entregas (≈X%).”
- “Definí **contratos de servicios** y patrones de consumo, reduciendo duplicidad y mejorando DX (menos ‘adapters’ por equipo).”
- “Guié migración incremental de arquitectura sin parar delivery, estabilizando releases (menos hotfix/rollback).”

### 7.2 Métricas (cuando no haya números exactos)
Se permite usar:
- “≈” (aproximado),
- rangos (“10–20%”),
- métricas proxy (tiempo build, incidencias, regresiones, adopción, throughput).

Regla: si no es verificable, presentarlo como **estimación** o **resultado cualitativo**.

## 8) Modelo de datos (`src/store/cv.json`)
Se amplía el JSON para soportar:
- `hero.proofs[]`: lista de bullets del hero.
- `platform`: sección nueva con `title`, `bullets`.

### Ejemplo (esquema)
```json
{
  "basics": {
    "name": "<tu nombre>",
    "role": "Frontend Lead — Microfrontends & Tech Evolution",
    "location": "<ciudad/remoto>",
    "summary": "<1-2 frases de valor>"
  },
  "hero": {
    "headline": "Evolución técnica de producto web en producción",
    "subheadline": "Microfrontends, design systems y delivery sin perder velocidad.",
    "proofs": [
      "Design system + librería consumida por microfronts",
      "Arquitectura técnica y evolución incremental sobre web existente",
      "Visión end-to-end: entornos, pipelines, prácticas de entrega"
    ],
    "primaryCta": { "label": "Contact", "href": "#contact" },
    "secondaryCta": { "label": "Download PDF", "href": "#" }
  },
  "platform": {
    "title": "Platform & Architecture",
    "bullets": [
      "Definí patrones de integración y contratos para microfrontends.",
      "Construí/extendí librería de estilos + componentes reutilizables.",
      "Evolucioné aplicaciones existentes con foco en estabilidad y DX.",
      "Contribuí a pipelines/entornos para mejorar delivery y confiabilidad."
    ]
  }
}
```

## 9) Cambios propuestos en UI/Componentes
### 9.1 Hero (`HeroBanner`)
- Adoptar el layout **A**.
- Renderizar `hero.proofs[]` como lista de 3 bullets visibles.
- Mantener CTAs.

### 9.2 Nueva sección (`CvPlatform`)
- Nuevo componente `src/components/sections/CvPlatform.js`.
- Estructura similar a otras secciones (`ui-card`, `.top`, `.hint`, lista de bullets).
- Anchor id: `platform`.

### 9.3 HomeView (orden y anclas)
- Insertar `<cv-platform id="platform"></cv-platform>` entre About y Skills.
- Orden final: About → Platform → Skills → Experience → Projects → Education → Contact.

### 9.4 Navbar (navegación)
- Si `cv.navigation` existe, incluir `Platform` (href `#platform`).
- Mantener scroll manual cross‑ShadowDOM (ya resuelto en `AppNavbar`).

### 9.5 Skills
- Reordenar grupos para que “lo principal” salga primero (ej: frontend/platform/design-system/tooling).
- (Opcional) Etiquetar 3–5 “daily drivers” por grupo.

### 9.6 Estados vacíos (sin placeholders)
Para un CV real, si falta data en `cv.json` **no se debe renderizar contenido de ejemplo** ("Example Corp", "Your Name", etc.).
- Si una sección no tiene items, se oculta o muestra un bloque mínimo “sin contenido” (según sección).
- Si se oculta, también se elimina de `cv.navigation` para evitar links muertos.

## 10) Accesibilidad y UX
- Mantener foco visible (`--focus-ring`).
- CTAs con texto claro.
- Evitar exceso de “neón”; usar como acento (ya alineado con theme).

## 11) Testing
Tests existentes son scripts Node que mockean `HTMLElement/customElements`.
- Actualizar tests o añadir mínimos para:
  - registro de `cv-platform`.
  - `HeroBanner` renderiza `proofs` cuando existen.
  - `HomeView` incluye el orden de secciones esperado.

(Sin introducir frameworks de test.)

## 12) Criterios de aceptación
- Hero muestra 3 proofs y CTAs.
- Existe sección Platform/Architecture y es navegable desde navbar.
- Skills aparece antes que Experience.
- Experience/Projects siguen el formato de bullets acordado.
- No se introducen dependencias nuevas.

## 13) Riesgos / trade-offs
- Más secciones = más scroll: mitigación con navbar + jerarquía clara.
- Métricas inventadas: mitigación usando aproximaciones y wording prudente.

---
**Estado:** Diseño aprobado (Hero A, Skills antes de Experience, bullets con impacto). Pendiente de revisión final del documento por el usuario antes de implementar.
