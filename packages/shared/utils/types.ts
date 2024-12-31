/**
 * Void function
 */
export type Fn = () => void

/**
 * Any function
 */
export type AnyFn = (...args: any[]) => any

export interface Pausable {
  /**
   * A ref indicate whether a pausable instance is active
   */
  isActive: Readonly<boolean>

  /**
   * Temporary pause the effect from executing
   */
  pause: Fn

  /**
   * Resume the effects
   */
  resume: Fn
}
