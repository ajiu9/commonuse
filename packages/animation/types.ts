export type TimingFunction = (v: number) => number
export type TemplateFunction = (v: number) => number

export interface AnimationObject {
  [key: string]: any
}

export interface AnimationConfig {
  object: AnimationObject
  property: string
  startValue: number
  endValue: number
  duration: number
  delay: number
  timingFunction: TimingFunction
  template: TemplateFunction
}

export type TimelineState = 'initial' | 'started' | 'paused'

export declare class Animation {
  object: AnimationObject
  property: string
  startValue: number
  endValue: number
  duration: number
  delay: number
  timingFunction: TimingFunction
  template: TemplateFunction
  constructor(config: AnimationConfig)
  receiveTime(time: number): void
}
