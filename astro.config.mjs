// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // <--- Importamos el plugin de Vite

import preact from "@astrojs/preact";

export default defineConfig({
  // Eliminamos tailwind() de 'integrations'
  integrations: [preact()], 
  
  vite: {
    plugins: [tailwindcss()], // <--- Lo agregamos aquí
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
        prefixDefaultLocale: false 
    }
  },
})