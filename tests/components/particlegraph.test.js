import '../test-setup.js';
import test from 'node:test';
import assert from 'node:assert/strict';

import { ParticleGraph } from '../../src/components/graph/ParticleGraph.js';

test('ParticleGraph Component (smoke)', async (t) => {
  const pg = new ParticleGraph();

  await t.test('should register custom element', () => {
    assert.ok(global.customElements.get('particle-graph'));
  });

  await t.test('connectedCallback should not throw with basic mocks', () => {
    // Minimal global mocks required by ParticleGraph
    global.ResizeObserver = class { observe() {} disconnect() {} };
    global.getComputedStyle = () => ({
      getPropertyValue: (k) => (k === '--bg' ? '#08080c' : '')
    });
    global.document.hidden = false;
    global.document.addEventListener = () => {};
    global.document.removeEventListener = () => {};
    global.performance = { now: () => 0 };
    global.requestAnimationFrame = () => 1;
    global.cancelAnimationFrame = () => {};
    global.devicePixelRatio = 1;

    // Patch render so querySelector returns our wrap/canvas
    const events = [];
    const ctx = {
      setTransform() {},
      clearRect() {},
      fillRect() {},
      beginPath() {},
      arc() {},
      fill() {},
      stroke() {},
      moveTo() {},
      lineTo() {},
      save() {},
      restore() {},
      setLineDash() {},
      fillText() {},
      strokeText() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      createRadialGradient: () => ({ addColorStop() {} })
    };
    const canvas = {
      width: 0,
      height: 0,
      style: {},
      getContext: () => ctx,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 500, height: 300 }),
      addEventListener: (type) => events.push(type),
      removeEventListener: () => {}
    };
    const wrap = {
      getBoundingClientRect: () => ({ width: 500, height: 300 })
    };

    pg.getBoundingClientRect = () => ({ width: 500, height: 300 });

    pg.render = (html) => {
      pg.shadowRoot.innerHTML = html;
      pg.shadowRoot.querySelector = (sel) => {
        if (sel === '.wrap') return wrap;
        if (sel === 'canvas') return canvas;
        return null;
      };
    };

    pg.connectedCallback();

    assert.ok(pg.shadowRoot.innerHTML.includes('<canvas'));
    assert.ok(events.includes('mousemove'));
    assert.ok(events.includes('mouseleave'));
  });

  await t.test('disconnectedCallback should not throw', () => {
    pg.disconnectedCallback();
  });
});
