import { useCallback, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function withType(type, durationOrOptions) {
  const options = typeof durationOrOptions === 'number' ? { duration: durationOrOptions } : (durationOrOptions ?? {});
  return { ...options, type };
}

/**
 * Reads the toast API from the nearest `ToastProvider`.
 * @returns {{
 *   toast: (message: string, options?: object) => string,
 *   success: (message: string, durationOrOptions?: number | object) => string,
 *   error: (message: string, durationOrOptions?: number | object) => string,
 *   dismiss: (id: string) => void,
 *   toasts: object[],
 * }}
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = useCallback(
    (message, options) => context.addToast(message, options ?? {}),
    [context],
  );

  return {
    toast,
    success: (message, durationOrOptions) => context.addToast(message, withType('success', durationOrOptions)),
    error: (message, durationOrOptions) => context.addToast(message, withType('error', durationOrOptions)),
    dismiss: context.startExitAnimation,
    toasts: context.toasts,
  };
};
