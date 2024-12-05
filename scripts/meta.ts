import type { CommonUseFunction, PackageIndexes } from '../meta'
import { existsSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import Git from 'simple-git'
import { packages } from '../meta'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
export const DIR_ROOT = resolve(__dirname, '../')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DOCS_URL = 'https://ajiu9.cn'

export const git = Git(DIR_ROOT)

export async function listFunctions(dir: string, ignore: string[] = []) {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [
    ],
  }
  for (const info of packages) {
    const dir = join(DIR_SRC, `${info.name}/src`)
    const functions = await listFunctions(dir)

    const pkg = {
      ...info,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
      docs: undefined,
    }

    indexes.packages[info.name] = pkg

    await Promise.all(functions.map(async (fnName) => {
      const mdPath = join(dir, fnName, 'index.md')
      const tsPath = join(dir, fnName, 'index.ts')

      const fn: CommonUseFunction = {
        name: fnName,
        package: pkg.name,
        lastUpdated: +await git.raw(['log', '-1', '--format=%at', tsPath]) * 1000,
      }

      if (!existsSync(mdPath)) {
        fn.internal = true
        indexes.functions.push(fn)
        return
      }
      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}/`
      indexes.functions.push(fn)
    }))
  }

  return indexes
}
readMetadata()
