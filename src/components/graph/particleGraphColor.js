function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function parseCssColor(input) {
  const s = String(input ?? '').trim();
  if (!s) return null;

  if (s.startsWith('#')) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b, a: 1 };
    }

    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      if ([r, g, b].some(Number.isNaN)) return null;
      return { r, g, b, a: 1 };
    }

    return null;
  }

  const match = /^rgba?\(\s*([^)]+)\s*\)$/i.exec(s);
  if (!match) return null;

  const parts = match[1].split(',').map(part => part.trim());
  if (parts.length !== 3 && parts.length !== 4) return null;

  const r = Number(parts[0]);
  const g = Number(parts[1]);
  const b = Number(parts[2]);
  if ([r, g, b].some(v => !Number.isFinite(v))) return null;

  const a = parts.length === 4 ? Number(parts[3]) : 1;
  if (!Number.isFinite(a)) return null;

  return {
    r: clamp(Math.round(r), 0, 255),
    g: clamp(Math.round(g), 0, 255),
    b: clamp(Math.round(b), 0, 255),
    a: clamp(a, 0, 1)
  };
}

export function luminance(rgb) {
  const srgb = [rgb.r, rgb.g, rgb.b].map(v => v / 255);
  const lin = srgb.map(c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function isLightColor(rgb, threshold = 0.6) {
  return luminance(rgb) > threshold;
}
