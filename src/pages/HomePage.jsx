// src/pages/HomePage.jsx
import React, { useState, useMemo, useContext } from 'react'; // useContext-et importálunk
import { TeamContext } from '../context/TeamContext'; // TeamContext-et importálunk
import { Link } from 'react-router-dom';
import { FaUserCircle, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
// A DailyTeamList-et már nem használjuk itt, így az importot törölhetjük:
// import DailyTeamList from '../components/DailyTeamList';
import { toYYYYMMDD, normalizeDateToLocalMidnight } from '../utils/date';
import './HomePage.css';

function HomePage({ jobs, notes, onAddNote, onToggleNote }) {
  const [newNoteText, setNewNoteText] = useState('');
  
  // FONTOS: Most már a Context-ből olvassuk a team-et
  const { team } = useContext(TeamContext);

  // Normalizált mai dátum objektum
  const todayDateObject = useMemo(() => normalizeDateToLocalMidnight(new Date()), []);
  // Mai dátum string
  const todayString = useMemo(() => toYYYYMMDD(todayDateObject), [todayDateObject]);

  // --- Adatok előkészítése ---

  const activeJobs = useMemo(() => {
    return jobs.filter(job => job.status === 'Folyamatban');
  }, [jobs]);

  // A "Mai Csapat" listát most már ITT, helyben számoljuk ki.
  const availableToday = useMemo(() => {
    // Biztosítjuk, hogy a 'team' tömb legyen
    if (!Array.isArray(team)) {
      return [];
    }
    return team.filter(member => member.availability?.includes(todayString));
  }, [team, todayString]); // Akkor számolja újra, ha a team vagy a todayString változik.

  const upcomingDeadlines = useMemo(() => {
    return jobs.filter(job => {
      const deadline = normalizeDateToLocalMidnight(new Date(job.deadline)); // Normalizáljuk
      const today = normalizeDateToLocalMidnight(new Date()); // Normalizáljuk
      const nextWeek = normalizeDateToLocalMidnight(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)); // Normalizáljuk
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

      {/* --- A "MAI CSAPAT" KÁRTYA MOST MÁR A HELYI SZŰRÉS EREDMÉNYÉT MUTATJA --- */}
      <div className="dashboard-card">
        <h2 className="card-title">Mai Csapat ({availableToday.length})</h2>
        <div className="team-list-mini">
          {availableToday.length > 0 ? (
            availableToday.map(member => (
              <div key={member.id} className="team-item-mini">
                <FaUserCircle style={{ color: member.color, fontSize: '1.5em' }} />
                <span>{member.name}</span>
              </div>
            ))
          ) : (
            <p className="no-data-message">Ma senki sem jelezte, hogy elérhető.</p>
          )}
        </div>
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