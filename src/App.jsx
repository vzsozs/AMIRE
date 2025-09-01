// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamProvider'; 

import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import TeamPage from './pages/TeamPage';
import TeamMemberDetailPage from './pages/TeamMemberDetailPage';
import JobDetailPage from './pages/JobDetailPage';

const initialJobs = [
  { id: 1, title: 'Gábor Lakásfelújítás', status: 'Folyamatban', deadline: '2025-09-15', description: 'Teljes lakásfestés, glettelés és mázolás.', assignedTeam: [1, 4] },
  { id: 2, title: 'Kovács Iroda Festés', status: 'Befejezve', deadline: '2025-08-20', description: 'Az iroda tárgyalójának és folyosójának tisztasági festése.', assignedTeam: [1] },
  { id: 3, title: 'Nagy Családi Ház Vízszerelés', status: 'Folyamatban', deadline: '2025-09-30', description: 'Fürdőszoba és konyha vízvezetékeinek cseréje.', assignedTeam: [2] },
  { id: 4, title: 'Tervezési Fázis - Új Projekt', status: 'Függőben', deadline: '2025-10-05', description: 'Új építkezés előkészítése, anyagbeszerzés tervezése.', assignedTeam: [] },
];

const initialTeam = [
  { 
    id: 1, name: 'Varga Béla', role: 'Festő, Mázoló', color: '#FF6F00', phone: '+36301234567', email: 'bela@amire.hu',
    // HELYES FORMÁTUM: VEZETŐ NULLÁKKAL
    availability: ['2025-09-01', '2025-09-16', '2025-09-17'] 
  },
  { 
    id: 2, name: 'Kiss Mária', role: 'Vízvezeték-szerelő', color: '#1E88E5', phone: '+36301112222', email: 'maria@amire.hu',
    availability: ['2025-09-17', '2025-09-18', '2025-09-29', '2025-09-30'] 
  },
  { 
    id: 3, name: 'Nagy Gábor', role: 'Projektvezető', color: '#00ACC1', phone: '+36209876543', email: 'gabor@amire.hu',
    // HELYES FORMÁTUM
    availability: ['2025-09-01', '2025-09-22', '2025-09-23'] 
  },
  { 
    id: 4, name: 'Horváth Éva', role: 'Segédmunkás', color: '#7CB342', phone: '', email: 'eva@amire.hu',
    // HELYES FORMÁTUM
    availability: ['2025-09-01', '2025-09-16'] 
  },
];

function App() {
  const [jobs, setJobs] = useState(initialJobs);
  const [dailyNotes, setDailyNotes] = useState({});

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const todayString = today.toISOString().slice(0, 10);
    const yesterdayString = yesterday.toISOString().slice(0, 10);

    setDailyNotes(prevNotes => {
      const yesterdayNotes = prevNotes[yesterdayString] || [];
      const todayNotes = prevNotes[todayString] || [];
      const uncompletedFromYesterday = yesterdayNotes.filter(note => !note.completed);
      if (uncompletedFromYesterday.length === 0) return prevNotes;
      const todayNoteIds = new Set(todayNotes.map(note => note.id));
      const notesToMove = uncompletedFromYesterday.filter(note => !todayNoteIds.has(note.id));
      return { ...prevNotes, [todayString]: [...notesToMove, ...todayNotes] };
    });
  }, []);

  const handleAddJob = (newJobData) => {
    const newJob = {
      id: Date.now(),
      description: 'Nincs leírás megadva.',
      assignedTeam: newJobData.assignedTeam || [],
      ...newJobData,
    };
    setJobs(prevJobs => [...prevJobs, newJob]);
  };

  const handleDeleteJob = (jobIdToDelete) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobIdToDelete));
  };

  const handleUpdateJob = (updatedJobData) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === updatedJobData.id ? { ...job, ...updatedJobData } : job));
  };

  const handleAssignTeamMember = (jobId, memberId) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId && !job.assignedTeam.includes(memberId)) {
        return { ...job, assignedTeam: [...job.assignedTeam, memberId] };
      }
      return job;
    }));
  };

  const handleUnassignTeamMember = (jobId, memberId) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        return { ...job, assignedTeam: prevJobs.assignedTeam.filter(id => id !== memberId) };
      }
      return job;
    }));
  };

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
    <TeamProvider initialTeam={initialTeam}>
      <Router>
        <div className="App">
          <Header />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage jobs={jobs} notes={dailyNotes} onAddNote={handleAddNote} onToggleNote={handleToggleNote} />} />
              <Route path="/tasks" element={<TasksPage jobs={jobs} onAddJob={handleAddJob} />} />
              <Route
                path="/tasks/:jobId"
                element={
                  <JobDetailPage
                    jobs={jobs}
                    onDeleteJob={handleDeleteJob}
                    onUpdateJob={handleUpdateJob}
                    onAssignTeamMember={handleAssignTeamMember}
                    onUnassignTeamMember={handleUnassignTeamMember}
                  />
                }
              />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/team/:memberId" element={<TeamMemberDetailPage />} />
              <Route path="/calendar" element={<CalendarPage jobs={jobs} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </TeamProvider>
  );
}

export default App;