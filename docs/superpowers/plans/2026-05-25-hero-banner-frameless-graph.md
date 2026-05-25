# Hero Banner Frameless ParticleGraph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the hero ParticleGraph block feel like a banner (frameless) instead of a card by removing border/radius/shadows and adding subtle edge fades.

**Architecture:** Keep the current `HeroBanner` structure (graph block separated above copy). Only adjust the inline CSS in `src\components\sections\HeroBanner.js` and add a small regression check in the existing Node test to prevent the “card frame” from coming back.

**Tech Stack:** Vanilla JS (ES modules), Web Components (Shadow DOM), CSS (gradients + `color-mix`), Node.js tests (no dependencies).

---

## File structure

**Modify:**
- `C:\Users\valan\source\Repository\valanhyr\src\components\sections\HeroBanner.js`
- `C:\Users\valan\source\Repository\valanhyr\tests\components\herobanner.test.js`

---

### Task 1: Confirm baseline tests are green

**Files:**
- (no changes)

- [ ] **Step 1: Run current tests (baseline)**

Run:

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\particlegraph-color.test.js
node .\tests\components\particlegraph.test.js
node .\tests\components\herobanner.test.js
```

Expected: all PASS.

---

### Task 2: Add a failing regression assertion for “frameless stage”

**Files:**
- Modify: `tests\components\herobanner.test.js`

- [ ] **Step 1: Edit `tests\\components\\herobanner.test.js` to assert the old card frame is gone**

Append these checks after the existing proofs assertions (keep the existing test intact):

```javascript
        // Regression: hero graph container should not look like a card.
        // These strings existed in the previous implementation.
        if (html.includes('border-radius: var(--radius-lg)')) {
            throw new Error('HeroBanner stage still uses card-like border radius');
        }
        if (html.includes('box-shadow:')) {
            throw new Error('HeroBanner stage still uses card-like box-shadow');
        }
        if (html.includes('border: 1px solid')) {
            throw new Error('HeroBanner stage still uses card-like border');
        }

        // Regression: ensure we have an edge-fade overlay hook.
        if (!html.includes('.stage::after')) {
            throw new Error('HeroBanner stage is missing ::after edge-fade overlay');
        }
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
node .\tests\components\herobanner.test.js
```

Expected: FAIL with one of the new errors (because the current HeroBanner still contains the card styles and no `.stage::after`).

---

### Task 3: Implement frameless stage + edge fades in `HeroBanner`

**Files:**
- Modify: `src\components\sections\HeroBanner.js`

- [ ] **Step 1: Remove the “card frame” styling from `.stage`**

In the `.stage { ... }` CSS block, remove these properties entirely:

```css
border: 1px solid var(--glass-border);
border-radius: var(--radius-lg);
box-shadow: inset 0 0 50px rgba(0, 255, 204, 0.05),
            0 10px 30px var(--shadow-dark);
```

Ensure `.stage` still includes at least:

```css
.stage {
    position: relative;
    height: 440px;
    background: var(--bg);
    overflow: hidden;
}
```

- [ ] **Step 2: Add the edge-fade overlay (`.stage::after`)**

Add this new CSS block near the `.stage` styles:

```css
.stage::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;

    /* Soften edges to avoid a hard rectangular block.
       Keep subtle: no glow, no blur filters. */
    background:
        radial-gradient(
            120% 120% at 50% 50%,
            transparent 0%,
            transparent 55%,
            color-mix(in srgb, var(--bg) 85%, transparent) 78%,
            var(--bg) 100%
        ),
        linear-gradient(
            to bottom,
            var(--bg) 0%,
            transparent 14%,
            transparent 86%,
            var(--bg) 100%
        );
    opacity: 1;
}
```

- [ ] **Step 3: Re-run the HeroBanner test (should pass now)**

Run:

```powershell
node .\tests\components\herobanner.test.js
```

Expected: PASS.

- [ ] **Step 4: Run the full test set again**

Run:

```powershell
node .\tests\components\navbar.test.js
node .\tests\components\homeview.test.js
node .\tests\components\particlegraph-color.test.js
node .\tests\components\particlegraph.test.js
node .\tests\components\herobanner.test.js
```

Expected: all PASS.

- [ ] **Step 5: Commit**

```powershell
git add src\components\sections\HeroBanner.js tests\components\herobanner.test.js
git commit -m "tune: make hero particlegraph stage frameless" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Manual visual QA (browser)

**Files:**
- (no changes unless issues found)

- [ ] **Step 1: Serve the repo with a static server and open the page**

Run (option A):

```powershell
python -m http.server 8000
```

Open: `http://localhost:8000/`

- [ ] **Step 2: Visual checklist**

Expected:
- The graph block blends with the page (no border, no rounded corners, no drop shadow).
- The edges feel soft (fade), not a hard rectangle.
- No perceived blur added by CSS (no filters).
- In light theme, the fade should still look natural (because it keys off `var(--bg)`).

- [ ] **Step 3: If the fade is too noticeable**

Adjust only the fade geometry/strength (keep it subtle):
- Move the radial stop from `55%` to `65%` (smaller fade area), or
- Lower the `color-mix` bg weight from `85%` to `75%`.

After adjusting, re-run:

```powershell
node .\tests\components\herobanner.test.js
```

---

## Plan self-review (done)
- Spec coverage: matches the approved spec (remove border/radius/shadow; add subtle `::after` fades; no restructure).
- Placeholder scan: no TODO/TBD; all steps include exact paths, code, and commands.
- Consistency: test strings match the intended removed/added CSS hooks.

---

## Execution choice
Plan complete and saved to `docs/superpowers/plans/2026-05-25-hero-banner-frameless-graph.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task (REQUIRED SUB-SKILL: superpowers:subagent-driven-development)
2. **Inline Execution** — Execute tasks in this session (REQUIRED SUB-SKILL: superpowers:executing-plans)

Which approach?