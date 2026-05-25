# Favicon (CV Chip) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add theme-aware SVG favicons (dark/light) plus an `.ico` fallback, and link them from `index.html` with a small test to prevent regressions.

**Architecture:** Ship static `favicon-*.svg` assets selected via `prefers-color-scheme` plus a generated `favicon.ico` fallback. Use a zero-dependency Node script to generate the ICO (BMP-in-ICO) and a Node test to verify assets + `<link rel="icon">` tags.

**Tech Stack:** HTML, SVG, Node.js (core modules only), Node built-in test runner.

---

## File structure

**Create:**
- `C:\Users\valan\source\Repository\valanhyr\favicon-dark.svg`
- `C:\Users\valan\source\Repository\valanhyr\favicon-light.svg`
- `C:\Users\valan\source\Repository\valanhyr\tools\generate-favicon-ico.mjs`
- `C:\Users\valan\source\Repository\valanhyr\tests\favicon.test.js`

**Modify:**
- `C:\Users\valan\source\Repository\valanhyr\index.html`

**Generate (tracked):**
- `C:\Users\valan\source\Repository\valanhyr\favicon.ico`

---

### Task 1: Add a failing favicon regression test

**Files:**
- Create: `tests\favicon.test.js`

- [ ] **Step 1: Create the test (should fail initially)**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());

function read(file) {
  return fs.readFileSync(path.join(repoRoot, file), 'utf8');
}

test('favicon assets and <link rel="icon"> tags exist', () => {
  const index = read('index.html');

  // Tags
  assert.match(index, /rel="icon"[^>]+href="favicon-dark\.svg"/);
  assert.match(index, /rel="icon"[^>]+href="favicon-light\.svg"/);
  assert.match(index, /rel="icon"[^>]+href="favicon\.ico"/);

  // Files
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon-dark.svg')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon-light.svg')));
  assert.ok(fs.existsSync(path.join(repoRoot, 'favicon.ico')));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests\favicon.test.js`

Expected: FAIL (missing tags and/or missing favicon files)

---

### Task 2: Add the theme-aware favicon link tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the favicon links in `<head>` (near `<title>`)**

Replace the `<title>` block with this (keep the existing title text):

```html
<title>Cyberpunk Portfolio // SYSTEM.PROTO</title>
<link rel="icon" href="favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
<link rel="icon" href="favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
<link rel="icon" href="favicon.ico" sizes="any">
```

- [ ] **Step 2: Re-run the favicon test (should still fail)**

Run: `node --test tests\favicon.test.js`

Expected: FAIL (missing files)

---

### Task 3: Create `favicon-dark.svg` and `favicon-light.svg`

**Files:**
- Create: `favicon-dark.svg`
- Create: `favicon-light.svg`

Notes:
- Keep it crisp: no blur/glow filters.
- Geometry is the same for both; only colors differ.

- [ ] **Step 1: Create `favicon-dark.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <title>CV Chip (Dark)</title>
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#08080c"/>
  <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="#00ffcc" stroke-width="4"/>

  <!-- C (mint) -->
  <path d="M30 24C25.5 24 22.5 27.4 22.5 32C22.5 36.6 25.5 40 30 40C32.6 40 34.7 39 36.2 37.2"
        fill="none" stroke="#00ffcc" stroke-width="4" stroke-linecap="round"/>

  <!-- V (rose) -->
  <path d="M41 24L36.2 40H33.8L29 24"
        fill="none" stroke="#ff0055" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: Create `favicon-light.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <title>CV Chip (Light)</title>
  <rect x="0" y="0" width="64" height="64" rx="14" fill="#f5f5f7"/>
  <rect x="8" y="8" width="48" height="48" rx="12" fill="none" stroke="#00a388" stroke-width="4"/>

  <!-- C (light primary) -->
  <path d="M30 24C25.5 24 22.5 27.4 22.5 32C22.5 36.6 25.5 40 30 40C32.6 40 34.7 39 36.2 37.2"
        fill="none" stroke="#00a388" stroke-width="4" stroke-linecap="round"/>

  <!-- V (light secondary) -->
  <path d="M41 24L36.2 40H33.8L29 24"
        fill="none" stroke="#d10047" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 3: Re-run the favicon test (should still fail due to missing `.ico`)**

Run: `node --test tests\favicon.test.js`

Expected: FAIL (missing `favicon.ico`)

- [ ] **Step 4: Commit SVG assets + index links + test (still failing is NOT allowed)**

Do NOT commit yet — wait until the `.ico` exists and the test passes.

---

### Task 4: Generate `favicon.ico` with a zero-dependency Node script

**Files:**
- Create: `tools\generate-favicon-ico.mjs`
- Generate (tracked): `favicon.ico`

This script creates a multi-image ICO (16/32/48) using uncompressed 32-bit BMP frames inside ICO.
The fallback icon uses the **dark** palette (background #08080c, border/C mint #00ffcc, V rose #ff0055).

- [ ] **Step 1: Create `tools\generate-favicon-ico.mjs`**

```javascript
import fs from 'node:fs';
import path from 'node:path';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function hexToRgba(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error('Bad hex: ' + hex);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 255 };
}

