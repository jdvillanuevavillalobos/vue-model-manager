// test/vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: ['../test/setup.ts'] // si tienes un setup global opcional
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  }
})
