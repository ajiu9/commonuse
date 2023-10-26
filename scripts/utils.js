import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const allTargets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory())
    return false

  const pkg = require(`../packages/${f}/package.json`)
  if (pkg.private && !pkg.buildOptions)
    return false

  return true
})

export const targets = (() => {
  let ret = allTargets.slice()
  // const name = 'commonuse'
  // const index = ret.findIndex(item => item === name)
  // ret.splice(index, 1)
  return ret
})()
