import React, { useEffect, useRef, useState } from 'react';
import { ToastContext } from './ToastContext';
import { ToastNotification } from './ToastNotification';

const ToastContainer = () => {
  const context = React.useContext(ToastContext);
  const [position] = useState('top-right');
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!context) {
    return null;
  }

  const { toasts, removeToast, startExitAnimation } = context;

  const getPositionStyle = () => {
    const positions = {
      'top-right': { top: '1rem', right: '1rem' },
      'top-left': { top: '1rem', left: '1rem' },
      'bottom-right': { bottom: '1rem', right: '1rem' },
      'bottom-left': { bottom: '1rem', left: '1rem' },
    };
    return positions[position as keyof typeof positions];
  };

  const animationStyles = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .toast-slide-in {
      animation: slideIn 0.5s ease forwards;
    }
    
    .toast-slide-out {
      animation: slideOut 0.5s ease forwards;
    }
  `;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        zIndex: 9999,
        ...getPositionStyle(),
        display: 'flex',
        flexDirection: 'column',
        alignItems: position.endsWith('right') ? 'flex-end' : 'flex-start',
        gap: '0.5rem',
      }}
    >
      <style>{animationStyles}</style>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onDismiss={() => startExitAnimation(toast.id)} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

export { ToastContainer };
