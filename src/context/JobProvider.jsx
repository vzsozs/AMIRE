// src/context/JobProvider.jsx
import React, { useState, useEffect } from 'react';
import { JobContext } from './JobContext';
import moment from 'moment';
import { useToast } from './useToast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true); // ÚJ: Betöltési állapot
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
    const fetchJobs = async () => {
      setIsLoadingJobs(true); // FONTOS: Indítjuk a betöltést
      const token = localStorage.getItem('amire_auth_token');
      // FONTOS: Itt NEM szabad showToast-ot hívni, ha csak nincs token
      if (!token) return; 

      try {
        const response = await fetch(`${API_BASE_URL}/jobs`, { headers: getAuthHeaders() });
        if (response.status === 401 || response.status === 403) { // Autentikációs hiba
          // showToast("Kérem, jelentkezzen be újra!", "error"); // Opcionális
          localStorage.removeItem('amire_auth_token'); // Töröljük a rossz tokent
          // Itt egy globális authentikációs állapotot kellene frissíteni, ami visszadob a login oldalra.
          // Mivel nincs ilyen globális AuthContext-ünk, most csak a tokent töröljük.
          return;
        }
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setJobs(data);
        setIsLoadingJobs(false); // FONTOS: Befejezzük a betöltést
        // showToast("Munkák sikeresen betöltve!", "success"); // Opcionális toast
      } catch (error) {
        console.error("Hiba a munkák adatainak lekérésekor:", error);
        // showToast("Hiba a munkák betöltésekor!", "error"); // Ezt is kikommentelem
      }
    };
    fetchJobs();
  }, []); // FONTOS: showToast eltávolítása a függőségi listából, hogy ne okozzon végtelen ciklust



  // --- MUNKÁK KEZELÉSE ---

  const addJob = async (newJobData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: getAuthHeaders(), // Token küldése
        body: JSON.stringify(newJobData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const newJob = await response.json();
      setJobs(prevJobs => [...prevJobs, newJob]);
      showToast("Munka sikeresen hozzáadva!", "success");
    } catch (error) {
      console.error("Hiba új munka hozzáadása során:", error);
      showToast("Hiba új munka hozzáadása során!", "error");
    }
  };

  const deleteJob = async (jobIdToDelete) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobIdToDelete}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), // Token küldése
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobIdToDelete));
      showToast("Munka sikeresen törölve!", "success");
    } catch (error) {
      console.error("Hiba munka törlésekor:", error);
      showToast("Hiba munka törlésekor!", "error");
    }
  };

  const updateJob = async (updatedJobData) => {
    try {
      // Biztosítjuk a helyes dátumformátumot, mielőtt elküldjük a backendnek
      const jobToSend = {
        ...updatedJobData,
        deadline: moment(updatedJobData.deadline).format('YYYY-MM-DD')
      };
      
      const response = await fetch(`${API_BASE_URL}/jobs/${jobToSend.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Token küldése
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Munka sikeresen frissítve!", "success");
    } catch (error) {
      console.error("Hiba munka frissítésekor:", error);
      showToast("Hiba munka frissítésekor!", "error");
    }
  };

  const assignTeamMember = async (jobId, memberId) => {
    try {
      // Először frissítjük a lokális állapotot (a backend által visszakapott teljes objektummal)
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const updatedAssignedTeam = [...(jobToUpdate.assignedTeam || []), memberId];
      const jobToSend = { ...jobToUpdate, assignedTeam: updatedAssignedTeam };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Token küldése
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json(); // A backend a frissített objektumot adja vissza
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Csapattag sikeresen hozzárendelve!", "success");
    } catch (error) {
      console.error("Hiba csapattag hozzárendelésekor:", error);
      showToast("Hiba csapattag hozzárendelésekor!", "error");
    }
  };

  const unassignTeamMember = async (jobId, memberId) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const updatedAssignedTeam = (jobToUpdate.assignedTeam || []).filter(id => id !== memberId);
      const jobToSend = { ...jobToUpdate, assignedTeam: updatedAssignedTeam };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Token küldése
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Csapattag sikeresen eltávolítva!", "success");
    } catch (error) {
      console.error("Hiba csapattag eltávolításakor:", error);
      showToast("Hiba csapattag eltávolításakor:", "error");
    }
  };

  const toggleJobSchedule = async (jobId, dateString) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const schedule = jobToUpdate.schedule || [];
      const updatedSchedule = schedule.includes(dateString) 
        ? schedule.filter(d => d !== dateString) 
        : [...schedule, dateString];
      const jobToSend = { ...jobToUpdate, schedule: updatedSchedule };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Munka ütemezése frissítve!", "success");
    } catch (error) {
      console.error("Hiba munka ütemezésének frissítésekor:", error);
      showToast("Hiba munka ütemezésének frissítésekor!", "error");
    }
  };

  const addTodoItem = async (jobId, todoText) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const newTodoItem = { id: Date.now(), text: todoText, completed: false };
      const updatedTodoList = [...(jobToUpdate.todoList || []), newTodoItem];
      const jobToSend = { ...jobToUpdate, todoList: updatedTodoList };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Teendő hozzáadva!", "success");
    } catch (error) {
      console.error("Hiba teendő hozzáadásakor:", error);
      showToast("Hiba teendő hozzáadásakor!", "error");
    }
  };

  const toggleTodoItem = async (jobId, todoId) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const updatedTodoList = (jobToUpdate.todoList || []).map(item =>
        item.id === todoId ? { ...item, completed: !item.completed } : item
      );
      const jobToSend = { ...jobToUpdate, todoList: updatedTodoList };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Teendő állapota frissítve!", "success");
    } catch (error) {
      console.error("Hiba teendő állapotának frissítésekor:", error);
      showToast("Hiba teendő állapotának frissítésekor!", "error");
    }
  };

  const deleteTodoItem = async (jobId, todoId) => {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) throw new Error('Munka nem található.');
      const updatedTodoList = (jobToUpdate.todoList || []).filter(item => item.id !== todoId);
      const jobToSend = { ...jobToUpdate, todoList: updatedTodoList };

      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(jobToSend),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedJob = await response.json();
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      showToast("Teendő sikeresen törölve!", "success");
    } catch (error) {
      console.error("Hiba teendő törlésekor:", error);
      showToast("Hiba teendő törlésekor!", "error");
    }
  };
  
  const value = {
    jobs,
    isLoadingJobs, // ÚJ: Átadjuk a betöltési állapotot
    addJob,
    deleteJob,
    updateJob,
    assignTeamMember,
    unassignTeamMember,
    toggleJobSchedule,
    addTodoItem,
    toggleTodoItem,
    deleteTodoItem,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};