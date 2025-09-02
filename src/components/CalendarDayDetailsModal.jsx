// src/components/CalendarDayDetailsModal.jsx
import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../context/TeamContext';
import { JobContext } from '../context/JobContext'; // ÚJ IMPORT
import { toYYYYMMDD } from '../utils/date';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaBriefcase, FaTimes, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import './CalendarDayDetailsModal.css';

// A komponens most már csak a 'date' és 'onClose' propokat kapja
function CalendarDayDetailsModal({ date, onClose }) {
  const { team } = useContext(TeamContext);
  const { jobs } = useContext(JobContext); // Itt olvassuk ki a 'jobs' listát a Context-ből
  
  const dateString = useMemo(() => toYYYYMMDD(date), [date]);

  const jobsOnSelectedDay = useMemo(() => {
    return Array.isArray(jobs) ? jobs.filter(job => {
      return job.deadline === dateString || job.schedule?.includes(dateString);
    }) : [];
  }, [jobs, dateString]);

  const availableMembersOnDay = useMemo(() => {
    return Array.isArray(team) ? team.filter(member => member.availability?.includes(dateString)) : [];
  }, [team, dateString]);

  return (
    <div className="calendar-day-details-modal">
      <div className="modal-header">
        <h2>{date.toLocaleDateString('hu-HU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
      </div>

      <div className="modal-section">
        <h3><FaBriefcase /> Munkák és ütemezés</h3>
        {jobsOnSelectedDay.length > 0 ? (
          <div className="details-list">
            {jobsOnSelectedDay.map(job => (
              <Link to={`/tasks/${job.id}`} key={job.id} onClick={onClose} className="detail-item" style={{ borderLeft: `5px solid ${job.color}` }}>
                <span className="job-title">{job.title}</span>
                <div className="job-indicators">
                    {job.deadline === dateString && (
                        <span className="job-indicator deadline-indicator">
                            <FaExclamationTriangle /> Határidő!
                        </span>
                    )}
                    {job.schedule?.includes(dateString) && (
                        <span className="job-indicator schedule-indicator">
                            <FaCalendarAlt /> Ütemezett
                        </span>
                    )}
                </div>
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