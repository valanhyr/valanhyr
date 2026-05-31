# SEO robots + sitemap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit crawler directives plus `robots.txt` and `sitemap.xml` for the CV homepage at `https://valanhyr.pages.dev/`.

**Architecture:** Static, zero-dependency SEO assets in repo root (`robots.txt`, `sitemap.xml`) plus small `<head>` additions in `index.html`. Verification via a small Node test that reads `index.html` as text.

**Tech Stack:** HTML, JavaScript, Node.js built-in test runner (`node:test`).

---

## File map (what changes where)

**Create**
- `robots.txt` — allow crawling + advertise sitemap.
- `sitemap.xml` — minimal sitemap for the homepage.
- `tests/seo/head.test.js` — validates `index.html` contains the expected SEO tags.

**Modify**
- `index.html` — add `meta robots` and `link rel="sitemap"`.

---

### Task 0: Baseline verification

**Files:** none

- [ ] **Step 1: Run existing tests**

Run (PowerShell):
```powershell
node --test .\tests\**\*.test.js
```
Expected: PASS.

---

### Task 1: Add failing SEO head test (TDD)

**Files:**
- Create: `tests/seo/head.test.js`

- [ ] **Step 1: Create the test file**

```js
// tests/seo/head.test.js
import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());
const indexPath = path.join(repoRoot, 'index.html');

test('index.html SEO head tags', () => {
    const html = fs.readFileSync(indexPath, 'utf8');

    assert.match(
        html,
        /<meta\s+name="robots"\s+content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"\s*>/i,
        'Expected meta robots with explicit directives'
    );

    assert.match(
        html,
        /<link\s+rel="sitemap"\s+type="application\/xml"\s+href="\/sitemap\.xml"\s*>/i,
        'Expected link rel=sitemap pointing to /sitemap.xml'
    );
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:
```powershell
node --test .\tests\seo\head.test.js
```
Expected: FAIL (missing `meta robots` / `link rel="sitemap"`).

---

### Task 2: Implement `index.html` head tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the robots meta + sitemap link**

Insert these lines in `<head>` (near the existing description/canonical):

```html
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
```

- [ ] **Step 2: Run the SEO test**

Run:
```powershell
node --test .\tests\seo\head.test.js
```
Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add .\index.html .\tests\seo\head.test.js
git commit -m "seo: add robots meta and sitemap link" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Add `robots.txt`

**Files:**
- Create: `robots.txt`

- [ ] **Step 1: Create `robots.txt`**

```txt
User-agent: *
Allow: /
Sitemap: https://valanhyr.pages.dev/sitemap.xml
```

- [ ] **Step 2: Commit**

```powershell
git add .\robots.txt
git commit -m "seo: add robots.txt" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Add `sitemap.xml`

**Files:**
- Create: `sitemap.xml`

- [ ] **Step 1: Create `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://valanhyr.pages.dev/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 2: (Optional) Add sitemap self-reference in robots.txt**

No change needed if Task 3 already includes the Sitemap line.

- [ ] **Step 3: Commit**

```powershell
git add .\sitemap.xml
git commit -m "seo: add sitemap.xml" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Final verification

**Files:** none

- [ ] **Step 1: Run full test suite**

```powershell
node --test .\tests\**\*.test.js
```
Expected: PASS.

- [ ] **Step 2: After deploy, sanity-check endpoints**

Open in browser:
- `https://valanhyr.pages.dev/robots.txt`
- `https://valanhyr.pages.dev/sitemap.xml`

Expected: both return 200 and match the committed contents.
