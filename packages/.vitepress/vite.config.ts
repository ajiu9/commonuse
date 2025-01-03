import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { markdownTransform } from './plugins/markdownTransform'

export default defineConfig({
  server: {
    fs: {
      allow: [
        resolve(__dirname, '..'),
      ],
    },
  },
  plugins: [
    // custom
    markdownTransform(),

    // plugins
    Components({
      dirs: resolve(__dirname, 'theme/components'),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: resolve(__dirname, 'components.d.ts'),
      transformer: 'vue3',
    }),
    UnoCSS(),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@ajiu9/animation': resolve(__dirname, '../animation/index.ts'),
      '@ajiu9/shared': resolve(__dirname, '../shared/index.ts'),
      '@ajiu9/gesture': resolve(__dirname, '../gesture/index.ts'),
    },
  },
})
