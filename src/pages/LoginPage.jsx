// src/pages/LoginPage.jsx
import React, { useState } from 'react'; // 'useEffect' már nem kell itt
import './LoginPage.css';

// Az API_BASE_URL-t már nem itt definiáljuk, hanem az App.jsx kezeli.
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginPage({ onLogin, appVersion }) { // Az appVersion propként érkezik
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        {appVersion && <p className="app-version">Verzió: {appVersion}</p>}
      </div>
    </div>
  );
}

export default LoginPage;