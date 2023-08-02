export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;

        const contexts = new Map();
        // PC mousemove and mouseup event
        // Event listen in document.documentElement
        const el = document.documentElement;

        element.addEventListener("mousedown", event => {
            const context = Object.create(null);
            // 移位做为key
            contexts.set(`mouse${1 << event.button}`, context);
        
            recognizer.start(event, context);
        
            const mouseMove = event => {
                // mousemove中event.button may not exist
                // get event.buttons 0b00001
                let button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        // order of buttons & button property is not same
                        let key;
                        if (button === 2)
                            key = 4;
                        else if (button === 4)
                            key = 2;
                        else
                            key = button;
                        const context = contexts.get(`mouse${key}`);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            }
        
            const mouseup = event => {
                const context = contexts.get(`mouse${1 << event.button}`);
                recognizer.end(event, context);
                contexts.delete(`mouse${1 << event.button}`);
                if (event.buttons === 0) {
                    el.removeEventListener("mousemove", mouseMove);
                    el.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
            }

            if (!isListeningMouse) {
                el.addEventListener("mousemove", mouseMove);
                el.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
        
        });

        // touchstart touchmove on an element
        element.addEventListener("touchstart", event => {
            for (const touch of event.changedTouches) {
                const context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });

        element.addEventListener("touchmove", event => {
            for (const touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                // prevent event for example drop down event
                // item can interrupt touchmove
                event.preventDefault();
                recognizer.move(touch, context);
            }
        });

        element.addEventListener("touchend", event => {
            for (const touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        element.addEventListener("touchcancel", event => {
            for (const touch of event.changedTouches) {
                const context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(touch.identifier);
            }
        });
    }
    
}

export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    start(point, context) {
        context.startX = point.clientX;
        context.startY = point.clientY;
        this.dispatcher.dispatch('start', {
            clientX: point.clientX,
            clientY: point.clientY,
        });
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        }];
        context. isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch('press', {});
        }, 500);
    }
    
    move(point, context) {
        const dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            context.isVertical = Math.abs(dx) - Math.abs(dy) >= 0;
            clearTimeout(context.handler);
            this.dispatcher.dispatch('panStart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            });
        }
    
        if (context.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            });
        }
        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY,
        });
    
    }
    
    end(point, context) {    
        if (context.isTap) {
            this.dispatcher.dispatch('tap', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            });
            clearTimeout(context.handler);
        }
        if (context.isPress) {
            this.dispatcher.dispatch('pressEnd', {});
        }
    
        context.points = context.points.filter(point => Date.now() - point.t < 500)
    
        let v = 0;
        if (context.points.length) {
            let d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }
        if (v > 1.5) {
            context.isFlick = true;
            this.dispatcher.dispatch('flick', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v,
            });
        } else {
            context.isFlick = false;
        }
        if (context.isPan) {
            this.dispatcher.dispatch('panEnd', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v,
            });
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
        });
    }
    
    cancel = (point, context) => {
        clearTimeout(context.handler);
        this.dispatcher.dispatch('cancel', {});
    }
}

export class Dispatcher {
    constructor(element) {
        this.element = element;
    }

    dispatch(type, properties) {
        let event = new Event(type);
        for (const name in properties) {
            event[name] = properties[name];
        }
        this.element.dispatchEvent(event);
    }
}

export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)))
}