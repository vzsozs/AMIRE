// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// FONTOS: Ezek az importok kellenek az ESM környezetben a __dirname alternatívájához
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Ez a függvény a __dirname megfelelője ESM környezetben
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname); // Most már ez működni fog
  const env = loadEnv(mode, rootDir, ''); // Betöltjük a környezeti változókat

  return {
    plugins: [react()],
    base: '/',
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
    },
  };
});