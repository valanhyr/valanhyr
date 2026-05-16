# Copilot instructions for this repository

## Project intent
This repository aims to be a **high-level vanilla web** project:
- No frameworks (React/Vue/Svelte/etc.).
- No bundlers/build step by default (Vite/Webpack/Rollup/etc.).
- Prefer platform APIs: ES modules, Web Components (Custom Elements + Shadow DOM), and plain HTML/CSS.
- Keep dependencies at **zero** unless explicitly agreed.
- If introducing tooling/dependencies (TypeScript, Vite, ESLint, test runners, etc.), get explicit agreement in an issue/PR before implementing.

## Commands (Windows)

### Run the app locally
- Entry point: `index.html` (loads `main.js` as an ES module).
- Use a static file server so ES module imports work reliably.

### Tests
Tests are plain Node scripts under `tests/` (no Jest/Vitest).

- Run all tests (PowerShell):
  ```powershell
  node .\tests\components\navbar.test.js
  node .\tests\components\homeview.test.js
  ```

- Run a single test:
  ```powershell
  node .\tests\components\navbar.test.js
  ```

### Lint
No linter configuration is present in the repo.

## High-level architecture

- **Bootstrap**: `index.html` mounts `<div id="app"></div>` and loads `main.js`.
- **Module registration + mount**: `main.js` imports component modules for their side effects (`customElements.define(...)`) and then injects the top-level layout into `#app`:
  - `<app-navbar>`
  - `<home-view>`
- **Views compose components**: `HomeView` renders a `<skill-graph>` placeholder; `SkillGraph` is registered globally via its module.
- **Web Components**:
  - Shared base: `src/components/BaseComponent.js` attaches an **open** Shadow DOM and provides `render(html)`.
  - Components implement `connectedCallback()` and call `this.render(...)`.
- **State**: `src/store/state.js` exports a singleton `store`.
  - `store.state` is a `Proxy`; assigning to a top-level key triggers subscribers for that key.
  - `BaseComponent.bindState(key, cb)` is a thin wrapper over `store.subscribe(key, cb)`.

## Key conventions and patterns

- **Component structure**
  - `export class X extends BaseComponent { connectedCallback() { ... } }`
  - `customElements.define('kebab-case-tag', X);` at the bottom of the module.
  - Components commonly inline a `<style>` block inside the rendered template.

- **Imports**
  - Use relative ES module imports with explicit `.js` extensions (matches current code and browser loading).

- **Styling**
  - Global theme tokens live in `src/styles/theme.css` as CSS custom properties (e.g. `--primary`, `--border-width`).
  - Global resets/layout live in `src/styles/global.css`.
  - Component styles can reference theme variables via `var(--primary)`.

- **Testing approach**
  - Tests mock `global.HTMLElement` and `global.customElements` (with a simple registry) and then `import()` the component module.
  - Assertions typically cover:
    - the custom element was registered
    - `connectedCallback()` renders expected HTML into `shadowRoot.innerHTML`
