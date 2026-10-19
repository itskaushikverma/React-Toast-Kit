import { useContext } from 'react';
import { TOAST_CLASS_NAMES, TOAST_STACK_POSITION, TOAST_STACK_STYLE, getPositionStyle } from '../constants/toast';
import { ToastContext } from '../context/ToastContext';
import { toastAnimationCss } from '../styles/toastAnimations';
import { ToastNotification } from './ToastNotification';

const ToastContainer = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast, startExitAnimation } = context;

  return (
    <div
      className={TOAST_CLASS_NAMES.container}
      style={{
        ...TOAST_STACK_STYLE,
        ...getPositionStyle(TOAST_STACK_POSITION),
        alignItems: TOAST_STACK_POSITION.endsWith('right') ? 'flex-end' : 'flex-start',
      }}
    >
      <style>{toastAnimationCss}</style>
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onDismiss={() => startExitAnimation(toast.id)}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { ToastContainer };
