// src/components/AddJobForm.jsx
import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './AddJobForm.css';

// Most már az onAddJob propot is fogadjuk
function AddJobForm({ team, onCancel, onAddJob }) {
  // Állapotok létrehozása minden egyes input mezőhöz
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Folyamatban'); // Alapértelmezett érték
  const [deadline, setDeadline] = useState('');

   // Új állapot a kiválasztott csapattagok ID-jainak tárolására
  const [selectedTeam, setSelectedTeam] = useState([]);

  // Függvény a csapattagok kiválasztásának kezelésére
  const handleTeamSelect = (memberId) => {
    // Ha az ID már a listában van, távolítsuk el (kiválasztás visszavonása)
    if (selectedTeam.includes(memberId)) {
      setSelectedTeam(selectedTeam.filter(id => id !== memberId));
    } else {
      // Ha nincs a listában, adjuk hozzá
      setSelectedTeam([...selectedTeam, memberId]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validáció (opcionális, de hasznos): ellenőrizzük, hogy minden mező ki van-e töltve
    if (!title || !status || !deadline) {
      alert('Kérjük, töltsön ki minden mezőt!');
      return;
    }

    // Meghívjuk a szülőtől kapott onAddJob függvényt az űrlap adataival
    onAddJob({ title, status, deadline, assignedTeam: selectedTeam });

    // A onCancel-t már a szülő komponens (TasksPage) hívja meg, miután hozzáadta a munkát.
    // Így itt már nem szükséges.
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <h2>Új munka hozzáadása</h2>
      <div className="form-group">
        <label htmlFor="job-title">Munka neve</label>
        <input
          type="text"
          id="job-title"
          placeholder="Pl.: Gábor Lakásfelújítás"
          value={title} // Az input értékét a 'title' állapothoz kötjük
          onChange={(e) => setTitle(e.target.value)} // Frissítjük az állapotot gépeléskor
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="job-status">Státusz</label>
        <select
          id="job-status"
          value={status} // A select értékét a 'status' állapothoz kötjük
          onChange={(e) => setStatus(e.target.value)} // Frissítjük az állapotot változáskor
          required
        >
          <option value="Folyamatban">Folyamatban</option>
          <option value="Befejezve">Befejezve</option>
          <option value="Függőben">Függőben</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="job-deadline">Határidő</label>
        <input
          type="date"
          id="job-deadline"
          value={deadline} // A dátum értékét a 'deadline' állapothoz kötjük
          onChange={(e) => setDeadline(e.target.value)} // Frissítjük az állapotot változáskor
          required
        />
      </div>
      
       {/* --- ÚJ SZEKCIÓ A CSAPATTAGOK KIVÁLASZTÁSÁHOZ --- */}
      <div className="form-group">
        <label>Csapattagok hozzárendelése</label>
        <div className="team-selection-list">
          {team.map(member => (
            <div
              key={member.id}
              className={`team-selection-item ${selectedTeam.includes(member.id) ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(member.id)}
            >
              <FaUserCircle className="avatar" style={{ color: member.color }} />
              <span className="name">{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>Mégse</button>
        <button type="submit" className="button-primary">Mentés</button>
      </div>
    </form>
  );
}

export default AddJobForm;