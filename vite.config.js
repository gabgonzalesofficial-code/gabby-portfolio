import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/three')) {
            return 'vendor-three'
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})