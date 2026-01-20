// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import preact from "@astrojs/preact";

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [preact()], 
  
  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
        prefixDefaultLocale: false 
    }
  },
})