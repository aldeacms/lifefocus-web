// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático para Cloudflare Pages
// No necesita adapter — Cloudflare Pages sirve dist/ directamente
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});