// src/components/Header.jsx
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useToast } from '../context/useToast'; // FONTOS: Toast hook importálása

function Header({ onLogout }) {
  const { showToast } = useToast(); // Itt kell használni

  const handleLogoutClick = () => {
    onLogout();
    showToast('Sikeres kijelentkezés!', 'info'); // Itt jelenítjük meg a toast-ot
  };

  return (
    <header className="app-header">
      <span>AMIRE</span>
      <button onClick={handleLogoutClick} className="logout-button"> {/* Módosított onClick */}
        <FaSignOutAlt />
      </button>
    </header>
  );
}
export default Header;