import { defineConfig } from 'vitepress'
import viteConfig from './vite.config'

export default defineConfig({
  title: 'Commonuse',
  description: 'Collection of Essential Js Utilities',
  lang: 'en-US',
  ignoreDeadLinks: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ajiu9/vistara' },
    ],
  },
  vite: viteConfig,
})
