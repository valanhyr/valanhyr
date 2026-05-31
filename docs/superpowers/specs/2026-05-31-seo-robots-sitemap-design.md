# SEO: robots + sitemap (CV)

Date: 2026-05-31

## Context
This is a single-page CV site deployed at:
- Canonical URL: https://valanhyr.pages.dev/

The site already includes:
- `meta description`
- `link rel="canonical"`
- JSON-LD structured data (`Person`, `ProfilePage`, `WebSite`)

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

(Keep existing canonical + JSON-LD.)

### 2) `robots.txt` (repo root)
Create `robots.txt` with:
- `User-agent: *`
- `Allow: /`
- `Sitemap: https://valanhyr.pages.dev/sitemap.xml`

### 3) `sitemap.xml` (repo root)
Create a minimal sitemap containing the canonical homepage URL.

## Validation
- Ensure `robots.txt` and `sitemap.xml` are present at the site root in the deployed environment.
- Quick sanity check: open `https://valanhyr.pages.dev/robots.txt` and `.../sitemap.xml` after deployment.
- Run existing Node tests to ensure no regression.
