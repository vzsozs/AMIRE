// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css'; // Létre fogjuk hozni a CSS-t

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Töröljük az előző hibát
     // FONTOS HIBAKERESÉS: LOGOLJUK KI AZ ELKÜLDÖTT ADATOKAT!
    console.log(`Frontend küldi: Felhasználónév: "${username}", Jelszó: "${password}"`);
    const success = await onLogin(username, password);
    if (!success) {
      setError('Hibás felhasználónév vagy jelszó!');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h1>AMIRE</h1>
        <p className="subtitle">Bejelentkezés az alkalmazásba</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Felhasználónév</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Jelszó</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Bejelentkezés</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;