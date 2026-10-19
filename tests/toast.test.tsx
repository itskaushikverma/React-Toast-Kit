import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from '../src';

function Controls() {
  const { toast, success, error, dismiss, toasts } = useToast();

  return (
    <div>
      <button onClick={() => toast('Normal notification')}>show-normal</button>
      <button onClick={() => toast('Custom normal', { type: 'normal', duration: 1000 })}>show-custom</button>
      <button onClick={() => toast('Typed success', { type: 'success' })}>show-typed</button>
      <button onClick={() => success('Operation successful')}>show-success</button>
      <button onClick={() => success('Quick success', 1500)}>show-success-duration</button>
      <button onClick={() => error('Something went wrong')}>show-error</button>
      <button onClick={() => error('Sticky error', 0)}>show-sticky</button>
      <button onClick={() => dismiss(toasts[0]?.id ?? '')}>dismiss-first</button>
      <p data-testid="count">{toasts.length}</p>
      <p data-testid="meta">
        {toasts.map((item) => `${item.type}:${item.duration}${item.isExiting ? ':exiting' : ''}`).join('|')}
      </p>
    </div>
  );
}

function App() {
  const [tick, setTick] = useState(0);

  return (
    <ToastProvider>
      <button onClick={() => setTick((value) => value + 1)}>rerender</button>
      <span data-testid="tick">{tick}</span>
      <Controls />
    </ToastProvider>
  );
}

function toastByMessage(message: string) {
  const node = screen.getByText(message).closest('.toast-notification');
  if (!node) {
    throw new Error(`No toast rendered for "${message}"`);
  }
  return node as HTMLElement;
}

