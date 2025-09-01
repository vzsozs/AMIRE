// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamProvider'; 
import moment from 'moment'; // EZ AZ ÚJ IMPORT
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
  { id: 1, title: 'Gábor Lakásfelújítás', status: 'Folyamatban', deadline: '2025-09-15', description: 'Teljes lakásfestés, glettelés és mázolás.', assignedTeam: [1, 4], 
    schedule: ['2025-09-01', '2025-09-02', '2025-09-03', '2025-09-04'], // ÚJ: ütemezés
    color: '#FF6F00' // ÚJ: munka színe
  },
  { id: 2, title: 'Kovács Iroda Festés', status: 'Befejezve', deadline: '2025-08-20', description: 'Az iroda tárgyalójának és folyosójának tisztasági festése.', assignedTeam: [1], 
    schedule: ['2025-08-18', '2025-08-19', '2025-08-20'],
    color: '#3F51B5'
  },
  { id: 3, title: 'Nagy Családi Ház Vízszerelés', status: 'Folyamatban', deadline: '2025-09-30', description: 'Fürdőszoba és konyha vízvezetékeinek cseréje.', assignedTeam: [2], 
    schedule: ['2025-09-29', '2025-09-30'],
    color: '#00BCD4'
  },
  { id: 4, title: 'Tervezési Fázis - Új Projekt', status: 'Függőben', deadline: '2025-10-05', description: 'Új építkezés előkészítése, anyagbeszerzés tervezése.', assignedTeam: [], 
    schedule: [],
    color: '#8BC34A'
  },
];

const initialTeam = [
  { 
    id: 1, name: 'Varga Béla', role: 'Festő, Mázoló', color: '#FF6F00', phone: '+36301234567', email: 'bela@amire.hu',
    // Itt nem kell moment objektum, stringként maradnak
    availability: ['2025-09-01', '2025-09-16', '2025-09-17'] 
  },
  { 
    id: 2, name: 'Kiss Mária', role: 'Vízvezeték-szerelő', color: '#1E88E5', phone: '+36301112222', email: 'maria@amire.hu',
    availability: ['2025-09-17', '2025-09-18', '2025-09-29', '2025-09-30'] 
  },
  { 
    id: 3, name: 'Nagy Gábor', role: 'Projektvezető', color: '#00ACC1', phone: '+36209876543', email: 'gabor@amire.hu',
    availability: ['2025-09-01', '2025-09-22', '2025-09-23'] 
  },
  { 
    id: 4, name: 'Horváth Éva', role: 'Segédmunkás', color: '#7CB342', phone: '', email: 'eva@amire.hu',
    availability: ['2025-09-01', '2025-09-16'] 
  },
];

function App() {
  const [jobs, setJobs] = useState(initialJobs);
  const [dailyNotes, setDailyNotes] = useState({});

  useEffect(() => {
    const today = moment();
    const yesterday = moment().subtract(1, 'days');

    const todayString = today.format('YYYY-MM-DD');
    const yesterdayString = yesterday.format('YYYY-MM-DD');

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
    // ÚJ: Alapértelmezett szín és üres ütemezés az új munkának
    color: newJobData.color || '#607D8B', // Ha nincs megadva szín, egy alap szürke
    schedule: newJobData.schedule || [],
    ...newJobData,
  };
  setJobs(prevJobs => [...prevJobs, newJob]);
};
  const handleDeleteJob = (jobIdToDelete) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobIdToDelete));
  };
  
  const handleUpdateJob = (updatedJobData) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === updatedJobData.id 
        ? { 
            ...job, 
            ...updatedJobData,
            // Biztosítjuk, hogy a deadline is YYYY-MM-DD formátumú string legyen
            deadline: moment(updatedJobData.deadline).format('YYYY-MM-DD') 
          } 
        : job
    ));
  };
  
  // ÚJ FÜGGVÉNY: Munka ütemezésének váltása (hozzáadás/törlés egy napról)
  const handleToggleJobSchedule = (jobId, dateString) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        const schedule = job.schedule || [];
        if (schedule.includes(dateString)) {
          return { ...job, schedule: schedule.filter(d => d !== dateString) };
        } else {
          return { ...job, schedule: [...schedule, dateString] };
        }
      }
      return job;
    }));
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
                    onToggleJobSchedule={handleToggleJobSchedule} // ÚJ PROP
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