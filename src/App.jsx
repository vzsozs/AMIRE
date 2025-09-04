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
import { useToast } from './context/useToast';

// Az API alap URL-je környezeti változóból
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dailyNotes, setDailyNotes] = useState({}); // Napi jegyzetek állapota (ha megtartjuk)
  const [appVersion, setAppVersion] = useState(''); // Alkalmazás verziószáma
  const { showToast } = useToast(); // Toast üzenetekhez

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
  }, [API_BASE_URL]);

  // Bejelentkezés kezelése
  const handleLogin = async (username, password) => {
    try {
      if (!API_BASE_URL) {
        showToast("Hiba: Az API URL nincs beállítva!", "error");
        return false;
      }
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hibás felhasználónév vagy jelszó');
      }
      const data = await response.json();
      localStorage.setItem('amire_auth_token', data.token);
      setIsAuthenticated(true);
      showToast("Sikeres bejelentkezés!", "success");
      return true;
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      showToast(error.message || "Ismeretlen hiba a bejelentkezés során.", "error");
      return false;
    }
  };

  // Kijelentkezés kezelése
  const handleLogout = () => {
    localStorage.removeItem('amire_auth_token');
    setIsAuthenticated(false);
    showToast("Sikeres kijelentkezés!", "info");
  };

  // Napi jegyzetek kezelése (Ha ezt a funkciót megtartjuk a HomePage-en)
  const handleAddNote = (noteText) => {
    const todayString = new Date().toISOString().slice(0, 10);
    const newNote = { id: Date.now(), text: noteText, completed: false };
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[todayString] || [];
      return { ...prevNotes, [todayString]: [...notesForDay, newNote] };
    });
    showToast("Jegyzet hozzáadva!", "success");
  };

  const handleToggleNote = (noteId) => {
    const todayString = new Date().toISOString().slice(0, 10);
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[todayString] || [];
      const updatedNotes = notesForDay.map(note => note.id === noteId ? { ...note, completed: !note.completed } : note);
      return { ...prevNotes, [todayString]: updatedNotes };
    });
    showToast("Jegyzet frissítve!", "info");
  };


  return (
    <ToastProvider>
      <TeamProvider>
        <JobProvider>
          <Router basename="/">
            <div className="App-layout-wrapper">
              {isAuthenticated ? ( // Ha be van jelentkezve, mutassuk az alkalmazást
                <>
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