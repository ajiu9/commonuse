import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { categoryNames, metadata } from '../metadata/metadata'
import viteConfig from './vite.config'

const Guide = [
  { text: 'Get Started', link: '/guide/' },
]
const DefaultSideBar = [
  { text: 'Guide', items: Guide },
]

const FunctionsSideBar = getFunctionsSideBar()

export default defineConfig({
  title: 'Comuse',
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
              { text: 'Recent Updated', link: '/functions#sort=updated' },
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
              { text: 'Ease', link: '/functions#category=ease' },
            ],
          },
          {
            text: 'Gesture', link: '/gesture',
          },
          {
            text: 'Shared', items: [
              { text: 'Shared', link: '/functions#category=shared' },
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
      '/functions': FunctionsSideBar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ajiu9/vistara' },
    ],
  },
  head: [
    ['meta', { name: 'author', content: 'Ajiu9' }],
    ['meta', { property: 'og:title', content: 'Comuse' }],
    ['meta', { property: 'og:description', content: 'Collection of Essential Js Utilities' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
  vite: viteConfig,
})

function getFunctionsSideBar() {
  const links = []

  for (const name of categoryNames) {
    if (name.startsWith('_'))
      continue

    const functions = metadata.functions.filter(i => i.category === name && !i.internal)

    links.push({
      text: name,
      items: functions.map(i => ({
        text: i.name,
        link: i.external || `/${i.package}/${i.name}/`,
      })),
      link: name.startsWith('@')
        ? (functions[0].external || `/${functions[0].package}/README`)
        : undefined,
    })
  }

  return links
}
