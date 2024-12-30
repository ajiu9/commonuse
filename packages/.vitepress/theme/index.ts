import type { Theme } from 'vitepress'
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import '@shikijs/vitepress-twoslash/style.css'
import './style.css'
import 'uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx: any) {
    ctx.app.use(TwoSlashFloatingVue)
  },
} satisfies Theme
