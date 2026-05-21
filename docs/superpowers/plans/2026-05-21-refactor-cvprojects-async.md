# Refactor CvProjects to Async Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `CvProjects` component to fetch data asynchronously from `SanityService` instead of the global store.

**Architecture:** The component will use a "Skeleton-first" approach. It will immediately render a loading state (skeleton) in `connectedCallback` and then fetch data using `SanityService`. Once data is available, it will re-render with the actual content.

**Tech Stack:** Vanilla Web Components, CSS, SanityService (Mock GROQ).

---

### Task 1: Create Tests for CvProjects

**Files:**
- Create: `tests/components/cvprojects.test.js`

- [ ] **Step 1: Write the initial test to verify skeleton and async loading**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { CvProjects } from '../../src/components/sections/CvProjects.js';

test('CvProjects Component', async (t) => {
    await t.test('should show skeleton then load projects', async () => {
        const component = new CvProjects();
        component.connectedCallback();
        
        // Should show skeleton initially
        assert.match(component.shadowRoot.innerHTML, /skeleton/i);

        // Wait for SanityService simulation delay (600ms in service + some buffer)
        await new Promise(r => setTimeout(r, 800));

        // Should render projects
        assert.match(component.shadowRoot.innerHTML, /Projects/i);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/components/cvprojects.test.js`
Expected: FAIL (skeleton not found or async not implemented)

- [ ] **Step 3: Commit initial test**

```bash
git add tests/components/cvprojects.test.js
git commit -m "test: add initial test for CvProjects async refactor"
```

### Task 2: Implement Async Refactor in CvProjects

**Files:**
- Modify: `src/components/sections/CvProjects.js`

- [ ] **Step 1: Update imports and connectedCallback**

```javascript
import { BaseComponent } from '../BaseComponent.js';
import { SanityService } from '../../services/SanityService.js';
// remove store import if not used elsewhere
```

- [ ] **Step 2: Implement skeleton and data fetching**

```javascript
    async connectedCallback() {
        this.#renderSkeleton();
        try {
            const projects = await SanityService.fetch('*[_type == "project"]');
            this.#render(projects);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            this.#render([]);
        }
    }
```

- [ ] **Step 3: Implement #renderSkeleton**

```javascript
    #renderSkeleton() {
        this.render(`
            <style>
                /* Reuse existing styles or add specific skeleton ones */
                .skeleton {
                    background: var(--surface-2);
                    height: 440px;
                    border-radius: var(--radius);
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
            </style>
            <section id="projects">
                <div class="skeleton"></div>
            </section>
        `);
    }
```

- [ ] **Step 4: Update #render to accept projects and use Sanity assets**

```javascript
    #render(items = []) {
        this.render(`
            /* ... styles ... */
            <section id="projects" aria-label="Projects">
                <ui-card>
                    /* ... top ... */
                    <div class="accordion">
                        ${items.map((p, index) => {
                            const title = p.title || p.name || 'Project';
                            const imageUrl = p.mainImage ? SanityService.urlFor(p.mainImage).width(400).url() : null;
                            const bgStyle = imageUrl ? `style="background-image: url('${imageUrl}'); background-size: cover;"` : '';
                            
                            return `
                                <div class="project-card ${index === 0 ? 'active' : ''}" ...>
                                    <div class="card-label">PROJECT ${String(index + 1).padStart(2, '0')}</div>
                                    <div class="card-bg" ${bgStyle}></div>
                                    <div class="card-content">
                                        <h3>${title}</h3>
                                        /* ... description, stack, links ... */
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </ui-card>
            </section>
        `);
    }
```

- [ ] **Step 5: Run tests to verify it passes**

Run: `node tests/components/cvprojects.test.js`
Expected: PASS

- [ ] **Step 6: Commit refactor**

```bash
git add src/components/sections/CvProjects.js
git commit -m "feat: refactor CvProjects to use async SanityService"
```
