// @ts-check
// these aliases are shared between vitest and rollup
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

function resolveEntryForPkg(p) {
  return path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages/${p}/src/index.ts`,
  )
}

const dirs = readdirSync(new URL('../packages', import.meta.url))

const entries = {
  comuse: resolveEntryForPkg('comuse'),
}

const nonSrcPackages = []

for (const dir of dirs) {
  const key = `@ajiu9/${dir}`
  if (
    dir !== 'comuse'
    && !nonSrcPackages.includes(dir)
    && !(key in entries)
    && statSync(new URL(`../packages/${dir}`, import.meta.url)).isDirectory()
  )
    entries[key] = resolveEntryForPkg(dir)
}
console.log('entries', entries)
export { entries }
