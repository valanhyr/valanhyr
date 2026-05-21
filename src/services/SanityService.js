/**
 * Mock Sanity Client for local simulation
 */
export class SanityService {
    static async fetch(query) {
        console.log(`[GROQ Simulation]: ${query}`);
        
        // Simulate network latency
        await new Promise(r => setTimeout(r, 600));

        const { default: data } = await import('../store/cv.json', { with: { type: 'json' } });

        // Basic GROQ-lite parser for *[_type == "xyz"]
        const match = query.match(/_type\s*==\s*['"]([^'"]+)['"]/);
        if (match) {
            const type = match[1];
            // Handle both flat array and nested object structure
            const source = Array.isArray(data) ? data : Object.values(data).flat();
            return source.filter(item => item._type === type);
        }

        return data;
    }

    static urlFor(source) {
        return new ImageUrlBuilder(source);
    }
}

class ImageUrlBuilder {
    constructor(source) {
        this.source = source;
        this.params = {};
    }

    width(w) { this.params.w = w; return this; }
    height(h) { this.params.h = h; return this; }
    
    url() {
        const assetRef = this.source?.asset?._ref || this.source;
        // Mock resolution: maps "image-abc-png" to "assets/abc.png"
        const filename = assetRef.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg');
        const query = Object.entries(this.params).map(([k, v]) => `${k}=${v}`).join('&');
        return `assets/${filename}${query ? '?' + query : ''}`;
    }
}
