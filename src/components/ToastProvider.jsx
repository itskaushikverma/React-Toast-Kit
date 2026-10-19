import { useCallback, useState } from 'react';
import { DEFAULT_TOAST_DURATION_MS } from '../constants/toast';
import { ToastContext } from '../context/ToastContext';
import { ToastContainer } from './ToastContainer';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type, duration = DEFAULT_TOAST_DURATION_MS) => {
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

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const startExitAnimation = useCallback((id) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast)));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, startExitAnimation }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
