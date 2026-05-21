import { BaseComponent } from '../BaseComponent.js';
import { SanityService } from '../../services/SanityService.js';

export class CvProjects extends BaseComponent {
    async connectedCallback() {
        this.#renderSkeleton();
        try {
            const projects = await SanityService.fetch('*[_type == "project"]');
            this.#render(projects);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            this.#render([]);
        }
    }

    #renderSkeleton() {
        this.render(`
            <style>
                :host { display: block; }
                section { scroll-margin-top: 96px; }
                .skeleton {
                    background: var(--surface-2);
                    height: 440px;
                    border-radius: var(--radius);
                    animation: pulse 1.5s infinite;
                    border: 1px solid var(--glass-border);
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 0.3; }
                    100% { opacity: 0.6; }
                }
            </style>
            <section id="projects">
                <div class="skeleton"></div>
            </section>
        `);
    }

    #render(items = []) {

        this.render(`
            <style>
                :host { display: block; }
                section { scroll-margin-top: 96px; }
                
                .top {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: var(--space-md);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-md);
                }

                h2 {
                    margin: 0;
                    font-size: 1.4rem;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }

                .hint {
                    font-family: var(--font-mono);
                    font-weight: 700;
                    opacity: 0.5;
                    font-size: 0.8rem;
                }

                .accordion {
                    display: flex;
                    width: 100%;
                    height: 440px;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .project-card {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                    border: 1px solid var(--glass-border);
                    background: var(--surface-2);
                    border-radius: var(--radius);
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }

                .project-card.active {
                    flex: 5;
                    background: var(--surface);
                    box-shadow: 15px 15px 30px var(--shadow-dark), 
                                0 0 15px rgba(0, 255, 204, 0.1);
                    border-color: rgba(0, 255, 204, 0.3);
                }

                .accordion:hover .project-card {
                    flex: 1;
                    box-shadow: none;
                    border-color: var(--glass-border);
                }

                .accordion .project-card:hover {
                    flex: 5;
                    background: var(--surface);
                    box-shadow: 15px 15px 30px var(--shadow-dark), 
                                0 0 15px rgba(0, 255, 204, 0.1);
                    border-color: rgba(0, 255, 204, 0.3);
                }

                .card-bg {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(145deg, var(--surface), var(--surface-3));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: height 0.6s var(--ease);
                    position: relative;
                    z-index: 1;
                }

                .accordion:not(:hover) .project-card.active .card-bg,
                .project-card:hover .card-bg {
                    height: 30%;
                    border-bottom: 1px solid var(--glass-border);
                }

                .accordion:not(:hover) .project-card.active .card-bg::after,
                .project-card:hover .card-bg::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.05));
                }

                .card-label {
                    position: absolute;
                    bottom: 1.5rem;
                    left: 1.5rem;
                    font-family: var(--font-mono);
                    font-weight: 800;
                    background: var(--primary);
                    color: var(--on-accent);
                    padding: 4px 12px;
                    border-radius: 4px;
                    transition: all 0.5s var(--ease);
                    z-index: 20;
                    white-space: nowrap;
                    font-size: 0.65rem;
                    box-shadow: 0 0 15px var(--primary);
                    pointer-events: none;
                }

                .accordion:not(:hover) .project-card.active .card-label,
                .project-card:hover .card-label {
                    bottom: auto;
                    top: 1.25rem;
                    left: 1.25rem;
                    transform: scale(1.1);
                }

                .card-content {
                    padding: 1.5rem;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.4s var(--ease);
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    overflow: hidden;
                    pointer-events: none;
                }

                .accordion:not(:hover) .project-card.active .card-content,
                .project-card:hover .card-content {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }

                h3 { margin: 0; font-weight: 800; font-size: 1.4rem; color: var(--text); }
                p { margin: 0; font-size: 0.95rem; line-height: 1.5; color: var(--text-dim); }
                
                .stack {
                    margin-top: auto;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                }

                .links { 
                    display: flex; 
                    gap: 0.75rem; 
                    margin-top: 1rem; 
                }

                @media (max-width: 768px) {
                    .accordion { flex-direction: column; height: auto; }
                    .project-card { height: 100px; flex: none !important; }
                    .accordion:not(:hover) .project-card.active, .project-card:hover { height: 320px; }
                    .card-label { transform: none !important; bottom: auto; top: 1rem; right: 1rem; left: auto; }
                }
            </style>

            <section id="projects" aria-label="Projects">
                <ui-card>
                    <div class="top">
                        <h2>Projects</h2>
                        <div class="hint">CV // System Portfolio</div>
                    </div>

                    <div class="accordion">
                        ${items.length ? items.map((p, index) => {
                            const title = p.title || p.name || 'Project';
                            const imageUrl = p.mainImage ? SanityService.urlFor(p.mainImage).width(400).url() : null;
                            const bgStyle = imageUrl ? `style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"` : '';

                            return `
                                <div class="project-card ${index === 0 ? 'active' : ''}" onclick="this.parentElement.querySelectorAll('.project-card').forEach(c => c.classList.remove('active')); this.classList.add('active')">
                                    <div class="card-label">PROJECT ${String(index + 1).padStart(2, '0')}</div>
                                    <div class="card-bg" ${bgStyle}></div>
                                    <div class="card-content">
                                        <h3>${title}</h3>
                                        <p>${p.description ?? ''}</p>
                                        ${Array.isArray(p.stack) && p.stack.length ? `
                                            <div class="stack">
                                                ${p.stack.map(s => `<ui-tag variant="secondary">${s}</ui-tag>`).join('')}
                                            </div>
                                        ` : ''}
                                        <div class="links">
                                            ${(Array.isArray(p.links) ? p.links : []).map(l => `<ui-button href="${l.href}" target="_blank">${l.label}</ui-button>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('') : `
                            <div class="project-card active">
                                <div class="card-label">PROTO.SITE</div>
                                <div class="card-bg"></div>
                                <div class="card-content">
                                    <h3>Cyberpunk Portfolio</h3>
                                    <p>High-performance CV built with Vanilla Web Components and Neumorphic design.</p>
                                    <div class="stack">
                                        <ui-tag variant="secondary">Vanilla JS</ui-tag>
                                        <ui-tag variant="secondary">CSS3</ui-tag>
                                        <ui-tag variant="secondary">MCP</ui-tag>
                                    </div>
                                </div>
                            </div>
                        `}
                    </div>
                </ui-card>
            </section>
        `);
    }
}

customElements.define('cv-projects', CvProjects);
