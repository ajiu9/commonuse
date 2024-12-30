import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import viteConfig from './vite.config'

const Guide = [
  { text: 'Get Started', link: '/guide/' },
]
const DefaultSideBar = [
  { text: 'Guide', items: Guide },
]

export default defineConfig({
  title: 'Cuse',
  description: 'Collection of Essential Js Utilities',
  lang: 'en-US',
  ignoreDeadLinks: true,
  lastUpdated: true,

  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide' },
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
      {
        text: 'Animation', link: '/animation',
      },
      {
        text: 'Gesture', link: '/gesture',
      },
    ],
    sidebar: {
      '/guide/': DefaultSideBar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ajiu9/vistara' },
    ],
  },
  head: [
    ['meta', { name: 'author', content: 'Ajiu9' }],
    ['meta', { property: 'og:title', content: 'Cuse' }],
    ['meta', { property: 'og:description', content: 'Collection of Essential Js Utilities' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
  vite: viteConfig,
})
