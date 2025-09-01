// src/pages/HomePage.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import DailyTeamList from '../components/DailyTeamList';
import { toYYYYMMDD } from '../utils/date'; // A biztonságos dátumfüggvény importálása
import './HomePage.css';

function HomePage({ jobs, notes, onAddNote, onToggleNote }) {
  const [newNoteText, setNewNoteText] = useState('');

  const todayDateObject = useMemo(() => {
    const today = new Date();
    // Létrehozunk egy új dátumot a mai nap helyi éve, hónapja és napja alapján, de UTC időzónában
    return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  }, []);
  // A 'todayString' most már a biztonságos, helyi időzónát használó függvénnyel készül
  const todayString = useMemo(() => toYYYYMMDD(todayDateObject), [todayDateObject]);

  const activeJobs = useMemo(() => jobs.filter(job => job.status === 'Folyamatban'), [jobs]);
  const upcomingDeadlines = useMemo(() => {
    return jobs.filter(job => {
      const deadline = new Date(job.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return deadline >= today && deadline <= nextWeek;
    });
  }, [jobs]);
  const todaysNotes = useMemo(() => (notes && notes[todayString]) ? notes[todayString] : [], [notes, todayString]);

  const handleAddNoteClick = () => {
    if (newNoteText.trim() === '') return;
    onAddNote(todayString, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="home-page-container">
      <div className="home-header">
        <h1>Üdvözöljük!</h1>
        <p>Itt a mai nap legfontosabb információi.</p>
      </div>

      <div className="dashboard-card">
        <h2 className="card-title">Aktív Projektek ({activeJobs.length})</h2>
        <div className="job-list-mini">
          {activeJobs.length > 0 ? (
            activeJobs.slice(0, 3).map(job => (
              <Link to={`/tasks/${job.id}`} key={job.id} className="job-item-mini">
                <span className="job-title">{job.title}</span>
                <span className="job-deadline">{job.deadline}</span>
              </Link>
            ))
          ) : (
            <p className="no-data-message">Nincsenek folyamatban lévő munkák.</p>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="card-title">Mai Csapat</h2>
        <DailyTeamList date={todayDateObject} /> 
      </div>
      
      {upcomingDeadlines.length > 0 && (
        <div className="dashboard-card warning">
          <h2 className="card-title"><FaExclamationTriangle /> Közelgő Határidők</h2>
          <div className="job-list-mini">
            {upcomingDeadlines.map(job => (
              <Link to={`/tasks/${job.id}`} key={job.id} className="job-item-mini">
                <span className="job-title">{job.title}</span>
                <span className="job-deadline warning-text">{job.deadline}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="dashboard-card notes-card">
        <h2 className="card-title">Napi Jegyzetek</h2>
        <div className="notes-list">
          {todaysNotes.length > 0 ? (
            todaysNotes.map(note => (
              <div 
                key={note.id} 
                className={`note-item ${note.completed ? 'completed' : ''}`}
                onClick={() => onToggleNote(todayString, note.id)}
              >
                <span className="note-text">{note.text}</span>
                <div className="checkmark-box"></div>
              </div>
            ))
          ) : (
            <p className="no-data-message">Nincsenek mai jegyzetek.</p>
          )}
        </div>
        <div className="add-note-form">
          <input 
            type="text" 
            className="add-note-input"
            placeholder="Új jegyzet hozzáadása..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNoteClick()}
          />
          <button onClick={handleAddNoteClick} className="add-note-button">
            <FaPlus />
          </button>
        </div>
      </div>

    </div>
  );
}

export default HomePage;