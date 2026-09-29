import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Khoi NM - Full-Stack Developer',
        short_name: 'Khoi NM',
        description: "Khoi NM's full-stack developer portfolio",
        theme_color: '#b26b93',
        lang: 'en',
        categories: ['entertainment', 'productivity'],
        icons: [
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        background_color: '#b26b93',
        display: 'standalone',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000, // 3MB limit
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,ttf,cur}'],
        globIgnores: ['**/vendor-sanity*'],
        navigateFallbackDenylist: [/^\/editor/],
      },
    }),
  ],
  base: './', // Use relative paths for better portability across different hosting (Vercel, GitHub Pages)
  build: {
    assetsInlineLimit: 0, // Ensures proper asset handling
    rollupOptions: {
      output: {
        // Generate files with content hash for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Split vendor chunks for better caching and smaller sizes
        manualChunks(id) {
          if (
            id.includes('node_modules/sanity') ||
            id.includes('node_modules/@sanity')
          ) {
            return 'vendor-sanity';
          }
          if (id.includes('node_modules/@emailjs')) {
            return 'vendor-utils';
          }
        },
      },
    },
    // Enable source maps for debugging (hidden from public view but uploadable to error monitoring)
    sourcemap: 'hidden',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
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
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
