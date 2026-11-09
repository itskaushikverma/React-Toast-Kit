import { createContext } from 'react';

/** @type {import('react').Context<import('../types.js').ToastContextValue | null>} */
export const ToastContext = createContext(null);
