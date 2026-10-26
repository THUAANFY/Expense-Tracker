import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      atomic: true,
      // Windows saves can briefly truncate a file before writing its full contents.
      // Wait for a stable file before invalidating Vite's module cache and sending HMR.
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 50,
      },
    },
  },
})
