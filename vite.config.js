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
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: '/og-image.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/og-image.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        background_color: '#008080',
        display: 'standalone'
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6000000, // 6MB to accommodate Sanity studio chunk
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,ttf,cur}']
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
          'vendor-utils': ['@emailjs/browser'],
          'vendor-sanity': ['sanity', 'sanity/structure'],
        }
      }
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@features': '/src/features',
      '@config': '/src/config',
      '@data': '/src/data',
      '@lib': '/src/lib',
      '@assets': '/src/assets',
      '@context': '/src/context',
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});