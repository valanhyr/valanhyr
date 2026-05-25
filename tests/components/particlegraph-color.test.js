import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseCssColor,
  luminance,
  isLightColor
} from '../../src/components/graph/particleGraphColor.js';

test('particleGraphColor: parseCssColor supports hex and rgb/rgba', () => {
  assert.deepEqual(parseCssColor('#fff'), { r: 255, g: 255, b: 255, a: 1 });
  assert.deepEqual(parseCssColor('#08080c'), { r: 8, g: 8, b: 12, a: 1 });

  assert.deepEqual(parseCssColor('rgb(10, 20, 30)'), { r: 10, g: 20, b: 30, a: 1 });
  assert.deepEqual(parseCssColor('rgba(10, 20, 30, 0.25)'), { r: 10, g: 20, b: 30, a: 0.25 });
});

test('particleGraphColor: luminance + isLightColor behave sensibly', () => {
  const dark = { r: 8, g: 8, b: 12, a: 1 };
  const light = { r: 245, g: 245, b: 247, a: 1 };

  assert.ok(luminance(dark) < luminance(light));
  assert.equal(isLightColor(dark), false);
  assert.equal(isLightColor(light), true);
});
