import { Keymap } from '@ajiu9/shared'

export function useKeyMap(element: HTMLElement) {
  return new Keymap(element)
}
