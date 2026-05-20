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
    await loadCv();

    app.innerHTML = `
        <div id="custom-cursor"></div>
        <app-navbar></app-navbar>
        <home-view></home-view>
    `;

    initCursor();
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
