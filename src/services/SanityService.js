/**
 * SanityService
 *
 * - Default: local "Mock Sanity" backed by src/store/cv.json (keeps repo zero-dependency + works offline)
 * - If window.__SANITY__ is defined (projectId/dataset/apiVersion), it fetches from the real Sanity HTTP API.
 */

const DEFAULT_API_VERSION = '2024-01-01';

export class SanityService {
    static isConfigured() {
        return !!this.#getConfig();
    }

    static async fetch(query) {
        const cfg = this.#getConfig();
        if (cfg) return this.#httpFetch(query, cfg);
        return this.#mockFetch(query);
    }

    static urlFor(source) {
        return new ImageUrlBuilder(source, this.#getConfig());
    }

    static #getConfig() {
        // Configure in index.html before main.js:
        // window.__SANITY__ = { projectId, dataset, apiVersion, useCdn, token? }
        const cfg = globalThis?.__SANITY__;
        if (!cfg || typeof cfg !== 'object') return null;

        const projectId = String(cfg.projectId || '').trim();
        const dataset = String(cfg.dataset || '').trim() || 'production';
        const apiVersion = String(cfg.apiVersion || '').trim() || DEFAULT_API_VERSION;
        const useCdn = cfg.useCdn !== false; // default true
        const token = typeof cfg.token === 'string' && cfg.token.trim() ? cfg.token.trim() : null;

        if (!projectId) return null;
        return { projectId, dataset, apiVersion, useCdn, token };
    }

    static async #httpFetch(query, cfg) {
        if (typeof globalThis.fetch !== 'function') {
            throw new Error('SanityService: global fetch() is not available');
        }

        const host = cfg.useCdn
            ? `${cfg.projectId}.apicdn.sanity.io`
            : `${cfg.projectId}.api.sanity.io`;

        const url = new URL(`https://${host}/v${cfg.apiVersion}/data/query/${cfg.dataset}`);
        url.searchParams.set('query', query);

        const headers = {};
        if (cfg.token) headers.Authorization = `Bearer ${cfg.token}`;

        let res;
        try {
            res = await fetch(url, { headers });
        } catch (err) {
            // Browser CORS blocks often surface as TypeError("Failed to fetch") with no status/body.
            const msg = String(err?.message || err || '');
            if (err instanceof TypeError || /failed to fetch/i.test(msg)) {
                throw new Error('Sanity query failed: network/CORS error. Add your site origin (e.g. http://localhost:3000) to Sanity API > CORS origins.');
            }
            throw err;
        }

        if (!res.ok) {
            const body = await res.text().catch(() => '');
            throw new Error(`Sanity query failed (${res.status}): ${body || res.statusText}`);
        }

        const json = await res.json();
        return json?.result;
    }

    static async #mockFetch(query) {
        console.log(`[GROQ Simulation]: ${query}`);

        // Simulate latency only in the browser.
        if (globalThis?.window?.document) {
            await new Promise(r => setTimeout(r, 600));
        }

        const { default: data } = await import('../store/cv.json', { with: { type: 'json' } });

        // Basic GROQ-lite parser for *[_type == "xyz"]
        const match = query.match(/_type\s*==\s*['"]([^'"]+)['"]/);
        if (match) {
            const type = match[1];
            const source = Array.isArray(data) ? data : Object.values(data).flat();
            return source.filter(item => item?._type === type);
        }

        return data;
    }
}

class ImageUrlBuilder {
    constructor(source, cfg) {
        this.source = source;
        this.cfg = cfg;
        this.params = {};
    }

    width(w) { this.params.w = w; return this; }
    height(h) { this.params.h = h; return this; }

    url() {
        const assetRef = this.source?.asset?._ref || this.source;
        if (!assetRef || typeof assetRef !== 'string') return '';

        // Real Sanity image refs look like: image-<assetId>-<width>x<height>-<format>
        // Example: image-abc123def-800x600-png
        if (this.cfg) {
            const m = assetRef.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
            if (m) {
                const assetId = m[1];
                const dims = m[2];
                const format = m[3];
                const base = `https://cdn.sanity.io/images/${this.cfg.projectId}/${this.cfg.dataset}/${assetId}-${dims}.${format}`;
                const url = new URL(base);
                if (this.params.w) url.searchParams.set('w', String(this.params.w));
                if (this.params.h) url.searchParams.set('h', String(this.params.h));
                url.searchParams.set('auto', 'format');
                return url.toString();
            }
        }

        // Mock/local fallback: maps "image-portfolio-png" -> "assets/portfolio.png"
        const filename = assetRef
            .replace(/^image-/, '')
            .replace(/-\d+x\d+-/g, '-')
            .replace(/-png$/, '.png')
            .replace(/-jpg$/, '.jpg')
            .replace(/-jpeg$/, '.jpeg')
            .replace(/-webp$/, '.webp');

        const query = Object.entries(this.params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&');

        return `assets/${filename}${query ? '?' + query : ''}`;
    }
}
