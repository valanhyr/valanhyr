# Design Spec: Zero-Dependency Testing Infrastructure for Vanilla Web Components

**Date:** 2026-05-20
**Status:** Approved
**Goal:** Establish a robust, scalable, and 100% dependency-free testing infrastructure for the project's vanilla web components using Node.js built-ins.

## Context
The project is a vanilla web application (HTML, CSS, JS) without a build step or external dependencies. Current tests are inconsistent manual scripts. We need a standardized way to verify component behavior without introducing `npm` packages like Jest or Vitest.

## Architecture

### 1. DOM Mocking Layer (`tests/test-setup.js`)
Node.js does not have a native DOM. We provide minimal, synchronous mocks for the essential browser APIs used by our components:
- `HTMLElement`: A base class that supports `attachShadow` and basic lifecycle methods.
- `ShadowRoot`: A simple container for `innerHTML`.
- `customElements`: A registry to track component registration via `define` and `get`.
- `global.window` and `global.document`: Basic stubs to prevent runtime errors during component instantiation.

### 2. Native Test Runner
We utilize the **Node.js Native Test Runner** (`node:test`) and **Assertion Module** (`node:assert`), available since Node 18/20.
- **Organization:** Tests are grouped using `test` and sub-tests (`t.test`).
- **Assertions:** Use strict assertions (`assert.strictEqual`, `assert.match`, `assert.ok`).
- **Execution:** Tests are run directly via `node --test tests/**/*.test.js`.

## Implementation Strategy

### Component Testing Pattern
Each component test file should follow this pattern:
1. Import `test-setup.js` to initialize the environment.
2. Import the component class.
3. Use `node:test` to define test suites.
4. Instantiate the component, trigger `connectedCallback()`, and inspect the `shadowRoot.innerHTML`.

### Targeted Components
- **Existing:** Migrate `AppNavbar` and `HomeView`.
- **New Coverage:** `UiButton`, `UiCard`, `UiTag`.
- **Future:** Extend to section components (`CvAbout`, `CvSkills`, etc.).

## Verification
- Run individual tests: `node tests/components/navbar.test.js`
- Run all tests: `node --test tests/components/*.test.js`
- Tests must pass in a standard Node.js environment without `node_modules`.

## Assumptions & Constraints
- We only mock what we use. If a component uses complex APIs (e.g., `IntersectionObserver`), those must be added to `test-setup.js`.
- Tests are behavioral and structural (inspecting DOM strings), not visual.
