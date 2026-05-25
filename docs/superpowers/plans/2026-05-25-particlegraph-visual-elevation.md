# ParticleGraph Visual Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a “balanced”, cyber-organic visual elevation of the hero `ParticleGraph`: subtle idle, neon accent only on focus, very subtle trails, always-on ultra-subtle grid, and dim the rest on focus.

**Architecture:** Keep the existing Web Component (`src\components\graph\ParticleGraph.js`) and evolve its rendering pipeline. Add a tiny zero-dependency helper module for color parsing/luminance so light/dark detection and trail fill can be tested in Node.

**Tech Stack:** Vanilla JS (ES modules), Canvas 2D, Web Components, Node.js tests (core modules only).

---

## File structure

**Create:**
- `C:\Users\valan\source\Repository\valanhyr\src\components\graph\particleGraphColor.js`
- `C:\Users\valan\source\Repository\valanhyr\tests\components\particlegraph-color.test.js`
- `C:\Users\valan\source\Repository\valanhyr\tests\components\particlegraph.test.js`

**Modify:**
- `C:\Users\valan\source\Repository\valanhyr\src\components\graph\ParticleGraph.js`

---

### Task 1: Add failing unit tests for color parsing + luminance

**Files:**
- Create: `tests\components\particlegraph-color.test.js`

- [ ] **Step 1: Create the failing test file**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';

// Will exist after Task 2
import {
  parseCssColor,
  luminance,
  isLightColor
} from '../../src/components/graph/particleGraphColor.js';

test('particleGraphColor: parseCssColor supports hex and rgb/rgba', () => {
  assert.deepEqual(parseCssColor('#fff'), { r: 255, g: 255, b: 255, a: 1 });
  assert.deepEqual(parseCssColor('#08080c'), { r: 8, g: 8, b: 12, a: 1 });

  assert.deepEqual(parseCssColor('rgb(10, 20, 30)'), { r: 10, g: 20, b: 30, a: 1 });
  assert.deepEqual(parseCssColor('rgba(10, 20, 30, 0.25)'), { r: 10, g: 20, b: 30, a: 0.25 });
});

