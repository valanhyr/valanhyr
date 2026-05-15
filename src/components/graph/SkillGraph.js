import { BaseComponent } from '../BaseComponent.js';

export class SkillGraph extends BaseComponent {
    connectedCallback() {
        const skills = [
            { id: 1, name: 'JS', x: 100, y: 100 },
            { id: 2, name: 'CSS', x: 300, y: 150 },
            { id: 3, name: 'HTML', x: 200, y: 300 }
        ];

        this.render(`
            <style>
                svg { width: 100%; height: 500px; border: 4px solid black; background: #eee; }
                .node { fill: white; stroke: black; stroke-width: 4px; cursor: pointer; }
                .node:hover { fill: var(--primary, yellow); }
                text { font-family: monospace; font-weight: bold; pointer-events: none; }
                line { stroke: black; stroke-width: 2px; }
            </style>
            <svg viewBox="0 0 500 500">
                ${skills.map(s => `<rect class="node" x="${s.x}" y="${s.y}" width="60" height="60" />`).join('')}
                ${skills.map(s => `<text x="${s.x + 10}" y="${s.y + 35}">${s.name}</text>`).join('')}
            </svg>
        `);
    }
}
customElements.define('skill-graph', SkillGraph);
