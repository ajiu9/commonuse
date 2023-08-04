// import { execa, execaSync } from 'execa'
import minimist from 'minimist'

// import { createRequire } from 'node:module'
import { targets as allTargets } from './utils.js'

// const require = createRequire(import.meta.url)
const args = minimist(process.argv.slice(2))
const targets = args._
console.log(targets)
console.log('allTargets', allTargets)

// const commit = execaSync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)
// console.log(execaSync('git', ['rev-parse', 'HEAD']))
// console.log(commit)

// console.log('process', process)
// console.log('process.argv', process.argv, process.argv.slice(2))

run()
async function run() {
  console.log('start')

  //  // Similar to `echo unicorns > stdout.txt` in Bash
  // await execa('echo', ['unicorns']).pipeStdout('stdout.txt');

  // // Similar to `echo unicorns 2> stdout.txt` in Bash
  // await execa('echo', ['unicorns']).pipeStderr('stderr.txt');

  // Similar to `echo unicorns &> stdout.txt` in Bash
  // await execa('echo', ['unicorns'], {all: true}).pipeAll('all.txt');

  // Similar to `cat < stdin.txt` in Bash
  // const { stdout } = await execa('cat', { inputFile: 'stdin.txt' }).pipeStderr('stderr.txt');
  // console.log(stdout)
  // => 'unicorns'

  //   const {stdout} = await execa('echo', ['unicorns']).pipeStdout(process.stdout);
  // // Prints `unicorns`
  // console.log(stdout);
  // Also returns 'unicorns'

  //   const data = await execa('echo', ['unicorns']).pipeStdout(process.stdout);
  // // // Prints `unicorns`
  // console.log(data);

  //   // Similar to `echo unicorns | cat` in Bash
  //   const { stdout } = await execa('echo', ['unicorns']).pipeStdout(execa('cat'))
  //   console.log(stdout)
  // // => 'unicorns'

  // // Catching an error
  // try {
  //   await execa('unknown', ['command'])
  // }
  // catch (error) {
  //   console.log('error,', error)
  //   /*
  //   {
  //     message: 'Command failed with ENOENT: unknown command spawn unknown ENOENT',
  //     errno: -2,
  //     code: 'ENOENT',
  //     syscall: 'spawn unknown',
  //     path: 'unknown',
  //     spawnargs: ['command'],
  //     originalMessage: 'spawn unknown ENOENT',
  //     shortMessage: 'Command failed with ENOENT: unknown command spawn unknown ENOENT',
  //     command: 'unknown command',
  //     escapedCommand: 'unknown command',
  //     stdout: '',
  //     stderr: '',
  //     failed: true,
  //     timedOut: false,
  //     isCanceled: false,
  //     killed: false
  //   }
  // */
  // }
  // const subprocess = execa('node')

  // setTimeout(() => {
  //   subprocess.kill('SIGTERM', {
  //     forceKillAfterTimeout: 2000,
  //   })
  // }, 1000)
}
