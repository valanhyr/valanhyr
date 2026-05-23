# Valanhyr CMS (Sanity) — Setup & Schemas

Este repo (portfolio) lee contenido desde Sanity con GROQ. Para que “salga todo”, en tu **Sanity Studio** necesitas crear **estos tipos** (y, en algunos casos, un documento “singleton”).

> Referencia: el frontend consulta estos `_type`:
> `basics`, `hero`, `about`, `platform`, `contact`, `navItem`, `link`, `education`, `experience`, `project`, `skill`, `graphSettings`.

---

## 1) Crear el proyecto (en otro repo)

En una carpeta nueva:

```bash
npm create sanity@latest .
```

Recomendado en el wizard:
- Dataset: `production`
- Template: **Clean project**

---

## 2) Tipos requeridos (qué usa la UI)

| `_type` | Qué pinta | Campos mínimos |
|---|---|---|
| `basics` (singleton) | Navbar + Hero + Contact | `name`, `role`, `location`, `status` |
| `hero` (singleton) | Hero | `headline`, `subheadline`, `proofs[]`, `primaryCta{label,href}`, `secondaryCta{label,href}` |
| `navItem` | Menú | `label`, `href`, `order` |
| `link` | Botones de contacto | `label`, `href`, `order` |
| `about` (singleton) | About | `title`, `paragraphs[]`, `highlights[]` |
| `platform` (singleton) | Platform | `title`, `bullets[]` |
| `experience` | Experience | `company`, `role`, `period`, `location`, `achievements[]`, `stack[]`, `order` |
| `project` | Projects | `name`/`title`, `description`, `stack[]`, `links[]`, `mainImage` (image), `order` |
| `education` | Education | `org`, `title`, `period`, `details[]`, `order` |
| `contact` (singleton) | Contact | `email`, `cta` |
| `skill` | Skills | `name`, `group`, `level?` |
| `graphSettings` (singleton) | Particle graph | `palette` (colores) + `groups?` (opcional) |

Notas:
- El frontend ordena varios tipos por `order` (`navItem`, `link`, `education`, `experience`, `project`). Añádelo.
- Imágenes: `mainImage` debe ser `type: 'image'` para que Sanity genere el `asset._ref` correctamente.

---

## 3) Schemas (copia/pega)

Crea estos archivos en `schemaTypes/` (o `schemas/` según tu Studio) y expórtalos en el index.

### `schemaTypes/basics.js` (singleton)
```js
export default {
  name: 'basics',
  title: 'Basics (Singleton)',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'status', title: 'Status', type: 'string' },
  ]
}
```

### `schemaTypes/hero.js` (singleton)
```js
export default {
  name: 'hero',
  title: 'Hero (Singleton)',
  type: 'document',
  fields: [
    { name: 'headline', title: 'Headline', type: 'string' },
    { name: 'subheadline', title: 'Subheadline', type: 'string' },
    { name: 'proofs', title: 'Proofs', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ]
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ]
    },
  ]
}
```

### `schemaTypes/navItem.js`
```js
export default {
  name: 'navItem',
  title: 'Navigation Item',
  type: 'document',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'href', title: 'Href', type: 'string' },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}
```

### `schemaTypes/link.js`
```js
export default {
  name: 'link',
  title: 'Link',
  type: 'document',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'href', title: 'Href', type: 'url' },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}
```

### `schemaTypes/about.js` (singleton)
```js
export default {
  name: 'about',
  title: 'About (Singleton)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'paragraphs', title: 'Paragraphs', type: 'array', of: [{ type: 'text' }] },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
  ]
}
```

### `schemaTypes/platform.js` (singleton)
```js
export default {
  name: 'platform',
  title: 'Platform (Singleton)',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'bullets', title: 'Bullets', type: 'array', of: [{ type: 'string' }] },
  ]
}
```

### `schemaTypes/experience.js`
```js
export default {
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'achievements', title: 'Achievements', type: 'array', of: [{ type: 'string' }] },
    { name: 'stack', title: 'Stack', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}
```

### `schemaTypes/project.js`
```js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'name', title: 'Name (optional)', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'mainImage', title: 'Main image', type: 'image', options: { hotspot: true } },
    { name: 'stack', title: 'Stack', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string' },
          { name: 'href', type: 'url' },
        ]
      }]
    },
    { name: 'highlights', title: 'Highlights', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}
```

### `schemaTypes/education.js`
```js
export default {
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    { name: 'org', title: 'Org', type: 'string' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'details', title: 'Details', type: 'array', of: [{ type: 'string' }] },
    { name: 'order', title: 'Order', type: 'number' },
  ]
}
```

### `schemaTypes/contact.js` (singleton)
```js
export default {
  name: 'contact',
  title: 'Contact (Singleton)',
  type: 'document',
  fields: [
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'cta', title: 'CTA', type: 'string' },
  ]
}
```

### `schemaTypes/skill.js`
```js
export default {
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'group', title: 'Group', type: 'string' },
    { name: 'level', title: 'Level', type: 'string' },
  ]
}
```

### `schemaTypes/graphSettings.js` (singleton)
```js
export default {
  name: 'graphSettings',
  title: 'Graph Settings (Singleton)',
  type: 'document',
  fields: [
    {
      name: 'palette',
      title: 'Palette',
      type: 'object',
      fields: [
        { name: 'frontend', type: 'string' },
        { name: 'backend', type: 'string' },
        { name: 'tools', type: 'string' },
        { name: 'ai', type: 'string' },
      ]
    },
    // Opcional (si quieres controlar el grafo desde CMS):
    // groups: object con keys frontend/backend/tools/ai y arrays de strings.
    {
      name: 'groups',
      title: 'Groups (optional)',
      type: 'object',
      fields: [
        { name: 'frontend', type: 'array', of: [{ type: 'string' }] },
        { name: 'backend', type: 'array', of: [{ type: 'string' }] },
        { name: 'tools', type: 'array', of: [{ type: 'string' }] },
        { name: 'ai', type: 'array', of: [{ type: 'string' }] },
      ]
    }
  ]
}
```

### `schemaTypes/index.js`
```js
import basics from './basics'
import hero from './hero'
import navItem from './navItem'
import link from './link'
import about from './about'
import platform from './platform'
import experience from './experience'
import project from './project'
import education from './education'
import contact from './contact'
import skill from './skill'
import graphSettings from './graphSettings'

export const schemaTypes = [
  basics,
  hero,
  navItem,
  link,
  about,
  platform,
  experience,
  project,
  education,
  contact,
  skill,
  graphSettings,
]
```

---

## 4) Singletons en Desk Structure (recomendado)

En `sanity.config.js`, define un structure que fije `documentId` para los singletons:

- `basics` → `basics`
- `hero` → `hero`
- `about` → `about`
- `platform` → `platform`
- `contact` → `contact`
- `graphSettings` → `graphSettings`

(Así no creas duplicados por accidente.)

---

## 5) CORS (imprescindible)

En **manage.sanity.io → Project → API → CORS origins** añade el origin exacto desde el que sirves el portfolio:
- `http://localhost:3000` (o el puerto real)

Si no coincide exacto (protocolo+host+puerto) el navegador dará 403: `CORS Origin not allowed`.
