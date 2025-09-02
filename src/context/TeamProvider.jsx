// src/context/TeamProvider.jsx
import React, { useState, useEffect } from 'react';
import { TeamContext } from './TeamContext';
import { useToast } from './useToast'; // Toast használatához

const API_BASE_URL = 'http://localhost:3001/api'; // Backend API alap URL

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState([]);
  const { showToast } = useToast();

  // Adatok lekérése a backendről a komponens betöltődésekor
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/team`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTeam(data);
      } catch (error) {
        console.error("Hiba a csapatadatok lekérésekor:", error);
        showToast("Hiba a csapatadatok betöltésekor!", "error");
      }
    };
    fetchTeam();
  }, [showToast]);

  // --- CSAPAT KEZELÉSE ---

  const addTeamMember = async (newMemberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newMember = await response.json();
      setTeam(prevTeam => [...prevTeam, newMember]);
      showToast("Csapattag sikeresen hozzáadva!", "success");
    } catch (error) {
      console.error("Hiba új csapattag hozzáadása során:", error);
      showToast("Hiba új csapattag hozzáadása során!", "error");
    }
  };

  const deleteTeamMember = async (memberIdToDelete) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${memberIdToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setTeam(prevTeam => prevTeam.filter(member => member.id !== memberIdToDelete));
      showToast("Csapattag sikeresen törölve!", "success");
    } catch (error) {
      console.error("Hiba csapattag törlésekor:", error);
      showToast("Hiba csapattag törlésekor!", "error");
    }
  };

  const updateTeamMember = async (updatedMemberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team/${updatedMemberData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMemberData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedMember = await response.json();
      setTeam(prevTeam => prevTeam.map(member => member.id === updatedMember.id ? updatedMember : member));
      showToast("Csapattag sikeresen frissítve!", "success");
    } catch (error) {
      console.error("Hiba csapattag frissítésekor:", error);
      showToast("Hiba csapattag frissítésekor!", "error");
    }
  };

  const toggleAvailability = async (memberId, dateString) => {
    try {
      const memberToUpdate = team.find(member => member.id === memberId);
      if (!memberToUpdate) throw new Error('Csapattag nem található.');
      const availability = memberToUpdate.availability || [];
      const updatedAvailability = availability.includes(dateString) 
        ? availability.filter(d => d !== dateString) 
        : [...availability, dateString];
      const memberToSend = { ...memberToUpdate, availability: updatedAvailability };

      const response = await fetch(`${API_BASE_URL}/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedMember = await response.json();
      setTeam(prevTeam => prevTeam.map(member => member.id === updatedMember.id ? updatedMember : member));
      showToast("Elérhetőség frissítve!", "success");
    } catch (error) {
      console.error("Hiba elérhetőség frissítésekor:", error);
      showToast("Hiba elérhetőség frissítésekor!", "error");
    }
  };
  
  const value = {
    team,
    addTeamMember,
    deleteTeamMember,
    updateTeamMember,
    toggleAvailability,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};