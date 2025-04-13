import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  preview: {
    host: true, 
    port: 4173,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
