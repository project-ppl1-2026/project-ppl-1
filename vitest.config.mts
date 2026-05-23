import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    alias: {
      // Vitest tidak baca __mocks__ otomatis seperti Jest
      'server-only': fileURLToPath(new URL('./__mocks__/server-only.ts', import.meta.url)),
      // baseline/service tidak ada di project, mock agar test tidak crash saat resolve
      '@/lib/baseline/service': fileURLToPath(new URL('./__mocks__/baseline-service.ts', import.meta.url)),
    },
  },
})