test('particleGraphColor: luminance + isLightColor behave sensibly', () => {
  const dark = { r: 8, g: 8, b: 12, a: 1 };
  const light = { r: 245, g: 245, b: 247, a: 1 };

  assert.ok(luminance(dark) < luminance(light));
  assert.equal(isLightColor(dark), false);
  assert.equal(isLightColor(light), true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
node .\tests\components\particlegraph-color.test.js
```

Expected: FAIL (module `particleGraphColor.js` does not exist yet).

---

### Task 2: Implement `particleGraphColor.js` (pure, testable helpers)

**Files:**
- Create: `src\components\graph\particleGraphColor.js`

- [ ] **Step 1: Create `src\components\graph\particleGraphColor.js`**

```javascript
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function parseCssColor(input) {
  const s = String(input || '').trim();
  if (!s) return null;

  // #rgb / #rrggbb
  const hex = s.startsWith('#') ? s.slice(1) : null;
  if (hex) {
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b, a: 1 };
    }
  }

  // rgb()/rgba()
  const m = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (m) {
    const parts = m[1].split(',').map(p => p.trim());
    if (parts.length < 3) return null;
    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    if ([r, g, b].some(v => !Number.isFinite(v))) return null;
    const a = parts.length >= 4 ? Number(parts[3]) : 1;
    if (!Number.isFinite(a)) return null;
    return {
      r: clamp(Math.round(r), 0, 255),
      g: clamp(Math.round(g), 0, 255),
      b: clamp(Math.round(b), 0, 255),
      a: clamp(a, 0, 1)
    };
  }

  return null;
}

export function luminance(rgb) {
  const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255);
  const lin = srgb.map(c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function isLightColor(rgb, threshold = 0.6) {
  return luminance(rgb) > threshold;
}
```

- [ ] **Step 2: Re-run the color test (should pass)**

Run:

```powershell
node .\tests\components\particlegraph-color.test.js
```

Expected: PASS

- [ ] **Step 3: Commit**

```powershell
git add src\components\graph\particleGraphColor.js tests\components\particlegraph-color.test.js
git commit -m "test: add particlegraph color helpers"
```

---

### Task 3: Add a smoke test for `ParticleGraph` lifecycle (zero-deps mocks)

**Files:**
- Create: `tests\components\particlegraph.test.js`

- [ ] **Step 1: Create the test file**

```javascript
import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert/strict';

import { ParticleGraph } from '../../src/components/graph/ParticleGraph.js';

test('ParticleGraph Component (smoke)', async (t) => {
  const pg = new ParticleGraph();

  await t.test('should register custom element', () => {
    assert.ok(global.customElements.get('particle-graph'));
  });

  await t.test('connectedCallback should not throw with basic mocks', () => {
    // Minimal global mocks required by ParticleGraph
    global.ResizeObserver = class { observe() {} disconnect() {} };
    global.getComputedStyle = () => ({
      getPropertyValue: (k) => (k === '--bg' ? '#08080c' : '')
    });
    global.performance = { now: () => 0 };
    global.requestAnimationFrame = () => 1;
    global.cancelAnimationFrame = () => {};

    // Patch render so querySelector returns our wrap/canvas
    const events = [];
    const ctx = {
      setTransform() {},
      clearRect() {},
      fillRect() {},
      beginPath() {},
      arc() {},
      fill() {},
      stroke() {},
      moveTo() {},
      lineTo() {},
      save() {},
      restore() {},
      setLineDash() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      createRadialGradient: () => ({ addColorStop() {} })
    };
    const canvas = {
      width: 0,
      height: 0,
      style: {},
      getContext: () => ctx,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 300 }),
      addEventListener: (type) => events.push(type),
      removeEventListener: () => {}
    };
    const wrap = {
      getBoundingClientRect: () => ({ width: 500, height: 300 })
    };

    pg.getBoundingClientRect = () => ({ width: 500, height: 300 });

    pg.render = (html) => {
      pg.shadowRoot.innerHTML = html;
      pg.shadowRoot.querySelector = (sel) => {
        if (sel === '.wrap') return wrap;
        if (sel === 'canvas') return canvas;
        return null;
      };
    };

    pg.connectedCallback();

    assert.ok(pg.shadowRoot.innerHTML.includes('<canvas'));
    assert.ok(events.includes('mousemove'));
    assert.ok(events.includes('mouseleave'));
  });

  await t.test('disconnectedCallback should not throw', () => {
    pg.disconnectedCallback();
  });
});
```

- [ ] **Step 2: Run the test**

Run:

```powershell
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 3: Commit**

```powershell
git add tests\components\particlegraph.test.js
git commit -m "test: add particlegraph smoke test"
```

---

### Task 4: Replace light/dark detection in `ParticleGraph` with luminance-based logic

**Files:**
- Modify: `src\components\graph\ParticleGraph.js`

- [ ] **Step 1: Import helpers**

Add near the top (after existing imports):

```javascript
import { parseCssColor, isLightColor } from './particleGraphColor.js';
```

- [ ] **Step 2: Replace the current `isLight` heuristic in `#draw()`**

In `#draw()`, replace:

```javascript
const isLight = styles.getPropertyValue('--bg').includes('#f') || styles.getPropertyValue('--bg').includes('245');
```

with:

```javascript
const bgRaw = styles.getPropertyValue('--bg').trim() || '#08080c';
const bgParsed = parseCssColor(bgRaw);
const isLight = bgParsed ? isLightColor(bgParsed) : false;
```

- [ ] **Step 3: Run existing tests**

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\particlegraph-color.test.js
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 4: Commit**

```powershell
git add src\components\graph\ParticleGraph.js
git commit -m "feat: use luminance-based light detection in particlegraph"
```

---

### Task 5: Implement subtle trails (ghosting) with hard reset on resize

**Files:**
- Modify: `src\components\graph\ParticleGraph.js`

- [ ] **Step 1: Add internal state flags**

In the constructor, add:

```javascript
this._needsHardClear = true;
this._lastBgRaw = null;
```

- [ ] **Step 2: Mark hard clear on resize**

At the end of `#resize()`, set:

```javascript
this._needsHardClear = true;
```

