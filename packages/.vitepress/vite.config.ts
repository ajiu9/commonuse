import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Components({
      dirs: resolve(__dirname, 'theme/components'),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: resolve(__dirname, 'components.d.ts'),
      transformer: 'vue3',
    }),
    UnoCSS(),
    Inspect(),
  ],
})
