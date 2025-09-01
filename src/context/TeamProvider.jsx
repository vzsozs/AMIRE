// src/context/TeamProvider.jsx
import React, { useState } from 'react';
import { TeamContext } from './TeamContext'; // Importáljuk a szomszédos fájlból

export const TeamProvider = ({ children, initialTeam }) => {
  const [team, setTeam] = useState(initialTeam);

  const handleAddTeamMember = (newMemberData) => {
    const newMember = { id: Date.now(), color: `#${Math.floor(Math.random()*16777215).toString(16)}`, ...newMemberData };
    setTeam(prevTeam => [...prevTeam, newMember]);
  };
  const handleDeleteTeamMember = (memberIdToDelete) => {
    setTeam(prevTeam => prevTeam.filter(p => p.id !== memberIdToDelete));
  };
  const handleUpdateTeamMember = (updatedMemberData) => {
    setTeam(prevTeam => prevTeam.map(member => member.id === updatedMemberData.id ? { ...member, ...updatedMemberData } : member));
  };
  const handleToggleAvailability = (memberId, dateString) => {
    setTeam(prevTeam => prevTeam.map(member => {
      if (member.id === memberId) {
        const availability = member.availability || [];
        if (availability.includes(dateString)) {
          return { ...member, availability: availability.filter(d => d !== dateString) };
        } else {
          return { ...member, availability: [...availability, dateString] };
        }
      }
      return member;
    }));
  };
  
  const value = {
    team,
    addTeamMember: handleAddTeamMember,
    deleteTeamMember: handleDeleteTeamMember,
    updateTeamMember: handleUpdateTeamMember,
    toggleAvailability: handleToggleAvailability,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};