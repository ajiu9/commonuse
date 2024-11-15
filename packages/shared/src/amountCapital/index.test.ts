import { describe, expect, it } from 'vitest'

import { amountCapital } from '.'

describe('amountCapital', () => {
  it('Zero', () => {
    expect(amountCapital(0)).toBe('')
  })
  it('Null undefined or empty string', () => {
    expect(amountCapital('')).toBe(void 0)
    expect(amountCapital(null)).toBe(void 0)
    expect(amountCapital(undefined)).toBe(void 0)
  })

  it('Number', () => {
    expect(amountCapital(100)).toBe('壹佰元整')
    expect(amountCapital(100.53)).toBe('壹佰元伍角叁分')
    expect(amountCapital('100.53')).toBe('壹佰元伍角叁分')
  })

  it('Decimal length', () => {
    expect(amountCapital(500.555)).toBe('伍佰元伍角伍分')
  })
  it('Negative number', () => {
    expect(amountCapital(-100)).toBe('欠壹佰元整')
  })
})
