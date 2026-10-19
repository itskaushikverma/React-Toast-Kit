import { forwardRef, isValidElement, useEffect, useRef } from 'react';
import { CircleCheckBig, OctagonAlert } from 'lucide-react';
import {
  EXIT_DURATION_MS,
  TOAST_BASE_STYLE,
  TOAST_CLASS_NAMES,
  TOAST_TYPE_STYLES,
  getToastMotion,
} from '../constants/toast';

const ICON_STYLE = { width: 20, height: 20, flexShrink: 0 };

function renderIcon(type, icon) {
  if (icon === false || icon === null) {
    return null;
  }

  if (isValidElement(icon)) {
    return icon;
  }

  if (typeof icon === 'function' || (icon && typeof icon === 'object' && typeof icon.render === 'function')) {
    const Icon = icon;
    return <Icon style={ICON_STYLE} aria-hidden="true" />;
  }

  if (type === 'success') {
    return <CircleCheckBig style={ICON_STYLE} aria-hidden="true" />;
  }

  if (type === 'error') {
    return <OctagonAlert style={ICON_STYLE} aria-hidden="true" />;
  }

  return null;
}

const ToastNotification = forwardRef(({ toast, onDismiss, onRemove }, ref) => {
  const { type, message, isExiting, textColor, backgroundColor, fontFamily, showCloseIcon, hideOnClick } = toast;
  const onDismissRef = useRef(onDismiss);
  const onRemoveRef = useRef(onRemove);
  onDismissRef.current = onDismiss;
  onRemoveRef.current = onRemove;

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

  const motion = getToastMotion(toast.position);
  const motionClass = isExiting ? TOAST_CLASS_NAMES.slideOut : TOAST_CLASS_NAMES.slideIn;

  return (
    <div
      ref={ref}
      className={`${TOAST_CLASS_NAMES.notification} ${motionClass}`}
      style={{
        ...TOAST_BASE_STYLE,
        ...TOAST_TYPE_STYLES[type],
        fontFamily,
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(textColor ? { color: textColor } : {}),
        '--toast-from-x': motion.x,
        '--toast-from-y': motion.y,
        cursor: hideOnClick ? 'pointer' : 'default',
      }}
      onClick={hideOnClick ? onDismiss : undefined}
    >
      {renderIcon(type, toast.icon)}
      <div className={TOAST_CLASS_NAMES.message} style={{ flex: 1 }}>
        {message}
      </div>
      {showCloseIcon ? (
        <button
          type="button"
          aria-label="Close"
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
            font: 'inherit',
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
});
ToastNotification.displayName = 'ToastNotification';

export { ToastNotification };
