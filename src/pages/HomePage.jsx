// src/pages/HomePage.jsx
import React, { useMemo, useContext } from 'react'; // useContext-et importálunk
import { TeamContext } from '../context/TeamContext'; // TeamContext-et importálunk
import { useJobs } from '../context/useJobs';
import { Link } from 'react-router-dom';
import { JobContext } from '../context/JobContext'; // ÚJ IMPORT
import EmptyState from '../components/EmptyState'; // ÚJ IMPORT
import { FaUserCircle, FaExclamationTriangle, FaPlus, FaCheckCircle, FaTasks, FaUsers } from 'react-icons/fa'; // FaTasks, FaUsers ikonok
import { toYYYYMMDD, normalizeDateToLocalMidnight } from '../utils/date';
import './HomePage.css';

function HomePage() { // Már nem kapja meg a 'jobs' propot
  //const [newNoteText, setNewNoteText] = useState('');
  
  // FONTOS: Most már a Context-ből olvassuk a team-et
  const { team } = useContext(TeamContext);
  const { jobs } = useJobs();

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
  
  // ÚJ: Még el nem végzett to-do elemek összegyűjtése az összes munkából
  const uncompletedTodosToday = useMemo(() => {
    const todayTodos = [];
    jobs.forEach(job => {
      (job.todoList || []).forEach(todo => {
        // Csak azokat a to-do-kat vesszük figyelembe, amik nincsenek elvégezve
        // és valamilyen módon "maira" vonatkoznak (pl. a munka ma ütemezve van)
        // Ezt a logikát később finomíthatjuk!
        if (!todo.completed && job.schedule?.includes(todayString)) {
          todayTodos.push({ ...todo, jobId: job.id, jobTitle: job.title, jobColor: job.color });
        }
      });
    });
    return todayTodos;
  }, [jobs, todayString]);

  //const todaysNotes = useMemo(() => (notes && notes[todayString]) ? notes[todayString] : [], [notes, todayString]);

  /*const handleAddNoteClick = () => {
    if (newNoteText.trim() === '') return;
    onAddNote(todayString, newNoteText);
    setNewNoteText('');
  };*/

  return (
    <div className="home-page-container">
      <div className="home-header">
        <h1>Helló</h1>
        <p>Itt a mai nap legfontosabb információi.</p>
      </div>

      {/* --- AKTUÁLIS TEENDŐK KÁRTYA (ÚJ NÉV) --- */}
      <div className="dashboard-card notes-card">
        <h2 className="card-title">Aktuális Teendők</h2> {/* ÚJ CÍM */}
        <div className="notes-list"> {/* Újrahasználjuk a notes-list osztályt */}
          {uncompletedTodosToday.length > 0 ? (
            uncompletedTodosToday.map(todo => (
              <Link to={`/tasks/${todo.jobId}`} key={todo.id} className="note-item" style={{ borderLeft: `5px solid ${todo.jobColor}` }}>
                <span className="note-text">{todo.text} ({todo.jobTitle})</span>
                <FaCheckCircle style={{ color: '#4CAF50' }} /> {/* Egy pipa ikon, jelezve, hogy teendő */}
              </Link>
            ))
          ) : (
            <EmptyState 
              icon={<FaTasks />} 
              title="Nincs aktuális teendő" 
              message="Jó hír, ma nincs elvégzetlen feladatod, vagy a munkák nincsenek ütemezve mára." 
            />
          )}
        </div>
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
            <EmptyState 
              icon={<FaTasks />} 
              title="Nincs aktív projekt" 
              message="Jelenleg nincsenek folyamatban lévő munkák." 
            />
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

    </div>
  );
}

export default HomePage;