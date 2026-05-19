# Cyberpunk Neumorphism Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from Neo-Brutalist to a dynamic "Cyberpunk Neumorphism + Glassmorphism" aesthetic using Vanilla CSS/JS.

**Architecture:** We will update the CSS variable system in `theme.css`, implement base neumorphic and glass styles in `global.css`, and refactor core UI components to use these new styles with high-contrast reactive elements.

**Tech Stack:** Vanilla CSS, Vanilla JS.

---

### Task 1: Update Theme Variables

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Replace :root variables in theme.css**

```css
:root {
    --bg: #0d0d0d;
    --surface: #0d0d0d;
    --surface-2: #141418;

    /* Cyberpunk Neons */
    --primary: #00ffff; /* Cyan */
    --secondary: #ff00ff; /* Magenta */
    --accent: #00ffff;

    --text: #f5f5f5;
    --text-dim: rgba(245, 245, 245, 0.7);
    --on-accent: #000000;

    /* Neumorphic Shadows */
    --shadow-dark: #050505;
    --shadow-light: #1a1a1a;
    
    /* Glassmorphism */
    --glass-bg: rgba(13, 13, 13, 0.7);
    --glass-border: rgba(255, 255, 255, 0.15);
    --glass-blur: 15px;

    /* Refined Layout */
    --border-width: 1px;
    --radius: 12px;
    --radius-lg: 20px;

    /* Motion */
    --dur: 300ms;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);

    --font-main: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'Fira Code', 'Courier New', monospace;
}
```

- [ ] **Step 2: Commit theme changes**
```bash
git add src/styles/theme.css
git commit -m "style: update theme variables for cyberpunk neumorphism"
```

---

### Task 2: Implement Global Neumorphic & Glass Styles

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Update global utility classes**
Remove old `.brutalist-card` styles and add neumorphic/glass utilities.

```css
.neumorphic-flat {
    background: var(--surface);
    box-shadow: 6px 6px 12px var(--shadow-dark), 
                -6px -6px 12px var(--shadow-light);
    border: 1px solid rgba(255,255,255,0.02);
}

.neumorphic-inset {
    background: var(--surface);
    box-shadow: inset 4px 4px 8px var(--shadow-dark), 
                inset -4px -4px 8px var(--shadow-light);
}

.glass-panel {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
}

/* Update animations */
@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

- [ ] **Step 2: Commit global styles**
```bash
git add src/styles/global.css
git commit -m "style: add neumorphic and glassmorphism utility classes"
```

---

### Task 3: Refactor UiButton Component

**Files:**
- Modify: `src/components/ui/UiButton.js`

- [ ] **Step 1: Apply Option 2 styles to UiButton**
Implement the glass-border with sweep animation.

```javascript
// In render() or equivalent
this.element.style.cssText = `
    background: linear-gradient(145deg, #111, #080808);
    color: var(--text);
    border: 1px solid var(--glass-border);
    padding: 12px 24px;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 6px 6px 12px var(--shadow-dark), -6px -6px 12px var(--shadow-light);
    position: relative;
    overflow: hidden;
    transition: all var(--dur) var(--ease);
`;
// Add the sweep div as child
```

- [ ] **Step 2: Verify button interaction**
Check hover state (border change to Cyan).

- [ ] **Step 3: Commit UiButton refactor**
```bash
git commit -m "feat: refactor UiButton with cyberpunk glass-border aesthetic"
```

---

### Task 4: Refactor UiCard Component

**Files:**
- Modify: `src/components/ui/UiCard.js`

- [ ] **Step 1: Apply .neumorphic-flat to UiCard**
Remove `.brutalist-card` and use the new utility.

- [ ] **Step 2: Commit UiCard refactor**
```bash
git commit -m "feat: refactor UiCard to use neumorphic elevation"
```

---

### Task 5: Refactor AppNavbar

**Files:**
- Modify: `src/components/layout/AppNavbar.js`

- [ ] **Step 1: Apply .glass-panel to Navbar**
Ensure it has fixed positioning and high z-index.

- [ ] **Step 2: Commit AppNavbar refactor**
```bash
git commit -m "feat: apply glassmorphism to AppNavbar"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Visual check in browser**
Verify all components are consistent.

- [ ] **Step 2: Test responsiveness**
Check if neumorphic shadows scale well on small screens.
