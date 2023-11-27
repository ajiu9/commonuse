export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
export const noop = () => {}

export const now = () => Date.now()
export const timestamp = () => +Date.now()

const toString = Object.prototype.toString
export const toTypeString = (value: unknown): string => toString.call(value)
export const isObject = (val: any): val is object => toString.call(val) === '[object Object]'

export const isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]'
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    (isObject(val) || isFunction(val))
    && isFunction((val as any).then)
    && isFunction((val as any).catch)
  )
}

export const hasOwn = <T extends object, K extends keyof T>(val: T, key: K): key is K => Object.prototype.hasOwnProperty.call(val, key)
