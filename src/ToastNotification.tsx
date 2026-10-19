import { forwardRef, useEffect, useRef, useState } from 'react';
import { CircleCheckBig, OctagonAlert } from 'lucide-react';
import type { Toast } from './types';

type ToastNotificationProps = {
  toast: Toast;
  onDismiss: () => void;
  onRemove: () => void;
};

const ToastNotification = forwardRef<HTMLDivElement, ToastNotificationProps>(({ toast, onDismiss, onRemove }, ref) => {
  const { type, message, isExiting } = toast;
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number | null>(null);
  const onDismissRef = useRef(onDismiss);
  const onRemoveRef = useRef(onRemove);
  onDismissRef.current = onDismiss;
  onRemoveRef.current = onRemove;

  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') {
      setIsVisible(true);
      return;
    }

    animationRef.current = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timer = setTimeout(() => {
        onRemoveRef.current();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isExiting]);

  useEffect(() => {
    if (toast.duration && !isExiting) {
      const timer = setTimeout(() => {
        onDismissRef.current();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, isExiting]);

  const getToastStyle = () => {
    const baseStyle = {
      padding: '1rem',
      paddingInline: '1.5rem',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      width: 'max-content',
      transform: 'translateX(100%)',
      opacity: 0,
    };

    const typeStyles = {
      normal: {
        backgroundColor: '#161a30',
        color: '#ffffff',
      },
      success: {
        backgroundColor: '#388e3c',
        color: '#ffffff',
      },
      error: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
      },
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  const getIcon = () => {
    if (type === 'success') {
      return <CircleCheckBig className="h-5 w-5 text-white" />;
    }

    if (type === 'error') {
      return <OctagonAlert className="h-5 w-5 text-[#b91c1c]" />;
    }

    return null;
  };

  return (
    <div ref={ref} className={`toast-notification ${isExiting ? 'toast-slide-out' : isVisible ? 'toast-slide-in' : ''}`} style={getToastStyle()} onClick={onDismiss}>
      {getIcon()}
      <div className="toast-message" style={{ flex: 1 }}>
        {message}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          opacity: 0.7,
        }}
      >
        ×
      </button>
    </div>
  );
});
ToastNotification.displayName = 'ToastNotification';

export { ToastNotification };
