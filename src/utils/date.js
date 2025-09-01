// src/utils/date.js
import moment from 'moment'; // Importáljuk a moment.js-t

// Mostantól ez a függvény a moment.js-t használja a YYYY-MM-DD string generálásához.
// Garantáltan időzóna-konzisztens lesz.
export const toYYYYMMDD = (date) => {
  // A moment() funkció képes a Date objektumokat kezelni, és formázni őket.
  // A 'YYYY-MM-DD' a moment.js formázási stringje.
  return moment(date).format('YYYY-MM-DD');
};

// Ez a segédfüggvény már nem feltétlenül szükséges, de megtartjuk a biztonság kedvéért,
// ha valahol explicit Date objektumot kellene létrehoznunk és normalizálnunk.
export const normalizeDateToLocalMidnight = (date) => {
  // A moment() már alapból a helyi időt veszi alapul, és a startOf('day') normalizálja éjfélre.
  return moment(date).startOf('day').toDate(); // Visszaalakítjuk natív Date objektummá, ha kell
};