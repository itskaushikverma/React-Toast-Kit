import React from 'react';
import type { ToastContextValue } from './types';

export const ToastContext = React.createContext<ToastContextValue | null>(null);
