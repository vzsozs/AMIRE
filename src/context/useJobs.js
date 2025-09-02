// src/context/useJobs.js
import { useContext } from 'react';
import { JobContext } from './JobContext'; // Importáljuk a Context-et

// Custom hook a JobContext egyszerűbb használatához
// Ezt fogják a komponensek importálni és használni.
export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};