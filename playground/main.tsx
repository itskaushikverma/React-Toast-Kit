import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider, useToast } from '../src';
import './index.css';

function Demo() {
  const { toast, success, error } = useToast();

  return (
    <div style={{ padding: '1.5rem', display: 'flex', gap: '0.75rem' }}>
      <button type="button" onClick={() => toast('Normal notification')}>
        Show toast
      </button>
      <button type="button" onClick={() => success('Operation successful')}>
        Success
      </button>
      <button type="button" onClick={() => error('Something went wrong')}>
        Error
      </button>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root');
}

createRoot(root).render(
  <StrictMode>
    <ToastProvider>
      <Demo />
    </ToastProvider>
  </StrictMode>,
);
