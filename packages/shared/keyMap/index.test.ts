import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Keymap } from './index'

describe('Keymap', () => {
  let keymap: Keymap
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    keymap = new Keymap(mockElement)
  })

  it('should initialize with default target', () => {
    expect(keymap.getTarget()).toBe('default')
    expect(keymap.getMap()).toEqual({ default: {} })
  })

  it('should bind a single key to a handler', () => {
    const handler = vi.fn()
    keymap.bind('Enter', handler)

    expect(keymap.getBindings('default').enter).toBe(handler)
  })

  it('should bind multiple keys to a handler', () => {
    const handler = vi.fn()
    keymap.bind(['Enter', 'Space'], handler)

    const space = Keymap.getNormalizedKey('Space')

    expect(keymap.getBindings('default').enter).toBe(handler)
    expect(keymap.getBindings('default')[space]).toBe(handler)
  })

  it('should unbind a single key', () => {
    const handler = vi.fn()
    keymap.bind('Enter', handler)
    keymap.unbind('Enter')

    expect(keymap.getBindings('default').enter).toBeUndefined()
  })

  it('should unbind multiple keys', () => {
    const handler = vi.fn()
    keymap.bind(['Enter', 'Space'], handler)
    keymap.unbind(['Enter', 'Space'])

    const space = Keymap.getNormalizedKey('Space')

    expect(keymap.getBindings('default').enter).toBeUndefined()
    expect(keymap.getBindings('default')[space]).toBeUndefined()
  })

  it('should unbind all keys for a target', () => {
    const handler = vi.fn()
    keymap.bind(['Enter', 'Space'], handler)
    keymap.unbindTarget()

    const enter = Keymap.getNormalizedKey('Enter')

    expect(keymap.getBindings('custom')[enter]).toBeUndefined()
  })

  it('should bind a handler to a specific target', () => {
    const handler = vi.fn()
    keymap.bindTarget('custom')
    keymap.bind('Enter', handler)

    expect(keymap.getBindings('custom').enter).toBe(handler)
  })

  it('should dispatch a keydown event and call the handler', () => {
    const handler = vi.fn()
    keymap.bind('Enter', handler)

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    keymap.dispatch(event, mockElement)

    expect(handler).toHaveBeenCalled()
  })

  it('should dispatch a keydown event with modifiers and call the handler', () => {
    const handler = vi.fn()
    keymap.bind('ctrl_enter', handler)

    const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true })
    keymap.dispatch(event, mockElement)

    expect(handler).toHaveBeenCalled()
  })

  it('should return false if the handler returns false', () => {
    const handler = vi.fn(() => false)
    keymap.bind('Enter', handler)

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    const result = keymap.dispatch(event, mockElement)

    expect(result).toBe(false)
    expect(event.cancelBubble).toBe(true)
  })

  it('should normalize key identifiers correctly', () => {
    expect(Keymap.getNormalizedKey('Ctrl+Enter')).toBe('ctrl_enter')
    const space = Keymap.getNormalizedKey('Space')
    expect(Keymap.getNormalizedKey('Shift+Alt+Space')).toBe(`alt_shift_${space}`)
    expect(Keymap.getNormalizedKey('Meta+C')).toBe('meta_c')
  })
})
