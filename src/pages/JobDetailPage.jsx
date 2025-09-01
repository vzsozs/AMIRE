// src/pages/JobDetailPage.jsx
import React, { useState, useContext } from 'react';
import { TeamContext } from '../context/TeamContext'; // FONTOS: TeamContext importálása
import { useParams, useNavigate } from 'react-router-dom';
import { toYYYYMMDD } from '../utils/date';
import { FaArrowLeft, FaTrash, FaUserPlus, FaTimesCircle, FaPencilAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import Modal from '../components/Modal';
import EditJobForm from '../components/EditJobForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './JobDetailPage.css';
import './JobScheduleCalendar.css';

// A függvény megkapja a szükséges propokat az App-ból
function JobDetailPage({ jobs, onDeleteJob, onUpdateJob, onAssignTeamMember, onUnassignTeamMember, onToggleJobSchedule }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // FONTOS: A 'team' listát a Context-ből olvassuk ki
  const { team } = useContext(TeamContext);

  const currentJobId = Number(jobId);
  const job = jobs.find(j => j.id === currentJobId);

  const [calendarKey, setCalendarKey] = useState(Date.now()); 
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // VÉGLEGES MEGOLDÁS: Ellenőrizzük, hogy MINDEN szükséges adat megérkezett-e
  if (!job || !team) { // A 'team' már létezik a Context miatt
    return (
      <div className="job-detail-page">
        <h2>Adatok betöltése...</h2>
        <p>Ha ez az üzenet nem tűnik el, a keresett munka valószínűleg nem létezik.</p>
        <button onClick={() => navigate('/tasks')} className="back-button" style={{ marginTop: '20px' }}>
          <FaArrowLeft /> 
        </button>
      </div>
    );
  }
  
  // A kód többi része innen már csak akkor fut le, ha 'job' és 'team' is biztosan létezik.

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Biztosan törölni szeretné a(z) "${job.title}" nevű munkát?`);
    if (isConfirmed) {
      onDeleteJob(job.id);
      navigate('/tasks');
    }
  };
  
  const assignedMembers = team.filter(member => job.assignedTeam.includes(member.id));
  const availableMembers = team.filter(member => !job.assignedTeam.includes(member.id));

  const handleAssignClick = (memberId) => {
    onAssignTeamMember(currentJobId, memberId);
  };

  const handleUnassignClick = (memberId) => {
    onUnassignTeamMember(currentJobId, memberId);
  };

  const handleUpdateSubmit = (updatedData) => {
    onUpdateJob(updatedData);
    setIsEditModalOpen(false);
  };

  const handleJobDayClick = (date) => {
    const dateString = toYYYYMMDD(date);
    onToggleJobSchedule(currentJobId, dateString);
    setCalendarKey(Date.now());
  };

  const getJobTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      if (job?.schedule?.includes(dateString)) {
        return 'scheduled-day';
      }
    }
    return null;
  };
  
  const handleJobPrevMonth = () => {
    setActiveStartDate(currentDate => {
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth() - 1);
      return firstDayOfCurrentMonth;
    });
    setCalendarKey(Date.now());
  };

  const handleJobNextMonth = () => {
    setActiveStartDate(currentDate => {
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth() + 1);
      return firstDayOfCurrentMonth;
    });
    setCalendarKey(Date.now());
  };


 return (
    <> {/* Fontos: A React fragment, mert több gyökérelem van */}
      <div className="job-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate('/tasks')} className="back-button icon-button">
            <FaArrowLeft />
          </button>
          <div className="header-buttons">
            <button onClick={() => setIsEditModalOpen(true)} className="edit-button">
              <FaPencilAlt /> Szerkesztés
            </button>
          <button onClick={handleDelete} className="delete-button">
            <FaTrash /> Törlés
          </button>
          </div>
        </div>
        
        <h1>{job.title}</h1>
        <p className="job-status-badge" data-status={job.status}>{job.status}</p>

        <div className="detail-section">
          <h3>Leírás</h3>
          <p>{job.description}</p>
        </div>

        <div className="detail-section">
          <h3>Határidő</h3>
          <p>{job.deadline}</p>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h3>Hozzárendelt csapattagok</h3>
            <button onClick={() => setIsAssignModalOpen(true)} className="assign-button">
              <FaUserPlus /> Hozzárendelés
            </button>
          </div>
          <div className="assigned-members-list">
            {assignedMembers.length > 0 ? (
              assignedMembers.map(member => (
                <div key={member.id} className="assigned-member-item" style={{ borderLeftColor: member.color }}>
                  <span className="member-name">{member.name}</span>
                  <button onClick={() => handleUnassignClick(member.id)} className="unassign-button">
                    <FaTimesCircle />
                  </button>
                </div>
              ))
            ) : (
              <p>Még nincsenek csapattagok hozzárendelve ehhez a munkához.</p>
            )}
          </div>
        </div>
        
        <div className="detail-section">
          <h3>Munka ütemezése</h3>
          <div className="calendar-wrapper-dark">
            <Calendar
              key={calendarKey}
              onClickDay={handleJobDayClick}
              tileClassName={getJobTileClassName}
              locale="hu-HU"
              showNeighboringMonth={false}
              activeStartDate={activeStartDate}
              prev2Label={null}
              next2Label={null}
            />
            <div className="custom-calendar-nav-dark">
              <button onClick={handleJobPrevMonth} className="custom-nav-button-dark">
                <FaChevronLeft />
              </button>
              <button onClick={handleJobNextMonth} className="custom-nav-button-dark">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

      </div> {/* Itt záródik a fő div */}

      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)}>
        <div className="assign-modal-content">
          <h2>Csapattag hozzárendelése</h2>
          <div className="available-members-list">
            {availableMembers.length > 0 ? (
              availableMembers.map(member => (
                <div key={member.id} className="available-member-item" onClick={() => handleAssignClick(member.id)}>
                  <span className="color-dot" style={{ backgroundColor: member.color }}></span>
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
              ))
            ) : (
              <p>Nincs több hozzárendelhető csapattag.</p>
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditJobForm 
          jobToEdit={job}
          onCancel={() => setIsEditModalOpen(false)}
          onUpdateJob={handleUpdateSubmit}
        />
      </Modal>
    </>
  );
}

export default JobDetailPage;