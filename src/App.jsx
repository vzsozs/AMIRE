// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamProvider';
import { ToastProvider } from './context/ToastProvider';
import Toast from './components/Toast';
import { JobProvider } from './context/JobProvider';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import TeamPage from './pages/TeamPage';
import TeamMemberDetailPage from './pages/TeamMemberDetailPage';
import JobDetailPage from './pages/JobDetailPage';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';

// Az API alap URL-je környezeti változóból
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dailyNotes, setDailyNotes] = useState({});
  const [appVersion, setAppVersion] = useState('');
  // FONTOS: A useToast hívást KISZEDTÜK INNEN!
  // const { showToast } = useToast(); 

  // Ellenőrizzük a tokent az alkalmazás indulásakor
  useEffect(() => {
    const token = localStorage.getItem('amire_auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Verziószám lekérése a backendről
  useEffect(() => {
    const fetchVersion = async () => {
      try {
        if (!API_BASE_URL) throw new Error('API URL nincs beállítva.');
        const response = await fetch(`${API_BASE_URL}/version`);
        if (!response.ok) throw new Error('Hiba a verziószám lekérésekor.');
        const data = await response.json();
        setAppVersion(data.version);
      } catch (error) {
        console.error("Verziószám lekérdezési hiba:", error);
        setAppVersion('N/A');
      }
    };
    if (API_BASE_URL) {
        fetchVersion();
    } else {
        setAppVersion('Fejlesztés alatt');
    }
  }, []);

  // FONTOS: A handleLogin, handleLogout, handleAddNote, handleToggleNote függvények
  // MOST MÁR context nélkül futnak itt.
  // Azok a komponensek, amik ezeket meghívják, majd a saját useToast-jukat használják.

  // Bejelentkezés kezelése
  const handleLogin = async (username, password) => {
    try {
      if (!API_BASE_URL) {
        // showToast("Hiba: Az API URL nincs beállítva!", "error"); // showToast itt már nem elérhető!
        return false;
      }
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // showToast(errorData.message || 'Hibás felhasználónév vagy jelszó', "error"); // showToast itt már nem elérhető!
        throw new Error(errorData.message || 'Hibás felhasználónév vagy jelszó');
      }
      const data = await response.json();
      localStorage.setItem('amire_auth_token', data.token);
      setIsAuthenticated(true);
      // showToast("Sikeres bejelentkezés!", "success"); // showToast itt már nem elérhető!
      return true;
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      // showToast(error.message || "Ismeretlen hiba a bejelentkezés során.", "error"); // showToast itt már nem elérhető!
      return false;
    }
  };

  // Kijelentkezés kezelése
  const handleLogout = () => {
    localStorage.removeItem('amire_auth_token');
    setIsAuthenticated(false);
    // showToast("Sikeres kijelentkezés!", "info"); // showToast itt már nem elérhető!
  };

  // Napi jegyzetek kezelése (Ha ezt a funkciót megtartjuk a HomePage-en)
  const handleAddNote = (noteText) => {
    const todayString = new Date().toISOString().slice(0, 10);
    const newNote = { id: Date.now(), text: noteText, completed: false };
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[todayString] || [];
      return { ...prevNotes, [todayString]: [...notesForDay, newNote] };
    });
    // showToast("Jegyzet hozzáadva!", "success"); // showToast itt már nem elérhető!
  };

  const handleToggleNote = (noteId) => {
    const todayString = new Date().toISOString().slice(0, 10);
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[todayString] || [];
      const updatedNotes = notesForDay.map(note => note.id === noteId ? { ...note, completed: !note.completed } : note);
      return { ...prevNotes, [todayString]: updatedNotes };
    });
    // showToast("Jegyzet frissítve!", "info"); // showToast itt már nem elérhető!
  };


  return (
    <ToastProvider>
      <TeamProvider>
        <JobProvider>
          <Router basename="/">
            <div className="App-layout-wrapper">
              {isAuthenticated ? ( // Ha be van jelentkezve, mutassuk az alkalmazást
                <>
                  {/* onLogout={handleLogout} - Ez mostantól a Header saját 'onLogout' logikáját használja */}
                  <Header onLogout={handleLogout} /> 
                  <div className="main-content-area">
                    <Sidebar />
                    <main className="app-content">
                      <Routes>
                        <Route path="/" element={<HomePage notes={dailyNotes} onAddNote={handleAddNote} onToggleNote={handleToggleNote} />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/tasks/:jobId" element={<JobDetailPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/team/:memberId" element={<TeamMemberDetailPage />} />
                      </Routes>
                    </main>
                  </div>
                  <Footer />
                </>
              ) : ( // Ha nincs bejelentkezve, mutassuk a login oldalt
                // A LoginPage már a saját showToast-ját használja
                <LoginPage onLogin={handleLogin} appVersion={appVersion} /> 
              )}
            </div>
          </Router>
        </JobProvider>
      </TeamProvider>
      <Toast /> 
    </ToastProvider>
  );
}

export default App;