// src/pages/CalendarPage.jsx
import React, { useState, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { toYYYYMMDD } from '../utils/date';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DailyTeamList from '../components/DailyTeamList';

function CalendarPage({ jobs }) {
  const { team } = useContext(TeamContext);
  // CSUPÁN EGYETLEN DÁTUM ÁLLAPOTRA VAN SZÜKSÉGÜNK
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Az 'activeStartDate' állapotot teljesen eltávolítottuk.

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      const availableMembersOnDay = Array.isArray(team) ? team.filter(member => 
        member.availability?.includes(dateString)
      ) : [];
      const hasDeadlineOnDay = Array.isArray(jobs) ? jobs.some(job => job.deadline === dateString) : false;

      if (availableMembersOnDay.length === 0 && !hasDeadlineOnDay) return null;
      
      return (
        <div className="day-markers">
          <div className="availability-dots">
            {availableMembersOnDay.slice(0, 3).map(member => (
              <div key={member.id} className="availability-dot" style={{ backgroundColor: member.color }}></div>
            ))}
          </div>
          {hasDeadlineOnDay && <div className="deadline-strip"></div>}
        </div>
      );
    }
    return null;
  };

  const formatNavigationLabel = (date) => {
    const year = date.getFullYear();
    // EZ A JAVÍTOTT SOR:
    const month = date.toLocaleDateString('hu-HU', { month: 'long' });
    return (
      <div className="custom-navigation-label">
        <div className="year">{year}.</div>
        <div className="month">{month}</div>
      </div>
    );
  };

  // A LAPOZÓ FÜGGVÉNYEK MOST MÁR A 'selectedDate'-ET MÓDOSÍTJÁK
  const handlePrevMonth = () => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Ez a számítás most már mindig a helyes 'selectedDate' alapján történik
  const jobsForSelectedDay = Array.isArray(jobs) ? jobs.filter(job => {
    if (!job.deadline) return false;
    const deadlineDate = new Date(job.deadline);
    return deadlineDate.toDateString() === selectedDate.toDateString();
  }) : [];

  return (
    <div className="calendar-page-container">
      <div className="calendar-page-header">
        <h1>Naptár</h1>
        <p>Tekintse meg a munkák határidejét a naptárban.</p>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate} // A naptár mindig a 'selectedDate'-et mutatja
          // Az 'activeStartDate' propot eltávolítottuk
          tileContent={tileContent}
          locale="hu-HU"
          navigationLabel={({ date }) => formatNavigationLabel(date)}
          showNeighboringMonth={false}
          prev2Label={null}
          next2Label={null}
          prevLabel={null}
          nextLabel={null}
        />
        <div className="custom-calendar-nav">
          <button onClick={handlePrevMonth} className="custom-nav-button">
            <FaChevronLeft />
          </button>
          <button onClick={handleNextMonth} className="custom-nav-button">
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="selected-day-jobs">
        <h2>A kiválasztott napon esedékes munkák:</h2>
        {jobsForSelectedDay.length > 0 ? (
          jobsForSelectedDay.map(job => (
            <div key={job.id} className="selected-day-job-item">
              <Link to={`/tasks/${job.id}`}>{job.title}</Link>
            </div>
          ))
        ) : (
          <p>Nincs esedékes munka ezen a napon.</p>
        )}
        <h2 style={{ marginTop: '20px' }}>Mai csapat:</h2>
        <DailyTeamList date={selectedDate} />
      </div>
    </div>
  );
}

export default CalendarPage;