import { defineConfig } from 'vitepress'
import viteConfig from './vite.config'

export default defineConfig({
  title: 'Commonuse',
  description: 'Collection of Essential Js Utilities',
  lang: 'en-US',
  ignoreDeadLinks: true,
  lastUpdated: true,

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },

  themeConfig: {
    nav: [
      { text: 'Examples', link: '/markdown-examples' },
      {
        text: 'Functions',
        items: [
          {
            text: '',
            items: [
              { text: 'All Functions', link: '/functions#' },
            ],
          },
          {
            text: 'Core', items: [
              { text: 'Shared', link: '/functions#category=animation' },
            ],
          },
          {
            text: 'Animation', items: [
              { text: 'Animation', link: '/functions#category=animation' },
            ],
          },
          {
            text: 'Shared', items: [
              { text: 'Shared', link: '/functions#category=animation' },
            ],
          },
        ],
      },
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
  head: [
    ['meta', { name: 'author', content: 'Ajiu9' }],
    ['meta', { property: 'og:title', content: 'CommonUse' }],
    ['meta', { property: 'og:description', content: 'Collection of Essential Js Utilities' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
  vite: viteConfig,
})
