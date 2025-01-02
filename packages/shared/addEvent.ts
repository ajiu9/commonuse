import type { AnyFunction, AnyObject } from './types'

/**
 * addEvent() event delegate, supports multiple delegates
 *
 * @param element - js dom object
 * @param type - The event type. No need to add on
 * @param handler - callback method
 */
export function addEvent(element: AnyObject, type: string, handler: AnyFunction) {
  if (element.addEventListener)
    element.addEventListener(type, handler, false)
  else {
    if (!handler.$$guid) handler.$$guid = addEvent.guid++

    if (!element.events) element.events = {}

    let handlers = element.events[type]
    if (!handlers) {
      handlers = element.events[type] = {}

      if (element[`on${type}`])
        handlers[0] = element[`on${type}`]
    }

    handlers[handler.$$guid] = handler

    element[`on${type}`] = handleEvent
  }
}
// a counter used to create unique IDs
addEvent.guid = 1

/**
 * handleEvent() to execute the event
 *
 * @private
 * @param event - event type
 * @returns returnValue
 */
function handleEvent(this: any, event: any): boolean {
  let returnValue = true
  // eslint-disable-next-line ts/no-this-alias
  const that = this
  // Capturing event objects (IE uses global event objects)
  event = event || fixEvent(((this.ownerDocument || this.document || that).parentWindow || window).event)
  const handlers = (this as any).events[event.type]

  for (const i in handlers) {
    (this as any).$$handleEvent = handlers[i]
    if ((this as any).$$handleEvent(event) === false)
      returnValue = false
  }
  return returnValue
}

/**
 * Add some "missing" functions to IE's event objects
 *
 * @private
 * @param event - event type
 * @returns event returns the event that completes the missing method
 */
function fixEvent(event: any): any {
  event.preventDefault = fixEvent.preventDefault
  event.stopPropagation = fixEvent.stopPropagation
  return event
}
fixEvent.preventDefault = function () {
  (this as any).returnValue = false
}
fixEvent.stopPropagation = function () {
  (this as any).cancelBubble = true
}
