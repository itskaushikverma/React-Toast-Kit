import { useContext } from 'react';
import { TOAST_CLASS_NAMES, TOAST_STACK_STYLE, getPositionStyle, getStackAlign } from '../constants/toast';
import { ToastContext } from '../context/ToastContext';
import { toastAnimationCss } from '../styles/toastAnimations';
import { ToastNotification } from './ToastNotification';

const ToastContainer = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast, startExitAnimation } = context;
  const positions = [...new Set(toasts.map((toast) => toast.position))];

  return (
    <>
      <style>{toastAnimationCss}</style>
      {positions.map((position) => (
        <div
          key={position}
          className={TOAST_CLASS_NAMES.container}
          style={{
            ...TOAST_STACK_STYLE,
            ...getPositionStyle(position),
            alignItems: getStackAlign(position),
            flexDirection: position.startsWith('bottom') ? 'column-reverse' : 'column',
          }}
        >
          {toasts
            .filter((toast) => toast.position === position)
            .map((toast) => (
              <ToastNotification
                key={toast.id}
                toast={toast}
                onDismiss={() => startExitAnimation(toast.id)}
                onRemove={() => removeToast(toast.id)}
              />
            ))}
        </div>
      ))}
    </>
  );
};

export { ToastContainer };
