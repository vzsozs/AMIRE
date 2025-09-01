// src/components/DailyTeamList.jsx
import React, { useContext, useMemo } from 'react';
import { TeamContext } from '../context/TeamContext';
import { toYYYYMMDD } from '../utils/date'; // Visszaimportáljuk a közös függvényt
import { FaUserCircle } from 'react-icons/fa';
import './DailyTeamList.css';

function DailyTeamList({ date }) {
  const { team } = useContext(TeamContext);

  const dateString = useMemo(() => toYYYYMMDD(date), [date]);

  const availableOnDate = useMemo(() => {
    if (!Array.isArray(team)) return [];
    return team.filter(member => member.availability?.includes(dateString));
  }, [team, dateString]);

  return (
    <div className="daily-team-list">
      {availableOnDate.length > 0 ? (
        availableOnDate.map(member => (
          <div key={member.id} className="daily-team-item">
            <FaUserCircle style={{ color: member.color, fontSize: '1.5em' }} />
            <span>{member.name}</span>
          </div>
        ))
      ) : (
        <p className="no-data-message">Ezen a napon senki sem jelezte, hogy elérhető.</p>
      )}
    </div>
  );
}

export default DailyTeamList;