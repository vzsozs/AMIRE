// src/components/EditTeamMemberForm.jsx
import React, { useState, useEffect } from 'react';
import ColorPalette from './ColorPalette'; // Használjuk a színválasztót
import './AddJobForm.css'; // Újrahasznosítjuk a stílusokat

// Előre definiált színek listája (ugyanaz, mint az AddTeamMemberForm-ban)
const predefinedColors = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#00BCD4', '#4CAF50', '#CDDC39', '#FFC107', '#FF9800', '#795548'
];

function EditTeamMemberForm({ memberToEdit, onCancel, onUpdateTeamMember }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [color, setColor] = useState(predefinedColors[0]);

  useEffect(() => {
    if (memberToEdit) {
      setName(memberToEdit.name);
      setRole(memberToEdit.role);
      setPhone(memberToEdit.phone || ''); // Ha nincs telefon, üres string legyen
      setEmail(memberToEdit.email || ''); // Ha nincs email, üres string legyen
      setColor(memberToEdit.color);
    }
  }, [memberToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = { id: memberToEdit.id, name, role, phone, email, color };
    onUpdateTeamMember(updatedData);
  };

  return (
    <form className="add-job-form" onSubmit={handleSubmit}>
      <h2>Csapattag szerkesztése</h2>
      <div className="form-group">
        <label>Név</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Szerepkör</label>
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Telefonszám</label>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email cím</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
        <button type="submit" className="button-primary">Módosítások mentése</button>
      </div>
    </form>
  );
}

export default EditTeamMemberForm;