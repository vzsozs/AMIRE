// src/components/AddTeamMemberForm.jsx
import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import './AddJobForm.css';

// Előre definiált színek listája
const predefinedColors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#00BCD4', '#4CAF50', '#CDDC39', '#FFC107', '#FF9800', '#795548'
];

// A FÜGGVÉNY NEVÉNEK ITT KELL EGYEZNIE AZ EXPORTÁLT NÉVVEL
function AddTeamMemberForm({ onCancel, onAddTeamMember }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [color, setColor] = useState('#FF6F00');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !role) {
      alert('A Név és Szerepkör kitöltése kötelező!');
      return;
    }
    onAddTeamMember({ name, role, phone, email, color });
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <h2>Új csapattag hozzáadása</h2>
      <div className="form-group">
        <label htmlFor="person-name">Név</label>
        <input type="text" id="person-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="person-role">Szerepkör</label>
        <input type="text" id="person-role" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="person-phone">Telefonszám</label>
        <input type="tel" id="person-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="person-email">Email cím</label>
        <input type="email" id="person-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Személy színe</label>
        <ColorPalette
          colors={predefinedColors}
          selectedColor={color}
          onColorChange={setColor}
        />
      </div>
      <div className="form-actions">
        <button type="button" className="button-secondary" onClick={onCancel}>Mégse</button>
        <button type="submit" className="button-primary">Mentés</button>
      </div>
    </form>
  );
}

// AZ EXPORTÁLT NÉVNEK EGYEZNIE KELL A FENTI FÜGGVÉNY NÉVVEL
export default AddTeamMemberForm;