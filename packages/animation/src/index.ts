const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

export class TimeLine {
  state: string
  constructor() {
    this.state = 'initial'
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
  }

  start() {
    if (this.state !== 'initial')
      return
    this.state = 'started'
    const startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      const now = Date.now()
      for (const animation of this[ANIMATIONS]) {
        let t
        // If the start time is less than current time
        // Set t to current time minus pause time minus delay
        if (this[START_TIME].get(animation) < startTime)
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        // Otherwise, set t to current time minus start time minus pause time minus delay
        else
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay

        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        if (t > 0)
          animation.receiveTime(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  add(animation: Animation, startTime?: number) {
    if (arguments.length < 2)
      startTime = Date.now()

    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, startTime)
  }

  pause() {
    if (this.state !== 'started')
      return
    this.state = 'paused'
    this[PAUSE_START] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if (this.state !== 'paused')
      return
    this.state = 'started'
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
    this[TICK]()
  }

  reset() {
    this.state = 'initial'
    this.pause()
    this[PAUSE_TIME] = 0
    this[PAUSE_START] = 0
    this[ANIMATIONS] = new Set()
    this[START_TIME] = new Map()
    this[TICK_HANDLER] = null
  }
}

export class Animation {
  constructor(public object: any, public property: string, public startValue: number, public endValue: number, public duration: number, public delay: number, public timingFunction: (v: number) => number, public template: (v: number) => number) {}

  receiveTime(time: number) {
    const range = this.endValue - this.startValue
    const progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}
