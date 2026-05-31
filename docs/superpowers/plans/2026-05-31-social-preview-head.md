# Social preview + head polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Open Graph + Twitter meta tags (no image) plus `theme-color`/`color-scheme` so sharing previews look professional.

**Architecture:** Pure static `<head>` tags in `index.html` plus a zero-dependency Node test that reads `index.html` as text.

**Tech Stack:** HTML, Node.js built-in test runner (`node:test`).

---

## File map

**Create**
- `tests/seo/social-meta.test.js`

**Modify**
- `index.html`

---

### Task 1: Add failing test (TDD)

**Files:**
- Create: `tests/seo/social-meta.test.js`

- [ ] **Step 1: Create test**

```js
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'index.html');

test('index.html contains OG/Twitter + theme-color tags', () => {
  const html = fs.readFileSync(indexPath, 'utf8');

  assert.match(html, /property="og:type"\s+content="website"/i);
  assert.match(html, /property="og:site_name"\s+content="Xisco Raya"/i);
  assert.match(html, /property="og:title"/i);
  assert.match(html, /property="og:description"/i);
  assert.match(html, /property="og:url"\s+content="https:\/\/valanhyr\.pages\.dev\/"/i);

  assert.match(html, /name="twitter:card"\s+content="summary"/i);
  assert.match(html, /name="twitter:title"/i);
  assert.match(html, /name="twitter:description"/i);

  assert.match(html, /name="color-scheme"\s+content="dark light"/i);
  assert.match(html, /name="theme-color"\s+content="#08080c"\s+media="\(prefers-color-scheme: dark\)"/i);
  assert.match(html, /name="theme-color"\s+content="#f5f5f7"\s+media="\(prefers-color-scheme: light\)"/i);
});
```

- [ ] **Step 2: Run to confirm it fails**

```powershell
node --test .\tests\seo\social-meta.test.js
```
Expected: FAIL.

---

### Task 2: Implement tags in `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add tags in `<head>`**

Add:
- Open Graph tags (no image)
- Twitter tags (no image)
- `color-scheme` and 2x `theme-color` with media

- [ ] **Step 2: Run tests**

```powershell
node --test .\tests\seo\social-meta.test.js
node --test .\tests\**\*.test.js
```
Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add .\index.html .\tests\seo\social-meta.test.js
git commit -m "seo: add social preview meta" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