function makeImage(size) {
  const buf = Buffer.alloc(size * size * 4);
  return {
    size,
    buf,
    set(x, y, c) {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      const i = (y * size + x) * 4;
      buf[i + 0] = c.r;
      buf[i + 1] = c.g;
      buf[i + 2] = c.b;
      buf[i + 3] = c.a;
    }
  };
}

function stampDisk(img, cx, cy, rad, col) {
  const r2 = rad * rad;
  for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
    for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) img.set(x, y, col);
    }
  }
}

function drawLine(img, x0, y0, x1, y1, thickness, col) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    stampDisk(img, x, y, thickness / 2, col);
  }
}

function insideRoundedRect(x, y, x0, y0, w, h, r) {
  const x1 = x0 + w - 1;
  const y1 = y0 + h - 1;
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;

  const rx = r;
  const ry = r;

  // Central bands
  if (x >= x0 + rx && x <= x1 - rx) return true;
  if (y >= y0 + ry && y <= y1 - ry) return true;

  // Corner circles
  const corners = [
    { cx: x0 + rx, cy: y0 + ry },
    { cx: x1 - rx, cy: y0 + ry },
    { cx: x0 + rx, cy: y1 - ry },
    { cx: x1 - rx, cy: y1 - ry }
  ];
  for (const c of corners) {
    const dx = x - c.cx;
    const dy = y - c.cy;
    if (dx * dx + dy * dy <= rx * rx) return true;
  }
  return false;
}

function drawRoundedBorder(img, x0, y0, w, h, r, t, colBorder, colBg) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const outer = insideRoundedRect(x, y, x0, y0, w, h, r);
      if (!outer) continue;
      const inner = insideRoundedRect(x, y, x0 + t, y0 + t, w - 2 * t, h - 2 * t, Math.max(0, r - t));
      img.set(x, y, inner ? colBg : colBorder);
    }
  }
}

function drawC(img, size, col) {
  // Approximate the SVG "C" using a polyline with a bit of curvature.
  const s = size;
  const pts = [
    [Math.round(s * 0.50), Math.round(s * 0.33)],
    [Math.round(s * 0.40), Math.round(s * 0.33)],
    [Math.round(s * 0.34), Math.round(s * 0.42)],
    [Math.round(s * 0.34), Math.round(s * 0.58)],
    [Math.round(s * 0.40), Math.round(s * 0.67)],
    [Math.round(s * 0.50), Math.round(s * 0.67)]
  ];
  const thickness = clamp(Math.round(s * 0.10), 2, 6);
  for (let i = 0; i < pts.length - 1; i++) {
    drawLine(img, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], thickness, col);
  }
}

function drawV(img, size, col) {
  const s = size;
  const thickness = clamp(Math.round(s * 0.10), 2, 6);
  const xL = Math.round(s * 0.62);
  const xM = Math.round(s * 0.55);
  const xR = Math.round(s * 0.48);
  const yT = Math.round(s * 0.33);
  const yB = Math.round(s * 0.67);

  drawLine(img, xL, yT, xM, yB, thickness, col);
  drawLine(img, xM, yB, xR, yT, thickness, col);
}

