export const toastAnimationCss = `
    @keyframes slideIn {
      from {
        transform: translate(var(--toast-from-x, 100%), var(--toast-from-y, 0));
        opacity: 0;
      }
      to {
        transform: translate(0, 0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translate(0, 0);
        opacity: 1;
      }
      to {
        transform: translate(var(--toast-from-x, 100%), var(--toast-from-y, 0));
        opacity: 0;
      }
    }
    
    .toast-slide-in {
      animation: slideIn 0.5s ease forwards;
    }
    
    .toast-slide-out {
      animation: slideOut 0.5s ease forwards;
    }
  `;
