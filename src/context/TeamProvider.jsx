// src/context/TeamProvider.jsx
import React, { useState, useEffect } from 'react';
import { TeamContext } from './TeamContext';
import { useToast } from './useToast'; // Toast használatához

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ezt használod

export const TeamProvider = ({ children }) => {
  const [team, setTeam] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true); // ÚJ: Betöltési állapot
  const { showToast } = useToast();

    // Segédfüggvény a token lekéréséhez
  const getAuthHeaders = () => {
    const token = localStorage.getItem('amire_auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };


  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoadingTeam(true); // FONTOS: Indítjuk a betöltést
      const token = localStorage.getItem('amire_auth_token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/team`, { headers: getAuthHeaders() });
        if (response.status === 401 || response.status === 403) {
          // showToast("Kérem, jelentkezzen be újra!", "error");
          localStorage.removeItem('amire_auth_token');
          return;
        }
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTeam(data);
        setIsLoadingTeam(false); // FONTOS: Befejezzük a betöltést
        // showToast("Csapat sikeresen betöltve!", "success");
      } catch (error) {
        console.error("Hiba a csapatadatok lekérésekor:", error);
        // showToast("Hiba a csapatadatok betöltésekor!", "error");
      }
    };
    fetchTeam();
  }, []); // FONTOS: showToast eltávolítása a függőségi listából

  // --- CSAPAT KEZELÉSE ---

  const addTeamMember = async (newMemberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/team`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMemberData), 
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newMemberFromBackend = await response.json(); // A backend adja vissza a teljes objektumot, ID-vel
      setTeam(prevTeam => [...prevTeam, newMemberFromBackend]); // EZ A JAVÍTOTT SOR!
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
        headers: getAuthHeaders(), // Token küldése
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
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedMemberData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedMemberFromBackend = await response.json(); // A backend adja vissza a frissített objektumot
      setTeam(prevTeam => prevTeam.map(member => 
        member.id === updatedMemberFromBackend.id ? updatedMemberFromBackend : member
      )); // EZ A JAVÍTOTT SOR!
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
        headers: getAuthHeaders(), // Token küldése
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
    isLoadingTeam, // ÚJ: Átadjuk a betöltési állapotot
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