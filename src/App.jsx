import { useState } from 'react';
import { Info } from 'lucide-react';
import { ToastPosition, ToastProvider, useToast } from './index.js';

const POSITIONS = [
  [ToastPosition.TopLeft, 'Top left'],
  [ToastPosition.TopCenter, 'Top center'],
  [ToastPosition.TopRight, 'Top right'],
  [ToastPosition.BottomLeft, 'Bottom left'],
  [ToastPosition.BottomRight, 'Bottom right'],
];

const ACTIONS = [
  {
    label: 'Normal',
    hint: 'Copy enabled',
    run: (toast) => toast.normal('Normal toast', { showCopyButton: true }),
  },
  {
    label: 'Success',
    hint: '4s duration',
    run: (toast) => toast.success('Operation successful', 4000),
  },
  {
    label: 'Error',
    hint: 'Alert style',
    run: (toast) => toast.error('Something went wrong'),
  },
  {
    label: 'Custom',
    hint: 'Colors + icon',
    run: (toast) =>
      toast.normal('Custom toast', {
        duration: 5000,
        icon: Info,
        backgroundColor: '#0f766e',
        textColor: '#ecfdf5',
        showCopyButton: true,
      }),
  },
  {
    label: 'No close',
    hint: 'Hide × button',
    run: (toast) => toast.normal('No close icon', { showCloseIcon: false }),
  },
  {
    label: 'Copy on',
    hint: 'Show copy button',
    run: (toast) => toast.normal('With copy button', { showCopyButton: true }),
  },
];

const demoCss = `
  .demo-shell {
    --ink: #10233f;
    --muted: #5b6b82;
    --line: rgba(16, 35, 63, 0.12);
    --panel: rgba(255, 255, 255, 0.72);
    --accent: #0f766e;
    min-height: 100vh;
    color: var(--ink);
    font-family: Figtree, sans-serif;
    background:
      radial-gradient(ellipse 70% 50% at 12% 18%, rgba(15, 118, 110, 0.18), transparent 55%),
      radial-gradient(ellipse 55% 45% at 88% 12%, rgba(14, 116, 144, 0.16), transparent 50%),
      linear-gradient(160deg, #eef5f8 0%, #e7eef4 48%, #dfe9ef 100%);
  }
  .demo-content {
    max-width: 920px;
    margin: 0 auto;
    padding: clamp(2rem, 6vw, 4.5rem) clamp(1.25rem, 4vw, 2rem) 3rem;
  }
  .demo-logo {
    width: clamp(4.25rem, 12vw, 5.75rem);
    height: clamp(4.25rem, 12vw, 5.75rem);
    margin: 0 0 1.15rem;
    border-radius: 18px;
  }
  .demo-brand {
    font-family: Syne, sans-serif;
    font-weight: 800;
    font-size: clamp(2.6rem, 8vw, 4.6rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
    margin: 0 0 0.85rem;
  }
  .demo-brand span { color: var(--accent); }
  .demo-lead {
    max-width: 34rem;
    margin: 0;
    color: var(--muted);
    font-size: clamp(1.05rem, 2.4vw, 1.2rem);
    line-height: 1.55;
  }
  .demo-section { margin-top: clamp(2rem, 5vw, 3rem); }
  .demo-label {
    display: block;
    margin-bottom: 0.75rem;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .demo-positions {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.65rem;
    max-width: 420px;
  }
  .demo-positions button:nth-child(4) { grid-column: 1; }
  .demo-positions button:nth-child(5) { grid-column: 3; }
  .demo-pos,
  .demo-action {
    border: 1px solid var(--line);
    background: var(--panel);
    color: var(--ink);
    cursor: pointer;
  }
  .demo-pos {
    border-radius: 12px;
    padding: 0.85rem 0.7rem;
  }
  .demo-pos.is-active {
    background: var(--accent);
    border-color: var(--accent);
    color: #ecfdf5;
  }
  .demo-pos strong {
    display: block;
    font-size: 0.92rem;
    font-weight: 600;
  }
  .demo-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }
  .demo-action {
    text-align: left;
    border-radius: 14px;
    padding: 1rem;
  }
  .demo-action strong {
    display: block;
    font-family: Syne, sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 0.2rem;
  }
  .demo-action span {
    color: var(--muted);
    font-size: 0.86rem;
  }
  @media (max-width: 560px) {
    .demo-positions {
      max-width: none;
      grid-template-columns: 1fr 1fr;
    }
    .demo-positions button:nth-child(2),
    .demo-positions button:nth-child(4),
    .demo-positions button:nth-child(5) { grid-column: auto; }
    .demo-positions button:nth-child(3) { grid-column: 1 / -1; }
  }
`;

function Controls({ position, onPositionChange }) {
  const toast = useToast();

  return (
    <div className="demo-shell">
      <style>{demoCss}</style>
      <main className="demo-content">
        <img
          className="demo-logo"
          src="/logo.svg"
          alt="React Toast Kit logo"
          width="92"
          height="92"
        />
        <h1 className="demo-brand">
          React
          <br />
          Toast <span>Kit</span>
        </h1>
        <p className="demo-lead">
          Trigger notifications, switch anchor corners, and preview copy, close, and custom styles
          in one place.
        </p>

        <section className="demo-section" aria-label="Toast position">
          <span className="demo-label">Position</span>
          <div className="demo-positions">
            {POSITIONS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`demo-pos${position === value ? ' is-active' : ''}`}
                onClick={() => onPositionChange(value)}
                aria-pressed={position === value}
              >
                <strong>{label}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="demo-section" aria-label="Toast triggers">
          <span className="demo-label">Try a toast</span>
          <div className="demo-actions">
            {ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className="demo-action"
                onClick={() => action.run(toast)}
              >
                <strong>{action.label}</strong>
                <span>{action.hint}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [position, setPosition] = useState(ToastPosition.TopRight);

  return (
    <ToastProvider position={position}>
      <Controls position={position} onPositionChange={setPosition} />
    </ToastProvider>
  );
}
