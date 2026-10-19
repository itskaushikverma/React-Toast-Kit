import { useCallback, useState } from 'react';
import {
  DEFAULT_TOAST_DURATION_MS,
  DEFAULT_TOAST_FONT_FAMILY,
  DEFAULT_TOAST_POSITION,
  DEFAULT_TOAST_TYPE,
  resolveToastPosition,
} from '../constants/toast';
import { ToastContext } from '../context/ToastContext';
import { ToastContainer } from './ToastContainer';

export const ToastProvider = ({
  children,
  position = DEFAULT_TOAST_POSITION,
  duration = DEFAULT_TOAST_DURATION_MS,
  fontFamily = DEFAULT_TOAST_FONT_FAMILY,
  showCloseIcon = true,
  hideOnClick = true,
}) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    (message, options = {}) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        id,
        message,
        type: options.type || DEFAULT_TOAST_TYPE,
        duration: options.duration ?? duration,
        position: resolveToastPosition(options.position || position),
        icon: options.icon,
        textColor: options.textColor,
        backgroundColor: options.backgroundColor,
        fontFamily: options.fontFamily || fontFamily,
        showCloseIcon: options.showCloseIcon ?? showCloseIcon,
        hideOnClick: options.hideOnClick ?? hideOnClick,
        createdAt: Date.now(),
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [duration, fontFamily, hideOnClick, position, showCloseIcon],
  );

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
