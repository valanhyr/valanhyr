# CV Recruiter‑first Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the recruiter-first CV redesign (Hero proofs, Platform/Architecture section, Skills before Experience, no example placeholders) driven by `src/store/cv.json`.

**Architecture:** Vanilla ES modules + Web Components. Data is loaded once via `loadCv()` into `store.state.cv`; sections subscribe to `cv` changes and render from JSON.

**Tech Stack:** HTML, CSS, JavaScript, Web Components, Node (plain test scripts under `tests/`).

---

## File map (what changes where)

**Create**
- `src/components/sections/CvPlatform.js` — new “Platform & Architecture” section.
- `tests/components/platform.test.js` — registers + renders platform section.
- `tests/components/herobanner.test.js` — verifies Hero renders `hero.proofs` when present.

**Modify**
- `src/components/views/HomeView.js` — insert `<cv-platform>` and reorder Skills before Experience.
- `src/components/sections/HeroBanner.js` — render proof bullets from `cv.hero.proofs`.
- `src/components/sections/CvExperience.js` — remove example placeholder; show empty-state message.
- `src/components/sections/CvProjects.js` — remove example placeholder; show empty-state message.
- `src/components/sections/CvEducation.js` — remove example placeholder; show empty-state message.
- `main.js` — import `CvPlatform.js` so it registers.
- `src/store/cv.json` — add `hero.proofs`, add `platform`, update `navigation` to include `#platform`, adjust copy.
- `tests/components/homeview.test.js` — assert `<cv-platform>` is present and order is correct.

---

### Task 0: Baseline verification (before changes)

**Files:** none

- [ ] **Step 1: Run existing tests**

Run (PowerShell):
```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
```
Expected: both print `✅ ... test passed!`

---

### Task 1: Update `HomeView` test for new section + ordering (TDD)

**Files:**
- Modify: `tests/components/homeview.test.js`

- [ ] **Step 1: Update the test to expect cv-platform and ordering**

Replace the file with:

```js
// tests/components/homeview.test.js

// Mock browser globals
class MockHTMLElement {
    constructor() {
        this.shadowRoot = { innerHTML: '' };
    }
    attachShadow() { return this.shadowRoot; }
}

global.HTMLElement = MockHTMLElement;

global.customElements = {
    define: (tag, cls) => {
        global.customElements.registry = global.customElements.registry || {};
        global.customElements.registry[tag] = cls;
    }
};

async function runTest() {
    try {
        const { HomeView } = await import('../../src/components/views/HomeView.js');
        const view = new HomeView();

        if (!global.customElements.registry['home-view']) {
            throw new Error('home-view not registered');
        }

        view.connectedCallback();

        const html = view.shadowRoot.innerHTML;

        const tags = [
            'hero-banner',
            'cv-about',
            'cv-platform',
            'cv-skills',
            'cv-experience',
            'cv-projects',
            'cv-education',
            'cv-contact'
        ];

        for (const tag of tags) {
            if (!html.includes(`<${tag}`)) {
                throw new Error(`HomeView did not render ${tag}`);
            }
        }

        // Order checks (skills before experience)
        const iSkills = html.indexOf('<cv-skills');
        const iExp = html.indexOf('<cv-experience');
        if (iSkills === -1 || iExp === -1 || iSkills > iExp) {
            throw new Error('Expected Skills section to appear before Experience');
        }

        // Platform should be between About and Skills
        const iAbout = html.indexOf('<cv-about');
        const iPlatform = html.indexOf('<cv-platform');
        if (iAbout === -1 || iPlatform === -1 || iSkills === -1 || !(iAbout < iPlatform && iPlatform < iSkills)) {
            throw new Error('Expected Platform section between About and Skills');
        }

        console.log('✅ HomeView test passed!');
    } catch (err) {
        console.error('❌ HomeView test failed:', err.message);
        process.exit(1);
    }
}

runTest();
```

