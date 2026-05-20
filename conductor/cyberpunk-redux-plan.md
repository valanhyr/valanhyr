# Cyberpunk Redux: Frontend Design Elevation

**Goal:** Elevate the current "Cyberpunk Neumorphism" design to a distinctive, production-grade interface by applying the `frontend-design` skill. This involves moving away from generic fonts and colors towards a high-fidelity, "Cyber-Organic" aesthetic with advanced CSS effects and meticulous attention to detail.

**Aesthetic Direction:**
- **Typography:** `Syne` (Bold Display), `Hanken Grotesk` (Refined Body), `JetBrains Mono` (Technical UI).
- **Color Palette:**
    - `bg`: `#08080c` (Deep Void)
    - `surface`: `#0d0d10`
    - `primary`: `#00ffcc` (Neon Mint)
    - `secondary`: `#ff0055` (Electric Rose)
    - `accent`: `#7a00ff` (Vivid Violet)
- **Advanced Effects:**
    - **Global Grain:** SVG noise filter for organic texture.
    - **Chromatic Aberration:** Subtle text-shadow displacement on hover for headings.
    - **Scanlines:** Overlay on the Hero Stage and specific UI elements.
    - **Refined Neumorphism:** Larger, softer shadows with subtle internal gradients.
    - **Cyber-Framing:** Corner brackets and technical ornaments on cards and containers.

---

### Phase 1: Foundation & Typography

**Modify:** `index.html`
- Replace `Inter` and `Fira Code` with `Syne`, `Hanken Grotesk`, and `JetBrains Mono`.
- Inject a hidden SVG `<filter>` for the grain effect.

**Modify:** `src/styles/theme.css`
- Update `--font-main`, `--font-mono`, and add `--font-display`.
- Refine the color variables with the "Cyber-Organic" palette.
- Adjust shadow variables for softer neumorphism.

---

### Phase 2: Global Styling & Textures

**Modify:** `src/styles/global.css`
- Implement the `::before` grain overlay on the body.
- Add `.cyber-glitch` and `.cyber-scanline` utility classes.
- Update `.neumorphic-flat` and `.neumorphic-inset` with refined gradients and shadows.

---

### Phase 3: Component Refinement

**Modify:** `src/components/ui/UiButton.js`
- Add a "Glitch" animation on hover.
- Refine the `sweep` animation to be more subtle and "laser-like".
- Use `JetBrains Mono` for button text.

**Modify:** `src/components/ui/UiCard.js`
- Add "Corner Brackets" (absolute positioned `::before`/`::after` elements).
- Enhance the hover state with a "Subtle Glow" matching the card's accent.

**Modify:** `src/components/sections/HeroBanner.js`
- Use `Syne` for the headline with a custom `text-shadow` effect.
- Enhance the `stage` with a scanline overlay and deeper shadows.

---

### Phase 4: Verification & Polish

1. **Visual Verification:** Ensure all fonts load correctly and the grain effect is subtle enough to not distract.
2. **Interaction Check:** Verify that "Glitch" and "Scanline" effects don't impact performance.
3. **Accessibility:** Ensure the high-contrast neon colors maintain WCAG AA compliance (or better) against the dark background.
