export const EMPTY_OBJ: { readonly [key: string]: any } = {}
export const EMPTY_ARR = []
export const NOOP = () => {}

/**
 * Always return false.
 */
export const NO = () => false

export const extend = Object.assign
