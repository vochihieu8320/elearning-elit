import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/', // Set the base path for the admin app
  server: {
    port: 3002,
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-redux'], // FIX BUG
  },
})
