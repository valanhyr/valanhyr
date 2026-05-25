# Hero banner “frameless” ParticleGraph block — design

Date: 2026-05-25

## Goal
Make the ParticleGraph block read as a **hero banner** element, not a **card**.

Concretely:
- Keep the graph as a **separate block** above the hero copy (current structure).
- Remove the “card frame” signals (border/radius/drop shadow).
- Avoid a hard rectangular edge by adding **soft edge fades**.

## Context (current)
`src/components/sections/HeroBanner.js` renders:
- `.stage`: a fixed-height container that currently uses border + large radius + inset/outer shadows.
- `<particle-graph>`: absolute-positioned, full-bleed canvas inside `.stage`.

The current `.stage` styling reads like a panel/card sitting on the page.

## Constraints
- Vanilla web project (no frameworks, no bundler).
- No new runtime dependencies.
- Must work in both dark and light theme.
- Must not reintroduce blur/ghosting on the canvas (keep graph rendering crisp).

## Proposed approach (selected)
**A) Frameless + fades**

### 1) Stage becomes frameless
In `HeroBanner.js` CSS for `.stage`:
- Remove: `border`, `border-radius`, and “card-like” `box-shadow`.
- Keep: `position: relative`, `overflow: hidden`, and current responsive `height` rules.
- Set `background` to `var(--bg)` so it visually merges with the page background.

This preserves the current layout and interaction, but eliminates the panel/card affordance.

### 2) Add soft edge fades (no glow)
Add a pseudo-element overlay for `.stage` to soften the edges:
- `.stage::after` covers the stage (`position: absolute; inset: 0`).
- `pointer-events: none` to avoid blocking interactions.
- Use a combination of gradients that fade **toward** `var(--bg)` near the borders:
  - A **radial vignette** (soft darkening/lightening at corners)
  - Optional **top/bottom linear fade** (helps the stage blend into surrounding content)

Implementation detail suggestion (theme-aware):
- Prefer `color-mix(in srgb, var(--bg) 85%, transparent)` to derive a fade color from `--bg`.
- Keep opacity subtle; the goal is “edge softness”, not a visible glow.

### 3) Keep the graph crisp
- Do not use `backdrop-filter` or blur filters on the stage.
- The graph itself remains responsible for crisp lines/text (already addressed in ParticleGraph changes).

## Non-goals
- No “full-bleed / edge-to-edge” hero for now.
- No layout restructure (e.g., moving hero copy on top of the graph) in this iteration.
- No new motion effects.

## Success criteria
- The graph block no longer reads as a card/panel.
- The edges feel integrated (soft fade), not like a hard rectangle.
- No regression in readability or crispness.
- Works in dark and light mode.

## Files expected to change (implementation phase)
- `src/components/sections/HeroBanner.js` (CSS only)

## Acceptance notes
If the fade effect is too noticeable, we reduce its opacity first (prefer subtlety). If it feels too sharp, we increase fade size rather than adding glow/blur.
