// src/components/CalendarDayDetailsModal.jsx
import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../context/TeamContext';
import { toYYYYMMDD } from '../utils/date';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBriefcase, FaTimes, FaCalendarAlt } from 'react-icons/fa'; // FaCalendarAlt importálása
import './CalendarDayDetailsModal.css';

function CalendarDayDetailsModal({ date, jobs, onClose }) {
  const { team } = useContext(TeamContext);
  
  const dateString = useMemo(() => toYYYYMMDD(date), [date]);

  // Lekérdezzük a munkákat
  const jobsOnSelectedDay = useMemo(() => {
    return Array.isArray(jobs) ? jobs.filter(job => {
      // Szűrjük a határidős ÉS az ütemezett munkákat is
      return job.deadline === dateString || job.schedule?.includes(dateString);
    }) : [];
  }, [jobs, dateString]);

  const availableMembersOnDay = useMemo(() => {
    return Array.isArray(team) ? team.filter(member => member.availability?.includes(dateString)) : [];
  }, [team, dateString]);

  return (
    <div className="calendar-day-details-modal">
      <div className="modal-header">
        <h2>Részletek: {date.toLocaleDateString('hu-HU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        <button onClick={onClose} className="close-button"><FaTimes /></button>
      </div>

      <div className="modal-section">
        <h3><FaBriefcase /> Munkák és ütemezés</h3>
        {jobsOnSelectedDay.length > 0 ? (
          <div className="details-list">
            {jobsOnSelectedDay.map(job => (
              <Link to={`/tasks/${job.id}`} key={job.id} onClick={onClose} className="detail-item" style={{ borderLeft: `5px solid ${job.color}` }}>
                <span className="job-title">{job.title}</span>
                {job.deadline === dateString && <span className="job-status" style={{ color: '#ff8a80' }}>Határidő!</span>}
                {job.schedule?.includes(dateString) && <span className="job-status" style={{ color: job.color }}>Ütemezett</span>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-details-message">Nincs munka esedékes vagy ütemezve ezen a napon.</p>
        )}
      </div>

      <div className="modal-section">
        <h3><FaUserCircle /> Elérhető csapat ezen a napon</h3>
        {availableMembersOnDay.length > 0 ? (
          <div className="details-list">
            {availableMembersOnDay.map(member => (
              <Link to={`/team/${member.id}`} key={member.id} onClick={onClose} className="detail-item" style={{ borderLeft: `5px solid ${member.color}` }}>
                <span className="member-name" style={{ color: member.color }}>{member.name}</span>
                <span className="member-role">{member.role}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-details-message">Senki sem jelezte, hogy elérhető ezen a napon.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarDayDetailsModal;