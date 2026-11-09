import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function withType(type, durationOrOptions) {
  const options =
    typeof durationOrOptions === 'number'
      ? { duration: durationOrOptions }
      : (durationOrOptions ?? {});
  return { ...options, type };
}

/**
 * Reads the toast API from the nearest `ToastProvider`.
 * @returns {{
 *   normal: (message: string, durationOrOptions?: number | object) => string,
 *   success: (message: string, durationOrOptions?: number | object) => string,
 *   error: (message: string, durationOrOptions?: number | object) => string,
 * }}
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    normal: (message, durationOrOptions) =>
      context.addToast(message, withType('normal', durationOrOptions)),
    success: (message, durationOrOptions) =>
      context.addToast(message, withType('success', durationOrOptions)),
    error: (message, durationOrOptions) =>
      context.addToast(message, withType('error', durationOrOptions)),
  };
};
