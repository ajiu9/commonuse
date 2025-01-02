import type { Theme } from 'vitepress'
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import { functions } from '../../../packages/metadata/metadata'
import '@shikijs/vitepress-twoslash/style.css'

import './style.css'
import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.use(TwoSlashFloatingVue)

    ctx.router.onBeforeRouteChange = (to: string) => {
      const name = to.replace(/\.html$/i, '').replace(/^\//, '')
      if (name.includes('/'))
        return
      const fn = functions.find(f => f.name === name)
      if (!fn)
        return

      setTimeout(() => ctx.router.go(`/${fn.package}/${fn.name}/`), 0)
      // Abort the navigation
      return false
    }
  },
} satisfies Theme
