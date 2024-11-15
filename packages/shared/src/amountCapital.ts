const decimalLength: number = 2
const handleNumericalAccuracy = (numerical: string): string => {
  let resultNumerical: string = ''
  const [integerValue, decimalValue = ''] = numerical.split('.')

  const decimalValueLength: number = decimalValue.length
  if (decimalValueLength <= decimalLength)
    resultNumerical = numerical
  else if (decimalValueLength > decimalLength)
    resultNumerical = `${integerValue}.${decimalValue.substr(0, decimalLength)}`

  return resultNumerical
}

/**
 * Converts a number to its Chinese capital representation.
 * @param {number | null | undefined} n - The number to convert.
 * @returns {string | void} - The Chinese capital representation of the number, or `void` if the input is invalid.
 */

type T = number | null | undefined | ''
export function amountCapital(n: T): string | void {
  if (n === null || n === undefined || n === '') return
  n = parseFloat(handleNumericalAccuracy(n.toString()))
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿', '兆'],
    ['', '拾', '佰', '仟'],
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    const numItem = (n * 10 * 10 ** i).toFixed(2)
    const digitIndex = Math.floor(Number(numItem)) % 10
    s += (digit[digitIndex] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head
    + s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '')
  )
}
