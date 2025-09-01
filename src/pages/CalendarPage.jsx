// src/pages/CalendarPage.jsx
import React, { useState, useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { toYYYYMMDD, normalizeDateToLocalMidnight } from '../utils/date';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarPage.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Link már nem szükséges itt, ezért töröljük
// import { Link } from 'react-router-dom'; 
import Modal from '../components/Modal';
import CalendarDayDetailsModal from '../components/CalendarDayDetailsModal';

function CalendarPage({ jobs }) {
  const { team } = useContext(TeamContext);
  const [selectedDate, setSelectedDate] = useState(() => normalizeDateToLocalMidnight(new Date()));
  
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [calendarKey, setCalendarKey] = useState(Date.now()); 

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);

      const availableMembersOnDay = Array.isArray(team) ? team.filter(member => 
        member.availability?.includes(dateString)
      ) : [];
      
      const deadlineJobsOnDay = Array.isArray(jobs) ? jobs.filter(job => job.deadline === dateString) : [];

      const scheduledJobsOnDay = Array.isArray(jobs) ? jobs.filter(job => 
        job.schedule?.includes(dateString)
      ) : [];

      if (availableMembersOnDay.length === 0 && deadlineJobsOnDay.length === 0 && scheduledJobsOnDay.length === 0) {
        return null;
      }
      
      return (
        <div className="day-markers">
          <div className="availability-dots">
            {availableMembersOnDay.slice(0, 3).map(member => (
              <div key={member.id} className="availability-dot" style={{ backgroundColor: member.color }}></div>
            ))}
          </div>
          <div className="scheduled-job-strips">
            {scheduledJobsOnDay.slice(0, 3).map(job => (
              <div key={job.id} className="scheduled-job-strip" style={{ backgroundColor: job.color }}></div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = toYYYYMMDD(date);
      const hasDeadline = Array.isArray(jobs) ? jobs.some(job => job.deadline === dateString) : false;
      if (hasDeadline) {
        return 'deadline-day';
      }
    }
    return null;
  };

  const formatNavigationLabel = (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleDateString('hu-HU', { month: 'long' });
    return (
      <div className="custom-navigation-label">
        <div className="year">{year}.</div>
        <div className="month">{month}</div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return normalizeDateToLocalMidnight(newDate);
    });
    setCalendarKey(Date.now());
  };

  const handleNextMonth = () => {
    setSelectedDate(currentDate => {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return normalizeDateToLocalMidnight(newDate);
    });
    setCalendarKey(Date.now());
  };

  const handleCalendarDayClick = (date) => {
    setModalDate(normalizeDateToLocalMidnight(date));
    setIsDetailsModalOpen(true);
    setCalendarKey(Date.now());
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setModalDate(null);
    setSelectedDate(prevDate => normalizeDateToLocalMidnight(new Date(prevDate))); 
    setCalendarKey(Date.now());
  };

  return (
    <>
      <div className="calendar-page-container">
        <div className="calendar-page-header">
          <h1>Naptár</h1>
          <p>Tekintse meg a munkák határidejét, ütemezését és a csapat elérhetőségét.</p>
        </div>
        <div className="calendar-wrapper">
          <Calendar
            key={calendarKey}
            onChange={(newDate) => setSelectedDate(normalizeDateToLocalMidnight(newDate))}
            onClickDay={handleCalendarDayClick}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            locale="hu-HU"
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
      </div>

      <Modal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal}>
        {modalDate && (
          <CalendarDayDetailsModal
            date={modalDate}
            jobs={jobs}
            onClose={handleCloseDetailsModal}
          />
        )}
      </Modal>
    </>
  );
}

export default CalendarPage;