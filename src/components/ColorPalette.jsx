// src/components/ColorPalette.jsx
import React from 'react';
import './ColorPalette.css'; // Létre fogjuk hozni

function ColorPalette({ colors, selectedColor, onColorChange }) {
  return (
    <div className="color-palette">
      {colors.map((color) => (
        <button
          key={color}
          type="button" // Fontos, hogy ne submittelje a formot
          className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          aria-label={`Szín: ${color}`} // Kisegítő technológiáknak
        />
      ))}
    </div>
  );
}

export default ColorPalette;