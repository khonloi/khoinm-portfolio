import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    include: ['react', 'react-dom', 'sanity', 'styled-components']
  }
});