// src/components/EmptyState.jsx
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa'; // Alapértelmezett ikon
import './EmptyState.css'; // Létre fogjuk hozni

function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <FaInfoCircle />} {/* Ha nincs megadva ikon, egy alap ikont mutat */}
      </div>
      <h3 className="empty-state-title">{title || 'Nincsenek adatok'}</h3>
      <p className="empty-state-message">{message || 'Jelenleg nincs megjeleníthető tartalom.'}</p>
    </div>
  );
}

export default EmptyState;