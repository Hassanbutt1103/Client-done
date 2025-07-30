import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    port: 5174
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'ui-vendor';
            }
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            if (id.includes('react-icons')) {
              return 'icon-vendor';
            }
            if (id.includes('socket.io')) {
              return 'socket-vendor';
            }
            return 'vendor';
          }
          // Route-based chunks
          if (id.includes('/pages/Admin/')) {
            return 'admin';
          }
          if (id.includes('/pages/Manager/')) {
            return 'manager';
          }
          if (id.includes('/pages/Financial/') || id.includes('/pages/AccessFoeEach/Financial')) {
            return 'financial';
          }
          if (id.includes('/pages/Engineering/') || id.includes('/pages/AccessFoeEach/Engineering')) {
            return 'engineering';
          }
          if (id.includes('/pages/Commercial/') || id.includes('/pages/AccessFoeEach/Commercial')) {
            return 'commercial';
          }
          if (id.includes('/pages/Purchasing/')) {
            return 'purchasing';
          }
          if (id.includes('/pages/HR/')) {
            return 'hr';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
