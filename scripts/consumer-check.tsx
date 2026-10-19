import type { ReactNode } from 'react';
import { ToastContext, ToastProvider, useToast, type Toast, type ToastOptions, type ToastType } from 'react-toast-kit';

export function Example({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Inside />
    </ToastProvider>
  );
}

function Inside() {
  const api = useToast();
  const options: ToastOptions = { type: 'success', duration: 4000 };
  const kind: ToastType = 'error';
  api.toast('Hello', options);
  api.success('Ok', 1000);
  api.error('Bad');
  const first: Toast | undefined = api.toasts[0];
  if (first) {
    api.dismiss(first.id);
  }
  void kind;
  void ToastContext;
  return null;
}
