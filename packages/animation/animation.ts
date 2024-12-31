import type { AnimationConfig, AnimationObject, TemplateFunction, TimingFunction } from './types'

export class Animation {
  object: AnimationObject
  property: string
  startValue: number
  endValue: number
  duration: number
  delay: number
  timingFunction: TimingFunction
  template: TemplateFunction

  constructor(config: AnimationConfig) {
    this.object = config.object
    this.property = config.property
    this.startValue = config.startValue
    this.endValue = config.endValue
    this.duration = config.duration
    this.delay = config.delay
    this.timingFunction = config.timingFunction
    this.template = config.template
  }

  receiveTime(time: number) {
    const range = this.endValue - this.startValue
    const progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}
