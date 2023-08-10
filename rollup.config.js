import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import terser from '@rollup/plugin-terser'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const masterVersion = require('./package.json').version

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

console.log('masterVersion', masterVersion)

const outputConfigs = {
    'esm-bundler': {
      file: resolve(`dist/${name}.esm-bundler.js`),
      format: `es`
    },
    cjs: {
      file: resolve(`dist/${name}.cjs.js`),
      format: `cjs`
    }
  }

const defaultFormats = ['esm-bundler', 'cjs']
const packageFormats = packageOptions.formats || defaultFormats

const packageConfigs = []

if (process.env.NODE_ENV === 'production') {
    packageFormats.forEach(format => {
      if (packageOptions.prod === false) {
        return
      }
      if (format === 'cjs') {
        packageConfigs.push(createProductionConfig(format))
      }
      if (/^(global|esm-browser)?/.test(format)) {
        packageConfigs.push(createMinifiedConfig(format))
      }
    })
}
  
export default packageConfigs

function createConfig(format, output, plugins = []) {
    if (!output) {
        // console.log(chalk.yellow(`invalid format: "${format}"`))
        process.exit(1)
    }
    const isNodeBuild = format === 'cjs'
    if (isNodeBuild) {
        output.esModule = true
    }

    const entryFile = 'index.js'
    return {
        input: resolve(entryFile),
        output
    }
}

function createProductionConfig(format) {
    return createConfig(format, {
        file: resolve(`dist/${name}.${format}.prod.js`),
        format: outputConfigs[format].format
    })
}

function createMinifiedConfig(format) {
    return createConfig(
      format,
      {
        file: outputConfigs[format].file.replace(/\.js$/, '.prod.js'),
        format: outputConfigs[format].format
      },
      [
        terser({
          module: /^esm/.test(format),
          compress: {
            ecma: 2015,
            pure_getters: true
          },
          safari10: true
        })
      ]
    )
  }
