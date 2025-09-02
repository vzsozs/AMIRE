// src/components/Header.jsx
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

function Header({ onLogout }) {
  console.log("Header renderelt. onLogout prop:", onLogout); // Ellenőrizzük a propot

  return (
    <header className="app-header">
      <span>AMIRE</span>
      <button onClick={onLogout} className="logout-button">
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default Header;