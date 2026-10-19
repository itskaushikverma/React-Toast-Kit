import React, { useCallback } from 'react';
import { ToastContext } from './ToastContext';
import type { Toast, ToastOptions } from './types';

export type UseToastReturn = {
  toast: (message: string, options?: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  dismiss: (id: string) => void;
  toasts: Toast[];
};

export const useToast = (): UseToastReturn => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = useCallback(
    (message: string, options: ToastOptions = { type: 'normal', duration: 4000 }) => {
      context.addToast(message, options?.type || 'normal', options?.duration);
    },
    [context],
  );

  return {
    toast,
    success: (message: string, duration?: number) => context.addToast(message, 'success', duration),
    error: (message: string, duration?: number) => context.addToast(message, 'error', duration),
    dismiss: context.startExitAnimation,
    toasts: context.toasts,
  };
};
