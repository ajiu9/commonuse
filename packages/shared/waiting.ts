/**
 * waiting for a while
 *
 * @param milliseconds - waiting time (milliseconds)
 * @param throwOnTimeout - throw on timeout
 */
export const waiting = (milliseconds: number, throwOnTimeout = false): Promise<void> =>
  new Promise((resolve, reject) => setTimeout(throwOnTimeout ? reject : resolve, milliseconds))
