import { store } from './state.js';

/**
 * Loads CV content from src/store/cv.json in the browser and stores it in store.state.cv.
 * Kept out of component connectedCallback() so Node tests can import components without network/file IO.
 */
export async function loadCv() {
    try {
        const res = await fetch('./src/store/cv.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Failed to load cv.json: ${res.status}`);
        const cv = await res.json();
        store.state.cv = cv;
        return cv;
    } catch (err) {
        // Keep UI usable even if JSON fails to load.
        store.state.cv = null;
        return null;
    }
}
