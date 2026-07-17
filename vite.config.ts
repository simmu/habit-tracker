import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,        // moved off Vite's default 5173 (in use elsewhere); parallel
                       // worktrees override this on the CLI (--port 5181, 5182, ...)
    strictPort: true,  // fail loudly if the port is taken instead of silently picking
                       // another — a silent switch would break worktree isolation
    // allow the cloudflared demo tunnel through Vite's host check. Leading dot = any
    // subdomain, so every fresh *.trycloudflare.com URL works without re-editing.
    allowedHosts: ['.trycloudflare.com'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
