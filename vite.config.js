// vite.config.js

// Vite ke liye core config import
import { defineConfig } from 'vite'

// React support plugin
import react from '@vitejs/plugin-react'

// Tailwind CSS support
import tailwindcss from '@tailwindcss/vite'

// Config export
export default defineConfig({
  // Plugins section: React + Tailwind
  plugins: [
    react(),
    tailwindcss()
  ],

  // Dev server config (local development)
  server: {
    port: 5174 // Change as needed
  },

  // Build settings (for production)
  build: {
    chunkSizeWarningLimit: 1000, // Ignore size warnings

    // Code minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,    // Remove console.log in production
        drop_debugger: true    // Remove debugger in production
      }
    }

    // ⚠️ NOTE: manualChunks removed to prevent Vercel crash
  },

  // Aliases (if needed, mostly optional for basic React projects)
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom'
    }
  }
})
