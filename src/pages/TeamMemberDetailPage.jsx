// src/pages/TeamMemberDetailPage.jsx
import React, { useState, useContext } from 'react'; // useContext importálása
import { TeamContext } from '../context/TeamContext'; // 'useTeam' helyett 'TeamContext'
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaPhone, FaEnvelope, FaPencilAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import Modal from '../components/Modal';
import EditTeamMemberForm from '../components/EditTeamMemberForm';
import Calendar from 'react-calendar'; // NAPTÁR IMPORTÁLÁSA
import 'react-calendar/dist/Calendar.css'; // Naptár alap stílusai
import './JobDetailPage.css'; // A meglévő stílusok
import './TeamMemberDetailPage.css'; // Új, egyedi stílusok a naptárhoz

function TeamMemberDetailPage() { 
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // 3. A Context-ből vesszük ki az összes szükséges adatot és függvényt
   const { team, deleteTeamMember, updateTeamMember, toggleAvailability } = useContext(TeamContext);

  const [key, setKey] = useState(Date.now());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const person = team.find(p => p.id == memberId);

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Biztosan törölni szeretné ${person.name} nevű csapattagot?`);
    if (isConfirmed) {
      deleteTeamMember(person.id); // 4. A Context-ből kapott függvényt hívjuk
      navigate('/team');
    }
  };

  const handleUpdateSubmit = (updatedData) => {
    updateTeamMember(updatedData); // 4. A Context-ből kapott függvényt hívjuk
    setIsEditModalOpen(false);
  };
  
  const handleDayClick = (date) => {
    const dateString = date.toISOString().slice(0, 10);
    toggleAvailability(person.id, dateString); // 4. A Context-ből kapott függvényt hívjuk
    setKey(Date.now()); 
  };

  // ÚJ FÜGGVÉNY: CSS osztálynevet ad a naptár celláihoz
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().slice(0, 10);
      // Ha a dátum benne van a személy elérhetőségi listájában, adjuk hozzá az 'available-day' osztályt
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
    <div className="job-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate('/team')} className="back-button icon-button">
            <FaArrowLeft />
          </button>
          {/* ÚJ RÉSZ: Gombok csoportosítása */}
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
      
      {/* ÚJ RÉSZEK AZ ELÉRHETŐSÉGEKNEK */}
      <div className="detail-section">
        <h3>Elérhetőségek</h3>
        <div className="calendar-wrapper-dark">
             <Calendar
              key={key}
              onClickDay={handleDayClick}
              tileClassName={getTileClassName}
              locale="hu-HU"
              showNeighboringMonth={false}
              // A NÉZETET AZ ÚJ ÁLLAPOT IRÁNYÍTJA
              activeStartDate={activeStartDate}
              // A BEÉPÍTETT NYILAKAT ELTÁVOLÍTJUK
              prev2Label={null}
              next2Label={null}
            />
            {/* SAJÁT NAVIGÁCIÓS GOMBOK */}
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

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditTeamMemberForm
          memberToEdit={person}
          onCancel={() => setIsEditModalOpen(false)}
          onUpdateTeamMember={handleUpdateSubmit}
        />
      </Modal>
    </div>
    
  );
}

export default TeamMemberDetailPage; // VÁLTOZÁS