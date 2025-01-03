import type { Plugin } from 'vite'
import { format } from 'prettier'
import ts from 'typescript'
import { functionNames, getFunction } from '../../../packages/metadata/metadata'

console.log(functionNames, `${functionNames.join('|')}`)
export function markdownTransform(): Plugin {
  return {
    name: 'comuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null
      console.log(id)

      // linkify function names
      // code = code.replace(
      //   new RegExp(`\`({${functionNames.join('|')}})\`(.)`, 'g'),
      //   (_, name, ending) => {
      //     if (ending === ']') // already a link
      //       return _
      //     const fn = getFunction(name)!
      //     return `[\`${fn.name}\`](${fn.docs}) `
      //   },
      // )
      const [pkg, _name, i] = id.split('/').slice(-3)
      const name = functionNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n')
        const firstHeader = code.search(/\n#{2,6}\s.+/)
        const sliceIndex = firstHeader < 0 ? frontmatterEnds < 0 ? 0 : frontmatterEnds + 4 : firstHeader

        // Insert JS/TS code blocks
        await replaceAsync(code, /\n```ts( [^\n]+)?\n(.+?)\n```\n/gs, async (_, meta = '', snippet = '') => {
          const formattedTS = (await format(snippet.replace(/\n+/g, '\n'), { semi: false, singleQuote: true, parser: 'typescript' })).trim()
          const js = ts.transpileModule(formattedTS, {
            compilerOptions: { target: 99 },
          })
          const formattedJS = (await format(js.outputText, { semi: false, singleQuote: true, parser: 'typescript' }))
            .trim()

          console.log('formattedJS: ', formattedJS)
          console.log('js: ', js)
        })
      }

      return code
    },
  }
}

function replaceAsync(str: string, match: RegExp, replacer: (substring: string, ...args: any[]) => Promise<string>) {
  const promises: Promise<string>[] = []
  str.replace(match, (...args) => {
    promises.push(replacer(...args))
    return ''
  })
  return Promise.all(promises).then(replacements => str.replace(match, () => replacements.shift()!))
}
