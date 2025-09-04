// src/App.jsx
import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // useNavigate importálása
import { TeamProvider } from './context/TeamProvider'; 
// import moment from 'moment'; // Moment.js már nem kell itt, mert a util függvény használja
import { ToastProvider } from './context/ToastProvider';
import Toast from './components/Toast';
import { JobProvider } from './context/JobProvider'; // ÚJ IMPORT
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
import LoginPage from './pages/LoginPage'; // ÚJ IMPORT

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ÚJ ÁLLAPOT
  // A 'jobs' és 'dailyNotes' állapotokat INNEN TÖRÖLTÜK, 
  // mert a 'JobProvider' és 'HomePage' (dailyNotes) kezelik őket
  // const [jobs, setJobs] = useState(initialJobs);
  const [dailyNotes, setDailyNotes] = useState({}); // Ezt még át kell gondolni, de most bent hagyjuk

  useEffect(() => {
    console.log("APP.JSX: VITE_API_BASE_URL (buildelt kódban):", API_BASE_URL);
  }, []); 


    // ÚJ FÜGGVÉNY: Bejelentkezés kezelése
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Hibás adatok');
      }
      const data = await response.json();
      localStorage.setItem('amire_auth_token', data.token); // Token tárolása
      setIsAuthenticated(true);
      return true; // Sikeres bejelentkezés
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      return false; // Sikertelen bejelentkezés
    }
  };

    // Ellenőrizzük a tokent az alkalmazás indulásakor
  useEffect(() => {
    const token = localStorage.getItem('amire_auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ÚJ FÜGGVÉNY: Kijelentkezés
  const handleLogout = () => {
    localStorage.removeItem('amire_auth_token');
    setIsAuthenticated(false);
  };

  // AZ ÖSSZES handle...Job és handle...TodoItem FÜGGVÉNYT INNEN TÖRÖLTÜK,
  // MERT A JobProvider KEZELI ŐKET
  /*
  const handleAddJob = (...) => { ... };
  const handleDeleteJob = (...) => { ... };
  const handleUpdateJob = (...) => { ... };
  const handleAssignTeamMember = (...) => { ... };
  const handleUnassignTeamMember = (...) => { ... };
  const handleToggleJobSchedule = (...) => { ... };
  const handleAddTodoItem = (...) => { ... };
  const handleToggleTodoItem = (...) => { ... };
  const handleDeleteTodoItem = (...) => { ... };
  */

  // Csak a napi jegyzetekhez tartozó függvények maradnak, ha megtartjuk a napi jegyzeteket
  // Később ezt is átadhatjuk egy Context-nek, ha bonyolódik
  const handleAddNote = (dateString, noteText) => {
    const newNote = { id: Date.now(), text: noteText, completed: false };
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[dateString] || [];
      return { ...prevNotes, [dateString]: [...notesForDay, newNote] };
    });
  };

  const handleToggleNote = (dateString, noteId) => {
    setDailyNotes(prevNotes => {
      const notesForDay = prevNotes[dateString] || [];
      const updatedNotes = notesForDay.map(note => note.id === noteId ? { ...note, completed: !note.completed } : note);
      return { ...prevNotes, [dateString]: updatedNotes };
    });
  };


  return (
    <ToastProvider>
      <TeamProvider>
        <JobProvider>
          <Router basename="/">
            <div className="App-layout-wrapper">
              {isAuthenticated ? ( // Ha be van jelentkezve, mutassuk az alkalmazást
                <>
                  <Header onLogout={handleLogout} /> {/* onLogout prop a headernek */}
              <div className="main-content-area">
                <Sidebar />
                <main className="app-content">
                  <Routes>
                    {/* A HomePage már nem kapja meg a 'jobs' és a 'notes' propokat, Context-ből olvassa */}
                    <Route path="/" element={<HomePage notes={dailyNotes} onAddNote={handleAddNote} onToggleNote={handleToggleNote} />} />
                    {/* A TasksPage és JobDetailPage már nem kapja meg a 'jobs' és 'on...' propokat */}
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/:jobId" element={<JobDetailPage />} />
                    {/* A CalendarPage már nem kapja meg a 'jobs' propot */}
                    <Route path="/calendar" element={<CalendarPage />} />
                    {/* A TeamPage és TeamMemberDetailPage sem kap már 'team' propot */}
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/team/:memberId" element={<TeamMemberDetailPage />} />
                  </Routes>
                </main>
              </div>
              <Footer />
               </>
              ) : ( // Ha nincs bejelentkezve, mutassuk a login oldalt
                <LoginPage onLogin={handleLogin} />
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