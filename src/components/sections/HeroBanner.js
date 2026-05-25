import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class HeroBanner extends BaseComponent {
    connectedCallback() {
        this.bindState('cv', () => this.#render());
        this.#render();
    }

    #render() {
        const cv = store.state.cv;

        const name = cv?.basics?.name ?? 'Your Name';
        const role = cv?.basics?.role ?? 'Software Developer';
        const location = cv?.basics?.location ?? 'Remote';
        const status = cv?.basics?.status ?? 'Open to opportunities';

        const headline = cv?.hero?.headline ?? 'Modern web CV, built in vanilla.';
        const subheadline = cv?.hero?.subheadline ?? 'Professional, fast, accessible — without frameworks.';
        const proofs = Array.isArray(cv?.hero?.proofs) ? cv.hero.proofs : [];

        const primary = cv?.hero?.primaryCta ?? { label: 'Contact', href: '#contact' };
        const secondary = cv?.hero?.secondaryCta ?? { label: 'Download PDF', href: '#' };

        this.render(`
            <style>
                :host { display: block; }

                .hero {
                    margin-bottom: var(--space-xl);
                }

                .stage {
                    position: relative;
                    height: 440px;
                    border: 1px solid var(--glass-border);
                    border-radius: var(--radius-lg);
                    background: var(--bg);
                    overflow: hidden;
                    box-shadow: inset 0 0 50px rgba(0, 255, 204, 0.05),
                                0 10px 30px var(--shadow-dark);
                }

                particle-graph {
                    position: absolute;
                    inset: 0;
                }

                .content {
                    margin-top: 3rem;
                    display: grid;
                    gap: 1.5rem;
                    max-width: 920px;
                }

                .kicker {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                }

                h1 {
                    font-family: var(--font-display);
                    font-size: clamp(2.5rem, 8vw, 5.5rem);
                    line-height: 0.95;
                    margin: 0;
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    color: var(--text);
                    text-shadow: 0 0 30px rgba(0, 255, 204, 0.15);
                    max-width: 100%;
                    min-width: 0;
                }

                /* If a long headline would overflow, tighten the scale a bit on desktop. */
                h1.is-tight {
                    font-size: clamp(2.3rem, 7vw, 5rem);
                    letter-spacing: -0.03em;
                }

                h1.is-tighter {
                    font-size: clamp(2.1rem, 6.2vw, 4.5rem);
                    letter-spacing: -0.02em;
                }

                .typewriter {
                    display: inline-block;
                    max-width: 100%;
                    width: 0;
                    overflow: hidden;
                    border-right: 4px solid var(--primary);
                    white-space: nowrap;
                    padding-right: 0.1em;
                    animation:
                        typing 3s steps(40, end) forwards,
                        blink-caret .75s step-end infinite;
                }

                /*
                  If the headline is too long for the available width, fall back
                  to wrapping (no typewriter animation) instead of overflowing.
                */
                .typewriter.is-wrapping {
                    white-space: normal;
                    overflow: visible;
                    animation: none;
                    border-right: none;
                    max-width: 100%;
                    overflow-wrap: anywhere;
                    word-break: break-word;
                    display: inline;
                }

                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }

                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: var(--primary); }
                }

                p { 
                    margin: 0;
                    font-size: 1.25rem;
                    color: var(--text-dim);
                    max-width: 600px;
                }

                .proofs { margin: 0; padding-left: 1.25rem; display: grid; gap: 0.35rem; }
                .proofs li { font-weight: 800; }

                .ctaRow {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }


                .identity {
                    margin-top: 2rem;
                    font-family: var(--font-mono);
                    font-weight: 700;
                    opacity: 0.6;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    .stage { height: 340px; }
                    h1 { font-size: clamp(2rem, 10vw, 3.5rem); }
                    .content { margin-top: 2rem; }
                    .typewriter {
                        white-space: normal;
                        border-right: none;
                        animation: none;
                        max-width: 100%;
                        overflow: visible;
                        overflow-wrap: anywhere;
                        word-break: break-word;
                        display: inline;
                    }
                }
                @media (max-width: 480px) {
                    .stage { height: 280px; }
                }
            </style>

            <section class="hero">
                <div class="stage" aria-label="Hero particle graph">
                    <particle-graph></particle-graph>
                </div>

                <div class="content">
                    <div class="kicker">
                        <ui-tag variant="primary">${status}</ui-tag>
                        <ui-tag>${role}</ui-tag>
                        <ui-tag>${location}</ui-tag>
                    </div>

                    <h1><span class="typewriter">${headline}</span></h1>
                    <p>${subheadline}</p>
                    ${proofs.length ? `
  <ul class="proofs">
    ${proofs.slice(0, 3).map(p => `<li>${p}</li>`).join('')}
  </ul>
` : ''}

                    <div class="ctaRow">
                        <ui-button variant="primary" href="${primary.href}">${primary.label}</ui-button>
                        <ui-button href="${secondary.href}">${secondary.label}</ui-button>
                    </div>

                    <div class="identity">${name} // SYSTEM.PROTO</div>
                </div>
            </section>
        `);

        // Avoid horizontal overflow for long headlines on wide screens.
        // Re-check after layout/fonts to prevent late overflow once web fonts load.
        const updateTypewriterWrapping = () => {
            try {
                const sr = this.shadowRoot;
                if (!sr || typeof sr.querySelector !== 'function') return;

                const h1 = sr.querySelector('h1');
                const tw = sr.querySelector('.typewriter');
                if (!h1 || !tw || !tw.classList || !h1.classList) return;

                const getH1Width = () => (typeof h1.getBoundingClientRect === 'function'
                    ? h1.getBoundingClientRect().width
                    : h1.clientWidth);

                const overflows = () => {
                    const w = getH1Width();
                    return w ? (tw.scrollWidth > w + 1) : false;
                };

                tw.classList.remove('is-wrapping');
                h1.classList.remove('is-tight', 'is-tighter');

                // Try keeping a single-line typewriter by tightening scale a bit.
                if (overflows()) {
                    h1.classList.add('is-tight');
                }
                if (overflows()) {
                    h1.classList.add('is-tighter');
                }

                // If it still doesn't fit, fall back to wrapping (no animation).
                if (overflows()) {
                    h1.classList.remove('is-tight', 'is-tighter');
                    tw.classList.add('is-wrapping');
                }
            } catch {
                // no-op
            }
        };

        updateTypewriterWrapping();
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(updateTypewriterWrapping);
        }
        if (typeof setTimeout === 'function') {
            setTimeout(updateTypewriterWrapping, 0);
        }
        if (typeof document !== 'undefined' && document.fonts?.ready) {
            document.fonts.ready.then(updateTypewriterWrapping).catch(() => {});
        }
    }
}

customElements.define('hero-banner', HeroBanner);
