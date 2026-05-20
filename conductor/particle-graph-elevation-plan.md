# ParticleGraph Elevation: Cyber-Organic Visualization

**Goal:** Transform the `ParticleGraph` from a standard node-link canvas drawing into a high-fidelity "Cyber-Organic" visualization that feels integrated with the "Cyberpunk Redux" aesthetic.

**Visual Improvements:**
- **Neon Glows:** Apply dynamic `shadowBlur` and `shadowColor` based on node group colors to create a "Neon Bloom" effect.
- **Dynamic Connection Gradients:** Draw edges as gradients between nodes instead of solid lines.
- **Variable Node Textures:** Use internal gradients for nodes to give them a "Spherical/Bio-luminescent" feel.
- **Grid Overlay:** Add a subtle, moving "Data Grid" background behind the particles.
- **Motion Trails:** (Optional/Performance permitting) Implement a slight "ghosting" effect using semi-transparent clearRect instead of full clear.
- **Typography:** Use `JetBrains Mono` for node labels instead of generic monospace.
- **Chromatic Aberration on Hover:** Add a subtle "Split-Color" effect when hovering over parent nodes.

---

### Phase 1: Background & Environment

**Modify:** `src/components/graph/ParticleGraph.js`
- Update the `wrap` background to `--bg` instead of `#000`.
- Implement a `drawGrid()` method to render a subtle, perspective-shifting or moving grid.
- Use `ctx.globalCompositeOperation = 'lighter'` for neon blending.

---

### Phase 2: Particle & Edge Refinement

**Modify:** `src/components/graph/ParticleGraph.js`
- **Nodes:** Replace `ctx.arc() + ctx.fill()` with a radial gradient for a "Bioluminescent" glow.
- **Edges:** Implement `ctx.createLinearGradient()` for edges between nodes of different groups.
- **Hover:** Enhance the parent node hover with a "Glitchy" ring or chromatic aberration.

---

### Phase 3: Performance & Polish

1. **Optimization:** Ensure `shadowBlur` is used judiciously to maintain 60fps.
2. **Typography:** Ensure `JetBrains Mono` is used and correctly aligned.
3. **Motion:** Refine the "Pulse" and "Easing" constants for a more organic, "floating" feel.
