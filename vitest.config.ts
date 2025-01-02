import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/shared': resolve(__dirname, 'packages/shared/index.ts'),
    },
    dedupe: [
      'vue',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
  test: {
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, 'packages/.test/setup.ts')],
    reporters: 'dot',
    server: {
      deps: {
        inline: [
          'vue',
          'msw',
        ],
      },
    },
    coverage: {
      exclude: ['./packages/**/demo.vue'],
    },
  },
})
