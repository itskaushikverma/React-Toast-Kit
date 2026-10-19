/** @vitest-environment node */

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider } from '../src';

describe('server rendering', () => {
  it('renders the provider without calling browser animation APIs', () => {
    const requestAnimationFrame = vi.fn(() => {
      throw new Error('requestAnimationFrame must not run during server render');
    });
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrame);

    const html = renderToString(createElement(ToastProvider, null, createElement('p', null, 'server child')));

    expect(html).toContain('server child');
    expect(html).toContain('toast-container');
    expect(html).toContain('@keyframes slideIn');
    expect(html).toContain('@keyframes slideOut');
    expect(html).not.toContain('toast-notification');
    expect(requestAnimationFrame).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