- [ ] **Step 3: Replace the `clearRect` background reset with trails fill**

In `#draw()`, locate the first line:

```javascript
ctx.clearRect(0, 0, this._w, this._h);
```

Delete it, and **replace the whole “Background” block** (from the comment `// Background` down to the `fillRect` that paints `bgColor`) with this exact code:

```javascript
// Background + trails (balanced)
const styles = getComputedStyle(this);
const bgRaw = styles.getPropertyValue('--bg').trim() || '#08080c';
const bgParsed = parseCssColor(bgRaw);
const isLight = bgParsed ? isLightColor(bgParsed) : false;

// Higher alpha = shorter trails. (Spec: 0.06–0.12)
const trailsAlpha = isLight ? 0.10 : 0.08;

ctx.globalCompositeOperation = 'source-over';

// Hard clear on resize or theme/bg change
if (this._needsHardClear || this._lastBgRaw !== bgRaw) {
  ctx.globalAlpha = 1;
  ctx.fillStyle = bgRaw;
  ctx.fillRect(0, 0, this._w, this._h);
  this._needsHardClear = false;
  this._lastBgRaw = bgRaw;
} else {
  ctx.globalAlpha = trailsAlpha;
  ctx.fillStyle = bgRaw;
  ctx.fillRect(0, 0, this._w, this._h);
  ctx.globalAlpha = 1;
}

// Grid stays always-on but extremely subtle
this.#drawGrid();
```

Notes:
- This intentionally re-computes `isLight` here, because the background/trails alpha depends on it.
- After this block, keep the rest of `#draw()` (edges/nodes/labels), but remove the now-duplicate `styles/bgColor/isLight` variables if present.

- [ ] **Step 4: Run tests**

```powershell
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 5: Commit**

```powershell
git add src\components\graph\ParticleGraph.js
git commit -m "feat: add subtle trails to particlegraph"
```

---

### Task 6: Make neon an accent: neutral idle pass + accent focus pass + dim rest

**Files:**
- Modify: `src\components\graph\ParticleGraph.js`

- [ ] **Step 1: Compute accent + focus/dim values once per frame**

Inside `#draw()` (after the background/trails block), add:

```javascript
const accentRaw = styles.getPropertyValue('--primary').trim() || '#00ffcc';
const accent = parseCssColor(accentRaw) || { r: 0, g: 255, b: 204, a: 1 };

const hovered = this._nodes.find(n => n.depth === 1 && n.id === this._hoveredGroupId);
const hoverIntensity = hovered ? (hovered._hoverT ?? 0) : 0;

// Spec range: dimRest.factor 0.20–0.40. Use 0.30 as default.
const dimRestAtFull = 0.30;
const dimK = 1 - (1 - dimRestAtFull) * hoverIntensity;
```

- [ ] **Step 2: Neutral idle pass (no constant neon wash)**

In the non-highlight edge drawing path (currently creates a linear gradient between `e.a.groupRgb` and `e.b.groupRgb`), replace the gradient usage with a neutral stroke.

Use this code for the non-highlight edges (inside the `for (const e of this._edges)` loop, in the branch that is NOT `isHoveredTree`):

```javascript
const baseAlpha = isGroupLink ? 0.35 : clamp(0.30 - (depth - 1) * 0.05, 0.10, 0.30);
let alpha = clamp(baseAlpha - dist / 800, 0.05, isGroupLink ? 0.35 : 0.25);

if (isLight) alpha = clamp(alpha * 1.5, 0.1, 0.5);

// Dim non-focused items when hovering/focusing a group
alpha *= dimK;

if (alpha <= 0.01) continue;

const base = isLight ? '0,0,0' : '255,255,255';
ctx.lineWidth = isGroupLink ? 1.8 : clamp(1.2 - (depth - 2) * 0.15, 0.6, 1.2);
ctx.strokeStyle = `rgba(${base},${alpha})`;

ctx.beginPath();
ctx.moveTo(e.a.x, e.a.y);
ctx.lineTo(e.b.x, e.b.y);
ctx.stroke();
```

- [ ] **Step 3: Accent-only highlight pass**

For highlighted edges (the `highlighted` array loop), replace `hlRgb` usage with `accent`, and keep `lighter` only for dark backgrounds:

