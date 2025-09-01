// src/pages/TasksPage.jsx
import React, { useState } from 'react';
import JobItem from '../components/JobItem';
import Modal from '../components/Modal';
import AddJobForm from '../components/AddJobForm';
import { FaPlus } from 'react-icons/fa';
import './TasksPage.css';

function TasksPage({ jobs, team, onAddJob }) { 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (newJobData) => { 
    onAddJob(newJobData); 
    setIsModalOpen(false);
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
          <p>Még nincsenek munkák felvéve.</p>
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