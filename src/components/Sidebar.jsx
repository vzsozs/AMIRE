// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Ugyanazokat az ikonokat használjuk, mint a Footerben
import { FaHome, FaTasks, FaCalendarAlt, FaUsers, FaWrench } from 'react-icons/fa';
import './Sidebar.css'; // Létre fogjuk hozni

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        {/* Itt is megjelenhetne az AMIRE cím, ha akarnánk */}
        <span>Navigáció</span>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`sidebar-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome className="icon" />
          Kezdőlap
        </Link>
        <Link to="/tasks" className={`sidebar-nav-item ${location.pathname.startsWith('/tasks') ? 'active' : ''}`}>
          <FaTasks className="icon" />
          Munkák
        </Link>
        <Link to="/calendar" className={`sidebar-nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
          <FaCalendarAlt className="icon" />
          Naptár
        </Link>
        {/* Ha az Eszközök modult mégis bevezetjük, ide is jönne egy link */}
        {/* Egyelőre nincs ToolsPage, de ha lesz, így nézne ki: */}
        {/* <Link to="/tools" className={`sidebar-nav-item ${location.pathname.startsWith('/tools') || location.pathname.startsWith('/materials') ? 'active' : ''}`}>
          <FaWrench className="icon" />
          Eszközök
        </Link> */}
        <Link to="/team" className={`sidebar-nav-item ${location.pathname.startsWith('/team') ? 'active' : ''}`}>
          <FaUsers className="icon" />
          Csapat
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;