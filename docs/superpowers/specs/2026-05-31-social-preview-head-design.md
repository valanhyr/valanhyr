# Social preview + head polish (OG/Twitter + theme-color)

Date: 2026-05-31

## Context
Single-page CV deployed at:
- Canonical URL: https://valanhyr.pages.dev/

The site already includes:
- `meta description`
- `link rel="canonical"`
- JSON-LD structured data
- `meta robots` and `link rel="sitemap"`

## Goals
- Improve link previews when sharing the CV (LinkedIn/X/WhatsApp) without adding dependencies.
- Improve browser UI integration on mobile/desktop via `theme-color`.

## Non-goals
- Adding an Open Graph preview image in this change (explicitly deferred).
- Changing `<html lang>`.

## Proposed changes

### `index.html`
Add the following head tags, using existing title/description/canonical values:

**Open Graph (no image):**
- `og:type` = `website`
- `og:site_name` = `Xisco Raya`
- `og:title` = page title
- `og:description` = meta description
- `og:url` = canonical URL

**Twitter (no image):**
- `twitter:card` = `summary`
- `twitter:title` = page title
- `twitter:description` = meta description

**Theme hints:**
- `meta name="color-scheme" content="dark light"`
- `meta name="theme-color"` for dark and light using `prefers-color-scheme` media.

## Validation
- Add a Node test that asserts these tags exist in `index.html`.
- Run existing Node tests.
