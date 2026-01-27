import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // This is the "brain" that tells Astro how to handle .tsx files
  integrations: [
    react(), 
    tailwind()
  ],
});