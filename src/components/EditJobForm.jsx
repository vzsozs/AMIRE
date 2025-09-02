// src/components/EditJobForm.jsx
import React, { useState, useEffect, useContext } from 'react'; // useContext importálása
import { JobContext } from '../context/JobContext'; // JobContext importálása
import ColorPalette from './ColorPalette';
import './AddJobForm.css';

// Előre definiált színek listája
const predefinedColors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#00BCD4', '#4CAF50', '#CDDC39', '#FFC107', '#FF9800', '#795548'
];

// A komponens megkapja a szerkesztendő munka adatait (jobToEdit)
// Az 'onUpdateJob' propot már nem kapja meg, hanem a Context-ből veszi
function EditJobForm({ jobToEdit, onCancel }) { 
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Folyamatban');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(predefinedColors[0]);

  // Itt olvassuk ki az 'updateJob' függvényt a Context-ből
  const { updateJob } = useContext(JobContext); 

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setStatus(jobToEdit.status);
      setDeadline(jobToEdit.deadline);
      setDescription(jobToEdit.description);
      setColor(jobToEdit.color || predefinedColors[0]);
    }
  }, [jobToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = { id: jobToEdit.id, title, status, deadline, description, color };
    updateJob(updatedData); // A Context-ből kapott 'updateJob'-ot hívjuk
    onCancel(); // Bezárjuk a modált mentés után
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

      <div className="form-group">
        <label>Munka színe</label>
        <ColorPalette
          colors={predefinedColors}
          selectedColor={color}
          onColorChange={setColor}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>Mégse</button>
        <button type="submit" className="button-primary">Módosítások mentése</button>
      </div>
    </form>
  );
}

export default EditJobForm;