// src/context/ToastProvider.jsx
import React, { useState } from 'react';
import { ToastContext } from './ToastContext'; // Importáljuk a Context-et

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, duration);
  };

  // A Context value már csak a 'toasts' állapotot és a 'showToast' függvényt tartalmazza
  const value = {
    toasts,
    showToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};