import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**'],
      exclude: ['src/test/**', 'src/assets/**'],
    },
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
});
