// src/pages/JobDetailPage.jsx
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamContext } from '../context/TeamContext';
import { JobContext } from '../context/JobContext';
import { toYYYYMMDD } from '../utils/date';
import { FaArrowLeft, FaTrash, FaUserPlus, FaTimesCircle, FaPencilAlt, FaChevronLeft, FaChevronRight, FaCheckSquare, FaRegSquare, FaTrashAlt, FaChevronDown, FaChevronUp, FaPlus, FaExclamationTriangle } from 'react-icons/fa'; 
import Modal from '../components/Modal';
import EditJobForm from '../components/EditJobForm';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './JobDetailPage.css';
import './JobScheduleCalendar.css';
import { useToast } from '../context/useToast';

function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [showCompletedTodos, setShowCompletedTodos] = useState(false);
  
  // FONTOS: Mindig a Context-ből olvasunk ki
  const { team, isLoadingTeam, isLoadingJobs } = useContext(TeamContext);
  const { 
    jobs, deleteJob, assignTeamMember, unassignTeamMember, 
    toggleJobSchedule, addTodoItem, toggleTodoItem, deleteTodoItem 
  } = useContext(JobContext);
  
  const { showToast } = useToast();

  const currentJobId = Number(jobId);

  const [calendarKey, setCalendarKey] = useState(Date.now()); 
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // --- HIBAKEZELÉS: Ez a VÉGLEGES Guard Clause ---
  // Először ellenőrizzük, hogy a Context-ből megkaptuk-e az összes listát
  if (!Array.isArray(jobs) || !Array.isArray(team) || jobs.length === 0) { 
    console.log("JobDetailPage: Adatok betöltése vagy üres lista. jobs:", jobs, "team:", team);
    return (
      <div className="job-detail-page">
        <h2>Adatok betöltése...</h2>
        <p>Kérem várjon, amíg az adatok betöltődnek. Ha ez az üzenet nem tűnik el, a szerverről nem érkezett adat, vagy a munka nem létezik.</p>
        <button onClick={() => navigate('/tasks')} className="back-button" style={{ marginTop: '20px' }}>
          <FaArrowLeft />
        </button>
      </div>
    );
  }
  
    if (isLoadingJobs || isLoadingTeam) { 
    return (
      <div className="job-detail-page">
        <h2>Adatok betöltése...</h2>
      </div>
    );
    }

  // --- Ha az adatok megvannak, megkeressük a konkrét munkát ---
  const job = jobs.find(j => j.id === currentJobId);

   // Ha a 'job' objektum még mindig undefined, az azt jelenti, hogy az ID nem létezik.
  if (!job) {
    console.log("JobDetailPage: A munka nem található az aktuális listában. jobId:", currentJobId);
    return (
      <div className="job-detail-page">
        <div className="empty-state"> {/* ÚJ: EmptyState komponens használata */}
            <h2 className="empty-state-title"><FaExclamationTriangle /> Munka nem található</h2>
            <p className="empty-state-message">
                A keresett munka azonosítója hibás, vagy a munka már nem létezik.
            </p>
            <button onClick={() => navigate('/tasks')} className="button-primary" style={{ marginTop: '20px' }}>
                <FaArrowLeft /> Vissza a munkák listájához
            </button>
        </div>
      </div>
    );
  }

  
  // === INNENTŐL KEZDVE BIZTOSAK VAGYUNK BENNE, HOGY A 'job' ÉS 'team' LÉTEZIK ÉS ÉRVÉNYES ===
  // Ezen a ponton már nem kell optional chaining a job.assignedTeam-nél, 
  // mert a job objektumról tudjuk, hogy létezik és a struktúrája megfelelő.

  const handleDelete = () => {
    const isConfirmed = window.confirm(`Biztosan törölni szeretné a(z) "${job.title}" nevű munkát?`);
    if (isConfirmed) {
      deleteJob(job.id); 
      navigate('/tasks');
      showToast('Munka sikeresen törölve!', 'success');
    }
  };
  
  const assignedMembers = team.filter(member => job.assignedTeam?.includes(member.id));
  const availableMembers = team.filter(member => !job.assignedTeam?.includes(member.id));

  const handleAssignClick = (memberId) => {
    assignTeamMember(currentJobId, memberId);
    showToast('Csapattag felvéve!', 'success');
  };

  const handleUnassignClick = (memberId) => {
    unassignTeamMember(currentJobId, memberId);
    showToast('Csapattag eltávolítva!', 'success');
  };

  const handleJobDayClick = (date) => {
    const dateString = toYYYYMMDD(date);
    toggleJobSchedule(currentJobId, dateString);
    setCalendarKey(Date.now());
  };

  const getJobTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      if (job.schedule?.includes(dateString)) {
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

  const handleAddTodoClick = () => {
    if (newTodoText.trim() === '') return;
    addTodoItem(currentJobId, newTodoText);
    setNewTodoText('');
    showToast('Teendő hozzáadva!', 'success');
  };

  const handleToggleClick = (todoId) => {
    toggleTodoItem(currentJobId, todoId);
    showToast('Teendő állapota frissítve!', 'info');
  };

  const handleDeleteClick = (todoId) => {
    const isConfirmed = window.confirm('Biztosan törölni szeretné ezt a teendőt?');
    if (isConfirmed) {
      deleteTodoItem(currentJobId, todoId);
      showToast('Teendő törölve!', 'success');
    }
  };

  const uncompletedTodos = (job.todolist || []).filter(item => !item.completed);
  const completedTodos = (job.todolist || []).filter(item => item.completed);


 return (
    <>
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
          <h3>Teendők</h3>
          <div className="todo-list-container">
            {uncompletedTodos.length > 0 ? (
              uncompletedTodos.map(item => (
                <div key={item.id} className="todo-item">
                  <button onClick={() => handleToggleClick(item.id)} className="todo-checkbox">
                    <FaRegSquare />
                  </button>
                  <span className="todo-text">{item.text}</span>
                  <button onClick={() => handleDeleteClick(item.id)} className="todo-delete-button">
                    <FaTrashAlt />
                  </button>
                </div>
              ))
            ) : (
              <p className="no-data-message">Nincsenek még elvégzetlen teendők.</p>
            )}

            {completedTodos.length > 0 && (
              <div className="completed-todos-section">
                <button 
                  onClick={() => setShowCompletedTodos(!showCompletedTodos)} 
                  className="toggle-completed-button"
                >
                  {showCompletedTodos ? <FaChevronUp /> : <FaChevronDown />}
                  Elvégzett teendők ({completedTodos.length})
                </button>
                {showCompletedTodos && (
                  <div className="completed-list">
                    {completedTodos.map(item => (
                      <div key={item.id} className="todo-item completed">
                        <button onClick={() => handleToggleClick(item.id)} className="todo-checkbox">
                          <FaCheckSquare />
                        </button>
                        <span className="todo-text">{item.text}</span>
                        <button onClick={() => handleDeleteClick(item.id)} className="todo-delete-button">
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="add-todo-form">
              <input 
                type="text" 
                className="add-todo-input"
                placeholder="Új teendő hozzáadása..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodoClick()}
              />
              <button onClick={handleAddTodoClick} className="add-todo-button">
                <FaPlus />
              </button>
            </div>
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


        <div className="detail-section">
          <div className="section-header">
            <h3>Akik csinálják</h3>
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
              <p className="no-data-message">Még nincsenek csapattagok hozzárendelve ehhez a munkához.</p>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Határidő</h3>
          <p>{job.deadline}</p>
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
              <p className="no-data-message">Nincs több hozzárendelhető csapattag.</p>
            )}
          </div>
        </div>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <EditJobForm 
          jobToEdit={job}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </>
  );
}

export default JobDetailPage;