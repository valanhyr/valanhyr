import '../test-setup.js';
import assert from 'node:assert';
import { test, describe } from 'node:test';
import { BaseComponent } from '../../src/components/BaseComponent.js';

describe('BaseComponent', () => {
    test('showSkeleton should set innerHTML with skeleton styles and provided html', () => {
        const component = new BaseComponent();
        const testHtml = '<div class="skeleton"></div>';
        
        component.showSkeleton(testHtml);
        
        const content = component.shadowRoot.innerHTML;
        assert.ok(content.includes('.skeleton {'));
        assert.ok(content.includes('@keyframes loading {'));
        assert.ok(content.includes(testHtml));
    });
});
