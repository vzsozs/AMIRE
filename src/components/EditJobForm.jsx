// src/components/EditJobForm.jsx
import React, { useState, useEffect } from 'react';
import './AddJobForm.css'; // Újrahasznosítjuk a stílusokat

// A komponens megkapja a szerkesztendő munka adatait (jobToEdit)
function EditJobForm({ jobToEdit, onCancel, onUpdateJob }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Folyamatban');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');

  // A useEffect hook segítségével töltjük fel az űrlapot, amint a komponens megkapja a munka adatait
  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setStatus(jobToEdit.status);
      setDeadline(jobToEdit.deadline);
      setDescription(jobToEdit.description);
    }
  }, [jobToEdit]); // Ez a kód lefut, ha a jobToEdit megváltozik

  const handleSubmit = (event) => {
    event.preventDefault();
    // Létrehozunk egy objektumot a frissített adatokkal
    const updatedData = { id: jobToEdit.id, title, status, deadline, description };
    onUpdateJob(updatedData);
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <h2>Munka szerkesztése</h2>
      <div className="form-group">
        <label htmlFor="edit-job-title">Munka neve</label>
        <input type="text" id="edit-job-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="edit-job-status">Státusz</label>
        <select id="edit-job-status" value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="Folyamatban">Folyamatban</option>
          <option value="Befejezve">Befejezve</option>
          <option value="Függőben">Függőben</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="edit-job-deadline">Határidő</label>
        <input type="date" id="edit-job-deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="edit-job-description">Leírás</label>
        <textarea 
          id="edit-job-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          rows="4"
        ></textarea>
      </div>
      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>Mégse</button>
        <button type="submit" className="button-primary">Módosítások mentése</button>
      </div>
    </form>
  );
}

export default EditJobForm;