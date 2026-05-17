import './src/components/layout/AppNavbar.js';
import './src/components/views/HomeView.js';

import './src/components/ui/UiButton.js';
import './src/components/ui/UiCard.js';

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
        <app-navbar></app-navbar>
        <home-view></home-view>
    `;
}

init();
