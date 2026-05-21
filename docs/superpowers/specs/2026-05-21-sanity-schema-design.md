# Design Spec: Sanity.io Schema Architecture

**Date:** 2026-05-21
**Status:** Approved
**Goal:** Define the formal schema structure for Sanity.io to enable real Headless CMS integration while maintaining compatibility with the current `SanityService` abstraction.

## Context
We are transitioning from a static `cv.json` to a dynamic Sanity-powered backend. The architecture must be intuitive for content editing and robust for technical consumption.

## Document Architecture

### 1. Singleton Documents (Global)
These documents represent unique sections of the portfolio. Only one instance of each should exist.

#### `basics` (Singleton)
- `name` (string): Full name.
- `role` (string): Professional title.
- `location` (string): Current location.
- `summary` (text): Short introductory bio.
- `links` (array of objects):
  - `label` (string)
  - `href` (url)

#### `about` (Singleton)
- `title` (string): Section title.
- `paragraphs` (array of text): Main content sections.
- `highlights` (array of string): Key bullet points.

### 2. Collection Documents (Independent)
Lists of entities that can be added, removed, or reordered.

#### `project`
- `name` (string): Project title.
- `description` (text): Main description.
- `mainImage` (image): Featured asset.
- `stack` (array of string): Technologies used.
- `links` (array of objects):
  - `label` (string)
  - `href` (url)
- `highlights` (array of string): Specific technical achievements.

#### `experience`
- `company` (string): Organization name.
- `role` (string): Job title.
- `period` (string): e.g., "2023 — Present".
- `location` (string): e.g., "Remote".
- `achievements` (array of string): Key responsibilities and outcomes.
- `stack` (array of string): Technologies used in this role.

#### `skillCategory`
- `title` (string): e.g., "Frontend", "Backend".
- `order` (number): For manual sorting in the UI.

#### `skill`
- `name` (string): e.g., "Angular", "TypeScript".
- `category` (reference): Pointer to a `skillCategory` document.

## Technical Implementation (Sanity Studio)

### Structure Builder
To enforce Singletons in the Studio UI:
```javascript
// sanity.config.ts / deskStructure.js
export const myStructure = (S) =>
  S.list()
    .title('Portfolio Content')
    .items([
      S.listItem()
        .title('Global Basics')
        .id('basics')
        .child(S.document().schemaType('basics').documentId('basics')),
      S.listItem()
        .title('About Section')
        .id('about')
        .child(S.document().schemaType('about').documentId('about')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !['basics', 'about'].includes(item.getId())
      ),
    ]);
```

## Data Mapping & GROQ
The `SanityService.js` will utilize GROQ to fetch and transform data to match our component expectations.

**Example for Skills (Dereferencing):**
```groq
*[_type == "skill"]{
  name,
  "group": category->title
}
```

## Verification
- **Studio Check:** Verify that `basics` and `about` cannot be duplicated.
- **Reference Check:** Ensure deleting a `skillCategory` is blocked if `skill` documents still reference it.
- **Service Integrity:** The `SanityService` fetch methods must correctly parse the dereferenced GROQ results.
