# ParticleGraph visual elevation — design

Date: 2026-05-25

## Goal
Elevate the `ParticleGraph` (hero background) to feel more “cyber-organic” and premium while staying readable and not competing with the hero copy/CTAs.

## Constraints
- Vanilla site: no frameworks, no bundler/build step.
- Keep runtime dependencies at zero.
- Must support `prefers-reduced-motion`.
- Performance target: **Balanced** (medium blur, very subtle trails).
- Visual rule: **neon is an accent** (primarily on hover/focus), idle state stays sober.

## Decisions
### 1) Visual direction
- Default/idle: subtle, low-contrast node/edge rendering.
- Focus (hover/focus over a group node):
  - Accent glow on focused group + its subtree
  - **Dim/veil the rest** to improve readability

### 2) Color strategy
Chosen direction: **Neon only as accent (hover/focus)**.
- Idle: mostly white/gray particles and edges.
- Focus: use the theme accent (`--primary`, mint/cyan) for glow and highlight.
- Group palette may remain available for future iterations, but is not the default visual driver.

### 3) Background grid
- Always present, but extremely subtle (low alpha).
- Light/dark behavior is derived from the actual `--bg` color, not string heuristics.

### 4) Motion trails (ghosting)
- Enabled in Balanced mode.
- Implementation concept: instead of `clearRect()`, paint the background color each frame with a small alpha to leave a short trail.
- Must reset/clear hard on resize/theme changes to avoid smearing artifacts.

### 5) Suggested defaults (tuning knobs)
These are starting points; they can be tweaked after eyeballing FPS and readability.
- `grid.alpha`: 0.02–0.04
- `trails.alpha`: 0.06–0.12 (higher = shorter trails)
- `dimRest.factor`: 0.20–0.40 (lower = stronger dim)
- `shadowBlur.max`: ~18–28 (apply only on accent pass)

## Rendering approach (high-level)
Layered pipeline:
1. Fill background (`--bg`).
2. Draw grid (very subtle).
3. Draw idle edges + nodes in `source-over` (sober, low alpha).
4. If there is focus:
   - Apply dim factor to non-focused elements (global alpha multiplier and/or a subtle veil).
   - Draw accent pass (`lighter` / glow) for focused group + subtree.
5. Labels: keep readable; focus labels can be stronger while idle labels remain understated.

## Performance & behavior
- Cap expensive operations (notably `shadowBlur`) and keep them only for the accent pass.
- Support `prefers-reduced-motion` by disabling trails/pulses (and optionally reducing animation intensity).
- Recommended: pause RAF when `document.hidden` and/or when the hero is outside the viewport.

## Success criteria
- The hero feels more integrated and premium, but the headline + CTAs remain the visual priority.
- Focus interaction makes the graph instantly more legible (accent + dim rest).
- Balanced mode runs smoothly on typical laptops; no obvious stutter.
- Reduced-motion users do not get trails/pulses.

## Non-goals
- No new libraries (particles libs, canvas libs).
- No full data-viz rewrite (force-directed layout, clustering engine) in this iteration.
- No complex click-to-pin UX unless explicitly added later.

## Notes
During brainstorming, temporary visual-companion screens are stored under `.superpowers/brainstorm/` and must not be committed.
