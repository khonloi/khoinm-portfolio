import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Khoi NM - Creative Developer',
        short_name: 'Khoi NM',
        description: 'Khoi NM\'s creative developer portfolio',
        theme_color: '#008080',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '192x192',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6000000 // 6MB to accommodate Sanity studio chunk
      }
    })
  ],
  base: './',  // Use relative paths for better portability across different hosting (Vercel, GitHub Pages)
  build: {
    assetsInlineLimit: 0, // Ensures proper asset handling
    rollupOptions: {
      output: {
        // Generate files with content hash for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Split vendor chunks for better caching and smaller sizes
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['@emailjs/browser']
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'styled-components']
  }
});