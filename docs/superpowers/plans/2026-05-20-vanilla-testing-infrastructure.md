# Zero-Dependency Testing Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate existing tests and add new component coverage using the native Node.js test runner and centralized mocks.

**Architecture:** Use `tests/test-setup.js` for DOM mocks and `node:test` + `node:assert` for testing.

**Tech Stack:** Node.js (Core modules only).

---

### Task 1: Migrate AppNavbar Test

**Files:**
- Modify: `tests/components/navbar.test.js`

- [ ] **Step 1: Rewrite test using node:test and node:assert**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { AppNavbar } from '../../src/components/layout/AppNavbar.js';

test('AppNavbar Component', async (t) => {
    const navbar = new AppNavbar();
    
    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('app-navbar'));
    });

    await t.test('should render header and primary nav', () => {
        navbar.connectedCallback();
        const html = navbar.shadowRoot.innerHTML;
        assert.match(html, /<header>/);
        assert.match(html, /aria-label="Primary"/);
    });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node --test tests/components/navbar.test.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/components/navbar.test.js
git commit -m "test: migrate AppNavbar to native node runner"
```

---

### Task 2: Migrate HomeView Test

**Files:**
- Modify: `tests/components/homeview.test.js`

- [ ] **Step 1: Rewrite test using node:test and node:assert**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { HomeView } from '../../src/components/views/HomeView.js';

test('HomeView Component', async (t) => {
    const view = new HomeView();

    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('home-view'));
    });

    await t.test('should render all section tags', () => {
        view.connectedCallback();
        const html = view.shadowRoot.innerHTML;
        const tags = ['hero-banner', 'cv-about', 'cv-skills', 'cv-experience', 'cv-projects', 'cv-education', 'cv-contact'];
        for (const tag of tags) {
            assert.match(html, new RegExp(`<${tag}`));
        }
    });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node --test tests/components/homeview.test.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/components/homeview.test.js
git commit -m "test: migrate HomeView to native node runner"
```

---

### Task 3: Add UiButton Test

**Files:**
- Create: `tests/components/uibutton.test.js`

- [ ] **Step 1: Create test file**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiButton } from '../../src/components/ui/UiButton.js';

test('UiButton Component', async (t) => {
    const button = new UiButton();

    await t.test('should register custom element', () => {
        assert.ok(global.customElements.get('ui-button'));
    });

    await t.test('should render button element', () => {
        button.connectedCallback();
        assert.match(button.shadowRoot.innerHTML, /<button/);
    });
});
```

- [ ] **Step 2: Run test**

Run: `node --test tests/components/uibutton.test.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add tests/components/uibutton.test.js
git commit -m "test: add tests for UiButton"
```

---

### Task 4: Add UiCard and UiTag Tests

**Files:**
- Create: `tests/components/uicard.test.js`
- Create: `tests/components/uitag.test.js`

- [ ] **Step 1: Create UiCard test**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiCard } from '../../src/components/ui/UiCard.js';

test('UiCard Component', async (t) => {
    const card = new UiCard();
    await t.test('should register and render', () => {
        assert.ok(global.customElements.get('ui-card'));
        card.connectedCallback();
        assert.match(card.shadowRoot.innerHTML, /class="card"/);
    });
});
```

- [ ] **Step 2: Create UiTag test**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert';
import { UiTag } from '../../src/components/ui/UiTag.js';

test('UiTag Component', async (t) => {
    const tag = new UiTag();
    await t.test('should register and render', () => {
        assert.ok(global.customElements.get('ui-tag'));
        tag.connectedCallback();
        assert.match(tag.shadowRoot.innerHTML, /class="tag"/);
    });
});
```

- [ ] **Step 3: Run tests**

Run: `node --test tests/components/uicard.test.js tests/components/uitag.test.js`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tests/components/uicard.test.js tests/components/uitag.test.js
git commit -m "test: add tests for UiCard and UiTag"
```

---

### Task 5: Verify All Tests

- [ ] **Step 1: Run entire suite**

Run: `node --test tests/components/*.test.js`
Expected: All tests pass.
