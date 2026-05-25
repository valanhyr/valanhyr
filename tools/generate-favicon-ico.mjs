import fs from 'node:fs';
import path from 'node:path';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function hexToRgba(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error('Bad hex: ' + hex);
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 255 };
}

function makeImage(size) {
  const buf = Buffer.alloc(size * size * 4);
  return {
    size,
    buf,
    set(x, y, c) {
      if (x < 0 || y < 0 || x >= size || y >= size) return;
      const i = (y * size + x) * 4;
      buf[i + 0] = c.r;
      buf[i + 1] = c.g;
      buf[i + 2] = c.b;
      buf[i + 3] = c.a;
    }
  };
}

function stampDisk(img, cx, cy, rad, col) {
  const r2 = rad * rad;
  for (let y = Math.floor(cy - rad); y <= Math.ceil(cy + rad); y++) {
    for (let x = Math.floor(cx - rad); x <= Math.ceil(cx + rad); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) img.set(x, y, col);
    }
  }
}

function drawLine(img, x0, y0, x1, y1, thickness, col) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x0 + dx * t;
    const y = y0 + dy * t;
    stampDisk(img, x, y, thickness / 2, col);
  }
}

function insideRoundedRect(x, y, x0, y0, w, h, r) {
  const x1 = x0 + w - 1;
  const y1 = y0 + h - 1;
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;

  const rx = r;
  const ry = r;

  // Central bands
  if (x >= x0 + rx && x <= x1 - rx) return true;
  if (y >= y0 + ry && y <= y1 - ry) return true;

  // Corner circles
  const corners = [
    { cx: x0 + rx, cy: y0 + ry },
    { cx: x1 - rx, cy: y0 + ry },
    { cx: x0 + rx, cy: y1 - ry },
    { cx: x1 - rx, cy: y1 - ry }
  ];
  for (const c of corners) {
    const dx = x - c.cx;
    const dy = y - c.cy;
    if (dx * dx + dy * dy <= rx * rx) return true;
  }
  return false;
}

function drawRoundedBorder(img, x0, y0, w, h, r, t, colBorder, colBg) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const outer = insideRoundedRect(x, y, x0, y0, w, h, r);
      if (!outer) continue;
      const inner = insideRoundedRect(x, y, x0 + t, y0 + t, w - 2 * t, h - 2 * t, Math.max(0, r - t));
      img.set(x, y, inner ? colBg : colBorder);
    }
  }
}

function drawC(img, size, col) {
  // Approximate the SVG "C" using a polyline with a bit of curvature.
  const s = size;
  const pts = [
    [Math.round(s * 0.50), Math.round(s * 0.33)],
    [Math.round(s * 0.40), Math.round(s * 0.33)],
    [Math.round(s * 0.34), Math.round(s * 0.42)],
    [Math.round(s * 0.34), Math.round(s * 0.58)],
    [Math.round(s * 0.40), Math.round(s * 0.67)],
    [Math.round(s * 0.50), Math.round(s * 0.67)]
  ];
  const thickness = clamp(Math.round(s * 0.10), 2, 6);
  for (let i = 0; i < pts.length - 1; i++) {
    drawLine(img, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], thickness, col);
  }
}

function drawV(img, size, col) {
  const s = size;
  const thickness = clamp(Math.round(s * 0.10), 2, 6);
  const xL = Math.round(s * 0.62);
  const xM = Math.round(s * 0.55);
  const xR = Math.round(s * 0.48);
  const yT = Math.round(s * 0.33);
  const yB = Math.round(s * 0.67);

  drawLine(img, xL, yT, xM, yB, thickness, col);
  drawLine(img, xM, yB, xR, yT, thickness, col);
}

function renderFrame(size) {
  const bg = hexToRgba('#08080c');
  const mint = hexToRgba('#00ffcc');
  const rose = hexToRgba('#ff0055');

  const img = makeImage(size);

  // Fill background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) img.set(x, y, bg);
  }

  // Outer tile border (rounded)
  const rOuter = clamp(Math.round(size * 0.22), 3, 14);
  const t = clamp(Math.round(size * 0.08), 2, 5);
  drawRoundedBorder(img, t, t, size - 2 * t, size - 2 * t, rOuter - 2, Math.max(1, Math.floor(t / 1.5)), mint, bg);

  // Letters
  drawC(img, size, mint);
  drawV(img, size, rose);

  return img;
}

function dibFromRgba(img) {
  const w = img.size;
  const h = img.size;

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);      // biSize
  header.writeInt32LE(w, 4);        // biWidth
  header.writeInt32LE(h * 2, 8);    // biHeight (incl AND mask)
  header.writeUInt16LE(1, 12);      // biPlanes
  header.writeUInt16LE(32, 14);     // biBitCount
  header.writeUInt32LE(0, 16);      // biCompression (BI_RGB)
  header.writeUInt32LE(w * h * 4, 20); // biSizeImage
  header.writeInt32LE(0, 24);       // biXPelsPerMeter
  header.writeInt32LE(0, 28);       // biYPelsPerMeter
  header.writeUInt32LE(0, 32);      // biClrUsed
  header.writeUInt32LE(0, 36);      // biClrImportant

  // Pixel data: BGRA, bottom-up
  const pixels = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const src = ((y * w) + x) * 4;
      const dstY = (h - 1 - y);
      const dst = ((dstY * w) + x) * 4;
      const r = img.buf[src + 0];
      const g = img.buf[src + 1];
      const b = img.buf[src + 2];
      const a = img.buf[src + 3];
      pixels[dst + 0] = b;
      pixels[dst + 1] = g;
      pixels[dst + 2] = r;
      pixels[dst + 3] = a;
    }
  }

  // AND mask (all opaque => 0 bits)
  const rowBytes = Math.ceil(w / 32) * 4;
  const mask = Buffer.alloc(rowBytes * h, 0x00);

  return Buffer.concat([header, pixels, mask]);
}

function writeIco(frames, outPath) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);

  let offset = 6 + entries.length;
  const images = [];

  frames.forEach((frame, idx) => {
    const dib = dibFromRgba(frame);
    images.push(dib);

    const w = frame.size;
    const h = frame.size;

    const e = idx * 16;
    entries.writeUInt8(w === 256 ? 0 : w, e + 0);
    entries.writeUInt8(h === 256 ? 0 : h, e + 1);
    entries.writeUInt8(0, e + 2); // colorcount
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4);  // planes
    entries.writeUInt16LE(32, e + 6); // bitcount
    entries.writeUInt32LE(dib.length, e + 8);
    entries.writeUInt32LE(offset, e + 12);

    offset += dib.length;
  });

  const ico = Buffer.concat([header, entries, ...images]);
  fs.writeFileSync(outPath, ico);
}

const repoRoot = path.resolve(process.cwd());
const out = path.join(repoRoot, 'favicon.ico');

const frames = [16, 32, 48].map(renderFrame);
writeIco(frames, out);

console.log('Wrote', out);
