import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,        // moved off Vite's default 5173 (in use elsewhere)
    strictPort: true,  // fail loudly if 5180 is taken instead of silently picking another
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
