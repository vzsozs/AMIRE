// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useToast } from '../context/useToast'; // FONTOS: Toast hook importálása
import './LoginPage.css';

function LoginPage({ onLogin, appVersion }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast(); // Itt kell használni
  // Az appVersion és a setAppVersion már nem itt vannak definiálva
  // const [appVersion, setAppVersion] = useState(''); 

  // Az useEffect a verziószám lekéréséhez már az App.jsx-ben van
  /*
  useEffect(() => {
    // ...
  }, []);
  */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const success = await onLogin(username, password); // onLogin nem küld már toast-ot
    if (!success) {
      setError('Hibás felhasználónév vagy jelszó!');
      showToast('Hibás felhasználónév vagy jelszó!', 'error'); // Itt jelenítjük meg a toast-ot
    } else {
      showToast('Sikeres bejelentkezés!', 'success'); // Vagy itt, ha sikeres
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
        {appVersion && <p className="app-version">Verzió: {appVersion}</p>}
      </div>
    </div>
  );
}

export default LoginPage;