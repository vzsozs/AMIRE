// src/components/Modal.jsx
import React from 'react';
import './Modal.css'; // Létre fogjuk hozni a CSS-t

function Modal({ isOpen, onClose, children }) {
  // Ha a modal nincs nyitva, nem renderelünk semmit
  if (!isOpen) {
    return null;
  }

  return (
    // A külső div az overlay, amire kattintva bezárul a modal
    <div className="modal-overlay" onClick={onClose}>
      {/* A belső div maga a modal tartalma, itt megállítjuk a kattintás továbbterjedését */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Bezárás gomb a jobb felső sarokban */}
        <button className="modal-close-button" onClick={onClose}>
          &times; {/* Ez egy 'x' karakter */}
        </button>
        {/* Ide fog bekerülni a modal tényleges tartalma (pl. az űrlapunk) */}
        {children}
      </div>
    </div>
  );
}

export default Modal;