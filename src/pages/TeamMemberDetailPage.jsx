// src/pages/TeamMemberDetailPage.jsx
import React, { useState, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { toYYYYMMDD } from '../utils/date';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaPhone, FaEnvelope, FaPencilAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import Modal from '../components/Modal';
import EditTeamMemberForm from '../components/EditTeamMemberForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './JobDetailPage.css'; // A meglévő stílusok
import './TeamMemberDetailPage.css'; // Új, egyedi stílusok a naptárhoz

function TeamMemberDetailPage() { 
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { team, deleteTeamMember, updateTeamMember, toggleAvailability } = useContext(TeamContext);

  const [key, setKey] = useState(Date.now());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const person = team.find(p => p.id == memberId);

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Biztosan törölni szeretné ${person.name} nevű csapattagot?`);
    if (isConfirmed) {
      deleteTeamMember(person.id);
      navigate('/team');
    }
  };

  const handleUpdateSubmit = (updatedData) => {
    updateTeamMember(updatedData);
    setIsEditModalOpen(false);
  };
  
  const handleDayClick = (date) => {
    const dateString = toYYYYMMDD(date);
    toggleAvailability(person.id, dateString);
    setKey(Date.now());
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      if (person?.availability?.includes(dateString)) {
        return 'available-day';
      }
    }
    return null;
  };
  
  const handlePrevMonth = () => {
    setActiveStartDate(currentDate => {
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth() - 1);
      return firstDayOfCurrentMonth;
    });
  };

  const handleNextMonth = () => {
    setActiveStartDate(currentDate => {
      const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      firstDayOfCurrentMonth.setMonth(firstDayOfCurrentMonth.getMonth() + 1);
      return firstDayOfCurrentMonth;
    });
  };

  if (!person) {
    return (
      <div className="job-detail-page">
        <h2>Hiba</h2>
        <p>A keresett személy nem található.</p>
      </div>
    );
  }

  return (
    <> {/* Fontos: A React fragment, mert több gyökérelem van */}
      <div className="job-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate('/team')} className="back-button icon-button">
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
      
        <h1>{person.name}</h1>
        <p className="job-status-badge" style={{ backgroundColor: person.color }}>{person.role}</p>
        
        {/* ÚJRA HOZZÁADTUK AZ ELÉRHETŐSÉGEK SZEKCIÓT */}
        <div className="detail-section">
            <h3>Elérhetőségek</h3>
            {person.phone && (
                <p className="contact-info">
                    <FaPhone /> <a href={`tel:${person.phone}`}>{person.phone}</a>
                </p>
            )}
            {person.email && (
                <p className="contact-info">
                    <FaEnvelope /> <a href={`mailto:${person.email}`}>{person.email}</a>
                </p>
            )}
            {!person.phone && !person.email && <p>Nincs megadva elérhetőség.</p>}
        </div>

        {/* AZ ELÉRHETŐSÉG NAPTÁR SZEKCIÓ */}
        <div className="detail-section">
          <h3>Elérhetőség a naptárban</h3> {/* Kicsit módosítottam a címet */}
          <div className="calendar-wrapper-dark">
             <Calendar
              key={key}
              onClickDay={handleDayClick}
              tileClassName={getTileClassName}
              locale="hu-HU"
              showNeighboringMonth={false}
              activeStartDate={activeStartDate}
              prev2Label={null}
              next2Label={null}
            />
            <div className="custom-calendar-nav-dark">
              <button onClick={handlePrevMonth} className="custom-nav-button-dark">
                <FaChevronLeft />
              </button>
              <button onClick={handleNextMonth} className="custom-nav-button-dark">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>

      </div> {/* Itt záródik a fő div */}

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditTeamMemberForm
          memberToEdit={person}
          onCancel={() => setIsEditModalOpen(false)}
          onUpdateTeamMember={handleUpdateSubmit}
        />
      </Modal>
    </>
  );
}

export default TeamMemberDetailPage;