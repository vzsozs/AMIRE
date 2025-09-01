// src/utils/date.js

// Ez a függvény a felhasználó böngészőjének helyi időzónája alapján dolgozik.
export const toYYYYMMDD = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }
  const year = date.getFullYear(); // Vissza: getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Vissza: getMonth()
  const day = String(date.getDate()).padStart(2, '0');   // Vissza: getDate()
  return `${year}-${month}-${day}`;
};