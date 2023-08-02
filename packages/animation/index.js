const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('add-time');
const PAUSE_START = Symbol('pause-start');
const PAUSE_TIME = Symbol('pause_time');
export class TimeLine {
    constructor() {
        this.state = 'initial';
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    start() {
        if (this.state !== 'initial')
            return;
        this.state = 'started';
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            let now = Date.now();
            for (const animation of this[ANIMATIONS]) {
                let t;
                // 如果传入时间小于当前时间
                // t 赋值当前
                if (this[START_TIME].get(animation) < startTime)
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                else
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;

                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if (t > 0) animation.receiveTime(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
    pause() {
        if (this.state !== 'started')
            return;
        this.state = 'paused';
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== 'paused')
            return;
        this.state = 'started';
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }
    reset() {
        this.state = 'initial';
        this.pause();
        this[PAUSE_TIME] = 0;
        this[PAUSE_START] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction || (v => v);
        this.template = template || (v => v);
    }
    receiveTime(time) {
        let range = this.endValue - this.startValue;
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}