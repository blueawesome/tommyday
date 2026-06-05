// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import alpinejs from '@astrojs/alpinejs';

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: 'never',
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [tailwindcss()]
  },

  integrations: [alpinejs()]
});
