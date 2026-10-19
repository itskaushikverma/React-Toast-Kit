export type ToastType = 'normal' | 'success' | 'error';

export type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  createdAt: number;
  isExiting?: boolean;
};

export type ToastContextValue = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  startExitAnimation: (id: string) => void;
};
