import { forwardRef, useEffect, useRef, useState } from 'react';
import { CircleCheckBig, OctagonAlert } from 'lucide-react';
import {
  ERROR_ICON_CLASS_NAME,
  EXIT_DURATION_MS,
  SUCCESS_ICON_CLASS_NAME,
  TOAST_BASE_STYLE,
  TOAST_CLASS_NAMES,
  TOAST_TYPE_STYLES,
} from '../constants/toast';

const ToastNotification = forwardRef(({ toast, onDismiss, onRemove }, ref) => {
  const { type, message, isExiting } = toast;
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
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
      }, EXIT_DURATION_MS);

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

  const motionClass = isExiting ? TOAST_CLASS_NAMES.slideOut : isVisible ? TOAST_CLASS_NAMES.slideIn : '';

  return (
    <div
      ref={ref}
      className={`${TOAST_CLASS_NAMES.notification} ${motionClass}`}
      style={{ ...TOAST_BASE_STYLE, ...TOAST_TYPE_STYLES[type] }}
      onClick={onDismiss}
    >
      {type === 'success' ? <CircleCheckBig className={SUCCESS_ICON_CLASS_NAME} /> : null}
      {type === 'error' ? <OctagonAlert className={ERROR_ICON_CLASS_NAME} /> : null}
      <div className={TOAST_CLASS_NAMES.message} style={{ flex: 1 }}>
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
