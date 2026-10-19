export const toastAnimationCss = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
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
