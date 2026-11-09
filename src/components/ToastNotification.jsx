import { isValidElement, useEffect, useRef, useState } from 'react';
import { Check, CircleCheckBig, Copy, OctagonAlert } from 'lucide-react';
import {
  EXIT_DURATION_MS,
  TOAST_BASE_STYLE,
  TOAST_CLASS_NAMES,
  TOAST_TYPE_STYLES,
  getToastMotion,
} from '../constants/toast';

const ICON_STYLE = { width: 20, height: 20, flexShrink: 0 };
const ACTION_ICON_STYLE = { width: 18, height: 18, flexShrink: 0 };

const ACTION_BUTTON_STYLE = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'inherit',
  opacity: 0.7,
  font: 'inherit',
  padding: 0,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function renderIcon(type, icon) {
  if (icon === false || icon === null) {
    return null;
  }

  if (isValidElement(icon)) {
    return icon;
  }

  if (
    typeof icon === 'function' ||
    (icon && typeof icon === 'object' && typeof icon.render === 'function')
  ) {
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

function ToastNotification({ toast, onDismiss, onRemove }) {
  const {
    type,
    message,
    isExiting,
    textColor,
    backgroundColor,
    fontFamily,
    showCloseIcon,
    showCopyButton,
    hideOnClick,
  } = toast;
  const [copied, setCopied] = useState(false);
  const onDismissRef = useRef(onDismiss);
  const onRemoveRef = useRef(onRemove);

  useEffect(() => {
    onDismissRef.current = onDismiss;
    onRemoveRef.current = onRemove;
  }, [onDismiss, onRemove]);

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

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(message ?? ''));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    onDismiss();
  };

  const motion = getToastMotion(toast.position);
  const motionClass = isExiting ? TOAST_CLASS_NAMES.slideOut : TOAST_CLASS_NAMES.slideIn;

  return (
    <div
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
      <div
        className={TOAST_CLASS_NAMES.message}
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflowWrap: 'anywhere',
        }}
      >
        {message}
      </div>
      {showCopyButton ? (
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy'}
          onClick={handleCopy}
          style={ACTION_BUTTON_STYLE}
        >
          {copied ? (
            <Check style={ACTION_ICON_STYLE} aria-hidden="true" />
          ) : (
            <Copy style={ACTION_ICON_STYLE} aria-hidden="true" />
          )}
        </button>
      ) : null}
      {showCloseIcon ? (
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          style={{
            ...ACTION_BUTTON_STYLE,
            fontSize: '1.5rem',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}

export { ToastNotification };
