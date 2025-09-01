// src/components/JobItem.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importáljuk a Link komponenst
import { FaChevronRight } from 'react-icons/fa';
import './JobItem.css';

const statusColors = {
  'Folyamatban': '#FFA000',
  'Befejezve': '#388E3C',
  'Függőben': '#D32F2F',
};

function JobItem({ job }) {
  const { id, title, status, deadline } = job;

  // A teljes komponenst egy Link-be csomagoljuk
  return (
    <Link to={`/tasks/${id}`} className="job-item-link">
      <div className="job-item">
        <div className="job-item-status-bar" style={{ backgroundColor: statusColors[status] || '#757575' }}></div>
        <div className="job-item-content">
          <div className="job-item-info">
            <h3 className="job-item-title">{title}</h3>
            <p className="job-item-deadline">Határidő: {deadline}</p>
          </div>
          <div className="job-item-status">
            <span className="status-indicator" style={{ backgroundColor: statusColors[status] || '#757575' }}></span>
            <p>{status}</p>
          </div>
        </div>
        <FaChevronRight className="job-item-arrow" />
      </div>
    </Link>
  );
}

export default JobItem;