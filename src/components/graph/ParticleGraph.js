import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';
import { parseCssColor, isLightColor } from './particleGraphColor.js';

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function mixRgb(a, b, t) {
    const tt = clamp(t, 0, 1);
    return {
        r: Math.round(a.r + (b.r - a.r) * tt),
        g: Math.round(a.g + (b.g - a.g) * tt),
        b: Math.round(a.b + (b.b - a.b) * tt)
    };
}

function hexToRgb(hex) {
    const h = String(hex || '').replace('#', '').trim();
    if (h.length === 3) {
        const r = parseInt(h[0] + h[0], 16);
        const g = parseInt(h[1] + h[1], 16);
        const b = parseInt(h[2] + h[2], 16);
        if ([r, g, b].some(Number.isNaN)) return null;
        return { r, g, b };
    }
    if (h.length === 6) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        if ([r, g, b].some(Number.isNaN)) return null;
        return { r, g, b };
    }
    return null;
}

function luminance(rgb) {
    // relative luminance in [0..1]
    const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255);
    const lin = srgb.map(c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/**
 * Canvas particle graph (vanilla) driven by store.state.cv.graph.
 * - Black background
 * - Particles move + bounce inside bounds
 * - Relation edges drawn from group -> skill membership
 */
export class ParticleGraph extends BaseComponent {
    constructor() {
        super();
        this._raf = null;
        this._lastT = 0;
        this._pulseT = 0;
        this._nodes = [];
        this._edges = [];
        this._dpr = 1;
        this._w = 0;
        this._h = 0;
        this._wrap = null;
        this._canvas = null;
        this._ctx = null;
        this._ro = null;

        // Trails (ghosting) support
        this._needsHardClear = true;
        this._lastBgRaw = null;

        // Pause/visibility support
        this._isIntersecting = true;
        this._isDocVisible = true;
        this._io = null;
        this._onVisibilityChange = null;

        // Hover interaction (only for parent/group nodes for now)
        this._hoveredGroupId = null;
        this._hoverScale = 5.0; // 5x size on hover
        this._hoverEase = 14;   // higher = snappier easing
        this._onMouseMove = null;
        this._onMouseLeave = null;
    }

    connectedCallback() {
        this.render(`
            <style>
                :host { display: block; }
                .wrap {
                    width: 100%;
                    height: 100%;
                    background: var(--bg);
                    overflow: hidden;
                }
                canvas {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            </style>
            <div class="wrap">
                <canvas part="canvas"></canvas>
            </div>
        `);

        this._wrap = this.shadowRoot.querySelector('.wrap');
        this._canvas = this.shadowRoot.querySelector('canvas');
        this._ctx = this._canvas.getContext('2d');

        this._onMouseMove = (ev) => {
            const rect = this._canvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;

            const hit = this.#pickGroupAt(x, y);
            this._hoveredGroupId = hit?.id ?? null;
            this._canvas.style.cursor = hit ? 'pointer' : 'default';
        };

        this._onMouseLeave = () => {
            this._hoveredGroupId = null;
            this._canvas.style.cursor = 'default';
        };

        this._canvas.addEventListener('mousemove', this._onMouseMove);
        this._canvas.addEventListener('mouseleave', this._onMouseLeave);

        this._ro = new ResizeObserver(() => {
            this.#resize();
            this.#initGraph();
        });
        // Observe both the host element and the inner wrapper; some layouts report 0x0 initially.
        this._ro.observe(this);
        this._ro.observe(this._wrap);

        this.bindState('cv', () => this.#initGraph());

        this._isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
        this._onVisibilityChange = () => {
            this._isDocVisible = !document.hidden;
        };
        if (typeof document !== 'undefined' && document.addEventListener) {
            document.addEventListener('visibilitychange', this._onVisibilityChange);
        }

        if (typeof IntersectionObserver !== 'undefined') {
            this._io = new IntersectionObserver((entries) => {
                // Any intersecting entry means the component is on screen enough to animate
                this._isIntersecting = entries.some(e => e.isIntersecting);
            }, { threshold: 0.01 });
            this._io.observe(this);
        }

        // Initial sizing can be 0x0 before layout; retry once on the next animation frame.
        this.#resize();
        this.#initGraph();
        requestAnimationFrame(() => {
            this.#resize();
            this.#initGraph();
        });

        this.#start();
    }

    #drawGrid(isLight) {
        const ctx = this._ctx;
        const spacing = 60;
        const offset = (this._pulseT * 10) % spacing;

        ctx.save();
        const base = isLight ? '0,0,0' : '255,255,255';
        ctx.strokeStyle = `rgba(${base},${isLight ? 0.04 : 0.03})`;
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = offset; x < this._w; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this._h);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = offset; y < this._h; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this._w, y);
            ctx.stroke();
        }
        ctx.restore();
    }

    disconnectedCallback() {
        if (this._ro) this._ro.disconnect();
        if (this._raf) cancelAnimationFrame(this._raf);
        this._raf = null;

        if (this._io) this._io.disconnect();
        this._io = null;

        if (this._onVisibilityChange && typeof document !== 'undefined' && document.removeEventListener) {
            document.removeEventListener('visibilitychange', this._onVisibilityChange);
        }
        this._onVisibilityChange = null;

        if (this._canvas && this._onMouseMove) this._canvas.removeEventListener('mousemove', this._onMouseMove);
        if (this._canvas && this._onMouseLeave) this._canvas.removeEventListener('mouseleave', this._onMouseLeave);
        this._onMouseMove = null;
        this._onMouseLeave = null;
    }

    #pickGroupAt(x, y) {
        // Only parent nodes (depth=1) are interactive for now.
        let best = null;
        let bestD = Infinity;

        for (const n of this._nodes) {
            if (n.depth !== 1) continue;
            const dx = x - n.x;
            const dy = y - n.y;

            const t = n._hoverT ?? 0;
            const scale = 1 + t * (this._hoverScale - 1);
            const r = n.r * scale + 10; // hit padding

            const d2 = dx * dx + dy * dy;
            if (d2 <= r * r && d2 < bestD) {
                bestD = d2;
                best = n;
            }
        }

        return best;
    }

    #resize() {
        if (!this._wrap) return;

        // Prefer host rect; fall back to inner elements.
        const hostRect = this.getBoundingClientRect();
        const wrapRect = this._wrap.getBoundingClientRect();
        const canvasRect = this._canvas?.getBoundingClientRect?.() ?? { width: 0, height: 0 };

        const width = hostRect.width || wrapRect.width || canvasRect.width;
        const height = hostRect.height || wrapRect.height || canvasRect.height;

        this._w = Math.max(1, width);
        this._h = Math.max(1, height);

        this._dpr = Math.max(1, Math.floor((globalThis.devicePixelRatio || 1) * 100) / 100);

        this._canvas.width = Math.floor(this._w * this._dpr);
        this._canvas.height = Math.floor(this._h * this._dpr);

        this._ctx.setTransform(this._dpr, 0, 0, this._dpr, 0, 0);

        this._needsHardClear = true;
    }

    #initGraph() {
        // Avoid re-initializing before we have meaningful bounds.
        if (this._w < 10 || this._h < 10) return;

        const cv = store.state.cv;

        const defaultPalette = {
            frontend: '#3b82f6',
            backend: '#ef4444',
            tools: '#22c55e',
            ai: '#facc15'
        };
        const palette = {
            ...defaultPalette,
            ...(cv?.graph?.palette || {})
        };

        // groups supports multi-level hierarchy:
        // - array: ["HTML", "CSS", {"label":"Frameworks","children":["React"]}]
        // - object: { core: ["HTML"], frameworks: ["React"] }
        const groups = cv?.graph?.groups ?? {
            frontend: ['HTML', 'CSS', 'JS'],
            backend: ['Node', 'REST', 'SQL'],
            tools: ['Git', 'CI', 'Monitoring'],
            ai: ['Spec-driven', 'Prompting', 'RAG']
        };

        const nodes = [];
        const edges = [];

        const slug = (s) => String(s)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const addNode = ({ id, label, depth, kind, groupKey }) => {
            // Depth-based visual scaling for "depth" / hierarchy.
            const baseR = depth === 1
                ? 8.4
                : clamp(6.2 - (depth - 2) * 1.15 + rand(-0.4, 0.6), 2.6, 6.0);

            const r = baseR;

            const groupRgb = hexToRgb(palette[groupKey]) || { r: 235, g: 235, b: 235 };

            const t = clamp((depth - 1) / 5, 0, 1);

            // Children are white by default; they only take the group color when the parent is hovered.
            let rgb;
            if (depth === 1) {
                // Parent/group nodes keep the group color (with a bit of depth lift).
                rgb = mixRgb(groupRgb, { r: 255, g: 255, b: 255 }, 0.18 + t * 0.70);
                rgb = mixRgb(rgb, { r: 220, g: 220, b: 220 }, t * 0.08);
            } else {
                // Depth cue via slight gray shift, but stay essentially white.
                rgb = mixRgb({ r: 255, g: 255, b: 255 }, { r: 220, g: 220, b: 220 }, t * 0.18);
            }

            const alpha = depth === 1
                ? clamp(0.95 - (depth - 1) * 0.04, 0.75, 0.95)
                : clamp(0.92 - (depth - 2) * 0.05, 0.72, 0.92);

            const vx = depth === 1 ? rand(-22, 22) : rand(-30, 30);
            const vy = depth === 1 ? rand(-22, 22) : rand(-30, 30);

            const node = {
                id,
                label,
                depth,
                kind,
                groupKey,
                groupRgb,
                r,
                rgb,
                alpha,
                color: `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`,
                x: rand(20, this._w - 20),
                y: rand(20, this._h - 20),
                vx,
                vy,
                _hoverT: 0
            };

            nodes.push(node);
            return node;
        };

        const normalizeArrayChild = (item) => {
            if (typeof item === 'string') return { label: item };
            if (item && typeof item === 'object') {
                if (typeof item.label === 'string') return item;
            }
            return null;
        };

        const buildChildren = (value) => {
            if (Array.isArray(value)) {
                return value.map(normalizeArrayChild).filter(Boolean);
            }
            if (value && typeof value === 'object') {
                return Object.entries(value).map(([k, v]) => ({ label: k, children: buildChildren(v) }));
            }
            return [];
        };

        const tree = Object.entries(groups).map(([k, v]) => ({
            label: k,
            kind: 'group',
            children: buildChildren(v)
        }));

        const byId = new Map();

        const walk = (parent, item, depth, path, groupKey) => {
            const nodeKind = depth === 1 ? 'group' : 'skill';
            const label = depth === 1 ? String(item.label).toUpperCase() : String(item.label);
            const id = `${nodeKind}:${path}/${slug(item.label)}`;

            const resolvedGroupKey = depth === 1 ? slug(item.label) : groupKey;

            const n = addNode({ id, label, depth, kind: nodeKind, groupKey: resolvedGroupKey });
            byId.set(id, n);

            if (parent) {
                edges.push({ a: parent, b: n, kind: 'tree', depth, groupKey: resolvedGroupKey });
            }

            for (const child of item.children ?? []) {
                walk(n, child, depth + 1, `${path}/${slug(item.label)}`, resolvedGroupKey);
            }
        };

        for (const top of tree) {
            walk(null, top, 1, 'root', null);
        }

        // Group-to-group links: connect each group to its nearest neighbor (visual backbone)
        const groupNodes = nodes.filter(n => n.kind === 'group');
        const backbone = [];
        const seen = new Set();
        for (const a of groupNodes) {
            let best = null;
            let bestD = Infinity;
            for (const b of groupNodes) {
                if (a === b) continue;
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = dx * dx + dy * dy;
                if (d < bestD) {
                    bestD = d;
                    best = b;
                }
            }
            if (best) {
                const eid = a.id < best.id ? `${a.id}|${best.id}` : `${best.id}|${a.id}`;
                if (!seen.has(eid)) {
                    seen.add(eid);
                    backbone.push({ a, b: best, kind: 'group-link', depth: 1 });
                }
            }
        }

        // Precompute hover info for parent nodes (depth=1): show immediate children.
        const directChildren = new Map();
        for (const e of edges) {
            if (e.kind !== 'tree' || e.depth !== 2) continue;
            const key = e.a.id;
            if (!directChildren.has(key)) directChildren.set(key, []);
            directChildren.get(key).push(e.b.label);
        }
        for (const g of groupNodes) {
            const kids = directChildren.get(g.id) ?? [];
            const shown = kids.slice(0, 3).join(' • ');
            g.hoverInfo = kids.length ? (kids.length > 3 ? `${shown} • …` : shown) : '';
        }

        this._nodes = nodes;
        this._edges = edges.concat(backbone);
    }

    #start() {
        if (this._raf) return;
        this._lastT = performance.now();

        const loop = (t) => {
            const dt = clamp((t - this._lastT) / 1000, 0, 0.05);
            this._lastT = t;

            if (!this._isDocVisible || !this._isIntersecting) {
                this._raf = requestAnimationFrame(loop);
                return;
            }

            this.#step(dt);
            this.#draw();
            this._raf = requestAnimationFrame(loop);
        };

        this._raf = requestAnimationFrame(loop);
    }

    #step(dt) {
        const w = this._w;
        const h = this._h;

        // Pulse timer for hover effects
        this._pulseT = (this._pulseT ?? 0) + dt;
        if (this._pulseT > 1000) this._pulseT -= 1000;

        // Smooth hover animation for parent nodes
        const a = 1 - Math.exp(-this._hoverEase * dt);
        for (const n of this._nodes) {
            if (n.depth !== 1) continue;
            const target = n.id === this._hoveredGroupId ? 1 : 0;
            n._hoverT = (n._hoverT ?? 0) + (target - (n._hoverT ?? 0)) * a;
        }

        for (const n of this._nodes) {
            n.x += n.vx * dt;
            n.y += n.vy * dt;

            if (n.x - n.r < 0) {
                n.x = n.r;
                n.vx = Math.abs(n.vx);
            } else if (n.x + n.r > w) {
                n.x = w - n.r;
                n.vx = -Math.abs(n.vx);
            }

            if (n.y - n.r < 0) {
                n.y = n.r;
                n.vy = Math.abs(n.vy);
            } else if (n.y + n.r > h) {
                n.y = h - n.r;
                n.vy = -Math.abs(n.vy);
            }
        }
    }

    #draw() {
        const ctx = this._ctx;
        if (!ctx) return;

        // Background + trails (balanced)
        const styles = getComputedStyle(this);
        const bgRaw = styles.getPropertyValue('--bg').trim() || '#08080c';
        const bgParsed = parseCssColor(bgRaw);
        const isLight = bgParsed ? isLightColor(bgParsed) : false;

        // Higher alpha = shorter trails. (Spec: 0.06–0.12)
        const trailsAlpha = isLight ? 0.10 : 0.08;

        ctx.globalCompositeOperation = 'source-over';

        // Hard clear on resize or theme/bg change
        if (this._needsHardClear || this._lastBgRaw !== bgRaw) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = bgRaw;
            ctx.fillRect(0, 0, this._w, this._h);
            this._needsHardClear = false;
            this._lastBgRaw = bgRaw;
        } else {
            ctx.globalAlpha = trailsAlpha;
            ctx.fillStyle = bgRaw;
            ctx.fillRect(0, 0, this._w, this._h);
            ctx.globalAlpha = 1;
        }

        // Grid stays always-on but extremely subtle
        this.#drawGrid(isLight);

        const accentRaw = styles.getPropertyValue('--primary').trim() || '#00ffcc';
        const accent = parseCssColor(accentRaw) || { r: 0, g: 255, b: 204, a: 1 };

        // Hovered parent (used to highlight its links)
        const hovered = this._nodes.find(n => n.depth === 1 && n.id === this._hoveredGroupId);
        const hoverIntensity = hovered ? (hovered._hoverT ?? 0) : 0;

        // Spec range: dimRest.factor 0.20–0.40. Use 0.30 as default.
        const dimRestAtFull = 0.30;
        const dimK = 1 - (1 - dimRestAtFull) * hoverIntensity;

        const pulse = 0.5 + 0.5 * Math.sin((this._pulseT ?? 0) * 2 * Math.PI * 0.75);
        const pulseK = 0.20 + 0.80 * pulse;

        ctx.globalCompositeOperation = 'source-over';

        // Edges (idle/neutral)
        const highlighted = [];
        for (const e of this._edges) {
            const dx = e.a.x - e.b.x;
            const dy = e.a.y - e.b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const isGroupLink = e.kind === 'group-link';
            const depth = e.depth ?? 2;

            const isHoveredTree = Boolean(
                hoverIntensity > 0 &&
                !isGroupLink &&
                e.kind === 'tree' &&
                e.groupKey &&
                hovered?.groupKey &&
                e.groupKey === hovered.groupKey
            );

            if (isHoveredTree) {
                highlighted.push({ e, dist, depth });
                continue;
            }

            const baseAlpha = isGroupLink ? 0.35 : clamp(0.30 - (depth - 1) * 0.05, 0.10, 0.30);
            let alpha = clamp(baseAlpha - dist / 800, 0.05, isGroupLink ? 0.35 : 0.25);

            if (isLight) alpha = clamp(alpha * 1.5, 0.1, 0.5);

            // Dim non-focused items when hovering/focusing a group
            alpha *= dimK;

            if (alpha <= 0.01) continue;

            const base = isLight ? '0,0,0' : '255,255,255';
            ctx.lineWidth = isGroupLink ? 1.8 : clamp(1.2 - (depth - 2) * 0.15, 0.6, 1.2);
            ctx.strokeStyle = `rgba(${base},${alpha})`;

            ctx.beginPath();
            ctx.moveTo(e.a.x, e.a.y);
            ctx.lineTo(e.b.x, e.b.y);
            ctx.stroke();
        }

        // Nodes (idle/neutral)
        const highlightedNodes = [];
        for (const n of this._nodes) {
            if (hovered && n === hovered) continue;

            const isHighlightedChild = Boolean(
                hoverIntensity > 0 &&
                n.depth > 1 &&
                hovered &&
                n.groupKey &&
                hovered.groupKey &&
                n.groupKey === hovered.groupKey
            );

            if (isHighlightedChild) {
                highlightedNodes.push(n);
                continue;
            }

            const tDepth = clamp((n.depth - 1) / 5, 0, 1);
            const baseAlpha = clamp((n.alpha ?? 0.85) * (n.depth === 1 ? 0.55 : 0.40) * (1 - tDepth * 0.35), 0.04, 0.9);
            const a0 = baseAlpha * dimK;
            if (a0 <= 0.01) continue;

            const core = isLight ? '0,0,0' : '255,255,255';
            const radGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
            radGrad.addColorStop(0, `rgba(${core},${a0})`);
            radGrad.addColorStop(1, `rgba(${core},0)`);

            ctx.beginPath();
            ctx.fillStyle = radGrad;
            ctx.arc(n.x, n.y, n.r * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dim/veil overlay (decided: yes)
        if (hoverIntensity > 0) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = isLight
                ? `rgba(255,255,255,${0.10 * hoverIntensity})`
                : `rgba(0,0,0,${0.10 * hoverIntensity})`;
            ctx.fillRect(0, 0, this._w, this._h);
        }

        // Accent-only highlight pass
        if (highlighted.length) {
            ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

            for (const { e, dist, depth } of highlighted) {
                const isDirectChildLink = Boolean(e.a && hovered && e.a.id === hovered.id);
                const baseAlpha = clamp(0.4 - (depth - 1) * 0.05, 0.15, 0.4);
                let alpha = clamp(baseAlpha - dist / 800, 0.1, 0.4);

                const boost = (isDirectChildLink ? 0.5 : 0.25) * hoverIntensity * pulseK;
                alpha = clamp(alpha + boost, 0.1, 0.85);

                const grad = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
                grad.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},${alpha})`);
                grad.addColorStop(1, isLight
                    ? `rgba(0,0,0,${alpha * 0.12})`
                    : `rgba(255,255,255,${alpha * 0.45})`
                );

                const baseWidth = clamp(1.4 - (depth - 2) * 0.15, 0.8, 1.4);
                const lw = clamp(baseWidth + (isDirectChildLink ? 1.5 : 0.5) * hoverIntensity * pulseK, baseWidth, 3.5);

                ctx.lineWidth = lw;
                ctx.strokeStyle = grad;

                ctx.beginPath();
                ctx.moveTo(e.a.x, e.a.y);
                ctx.lineTo(e.b.x, e.b.y);
                ctx.stroke();
            }
        }

        // Draw highlighted children
        if (highlightedNodes.length) {
            ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

            for (const n of highlightedNodes) {
                const a = clamp(0.2 + 0.7 * hoverIntensity * pulseK, 0.2, 0.95);
                const rr = n.r * (1 + 0.2 * hoverIntensity * pulseK);

                const radGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rr * 1.5);

                if (isLight) {
                    radGrad.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},${a})`);
                    radGrad.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0)`);
                } else {
                    radGrad.addColorStop(0, `rgba(255,255,255,${a * 0.65})`);
                    radGrad.addColorStop(0.25, `rgba(${accent.r},${accent.g},${accent.b},${a})`);
                    radGrad.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0)`);
                }

                ctx.save();
                ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},${isLight ? 0.15 : 0.4})`;
                ctx.shadowBlur = clamp((isLight ? 4 : 15) * hoverIntensity * pulseK, 0, 28);
                ctx.beginPath();
                ctx.fillStyle = radGrad;
                ctx.arc(n.x, n.y, rr * 1.8, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Hovered parent
        if (hovered) {
            ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

            const t = hovered._hoverT ?? 0;
            const r = hovered.r * (1 + t * (this._hoverScale - 1));

            ctx.save();
            ctx.shadowColor = `rgba(${accent.r},${accent.g},${accent.b},${isLight ? 0.25 : 0.6})`;
            ctx.shadowBlur = clamp((isLight ? 10 : 30) * t, 0, 32);

            const radGrad = ctx.createRadialGradient(hovered.x, hovered.y, 0, hovered.x, hovered.y, r);

            if (isLight) {
                radGrad.addColorStop(0, `rgba(${accent.r},${accent.g},${accent.b},1)`);
                radGrad.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0.25)`);
            } else {
                radGrad.addColorStop(0, '#fff');
                radGrad.addColorStop(0.2, `rgba(${accent.r},${accent.g},${accent.b},1)`);
                radGrad.addColorStop(1, `rgba(${accent.r},${accent.g},${accent.b},0)`);
            }

            ctx.beginPath();
            ctx.fillStyle = radGrad;
            ctx.arc(hovered.x, hovered.y, r * 1.2, 0, Math.PI * 2);
            ctx.fill();

            // Technical Ring
            ctx.shadowBlur = 0;
            ctx.lineWidth = 2;
            ctx.strokeStyle = `rgba(${accent.r},${accent.g},${accent.b},${0.8 * t})`;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(hovered.x, hovered.y, r * 1.4, this._pulseT * 2, this._pulseT * 2 + Math.PI * 1.5);
            ctx.stroke();
            ctx.restore();

            // Labels for hovered
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '900 13px "JetBrains Mono", monospace';

            const lum = luminance(accent);
            const isDarkText = lum > 0.6;

            ctx.fillStyle = isLight ? (isDarkText ? '#000' : '#fff') : (isDarkText ? 'rgba(0,0,0,0.85)' : '#fff');
            ctx.fillText(hovered.label, hovered.x, hovered.y - 12);

            if (hovered.hoverInfo) {
                ctx.font = '700 10px "JetBrains Mono", monospace';
                ctx.fillStyle = isLight ? (isDarkText ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)') : (isDarkText ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)');
                ctx.fillText(hovered.hoverInfo, hovered.x, hovered.y + 14);
            }
        }

        // General Labels
        ctx.globalCompositeOperation = 'source-over';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        const labelPrefix = isLight ? 'rgba(0,0,0,' : 'rgba(255,255,255,';

        for (const n of this._nodes) {
            if (n.depth === 1 && n.id === this._hoveredGroupId) continue;
            const fontSize = clamp(11 - (n.depth - 1) * 1.2, 8, 11);
            ctx.font = `700 ${fontSize}px "JetBrains Mono", monospace`;
            let labelAlpha = clamp(0.8 - (n.depth - 1) * 0.15, 0.3, 0.8);

            if (hoverIntensity > 0 && hovered && n.groupKey !== hovered.groupKey) {
                labelAlpha *= dimK;
            }

            ctx.fillStyle = `${labelPrefix}${labelAlpha})`;
            ctx.fillText(n.label, n.x + n.r + 6, n.y - n.r - 2);
        }
    }
}

customElements.define('particle-graph', ParticleGraph);
