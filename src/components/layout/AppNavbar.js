import { BaseComponent } from '../BaseComponent.js';
import { store } from '../../store/state.js';

export class AppNavbar extends BaseComponent {
    constructor() {
        super();
        this._menuOpen = false;
        this._theme = 'light';
        this._nav = [];
        this._activeId = '';
        this._io = null;

        this._onClick = null;
        this._onChange = null;
        this._onKeyDown = null;
    }

    connectedCallback() {
        this.#initTheme();

        this._onClick = (ev) => {
            const btn = ev.target?.closest?.('button');
            if (btn?.classList?.contains('menuBtn')) {
                ev.preventDefault();
                this.#toggleMenu();
                return;
            }
            if (btn?.classList?.contains('closeBtn')) {
                ev.preventDefault();
                this.#closeMenu();
                return;
            }

            // Click outside drawer closes (backdrop).
            const backdrop = ev.target?.classList?.contains?.('backdrop') ? ev.target : null;
            if (backdrop) {
                this.#closeMenu();
                return;
            }

            const a = ev.target?.closest?.('a');
            if (!a) return;

            const href = a.getAttribute('href') || '';
            if (!href.startsWith('#') || href === '#') return;

            const id = href.slice(1);

            // Anchors don't work across Shadow DOM boundaries. Scroll manually.
            const home = globalThis.document?.querySelector?.('home-view');
            const target = globalThis.document?.getElementById?.(id)
                || home?.shadowRoot?.getElementById?.(id)
                || home?.shadowRoot?.querySelector?.(`#${id}`);

            if (!target) return;

            ev.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            globalThis.history?.replaceState?.(null, '', href);
            this.#closeMenu();
        };

        this._onChange = (ev) => {
            const input = ev.target?.closest?.('input[data-theme-toggle]');
            if (!input) return;
            this.#setTheme(input.checked ? 'dark' : 'light');
        };

        this._onKeyDown = (ev) => {
            if (ev.key === 'Escape') this.#closeMenu();
        };

        // In tests, shadowRoot is a minimal mock. Guard DOM APIs.
        this.shadowRoot?.addEventListener?.('click', this._onClick);
        this.shadowRoot?.addEventListener?.('change', this._onChange);
        globalThis.addEventListener?.('keydown', this._onKeyDown);

        this.bindState('cv', () => this.#render());
        this.#render();
    }

    disconnectedCallback() {
        this.shadowRoot?.removeEventListener?.('click', this._onClick);
        this.shadowRoot?.removeEventListener?.('change', this._onChange);
        globalThis.removeEventListener?.('keydown', this._onKeyDown);
        this._onClick = null;
        this._onChange = null;
        this._onKeyDown = null;

        this._io?.disconnect?.();
        this._io = null;

        // Ensure scroll isn't stuck if the component is removed.
        if (this._menuOpen) {
            this._menuOpen = false;
            if (globalThis.document?.body) globalThis.document.body.style.overflow = '';
        }
    }

    #setupScrollSpy() {
        if (!globalThis.document?.querySelector) return;
        if (!globalThis.IntersectionObserver) return;

        const home = globalThis.document.querySelector('home-view');
        const homeRoot = home?.shadowRoot;
        if (!homeRoot?.getElementById) return;

        const nav = Array.isArray(this._nav) ? this._nav : [];
        const ids = nav
            .map(i => String(i?.href || ''))
            .filter(h => h.startsWith('#') && h.length > 1)
            .map(h => h.slice(1));

        const uniqueIds = [...new Set(ids)];
        if (!uniqueIds.length) return;

        const targets = uniqueIds
            .map(id => ({ id, el: globalThis.document.getElementById?.(id) || homeRoot.getElementById(id) }))
            .filter(x => x.el);

        if (!targets.length) return;

        this._io?.disconnect?.();

        this._io = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .map(e => ({
                    id: targets.find(t => t.el === e.target)?.id,
                    top: e.boundingClientRect.top,
                    ratio: e.intersectionRatio
                }))
                .filter(v => v.id);

            if (!visible.length) return;

            visible.sort((a, b) => Math.abs(a.top) - Math.abs(b.top) || b.ratio - a.ratio);
            this.#setActiveId(visible[0].id);
        }, {
            root: null,
            threshold: [0.01, 0.1, 0.25, 0.5],
            rootMargin: '-35% 0px -55% 0px'
        });

        for (const t of targets) this._io.observe(t.el);
    }

    #setActiveId(id) {
        if (!id) return;
        if (this._activeId === id) return;
        this._activeId = id;

        const links = this.shadowRoot?.querySelectorAll?.('a[href^="#"]');
        if (!links) return;

        for (const a of links) {
            const href = a.getAttribute?.('href') || '';
            const isActive = href === `#${id}`;
            if (isActive) a.setAttribute?.('data-active', 'true');
            else a.removeAttribute?.('data-active');
        }
    }

    #openMenu() {
        if (this._menuOpen) return;
        this._menuOpen = true;
        if (globalThis.document?.body) globalThis.document.body.style.overflow = 'hidden';
        this.#render();
    }

    #closeMenu() {
        if (!this._menuOpen) return;
        this._menuOpen = false;
        if (globalThis.document?.body) globalThis.document.body.style.overflow = '';
        this.#render();
    }

    #toggleMenu() {
        if (this._menuOpen) this.#closeMenu();
        else this.#openMenu();
    }

    #initTheme() {
        const docEl = globalThis.document?.documentElement;
        if (!docEl) return;

        const stored = globalThis.localStorage?.getItem?.('theme');
        const prefersDark = !!globalThis.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

        const theme = stored || (prefersDark ? 'dark' : 'light');
        this._theme = theme;

        if (theme === 'dark') docEl.setAttribute('data-theme', 'dark');
        else docEl.removeAttribute('data-theme');
    }

    #setTheme(theme) {
        const docEl = globalThis.document?.documentElement;
        if (docEl) {
            if (theme === 'dark') docEl.setAttribute('data-theme', 'dark');
            else docEl.removeAttribute('data-theme');
        }

        globalThis.localStorage?.setItem?.('theme', theme);
        this._theme = theme;
        this.#render();
    }

    #render() {
        const cv = store.state.cv;

        const brand = cv?.basics?.name ?? 'CV.SYS';
        const role = cv?.basics?.role ?? 'Software Developer';
        const nav = Array.isArray(cv?.navigation) && cv.navigation.length
            ? cv.navigation
            : [
                { label: 'Home', href: '#top' },
                { label: 'About', href: '#about' },
                { label: 'Skills', href: '#skills' },
                { label: 'Experience', href: '#experience' },
                { label: 'Projects', href: '#projects' },
                { label: 'Education', href: '#education' },
                { label: 'Contact', href: '#contact' }
            ];

        const menuOpen = this._menuOpen;
        const themeIsDark = this._theme === 'dark';

        this._nav = nav;

        const themeToggle = `
            <label class="themeToggle" title="Toggle dark mode">
                <input data-theme-toggle type="checkbox" ${themeIsDark ? 'checked' : ''} aria-label="Toggle dark mode" />
                <span class="toggleText">Dark</span>
            </label>
        `;

        const themeToggleCompact = `
            <label class="themeToggle compact" title="Toggle dark mode">
                <input data-theme-toggle type="checkbox" ${themeIsDark ? 'checked' : ''} aria-label="Toggle dark mode" />
                <span class="toggleText">Dark</span>
            </label>
        `;

        this.render(`
            <style>
                header {
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    background: var(--bg);
                    border-bottom: var(--border-width) solid var(--text);
                }

                .wrap {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-md);
                    padding: 1rem;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                .brand {
                    display: grid;
                    gap: 0.15rem;
                }

                .brand .name {
                    font-weight: 900;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .brand .role {
                    font-family: monospace;
                    font-weight: 700;
                    opacity: 0.85;
                    font-size: 0.9rem;
                }

                .actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--space-sm);
                }

                .desktopNav {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                }

                a {
                    text-decoration: none;
                    color: var(--text);
                    border: var(--border-width) solid var(--text);
                    padding: 0.35rem 0.6rem;
                    background: var(--surface-2);
                    font-weight: 900;
                    font-family: monospace;
                }

                a:hover { background: var(--primary); color: var(--on-accent); }
                a:focus-visible { outline: var(--focus-ring); outline-offset: 2px; }

                a[data-active="true"] {
                    background: var(--surface-2);
                    box-shadow: inset 0 -8px 0 var(--secondary);
                }

                a[data-active="true"]:hover {
                    box-shadow: inset 0 -8px 0 var(--primary);
                }

                .themeToggle {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-family: monospace;
                    font-weight: 900;
                    cursor: pointer;
                    user-select: none;
                }

                .themeToggle input {
                    appearance: none;
                    width: 46px;
                    height: 26px;
                    border: var(--border-width) solid var(--text);
                    background: var(--surface-2);
                    box-shadow: 2px 2px 0px var(--text);
                    position: relative;
                    cursor: pointer;
                }

                .themeToggle input::after {
                    content: '';
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    width: 12px;
                    height: 12px;
                    background: var(--text);
                    transition: transform 140ms ease;
                }

                .themeToggle input:checked { background: var(--secondary); }
                .themeToggle input:checked::after { transform: translateX(20px); }

                .themeToggle.compact .toggleText { display: none; }

                .menuBtn {
                    display: none;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    border: var(--border-width) solid var(--text);
                    background: var(--surface-2);
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                    font-family: monospace;
                    font-weight: 900;
                    cursor: pointer;
                }

                .menuBtn:active {
                    transform: translate(-1px, -1px);
                    box-shadow: calc(var(--shadow-offset) + 1px) calc(var(--shadow-offset) + 1px) 0px var(--text);
                }

                .backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.45);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 160ms ease;
                    z-index: 99;
                }

                .backdrop[data-open="true"] {
                    opacity: 1;
                    pointer-events: auto;
                }

                .drawer {
                    position: absolute;
                    top: 0;
                    right: 0;
                    height: 100vh;
                    width: min(86vw, 320px);
                    background: var(--bg);
                    border-left: var(--border-width) solid var(--text);
                    box-shadow: calc(-1 * var(--shadow-offset)) 0 0 var(--text);
                    transform: translateX(110%);
                    transition: transform 180ms ease;
                    display: grid;
                    grid-template-rows: auto 1fr;
                }

                .backdrop[data-open="true"] .drawer { transform: translateX(0); }

                .drawerTop {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-md);
                    padding: 1rem;
                    border-bottom: var(--border-width) solid var(--text);
                }

                .drawerTitle {
                    font-family: monospace;
                    font-weight: 900;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                }

                .drawerActions {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }

                .closeBtn {
                    width: 44px;
                    height: 44px;
                    border: var(--border-width) solid var(--text);
                    background: var(--surface-2);
                    box-shadow: var(--shadow-offset) var(--shadow-offset) 0px var(--text);
                    font-family: monospace;
                    font-weight: 900;
                    cursor: pointer;
                }

                .mobileNav {
                    padding: 1rem;
                    display: grid;
                    gap: 0.6rem;
                    align-content: start;
                }

                .mobileNav a {
                    display: block;
                    padding: 0.75rem 0.75rem;
                    border-width: var(--border-width);
                    background: var(--surface-2);
                }

                .mobileNav a:hover {
                    background: var(--secondary);
                    color: var(--on-accent);
                }

                @media (max-width: 650px) {
                    .desktopNav { display: none; }
                    .menuBtn { display: inline-flex; }
                }
            </style>

            <header>
                <div class="wrap">
                    <div class="brand">
                        <div class="name">${brand}</div>
                        <div class="role">${role}</div>
                    </div>

                    <div class="actions">
                        ${themeToggle}

                        <button class="menuBtn" type="button" aria-label="Menu" aria-expanded="${menuOpen ? 'true' : 'false'}" aria-controls="mobileMenu">☰</button>

                        <nav class="desktopNav" aria-label="Primary">
                            ${nav.map(item => `<a href="${item.href}">${item.label}</a>`).join('')}
                        </nav>
                    </div>
                </div>

                <div class="backdrop" data-open="${menuOpen ? 'true' : 'false'}" aria-hidden="${menuOpen ? 'false' : 'true'}">
                    <aside class="drawer" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Menu">
                        <div class="drawerTop">
                            <div class="drawerTitle">Menu</div>
                            <div class="drawerActions">
                                ${themeToggleCompact}
                                <button class="closeBtn" type="button" aria-label="Close menu">✕</button>
                            </div>
                        </div>
                        <nav class="mobileNav" aria-label="Primary mobile">
                            ${nav.map(item => `<a href="${item.href}">${item.label}</a>`).join('')}
                        </nav>
                    </aside>
                </div>
            </header>
        `);

        // After render, attach/refresh scrollspy (home-view exists in DOM).
        globalThis.setTimeout?.(() => this.#setupScrollSpy(), 0);
    }
}
customElements.define('app-navbar', AppNavbar);