```javascript
ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

const grad = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
const a0 = alpha;

grad.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},${a0})`);
grad.addColorStop(1, isLight
  ? `rgba(0,0,0,${a0 * 0.12})`
  : `rgba(255,255,255,${a0 * 0.45})`
);

ctx.strokeStyle = grad;
```

(Keep your existing width boost logic, but clamp for “Balanced”: `alpha <= 0.85` and `lineWidth <= 3.5`.)

- [ ] **Step 4: Dim/veil overlay (decided: yes)**

After finishing the **idle** pass (edges + non-highlight nodes), and only when `hoverIntensity > 0`, add:

```javascript
ctx.globalCompositeOperation = 'source-over';
ctx.fillStyle = isLight
  ? `rgba(255,255,255,${0.10 * hoverIntensity})`
  : `rgba(0,0,0,${0.10 * hoverIntensity})`;
ctx.fillRect(0, 0, this._w, this._h);
```

- [ ] **Step 5: Run tests**

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 6: Commit**

```powershell
git add src\components\graph\ParticleGraph.js
git commit -m "feat: accent-only focus rendering for particlegraph"
```

---

### Task 7: Pause animation when hidden / offscreen (CPU saver)

**Files:**
- Modify: `src\components\graph\ParticleGraph.js`
- Modify: `tests\components\particlegraph.test.js`

- [ ] **Step 1: Add state fields in the constructor**

In `constructor()`, add:

```javascript
this._isIntersecting = true;
this._isDocVisible = true;
this._io = null;
this._onVisibilityChange = null;
```

- [ ] **Step 2: Add observers/listeners in `connectedCallback()`**

Near the end of `connectedCallback()` (after canvas is created), add:

```javascript
this._isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
this._onVisibilityChange = () => {
  this._isDocVisible = !document.hidden;
};
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('visibilitychange', this._onVisibilityChange);
}

this._io = new IntersectionObserver((entries) => {
  // Any intersecting entry means the component is on screen enough to animate
  this._isIntersecting = entries.some(e => e.isIntersecting);
}, { threshold: 0.01 });
this._io.observe(this);
```

- [ ] **Step 3: Respect visibility in the RAF loop**

In `#start()` loop, right before `this.#step(dt);` add:

```javascript
if (!this._isDocVisible || !this._isIntersecting) {
  this._raf = requestAnimationFrame(loop);
  return;
}
```

- [ ] **Step 4: Cleanup in `disconnectedCallback()`**

Add:

```javascript
if (this._io) this._io.disconnect();
this._io = null;

if (this._onVisibilityChange && typeof document !== 'undefined' && document.removeEventListener) {
  document.removeEventListener('visibilitychange', this._onVisibilityChange);
}
this._onVisibilityChange = null;
```

- [ ] **Step 5: Update the smoke test mocks for `document.hidden` + listeners**

In `tests\components\particlegraph.test.js`, inside the `connectedCallback should not throw...` test, add:

```javascript
global.document.hidden = false;
global.document.addEventListener = () => {};
global.document.removeEventListener = () => {};
```

- [ ] **Step 6: Run smoke test**

```powershell
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 7: Commit**

```powershell
git add src\components\graph\ParticleGraph.js tests\components\particlegraph.test.js
git commit -m "perf: pause particlegraph when hidden/offscreen"
```

---

### Task 8: Manual QA checklist (final)

- [ ] **Step 1: Visual verification**
  - Idle is sober (no constant neon wash)
  - Hover focuses a group: accent + dim rest works
  - Grid is visible only subtly
  - Trails are subtle and do not smear after resize

- [ ] **Step 2: Reduced motion**
  - Enable OS/browser reduced motion and confirm trails/pulses are disabled or minimized

- [ ] **Step 3: Print**
  - Print CSS already hides `.stage` / `particle-graph`; confirm no regressions

- [ ] **Step 4: Final test run**

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\particlegraph-color.test.js
node .\tests\components\particlegraph.test.js
```

Expected: PASS

- [ ] **Step 5: Final commit (if any uncommitted changes remain)**

```powershell
git status --porcelain
```

Expected: empty
