import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { cpus } from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { execa, execaSync } from 'execa'
import minimist from 'minimist'

import { targets as allTargets } from './utils.js'

const require = createRequire(import.meta.url)
const args = minimist(process.argv.slice(2))
// const targets = args._
// console.log(targets)

const commit = execaSync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
// console.log(commit)
// console.log('process.argv', process.argv, process.argv.slice(2))

run()
function run() {
  buildAll(allTargets)
}

async function buildAll(targets) {
  await runParallel(cpus().length, targets, build)
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency)
        await Promise.race(executing)
    }
  }
  return Promise.all(ret)
}

async function build(target) {
  const pkgDir = path.resolve(`packages/${target}`)
  const pkg = require(`${pkgDir}/package.json`)

  // ignore private package
  if (pkg.private) return
  // remove dist
  if (existsSync(`${pkgDir}/dist`))
    fs.rm(`${pkgDir}/dist`, { recursive: true })

  await execa('rollup',
    [
      '-c',
      '--environment',
      [
        `COMMIT:${commit}`,
        `TARGET:${target}`,
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' },
  )
}
