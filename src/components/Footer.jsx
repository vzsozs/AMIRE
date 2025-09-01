// src/components/Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Link és útvonal lekérdezéséhez
import { FaHome, FaTasks, FaCalendarAlt, FaUsers } from 'react-icons/fa'; // Ikonok

function Footer() {
  const location = useLocation(); // Az aktuális URL útvonalat lekérdezzük

  return (
    <footer className="app-footer">
      <Link to="/" className={`footer-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <FaHome className="icon" />
        Kezdőlap
      </Link>
      <Link to="/tasks" className={`footer-nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}>
        <FaTasks className="icon" />
        Munkák
      </Link>
      <Link to="/calendar" className={`footer-nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
        <FaCalendarAlt className="icon" />
        Naptár
      </Link>
      <Link to="/team" className={`footer-nav-item ${location.pathname.startsWith('/team') ? 'active' : ''}`}>
        <FaUsers className="icon" />
        Csapat
      </Link>
    </footer>
  );
}

export default Footer;