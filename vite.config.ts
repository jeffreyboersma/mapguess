import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_PATH || '/',
    // Vite automatically exposes VITE_* variables to import.meta.env
    // No need to use define - it works out of the box!
  }
})