- [ ] **Step 2: Run the test to verify it fails**

Run:
```powershell
node .\tests\components\homeview.test.js
```
Expected: FAIL complaining about `cv-platform` missing or ordering wrong.

- [ ] **Step 3: Commit (tests only)**

```powershell
git add .\tests\components\homeview.test.js
git commit -m "test: update homeview structure" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Add new tests for Hero proofs and Platform section (TDD)

**Files:**
- Create: `tests/components/herobanner.test.js`
- Create: `tests/components/platform.test.js`

- [ ] **Step 1: Create `tests/components/herobanner.test.js`**

```js
// tests/components/herobanner.test.js

class MockHTMLElement {
    constructor() {
        this.shadowRoot = { innerHTML: '' };
    }
    attachShadow() { return this.shadowRoot; }
}

global.HTMLElement = MockHTMLElement;

global.customElements = {
    define: (tag, cls) => {
        global.customElements.registry = global.customElements.registry || {};
        global.customElements.registry[tag] = cls;
    }
};

async function runTest() {
    try {
        const { store } = await import('../../src/store/state.js');
        const { HeroBanner } = await import('../../src/components/sections/HeroBanner.js');

        if (!global.customElements.registry['hero-banner']) {
            throw new Error('hero-banner not registered');
        }

        // Set CV data before rendering
        store.state.cv = {
            basics: { name: 'Test Name', role: 'Frontend Lead', location: 'Remote', status: 'Open' },
            hero: {
                headline: 'Headline',
                subheadline: 'Sub',
                proofs: ['Proof 1', 'Proof 2', 'Proof 3'],
                primaryCta: { label: 'Contact', href: '#contact' },
                secondaryCta: { label: 'Download PDF', href: '#pdf' }
            }
        };

        const hero = new HeroBanner();
        hero.connectedCallback();

        const html = hero.shadowRoot.innerHTML;
        for (const p of ['Proof 1', 'Proof 2', 'Proof 3']) {
            if (!html.includes(p)) throw new Error('HeroBanner did not render proofs');
        }

        console.log('✅ HeroBanner proofs test passed!');
    } catch (err) {
        console.error('❌ HeroBanner proofs test failed:', err.message);
        process.exit(1);
    }
}

runTest();
```

- [ ] **Step 2: Create `tests/components/platform.test.js`**

```js
// tests/components/platform.test.js

class MockHTMLElement {
    constructor() {
        this.shadowRoot = { innerHTML: '' };
    }
    attachShadow() { return this.shadowRoot; }
}

global.HTMLElement = MockHTMLElement;

global.customElements = {
    define: (tag, cls) => {
        global.customElements.registry = global.customElements.registry || {};
        global.customElements.registry[tag] = cls;
    }
};

async function runTest() {
    try {
        const { store } = await import('../../src/store/state.js');
        const { CvPlatform } = await import('../../src/components/sections/CvPlatform.js');

        if (!global.customElements.registry['cv-platform']) {
            throw new Error('cv-platform not registered');
        }

        store.state.cv = {
            platform: {
                title: 'Platform & Architecture',
                bullets: ['A', 'B', 'C']
            }
        };

        const section = new CvPlatform();
        section.connectedCallback();

        const html = section.shadowRoot.innerHTML;
        if (!html.includes('Platform & Architecture')) throw new Error('CvPlatform did not render title');
        for (const b of ['A', 'B', 'C']) {
            if (!html.includes(`<li>${b}</li>`)) throw new Error('CvPlatform did not render bullets');
        }

        console.log('✅ CvPlatform test passed!');
    } catch (err) {
        console.error('❌ CvPlatform test failed:', err.message);
        process.exit(1);
    }
}

