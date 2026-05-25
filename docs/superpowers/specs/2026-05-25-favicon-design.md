# Favicon (CV chip) — design

Date: 2026-05-25

## Goal
Add a favicon consistent with the current cyberpunk/neumorphic theme, with clear legibility at small sizes.

## Constraints
- Vanilla site: no frameworks, no bundler/build step.
- Keep runtime deps at zero.
- Support both dark and light themes with good contrast.

## Decisions
### 1) Asset strategy
- Primary: **two SVG favicons** selected via `prefers-color-scheme`.
- Fallback: `favicon.ico` for older user agents.

HTML (in `index.html` `<head>`):

```html
<link rel="icon" href="favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
<link rel="icon" href="favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)">
<link rel="icon" href="favicon.ico" sizes="any">
```

### 2) Icon concept
Chosen direction: **Chip + “CV” inside (literal)**.

### 3) Visual spec
#### Dark favicon (`favicon-dark.svg`)
- Tile: rounded square app-icon shape.
- Background: `#08080c`.
- Border: neon mint `#00ffcc`.
- Letters: `C` in `#00ffcc`, `V` in `#ff0055`.
- Style: **no glow/blur**, no extra “pins” (cleaner).
- Safe zone: keep all strokes inside a ~8px margin on a 64×64 viewBox.

#### Light favicon (`favicon-light.svg`)
- Background: `#f5f5f7`.
- Border + `C`: `#00a388` (theme light primary).
- `V`: `#d10047` (theme light secondary).
- Same geometry/stroke weights as dark.

#### ICO fallback (`favicon.ico`)
- Use a single version (preferably dark) as fallback.
- Include sizes: 16×16, 32×32, 48×48.

## Success criteria
- Recognizable and readable at 16×16 and 32×32.
- Looks correct on both dark & light browser UI.
- No new runtime dependencies; favicon assets are static files.

## Non-goals
- No animated favicon.
- No full icon pack / PWA manifest scope in this change.

## Notes
During brainstorming, temporary visual-companion screens are stored under `.superpowers/brainstorm/` and must not be committed.
