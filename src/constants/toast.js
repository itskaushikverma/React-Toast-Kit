export const DEFAULT_TOAST_TYPE = 'normal';
export const DEFAULT_TOAST_DURATION_MS = 4000;
export const EXIT_DURATION_MS = 500;
export const TOAST_STACK_POSITION = 'top-right';

export const TOAST_CLASS_NAMES = {
  container: 'toast-container',
  notification: 'toast-notification',
  message: 'toast-message',
  slideIn: 'toast-slide-in',
  slideOut: 'toast-slide-out',
};

export const SUCCESS_ICON_CLASS_NAME = 'h-5 w-5 text-white';
export const ERROR_ICON_CLASS_NAME = 'h-5 w-5 text-[#b91c1c]';

export const TOAST_BASE_STYLE = {
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
  'top-right': { top: '1rem', right: '1rem' },
  'top-left': { top: '1rem', left: '1rem' },
  'bottom-right': { bottom: '1rem', right: '1rem' },
  'bottom-left': { bottom: '1rem', left: '1rem' },
};

export function getPositionStyle(position) {
  return POSITION_STYLES[position];
}
