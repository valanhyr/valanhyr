import { store } from './state.js';
import { SanityService } from '../services/SanityService.js';

const LOCAL_CV_PATH = './src/store/cv.json';

function normalizeCvDocs(docs) {
    const source = Array.isArray(docs) ? docs : [];
    const byType = (t) => source.filter(d => d?._type === t);
    const first = (t) => byType(t)[0] || null;

    return {
        basics: first('basics'),
        hero: first('hero'),
        platform: first('platform'),
        about: first('about'),
        contact: first('contact'),
        navigation: byType('navItem'),
        links: byType('link'),
        education: byType('education'),
        experience: byType('experience'),
        projects: byType('project'),
        skills: byType('skill'),
        // Used by ParticleGraph: expects cv.graph.palette / cv.graph.groups.
        graph: first('graphSettings')
    };
}

/**
 * Loads CV content and stores it in store.state.cv.
 *
 * - If window.__SANITY__ is configured, fetches from real Sanity.
 * - Otherwise falls back to src/store/cv.json.
 *
 * Kept out of component connectedCallback() so Node tests can import components without IO.
 */
export async function loadCv() {
    try {
        let cv;

        if (SanityService.isConfigured()) {
            const query = `{
  "basics": *[_type == "basics"][0],
  "hero": *[_type == "hero"][0],
  "platform": *[_type == "platform"][0],
  "about": *[_type == "about"][0],
  "contact": *[_type == "contact"][0],
  "navigation": *[_type == "navItem"]|order(order asc, _id asc),
  "links": *[_type == "link"]|order(order asc, _id asc),
  "education": *[_type == "education"]|order(order asc, _id asc),
  "experience": *[_type == "experience"]|order(order asc, _id asc),
  "projects": *[_type == "project"]|order(order asc, _id asc),
  "skills": *[_type == "skill"]|order(group asc, name asc),
  "graph": *[_type == "graphSettings"][0]
}`;

            cv = await SanityService.fetch(query);
        } else {
            const res = await fetch(LOCAL_CV_PATH, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`Failed to load cv.json: ${res.status}`);
            const docs = await res.json();
            cv = normalizeCvDocs(docs);
        }

        store.state.cv = cv;
        return cv;
    } catch (err) {
        // Keep UI usable even if CMS/JSON fails to load.
        store.state.cv = null;
        return null;
    }
}
