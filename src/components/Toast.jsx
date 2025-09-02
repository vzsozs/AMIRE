// src/components/Toast.jsx
import React from 'react';
import { useToast } from '../context/useToast'; // EZ A JAVÍTÁS
import './Toast.css'; // Létre fogjuk hozni

function Toast() {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast-message toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;