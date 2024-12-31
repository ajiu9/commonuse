// import { tryOnScopeDispose } from '@vueuse/shared'
import type { Pausable } from '@ajiu9/shared'
import type { ConfigurableWindow } from '../../cuse/src/_configurable'
import { defaultWindow } from '../../cuse/src/_configurable'

export interface UseRafFnCallbackArguments {
  /**
   * Time elapsed between this and the last frame.
   */
  delta: number

  /**
   * Time elapsed since the creation of the web page. See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin Time origin}.
   */
  timestamp: DOMHighResTimeStamp
}

export interface UseRafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean
  /**
   * The maximum frame per second to execute the function.
   * Set to `undefined` to disable the limit.
   *
   * @default undefined
   */
  fpsLimit?: number
}

/**
 * Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
 *
 * @see https://vueuse.org/useRafFn
 * @param fn
 * @param options
 */
export function useRafFn(fn: (args: UseRafFnCallbackArguments) => void, options: UseRafFnOptions = {}): Pausable {
  const {
    immediate = true,
    fpsLimit = undefined,
    window = defaultWindow,
  } = options

  let isActive = false
  const intervalLimit = fpsLimit ? 1000 / fpsLimit : null
  let previousFrameTimestamp = 0
  let rafId: null | number = null

  function loop(timestamp: DOMHighResTimeStamp) {
    if (!isActive || !window)
      return

    const delta = timestamp - (previousFrameTimestamp || timestamp)

    if (intervalLimit && delta < intervalLimit) {
      rafId = window.requestAnimationFrame(loop)
      return
    }

    fn({ delta, timestamp })

    previousFrameTimestamp = timestamp
    rafId = window.requestAnimationFrame(loop)
  }

  function resume() {
    if (!isActive && window) {
      isActive = true
      rafId = window.requestAnimationFrame(loop)
    }
  }

  function pause() {
    isActive = false
    if (rafId != null && window) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  if (immediate)
    resume()

  // tryOnScopeDispose(pause)

  return {
    isActive,
    pause,
    resume,
  }
}