function expectInlineStyle(element: Element, snippets: string[]) {
  const style = element.getAttribute('style') ?? '';
  for (const snippet of snippets) {
    expect(style).toContain(snippet);
  }
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe('ToastProvider and useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws when useToast is called outside ToastProvider', () => {
    function Bare() {
      useToast();
      return null;
    }

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow(/useToast must be used within a ToastProvider/);
    consoleError.mockRestore();
  });

  it('renders children and an empty top-right container', () => {
    render(
      <ToastProvider>
        <p>child text</p>
      </ToastProvider>,
    );

    expect(screen.getByText('child text')).toBeInTheDocument();

    const container = document.querySelector('.toast-container');
    expect(container).not.toBeNull();
    expectInlineStyle(container as Element, [
      'position: fixed',
      'z-index: 9999',
      'top: 1rem',
      'right: 1rem',
      'display: flex',
      'flex-direction: column',
      'align-items: flex-end',
      'gap: 0.5rem',
    ]);
    expect(container?.querySelector('style')?.textContent).toContain('@keyframes slideIn');
    expect(container?.querySelector('style')?.textContent).toContain('@keyframes slideOut');
    expect(container?.querySelector('style')?.textContent).toContain('animation: slideIn 0.5s ease forwards');
    expect(container?.querySelector('style')?.textContent).toContain('animation: slideOut 0.5s ease forwards');
  });

  it('creates normal, success, and error toasts with the existing defaults', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'show-normal' }));
    fireEvent.click(screen.getByRole('button', { name: 'show-success' }));
    fireEvent.click(screen.getByRole('button', { name: 'show-error' }));
    fireEvent.click(screen.getByRole('button', { name: 'show-typed' }));

    expect(screen.getByTestId('count')).toHaveTextContent('4');
    expect(screen.getByTestId('meta')).toHaveTextContent('normal:4000|success:4000|error:4000|success:4000');

    const normal = toastByMessage('Normal notification');
    const success = toastByMessage('Operation successful');
    const error = toastByMessage('Something went wrong');

    expectInlineStyle(normal, [
      'padding: 1rem',
      'padding-inline: 1.5rem',
      'border-radius: 5px',
      'display: flex',
      'align-items: center',
      'gap: 0.75rem',
      'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)',
      'width: max-content',
      'transform: translateX(100%)',
      'opacity: 0',
      'background-color: rgb(22, 26, 48)',
      'color: rgb(255, 255, 255)',
    ]);
    expectInlineStyle(success, ['background-color: rgb(56, 142, 60)', 'color: rgb(255, 255, 255)']);
    expectInlineStyle(error, ['background-color: rgb(254, 226, 226)', 'color: rgb(185, 28, 28)']);
    expect(normal.querySelector('svg')).toBeNull();
    expect(success.querySelector('svg')?.getAttribute('class')).toContain('h-5 w-5 text-white');
    expect(error.querySelector('svg')?.getAttribute('class')).toContain('h-5 w-5 text-[#b91c1c]');
    const closeButton = within(normal).getByRole('button', { name: '×' });
    expect(closeButton).toHaveAttribute('type', 'button');
    expect(closeButton.style.cursor).toBe('pointer');
    expect(closeButton.style.opacity).toBe('0.7');
    expect(closeButton.style.backgroundColor || closeButton.style.background).toBeTruthy();
    expect(normal.querySelector('.toast-message')?.getAttribute('style')).toContain('flex: 1');

    expect(normal.className).not.toContain('toast-slide-in');
    await advance(16);
    expect(normal.className).toContain('toast-slide-in');
    expect(success.className).toContain('toast-slide-in');
    expect(error.className).toContain('toast-slide-in');
  });

  it('dismisses from the toast, the close button, and dismiss(id), then removes the node after 500ms', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'show-normal' }));
    fireEvent.click(toastByMessage('Normal notification'));
    expect(screen.getByTestId('meta').textContent).toContain('normal:4000:exiting');
    expect(toastByMessage('Normal notification').className).toContain('toast-slide-out');
    await advance(499);
    expect(screen.queryByText('Normal notification')).toBeInTheDocument();
    await advance(1);
    expect(screen.queryByText('Normal notification')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show-success' }));
    fireEvent.click(within(toastByMessage('Operation successful')).getByRole('button', { name: '×' }));
    expect(toastByMessage('Operation successful').className).toContain('toast-slide-out');
    await advance(500);
    expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show-error' }));
    fireEvent.click(screen.getByRole('button', { name: 'dismiss-first' }));
    expect(toastByMessage('Something went wrong').className).toContain('toast-slide-out');
    await advance(500);
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('auto-dismisses after the default and custom durations', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'show-custom' }));
    await advance(999);
    expect(screen.getByTestId('meta').textContent).toBe('normal:1000');
    await advance(1);
    expect(screen.getByTestId('meta').textContent).toContain('exiting');
    await advance(500);
    expect(screen.queryByText('Custom normal')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show-success-duration' }));
    await advance(1500);
    expect(toastByMessage('Quick success').className).toContain('toast-slide-out');
    await advance(500);
    expect(screen.queryByText('Quick success')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'show-normal' }));
    await advance(3999);
    expect(screen.getByTestId('meta').textContent).toBe('normal:4000');
    await advance(1);
    expect(screen.getByTestId('meta').textContent).toContain('exiting');
  });

  it('keeps the original duration when a parent re-render happens', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'show-custom' }));
    await advance(600);
    fireEvent.click(screen.getByRole('button', { name: 'rerender' }));
    expect(screen.getByTestId('tick')).toHaveTextContent('1');
    await advance(399);
    expect(screen.getByTestId('meta').textContent).toBe('normal:1000');
    await advance(1);
    expect(screen.getByTestId('meta').textContent).toContain('exiting');

    await advance(200);
    fireEvent.click(screen.getByRole('button', { name: 'rerender' }));
    await advance(299);
    expect(screen.queryByText('Custom normal')).toBeInTheDocument();
    await advance(1);
    expect(screen.queryByText('Custom normal')).not.toBeInTheDocument();
  });

  it('leaves a toast on screen when duration is 0', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'show-sticky' }));
    await advance(8000);
    expect(screen.getByText('Sticky error')).toBeInTheDocument();
    expect(screen.getByTestId('meta').textContent).toBe('error:0');
  });
});
