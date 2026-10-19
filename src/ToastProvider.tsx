import React, { useCallback, useState } from 'react';
import { ToastContainer } from './ToastContainer';
import { ToastContext } from './ToastContext';
import type { Toast, ToastType } from './types';

export const ToastProvider = ({ children }: { children?: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const startExitAnimation = useCallback((id: string) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, startExitAnimation }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
