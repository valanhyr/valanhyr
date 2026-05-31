import './src/components/layout/AppNavbar.js';
import './src/components/views/HomeView.js';

import './src/components/ui/UiButton.js';
import './src/components/ui/UiCard.js';
import './src/components/ui/UiTag.js';

import './src/components/graph/ParticleGraph.js';
import './src/components/sections/HeroBanner.js';
import './src/components/sections/CvAbout.js';
import './src/components/sections/CvPlatform.js';
import './src/components/sections/CvSkills.js';
import './src/components/sections/CvExperience.js';
import './src/components/sections/CvProjects.js';
import './src/components/sections/CvEducation.js';
import './src/components/sections/CvContact.js';

import { loadCv } from './src/store/loadCv.js';

const app = document.getElementById('app');

async function init() {
    // Load data early so header/hero can render from JSON.
    const cv = await loadCv();
    updateStructuredData(cv);

    app.innerHTML = `
        <div id="custom-cursor"></div>
        <app-navbar></app-navbar>
        <home-view></home-view>
    `;

    initCursor();
}

function updateStructuredData(cv) {
    try {
        const doc = globalThis.document;
        if (!doc) return;

        const el = doc.getElementById('structured-data');
        if (!el) return;

        const canonical = doc.querySelector('link[rel="canonical"]')?.href
            || (globalThis.location ? `${globalThis.location.origin}${globalThis.location.pathname}` : '');

        const baseUrl = String(canonical || '').replace(/#.*$/, '');
        if (!baseUrl) return;

        const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || undefined;

        const name = cv?.basics?.name && cv.basics.name !== 'Your Name'
            ? cv.basics.name
            : (doc.title || 'CV');

        const jobTitle = cv?.basics?.role || undefined;

        const sameAs = Array.isArray(cv?.links)
            ? cv.links.map(l => String(l?.href || '')).filter(h => /^https?:\/\//i.test(h))
            : [];

        const emailHref = cv?.contact?.email
            ? `mailto:${cv.contact.email}`
            : (Array.isArray(cv?.links)
                ? cv.links.map(l => String(l?.href || '')).find(h => /^mailto:/i.test(h))
                : null);

        const jsonLd = {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'Person',
                    '@id': `${baseUrl}#person`,
                    name,
                    ...(jobTitle ? { jobTitle } : {}),
                    url: baseUrl,
                    ...(description ? { description } : {}),
                    ...(emailHref ? { email: emailHref } : {}),
                    ...(sameAs.length ? { sameAs } : {}),
                    mainEntityOfPage: { '@id': `${baseUrl}#webpage` }
                },
                {
                    '@type': 'ProfilePage',
                    '@id': `${baseUrl}#webpage`,
                    url: baseUrl,
                    name: doc.title || name,
                    ...(description ? { description } : {}),
                    isPartOf: { '@id': `${baseUrl}#website` },
                    about: { '@id': `${baseUrl}#person` }
                },
                {
                    '@type': 'WebSite',
                    '@id': `${baseUrl}#website`,
                    url: baseUrl,
                    name: doc.title || name,
                    ...(description ? { description } : {}),
                    publisher: { '@id': `${baseUrl}#person` }
                }
            ]
        };

        el.textContent = JSON.stringify(jsonLd, null, 2);
    } catch {
        // no-op
    }
}

function initCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Reactive interaction for all interactive elements
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        const isInteractive = 
            target.closest('ui-button') || 
            target.closest('a') || 
            target.closest('button') || 
            target.closest('input') ||
            (target.closest('ui-card') && target.closest('ui-card').hasAttribute('interactive'));
        
        if (isInteractive) {
            document.body.classList.add('cursor-hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        document.body.classList.remove('cursor-hover');
    });
}

init();
