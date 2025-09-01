// src/components/DailyTeamList.jsx
import React, { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';
import { FaUserCircle } from 'react-icons/fa';
import './DailyTeamList.css';

// 1. A BIZTONSÁG KEDVÉÉRT A SEGÉDFÜGGVÉNYT ITT, HELYBEN DEFINIÁLJUK
const toYYYYMMDD = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error("toYYYYMMDD hibás dátumot kapott:", date);
    return null;
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function DailyTeamList({ date }) {
  const { team } = useContext(TeamContext);

  // 2. LÉPÉSRŐL-LÉPÉSRE TÖRTÉNŐ HIBAKERESÉS
  console.log("--- DailyTeamList Render ---");
  console.log("1. Megkapott 'date' prop:", date);

  const dateString = toYYYYMMDD(date);
  console.log("2. Generált 'dateString':", dateString);
  
  console.log("3. Szűrés előtti 'team' lista:", team);

  const availableOnDate = Array.isArray(team) 
    ? team.filter(member => {
        const hasDate = member.availability?.includes(dateString);
        // Minden csapattagra kiírjuk, hogy a mai napon elérhető-e
        // console.log(`  - ${member.name}: ${hasDate ? 'IGEN' : 'NEM'}`);
        return hasDate;
      }) 
    : [];
  console.log("4. Szűrés utáni 'availableOnDate' lista:", availableOnDate);
  console.log("--------------------------");

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