import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind every interface. Vite's default `localhost` resolved to ::1 only on
    // this machine, so http://127.0.0.1:5173 was refused and browsers that try
    // IPv4 first showed a dead localhost. `true` also exposes the LAN URL for
    // phone testing without the extra --host flag.
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
  },
})
