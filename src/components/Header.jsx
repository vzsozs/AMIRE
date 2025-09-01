// src/components/Header.jsx
import React from 'react';
import { FaBars } from 'react-icons/fa'; // Menü ikon

function Header() {
  return (
    <header className="app-header">
      <span>AMIRE</span>
      <FaBars style={{ fontSize: '1.2em', color: 'var(--text-color)' }} />
    </header>
  );
}

export default Header;