import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { cpus } from 'node:os'


const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const masterVersion = require('./package.json').version

const packagesDir = path.resolve(__dirname, 'packages')
console.log('masterVersion', masterVersion)
console.log('__dirname', __dirname)
console.log('packagesDir', packagesDir)
console.log('cpus', cpus())

const packageConfigs = {}
export default packageConfigs
