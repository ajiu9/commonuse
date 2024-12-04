// genaret by ChatGPT
import type { AnimationConfig } from './index'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Animation, TimeLine } from './index'

// Mock requestAnimationFrame and cancelAnimationFrame to avoid the need for an actual animation frame.
vi.stubGlobal('requestAnimationFrame', (callback: (time: number) => void) => setTimeout(callback, 16))
vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))

describe('Animation Class', () => {
  it('should initialize animation with correct parameters', () => {
    const object = { opacity: 0 }
    const config: AnimationConfig = {
      object,
      property: 'opacity',
      startValue: 0,
      endValue: 1,
      duration: 1000,
      delay: 0,
      timingFunction: (v: number) => v,
      template: (v: number) => v,
    }

    const animation = new Animation(config)

    expect(animation.object).toBe(object)
    expect(animation.property).toBe('opacity')
    expect(animation.startValue).toBe(0)
    expect(animation.endValue).toBe(1)
    expect(animation.duration).toBe(1000)
    expect(animation.delay).toBe(0)
  })

  it('should update object property when receiveTime is called', () => {
    const object = { opacity: 0 }
    const config: AnimationConfig = {
      object,
      property: 'opacity',
      startValue: 0,
      endValue: 1,
      duration: 1000,
      delay: 0,
      timingFunction: (v: number) => v,
      template: (v: number) => v,
    }

    const animation = new Animation(config)
    animation.receiveTime(500)

    expect(object.opacity).toBeCloseTo(0.5, 2) // Allowing for slight differences (2 decimal places)
  })
})

describe('TimeLine Class', () => {
  let timeline: TimeLine
  let animation: Animation
  const object = { opacity: 0 }

  beforeEach(() => {
    // Create a new timeline and animation before each test
    timeline = new TimeLine()
    animation = new Animation({
      object,
      property: 'opacity',
      startValue: 0,
      endValue: 1,
      duration: 1000,
      delay: 0,
      timingFunction: (v: number) => v,
      template: (v: number) => v,
    })

    // Enable fake timers for the tests
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Clear fake timers after each test
    vi.useRealTimers()
  })

  it('should initialize with state "initial"', () => {
    expect(timeline.state).toBe('initial')
  })

  it('should start the timeline', () => {
    timeline.start()
    expect(timeline.state).toBe('started')
  })

  it('should add animation correctly', () => {
    timeline.add(animation)
    // We cannot directly check `ANIMATIONS`, but we can check the effect of adding the animation.
    // So let's check if the animation is applied by simulating time and verifying the animation effect.
    vi.advanceTimersByTime(500) // Simulate time passing
    expect(object.opacity).toBeCloseTo(0, 2) // Using `toBeCloseTo` to allow small variations
  })

  it('should start the animation when timeline starts', () => {
    timeline.start()
    timeline.add(animation)

    // Simulate the passage of time (e.g., after 500ms)
    vi.advanceTimersByTime(500)

    expect(object.opacity).toBeCloseTo(0.5, 2)
  })

  it('should pause the timeline', () => {
    timeline.start()
    timeline.pause()
    expect(timeline.state).toBe('paused')
  })

  it('should resume the timeline from paused state', () => {
    timeline.start()
    timeline.pause()
    timeline.resume()
    expect(timeline.state).toBe('started')
  })

  it('should reset the timeline to initial state', () => {
    timeline.start()
    timeline.add(animation)
    timeline.reset()

    expect(timeline.state).toBe('initial')
  })

  it('should handle pause and resume with correct timing', () => {
    timeline.start()
    timeline.add(animation)

    // Simulate passing of time
    vi.advanceTimersByTime(500)

    timeline.pause()

    timeline.resume()

    vi.advanceTimersByTime(500)
    expect(object.opacity).toBeCloseTo(1, 2) // Use toBeCloseTo for time differences
  })
})
