import ajiu9 from '@ajiu9/eslint-config'

export default ajiu9({
  formatters: true,
}, {
  ignores: [
    '**/cache',
    '**/dist',
  ],
})
