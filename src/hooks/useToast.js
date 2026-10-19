import { useCallback, useContext } from 'react';
import { DEFAULT_TOAST_DURATION_MS, DEFAULT_TOAST_TYPE } from '../constants/toast';
import { ToastContext } from '../context/ToastContext';

/**
 * Reads the toast API from the nearest `ToastProvider`.
 * @returns {{
 *   toast: (message: string, options?: import('../types.js').ToastOptions) => void,
 *   success: (message: string, duration?: number) => void,
 *   error: (message: string, duration?: number) => void,
 *   dismiss: (id: string) => void,
 *   toasts: import('../types.js').Toast[],
 * }}
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = useCallback(
    (message, options = { type: DEFAULT_TOAST_TYPE, duration: DEFAULT_TOAST_DURATION_MS }) => {
      context.addToast(message, options?.type || DEFAULT_TOAST_TYPE, options?.duration);
    },
    [context],
  );

  return {
    toast,
    success: (message, duration) => context.addToast(message, 'success', duration),
    error: (message, duration) => context.addToast(message, 'error', duration),
    dismiss: context.startExitAnimation,
    toasts: context.toasts,
  };
};