runTest();
```

- [ ] **Step 3: Run tests to verify they fail**

Run:
```powershell
node .\tests\components\herobanner.test.js
node .\tests\components\platform.test.js
```
Expected: FAIL (missing `CvPlatform.js` and/or proofs).

- [ ] **Step 4: Commit (tests only)**

```powershell
git add .\tests\components\herobanner.test.js .\tests\components\platform.test.js
git commit -m "test: add hero and platform tests" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Implement `CvPlatform` section

**Files:**
- Create: `src/components/sections/CvPlatform.js`

- [ ] **Step 1: Create the component**

```js
// src/components/sections/CvPlatform.js
import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class CvPlatform extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;
        const platform = cv?.platform ?? {};

        const title = platform.title ?? 'Platform & Architecture';
        const bullets = Array.isArray(platform.bullets) ? platform.bullets : [];

        if (!cv) {
            this.render('');
            return;
        }

        this.render(`
            <style>
                :host { display: block; }
                section { scroll-margin-top: 96px; }
                .top {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-md);
                }
                h2 { margin: 0; font-size: 1.4rem; letter-spacing: 0.02em; text-transform: uppercase; }
                .hint { font-family: monospace; font-weight: 800; opacity: 0.75; }
                .box { background: var(--surface-2); border: var(--border-width) solid var(--text); padding: 1rem; }
                ul { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                li { font-weight: 700; }
                .empty { font-family: monospace; font-weight: 800; opacity: 0.75; }
            </style>

            <section id="platform" aria-label="Platform and Architecture">
                <ui-card>
                    <div class="top">
                        <h2>${title}</h2>
                        <div class="hint">CV / Platform</div>
                    </div>

                    <div class="box">
                        ${bullets.length
                            ? `<ul>${bullets.slice(0, 6).map(b => `<li>${b}</li>`).join('')}</ul>`
                            : `<div class="empty">Add platform bullets in <code>src/store/cv.json</code>.</div>`
                        }
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-platform', CvPlatform);
```

- [ ] **Step 2: Run platform test**

```powershell
node .\tests\components\platform.test.js
```
Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add .\src\components\sections\CvPlatform.js
git commit -m "feat: add platform section" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Update `HomeView` structure (Platform insertion + ordering)

**Files:**
- Modify: `src/components/views/HomeView.js`

- [ ] **Step 1: Replace file with updated order**

```js
// src/components/views/HomeView.js
import { BaseComponent } from '../BaseComponent.js';

export class HomeView extends BaseComponent {
    connectedCallback() {
        this.render(`
            <style>
                :host { display: block; }
                main {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    gap: var(--space-xl);
                    padding-bottom: var(--space-xl);
                }

                /* Anchor targets must be in the light DOM (not inside Shadow DOM). */
                cv-about,
                cv-platform,
                cv-skills,
                cv-experience,
                cv-projects,
                cv-education,
                cv-contact {
                    scroll-margin-top: 96px;
                }
            </style>

            <main id="top">
                <hero-banner></hero-banner>
                <cv-about id="about"></cv-about>
                <cv-platform id="platform"></cv-platform>
                <cv-skills id="skills"></cv-skills>
                <cv-experience id="experience"></cv-experience>
                <cv-projects id="projects"></cv-projects>
                <cv-education id="education"></cv-education>
                <cv-contact id="contact"></cv-contact>
            </main>
        `);
    }
}
customElements.define('home-view', HomeView);
```

- [ ] **Step 2: Run HomeView test**

```powershell
node .\tests\components\homeview.test.js
```
Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add .\src\components\views\HomeView.js
git commit -m "feat: reorder sections and add platform" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Register the new section in `main.js`

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Add the import**

Add:
```js
import './src/components/sections/CvPlatform.js';
```
near the other `Cv*` imports.

- [ ] **Step 2: Commit**

```powershell
git add .\main.js
git commit -m "chore: register platform section" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Implement Hero proofs (Layout A)

**Files:**
- Modify: `src/components/sections/HeroBanner.js`
- Test: `tests/components/herobanner.test.js`

- [ ] **Step 1: Update HeroBanner to render proofs**

In `#render()` add:
```js
const proofs = Array.isArray(cv?.hero?.proofs) ? cv.hero.proofs : [];
```

Then in template, insert below subheadline:
```html
${proofs.length ? `
  <ul class="proofs">
    ${proofs.slice(0, 3).map(p => `<li>${p}</li>`).join('')}
  </ul>
` : ''}
```

Add CSS:
```css
.proofs { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
.proofs li { font-weight: 800; }
```

- [ ] **Step 2: Run hero test**

```powershell
node .\tests\components\herobanner.test.js
```
Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add .\src\components\sections\HeroBanner.js
git commit -m "feat: hero proof bullets" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Remove example placeholders (Experience/Projects/Education)

**Files:**
- Modify: `src/components/sections/CvExperience.js`
- Modify: `src/components/sections/CvProjects.js`
- Modify: `src/components/sections/CvEducation.js`

- [ ] **Step 1: Experience fallback → empty-state**

Replace the `else` branch in the template with:
```js
<article class="item">
  <div class="row">
    <div class="company">Experience</div>
    <div class="period">Add entries in cv.json</div>
  </div>
  <div class="hint">No experience entries yet. Add them in <code>src/store/cv.json</code>.</div>
</article>
```

- [ ] **Step 2: Projects fallback → empty-state**

Replace the fallback branch with:
```js
<article>
  <ui-card surface="2">
    <div slot="header"><h3>No projects yet</h3></div>
    <div class="content">
      <div class="details">
        <p>Add 2–3 selected projects in <code>src/store/cv.json</code>.</p>
      </div>
    </div>
  </ui-card>
</article>
```

- [ ] **Step 3: Education fallback → empty-state**

Replace the fallback branch with:
```js
<article class="item">
  <div class="row">
    <div>
      <div class="org">Education</div>
      <div class="title">Optional</div>
    </div>
    <div class="period">—</div>
  </div>
  <div class="hint">Add education/certifications in <code>src/store/cv.json</code> (optional).</div>
</article>
```

- [ ] **Step 4: Run navbar/homeview tests**

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
```
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add .\src\components\sections\CvExperience.js .\src\components\sections\CvProjects.js .\src\components\sections\CvEducation.js
git commit -m "feat: remove example placeholders" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Update `cv.json` content (proofs + platform + navigation)

**Files:**
- Modify: `src/store/cv.json`

- [ ] **Step 1: Update navigation to include Platform**

```json
"navigation": [
  { "label": "Home", "href": "#top" },
  { "label": "About", "href": "#about" },
  { "label": "Platform", "href": "#platform" },
  { "label": "Skills", "href": "#skills" },
  { "label": "Experience", "href": "#experience" },
  { "label": "Projects", "href": "#projects" },
  { "label": "Education", "href": "#education" },
  { "label": "Contact", "href": "#contact" }
]
```

- [ ] **Step 2: Add hero proofs + platform bullets**

```json
"hero": {
  "headline": "Evolución técnica de producto web en producción",
  "subheadline": "Microfrontends, design systems y delivery sin perder velocidad.",
  "primaryCta": { "label": "Contact", "href": "#contact" },
  "secondaryCta": { "label": "Download PDF", "href": "#" },
  "proofs": [
    "Design system + librería consumida por microfronts",
    "Arquitectura técnica y evolución incremental sobre web existente",
    "Visión end-to-end: entornos, pipelines, prácticas de entrega"
  ]
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
```

- [ ] **Step 3: Commit**

```powershell
git add .\src\store\cv.json
git commit -m "docs: update cv content for recruiter-first" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Final verification

**Files:** none

- [ ] **Step 1: Run all tests**

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\herobanner.test.js
node .\tests\components\platform.test.js
```
Expected: all PASS.

- [ ] **Step 2: Check git status**

```powershell
git status
```
Expected: clean working tree.

