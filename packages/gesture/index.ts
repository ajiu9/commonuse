type TouchIdentifier = number

export interface GestureRecognizer {
  start: (point: MouseEvent | Touch, context: GestureContext) => void
  move: (point: MouseEvent | Touch, context: GestureContext) => void
  end: (point: MouseEvent | Touch, context: GestureContext) => void
  cancel: (point: MouseEvent | Touch, context: GestureContext) => void
}

interface GestureContext {
  startX?: number
  startY?: number
  points?: { t: number, x: number, y: number }[]
  isTap?: boolean
  isPan?: boolean
  isPress?: boolean
  isVertical?: boolean
  handler?: number | null
  isFlick?: boolean
}

export class Listener {
  private isListeningMouse = false
  private contexts: Map<TouchIdentifier | string, GestureContext> = new Map()

  constructor(private element: Element, private recognizer: GestureRecognizer) {
    this.setupMouseListeners()
    this.setupTouchListeners()
  }

  private setupMouseListeners(): void {
    const el: HTMLElement = document.documentElement

    this.element.addEventListener('mousedown', (event: Event) => {
      const mouseEvent = event as MouseEvent
      const context = Object.create(null)
      this.contexts.set(`mouse${1 << mouseEvent.button}`, context)

      this.recognizer.start(mouseEvent, context)

      const mouseMove = (event: Event) => {
        const mouseEvent = event as MouseEvent
        let button = 1
        while (button <= mouseEvent.buttons) {
          if (button & mouseEvent.buttons) {
            let key
            if (button === 2) key = 4
            else if (button === 4) key = 2
            else key = button

            const context = this.contexts.get(`mouse${key}`)
            if (context) this.recognizer.move(mouseEvent, context)
          }
          button = button << 1
        }
      }

      const mouseup = (event: Event) => {
        const mouseEvent = event as MouseEvent
        const context = this.contexts.get(`mouse${1 << mouseEvent.button}`)
        if (context) this.recognizer.end(mouseEvent, context)
        this.contexts.delete(`mouse${1 << mouseEvent.button}`)

        if (mouseEvent.buttons === 0) {
          el.removeEventListener('mousemove', mouseMove as EventListener)
          el.removeEventListener('mouseup', mouseup as EventListener)
          this.isListeningMouse = false
        }
      }

      if (!this.isListeningMouse) {
        el.addEventListener('mousemove', mouseMove as EventListener)
        el.addEventListener('mouseup', mouseup as EventListener)
        this.isListeningMouse = true
      }
    })
  }

  private setupTouchListeners(): void {
    this.element.addEventListener('touchstart', (event: Event) => {
      const touchEvent = event as TouchEvent
      for (const touch of touchEvent.changedTouches) {
        const context = Object.create(null)
        this.contexts.set(touch.identifier, context)
        this.recognizer.start(touch, context)
      }
    })

    this.element.addEventListener('touchmove', (event: Event) => {
      const touchEvent = event as TouchEvent
      for (const touch of touchEvent.changedTouches) {
        const context = this.contexts.get(touch.identifier)
        if (context) {
          event.preventDefault()
          this.recognizer.move(touch, context)
        }
      }
    })

    this.element.addEventListener('touchend', (event: Event) => {
      const touchEvent = event as TouchEvent
      for (const touch of touchEvent.changedTouches) {
        const context = this.contexts.get(touch.identifier)
        if (context) {
          this.recognizer.end(touch, context)
          this.contexts.delete(touch.identifier)
        }
      }
    })

    this.element.addEventListener('touchcancel', (event: Event) => {
      const touchEvent = event as TouchEvent
      for (const touch of touchEvent.changedTouches) {
        const context = this.contexts.get(touch.identifier)
        if (context) {
          this.recognizer.cancel(touch, context)
          this.contexts.delete(touch.identifier)
        }
      }
    })
  }
}

export class Recognizer {
  constructor(private dispatcher: Dispatcher) {}

  start(point: MouseEvent | Touch, context: GestureContext): void {
    context.startX = point.clientX
    context.startY = point.clientY
    this.dispatcher.dispatch('start', {
      clientX: point.clientX,
      clientY: point.clientY,
    })
    context.points = [{
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    }]
    context.isTap = true
    context.isPan = false
    context.isPress = false
    context.handler = setTimeout(() => {
      context.isTap = false
      context.isPan = false
      context.isPress = true
      context.handler = null
      this.dispatcher.dispatch('press', {})
    }, 500) as unknown as number
  }

  move(point: MouseEvent | Touch, context: GestureContext): void {
    const dx = point.clientX - context.startX!
    const dy = point.clientY - context.startY!
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isPan = true
      context.isTap = false
      context.isPress = false
      context.isVertical = Math.abs(dx) - Math.abs(dy) >= 0
      clearTimeout(context.handler ?? undefined)
      this.dispatcher.dispatch('panStart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
    }

    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
      })
    }
    context.points = context.points!.filter(point => Date.now() - point.t < 500)
    context.points!.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY,
    })
  }

  end(point: MouseEvent | Touch, context: GestureContext): void {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
      })
      clearTimeout(context.handler ?? undefined)
    }
    if (context.isPress)
      this.dispatcher.dispatch('pressEnd', {})

    context.points = context.points!.filter(point => Date.now() - point.t < 500)

    let v = 0
    if (context.points!.length) {
      const d = Math.sqrt((point.clientX - context.points![0].x) ** 2 + (point.clientY - context.points![0].y) ** 2)
      v = d / (Date.now() - context.points![0].t)
    }
    if (v > 1.5) {
      context.isFlick = true
      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      })
    }
    else
      context.isFlick = false

    if (context.isPan) {
      this.dispatcher.dispatch('panEnd', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v,
      })
    }
    this.dispatcher.dispatch('end', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isVertical: context.isVertical,
      isFlick: context.isFlick,
      isPan: context.isPan,
      velocity: v,
    })
  }

  cancel(point: MouseEvent | Touch, context: GestureContext): void {
    clearTimeout(context.handler!)
    this.dispatcher.dispatch('cancel', {})
  }
}

interface GestureEvent extends Event {
  [key: string]: any // 允许任意字符串键
}

export class Dispatcher {
  constructor(private element: Element) {}

  dispatch(type: string, properties: Record<string, any>): void {
    const event = new Event(type) as GestureEvent
    for (const name in properties)
      event[name] = properties[name]

    this.element.dispatchEvent(event)
  }
}

export function enableGesture(element: Element): void {
  // eslint-disable-next-line no-new
  new Listener(element, new Recognizer(new Dispatcher(element)))
}
