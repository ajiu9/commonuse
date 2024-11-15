import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
// import 'uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {},
} satisfies Theme
