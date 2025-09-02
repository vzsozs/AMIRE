// src/pages/TasksPage.jsx
import React, { useState, useContext } from 'react'; // useContext importálása
import { TeamContext } from '../context/TeamContext'; // FONTOS: Importáljuk a TeamContext-et
import { JobContext } from '../context/JobContext'; // ÚJ IMPORT
import EmptyState from '../components/EmptyState'; // ÚJ IMPORT
import { useToast } from '../context/useToast'; // EZ A JAVÍTÁS
import JobItem from '../components/JobItem';
import Modal from '../components/Modal';
import AddJobForm from '../components/AddJobForm';
import { FaPlus, FaTasks } from 'react-icons/fa'; // FaTasks ikon
import './TasksPage.css';

function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const { team } = useContext(TeamContext); 
  const { jobs, addJob } = useContext(JobContext); // ÚJ: Itt olvassuk ki a 'jobs' és 'addJob'-ot

  const handleFormSubmit = (newJobData) => { 
    addJob(newJobData);
    setIsModalOpen(false);
    showToast('Jippi új munka!', 'success'); // ÜZENET!
  };

  return (
    <div className="tasks-page-container">
      <div className="tasks-page-header">
        <h1>Munkák</h1> 
        <p>Itt láthatja és kezelheti a céges munkákat és projekteket.</p> 
      </div>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map(job => ( 
            <JobItem key={job.id} job={job} /> 
          ))
        ) : (
          <EmptyState 
            icon={<FaTasks />} 
            title="Nincs felvett munka" 
            message="Kattints a '+' gombra az első munka hozzáadásához!" 
          />
        )}
      </div>
      <button className="fab" onClick={() => setIsModalOpen(true)}>
        <FaPlus />
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <AddJobForm
        team={team} // Továbbadjuk a csapat listát
        onCancel={() => setIsModalOpen(false)}
        onAddJob={handleFormSubmit} 
      />
    </Modal>
    </div>
  );
}

export default TasksPage;