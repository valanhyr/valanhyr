# Design Spec: Headless CMS Simulation (Sanity.io)

**Date:** 2026-05-20
**Status:** Approved
**Goal:** Transition the project from static JSON imports to an asynchronous, service-based architecture that simulates a Sanity.io Headless CMS integration.

## Context
To professionalize the portfolio and prepare for real CMS integration, we are decoupling content from code. We will implement a "Mock Sanity Client" that mimics the official `@sanity/client` and `@sanity/image-url` libraries using local JSON data.

## Architecture

### 1. Mock Sanity Service (`src/services/SanityService.js`)
A singleton service that provides a Sanity-like interface:
- **`fetch(query)`**: An asynchronous method that accepts GROQ-like strings.
  - Supports basic filtering by `_type` (e.g., `*[_type == "project"]`).
  - Simulates network latency (800ms) to allow for testing "Loading" states.
- **`urlFor(source)`**: A mock image builder that returns a chainable object.
  - Supports `.width()`, `.height()`, and `.url()` methods.
  - Generates simulated Sanity asset URLs that point to local `assets/` files.

### 2. Data Transformation (`src/store/cv.json`)
The current JSON will be refactored to follow Sanity's document conventions:
- Use `_type` and `_id` for every top-level entity.
- Images follow the `asset: { _ref: "..." }` structure.

### 3. Asynchronous Component Pattern
Components will transition from synchronous rendering to an async lifecycle:
- **Initial State:** Display "Skeletons" or a loading indicator.
- **Data Fetching:** Call `SanityService.fetch()` in `connectedCallback()`.
- **Render:** Update the Shadow DOM once data is received.

## Implementation Details

### GROQ Lite Parser Logic
The `fetch` method will use regex to extract the `_type` from the query string and filter the flat JSON array accordingly.

### Image Builder Logic
The `urlFor` method will return a proxy or a class that stores transformation parameters and finally resolves to a local path (e.g., `assets/project1.jpg?w=500`).

## Verification
- **Unit Tests:** Add tests for `SanityService` to ensure `fetch` filters correctly and `urlFor` generates expected strings.
- **UI Testing:** Verify that components show loading states before displaying content.

## Future Path
To migrate to a real Sanity project:
1. Replace the `SanityService.js` implementation with the official `@sanity/client`.
2. Update the `projectId` and `dataset` configuration.
3. No changes will be needed in the component logic.
