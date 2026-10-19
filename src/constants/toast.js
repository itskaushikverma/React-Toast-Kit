export const DEFAULT_TOAST_TYPE = 'normal';
export const DEFAULT_TOAST_DURATION_MS = 4000;
export const EXIT_DURATION_MS = 500;
export const DEFAULT_TOAST_FONT_FAMILY = 'sans-serif';

export const ToastPosition = Object.freeze({
  TopLeft: 'top-left',
  TopCenter: 'top-center',
  TopRight: 'top-right',
  BottomLeft: 'bottom-left',
  BottomRight: 'bottom-right',
});

export const DEFAULT_TOAST_POSITION = ToastPosition.TopRight;

export const TOAST_CLASS_NAMES = {
  container: 'toast-container',
  notification: 'toast-notification',
  message: 'toast-message',
  slideIn: 'toast-slide-in',
  slideOut: 'toast-slide-out',
};

export const TOAST_BASE_STYLE = {
  padding: '1rem',
  paddingInline: '1.5rem',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  width: 'max-content',
  fontFamily: DEFAULT_TOAST_FONT_FAMILY,
  fontSize: '1rem',
  fontWeight: 500,
};

export const TOAST_TYPE_STYLES = {
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

export const TOAST_STACK_STYLE = {
  position: 'fixed',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

export const POSITION_STYLES = {
  [ToastPosition.TopRight]: { top: '1rem', right: '1rem' },
  [ToastPosition.TopLeft]: { top: '1rem', left: '1rem' },
  [ToastPosition.TopCenter]: { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
  [ToastPosition.BottomRight]: { bottom: '1rem', right: '1rem' },
  [ToastPosition.BottomLeft]: { bottom: '1rem', left: '1rem' },
};

export function resolveToastPosition(position) {
  return POSITION_STYLES[position] ? position : DEFAULT_TOAST_POSITION;
}

export function getPositionStyle(position) {
  return POSITION_STYLES[resolveToastPosition(position)];
}

export function getStackAlign(position) {
  const resolved = resolveToastPosition(position);
  if (resolved === ToastPosition.TopCenter) {
    return 'center';
  }
  return resolved.endsWith('right') ? 'flex-end' : 'flex-start';
}

export function getToastMotion(position) {
  const resolved = resolveToastPosition(position);
  if (resolved === ToastPosition.TopCenter) {
    return { x: '0px', y: '-100%' };
  }
  if (resolved.endsWith('left')) {
    return { x: '-100%', y: '0px' };
  }
  return { x: '100%', y: '0px' };
}
