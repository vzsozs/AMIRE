// src/pages/JobDetailPage.jsx
import React, { useState, useContext } from 'react'; // useContext importálása
import { TeamContext } from '../context/TeamContext'; // 'useTeam' helyett 'TeamContext'
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaUserPlus, FaTimesCircle, FaPencilAlt } from 'react-icons/fa';
import Modal from '../components/Modal';
import EditJobForm from '../components/EditJobForm';
import './JobDetailPage.css';

function JobDetailPage({ jobs, onDeleteJob, onAssignTeamMember, onUnassignTeamMember, onUpdateJob }) {
  const { team } = useContext(TeamContext);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  // Új állapot a szerkesztő modálhoz
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const currentJobId = Number(jobId);
  const job = jobs.find(j => j.id === currentJobId);

  // VÉGLEGES MEGOLDÁS: Ellenőrizzük, hogy MINDEN szükséges adat megérkezett-e, mielőtt bármit csinálnánk.
  // Ha a 'job' VAGY a 'team' még nem létezik (undefined), akkor jelenítsünk meg egy töltőképernyőt vagy hibaüzenetet.
  if (!job || !team) {
    // Ezt lecserélhetjük egy szebb "Töltés..." komponensre is a jövőben
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

    const handleUpdateSubmit = (updatedData) => {
    onUpdateJob(updatedData);
    setIsEditModalOpen(false); // Bezárjuk a modált mentés után
  };

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

  return (
    <>
      <div className="job-detail-page">
        <div className="detail-header">
          <button onClick={() => navigate('/tasks')} className="back-button icon-button">
            <FaArrowLeft />
          </button>
          <div className="header-buttons">
            {/* ÚJ SZERKESZTÉS GOMB */}
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
        
        <div className="detail-section placeholder">
          <h3>Szükséges szerszámok</h3>
          <p>Ez a funkció fejlesztés alatt áll.</p>
        </div>
      </div>

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