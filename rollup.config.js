import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'

// import polyfillNode from 'rollup-plugin-polyfill-node'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// const masterVersion = require('./package.json').version

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, process.env.TARGET)

const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve('package.json'))
const packageOptions = pkg.buildOptions || {}
const name = packageOptions.filename || path.basename(packageDir)

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: 'es',
  },
  'cjs': {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  'global': {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife',
  },
}

const defaultFormats = ['esm-bundler', 'cjs']
const packageFormats = packageOptions.formats || defaultFormats

const packageConfigs = []

if (process.env.NODE_ENV === 'production') {
  packageFormats.forEach((format) => {
    if (packageOptions.prod === false)
      return

    if (format === 'cjs')
      packageConfigs.push(createProductionConfig(format))

    if (/^(global|esm-browser)?/.test(format))
      packageConfigs.push(createMinifiedConfig(format))
  })
}

export default packageConfigs

function createConfig(format, output, plugins = []) {
  if (!output) {
    // console.log(chalk.yellow(`invalid format: "${format}"`))
    process.exit(1)
  }
  output.exports = 'auto'

  const isNodeBuild = format === 'cjs'
  const isGlobalBuild = /global/.test(format)

  if (isNodeBuild)
    output.esModule = true

  output.sourcemap = !!process.env.SOURCE_MAP
  output.externalLiveBindings = false

  if (isGlobalBuild)
    output.name = packageOptions.name

  const entryFile = 'src/index.ts'
  return {
    input: resolve(entryFile),
    // Global and Browser ESM builds inline everything so that they can be
    // used alone.
    external: resolveExternal(),
    plugins: [
      esbuild({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        sourceMap: output.sourcemap,
        minify: false,
        target: isNodeBuild ? 'es2019' : 'es2015',
        // define: resolveDefine()
      }),
      nodeResolve(),
      // polyfillNode(),
      ...plugins,
    ],
    output,
    // treeshake: {
    //   moduleSideEffects: false,
    // },
  }

  function resolveExternal() {
    return {
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      // for commonuse
      ...['path', 'url', 'stream'],
    }
  }
}

function createProductionConfig(format) {
  return createConfig(format, {
    file: resolve(`dist/${name}.${format}.js`),
    format: outputConfigs[format].format,
  })
}

function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.js'),
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: format.startsWith('esm'),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
        safari10: true,
      }),
    ],
  )
}