function renderFrame(size) {
  const bg = hexToRgba('#08080c');
  const mint = hexToRgba('#00ffcc');
  const rose = hexToRgba('#ff0055');

  const img = makeImage(size);

  // Fill background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) img.set(x, y, bg);
  }

  // Outer tile border (rounded)
  const rOuter = clamp(Math.round(size * 0.22), 3, 14);
  const t = clamp(Math.round(size * 0.08), 2, 5);
  drawRoundedBorder(img, t, t, size - 2 * t, size - 2 * t, rOuter - 2, Math.max(1, Math.floor(t / 1.5)), mint, bg);

  // Letters
  drawC(img, size, mint);
  drawV(img, size, rose);

  return img;
}

function dibFromRgba(img) {
  const w = img.size;
  const h = img.size;

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);      // biSize
  header.writeInt32LE(w, 4);        // biWidth
  header.writeInt32LE(h * 2, 8);    // biHeight (incl AND mask)
  header.writeUInt16LE(1, 12);      // biPlanes
  header.writeUInt16LE(32, 14);     // biBitCount
  header.writeUInt32LE(0, 16);      // biCompression (BI_RGB)
  header.writeUInt32LE(w * h * 4, 20); // biSizeImage
  header.writeInt32LE(0, 24);       // biXPelsPerMeter
  header.writeInt32LE(0, 28);       // biYPelsPerMeter
  header.writeUInt32LE(0, 32);      // biClrUsed
  header.writeUInt32LE(0, 36);      // biClrImportant

  // Pixel data: BGRA, bottom-up
  const pixels = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = ((y * w) + x) * 4;
      const dstY = (h - 1 - y);
      const dst = ((dstY * w) + x) * 4;
      const r = img.buf[src + 0];
      const g = img.buf[src + 1];
      const b = img.buf[src + 2];
      const a = img.buf[src + 3];
      pixels[dst + 0] = b;
      pixels[dst + 1] = g;
      pixels[dst + 2] = r;
      pixels[dst + 3] = a;
    }
  }

  // AND mask (all opaque => 0 bits)
  const rowBytes = Math.ceil(w / 32) * 4;
  const mask = Buffer.alloc(rowBytes * h, 0x00);

  return Buffer.concat([header, pixels, mask]);
}

function writeIco(frames, outPath) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);

  let offset = 6 + entries.length;
  const images = [];

  frames.forEach((frame, idx) => {
    const dib = dibFromRgba(frame);
    images.push(dib);

    const w = frame.size;
    const h = frame.size;

    const e = idx * 16;
    entries.writeUInt8(w === 256 ? 0 : w, e + 0);
    entries.writeUInt8(h === 256 ? 0 : h, e + 1);
    entries.writeUInt8(0, e + 2); // colorcount
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4);  // planes
    entries.writeUInt16LE(32, e + 6); // bitcount
    entries.writeUInt32LE(dib.length, e + 8);
    entries.writeUInt32LE(offset, e + 12);

    offset += dib.length;
  });

  const ico = Buffer.concat([header, entries, ...images]);
  fs.writeFileSync(outPath, ico);
}

const repoRoot = path.resolve(process.cwd());
const out = path.join(repoRoot, 'favicon.ico');

const frames = [16, 32, 48].map(renderFrame);
writeIco(frames, out);

console.log('Wrote', out);
```

- [ ] **Step 2: Run the generator to create `favicon.ico`**

Run: `node .\tools\generate-favicon-ico.mjs`

Expected: prints `Wrote ...\favicon.ico`

- [ ] **Step 3: Re-run the favicon test (should pass now)**

Run: `node --test tests\favicon.test.js`

Expected: PASS

---

### Task 5: Run full test suite and commit

**Files:**
- Modify: `index.html`
- Create: `favicon-dark.svg`
- Create: `favicon-light.svg`
- Create: `tools\generate-favicon-ico.mjs`
- Create: `tests\favicon.test.js`
- Generate: `favicon.ico`

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: PASS

- [ ] **Step 2: Commit**

```bash
git add index.html favicon-dark.svg favicon-light.svg favicon.ico tools/generate-favicon-ico.mjs tests/favicon.test.js
git commit -m "feat: add CV chip favicon assets" \
  -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Quick manual verification (recommended)
- Open the site and verify the favicon changes when switching OS/browser theme (dark vs light).
- Hard refresh (Ctrl+F5) if the browser caches icons.
