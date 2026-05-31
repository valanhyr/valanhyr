# SEO: robots + sitemap (CV)

Date: 2026-05-31

## Context
This is a single-page CV site deployed at:
- Canonical URL: https://valanhyr.pages.dev/

This change is part of a broader **"professional head"** package (meta description, canonical URL, and JSON-LD structured data for `Person`, `ProfilePage`, `WebSite`). Those items are already implemented in this branch; this spec focuses on adding explicit crawler directives and sitemap discoverability.

## Goals
- Make crawler directives explicit (index/follow) without blocking common previews.
- Provide a sitemap and advertise it to crawlers.
- Keep the project zero-dependency and framework-free.

## Non-goals
- Multilingual SEO (no `hreflang` work in this change).
- Social previews (Open Graph/Twitter) (handled separately).
- Changing `<html lang>` in this change (explicit user request).

## Proposed changes

### 1) `index.html`
Add:
- `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">`
- `<link rel="sitemap" type="application/xml" href="/sitemap.xml">`

### 2) `robots.txt` (repo root)
Create `robots.txt` with:
- `User-agent: *`
- `Allow: /`
- `Sitemap: https://valanhyr.pages.dev/sitemap.xml`

### 3) `sitemap.xml` (repo root)
Create a truly minimal sitemap containing only the canonical homepage URL.

## Validation
- A small Node test (`tests/seo/head.test.js`) validates `index.html` contains the expected robots meta + sitemap link.
- Run full tests: `node --test .\tests\**\*.test.js`
- After deploy, sanity-check endpoints:
  - `https://valanhyr.pages.dev/robots.txt`
  - `https://valanhyr.pages.dev/sitemap.xml`
