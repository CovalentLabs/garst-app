
export enum SwipeDirection {
  START = 0, END = 1
}

export type SwipeStartInput = {
  direction: SwipeDirection,
  delta: number,
  origin: number,
}

// delta
export type SwipeMoveInput = number

// velocity
export type SwipeEndInput = number

export
class VitreSwipeDetector {
  startSwipe: (input: SwipeStartInput) => any
  moveSwipe: (input: SwipeMoveInput) => any
  endSwipe: (input: SwipeEndInput) => any
  // private offsetLeft: number
  // private offsetWidth: number
  // private curtainWidth: number
  private swipeListener: SwipeListener

  constructor(
      private host: HTMLElement,
      private isX: boolean
      ) {
    const noop = function(_){}
    this.startSwipe = noop
    this.moveSwipe = noop
    this.endSwipe = noop

    this.swipeListener = new SwipeListener(host, isX, this)
  }

  destroy() {
    // TODO unsubscribe from hammer
  }
}

type velpass = { o, v, d, a, t }
class SwipeListener {
  private mc: HammerManager
  private angleThreshold: AngleThreshold
  private velocities = [0, 0, 0]
  // private VELOCITY_THRESHOLD = .1
  private origin = 0
  private isStopped = true
  private recordVelocity = rotateRecord(this.velocities)
  private vel: (ev: HammerInput) => velpass
  private waitingForTouchEnd: boolean = false
  constructor(host: HTMLElement, isX: boolean, private detector: VitreSwipeDetector) {
    this.angleThreshold = new AngleThreshold(isX)
    this.mc = new Hammer.Manager(host, {
      recognizers: [
        [Hammer.Pan, { direction: isX ? Hammer.DIRECTION_HORIZONTAL : Hammer.DIRECTION_VERTICAL }]
      ]
    })

    this.vel = make_vel(isX)

    // Set up listener
    this.mc.on('panstart panmove', (ev: HammerInput) => { this.onpan(this.vel(ev)) })
  }

  private onpan({ o, v, d, a, t }: velpass) {
    if (!this.isStopped) {
      this.detector.moveSwipe(d)
      this.recordVelocity(v)
    } else {
      if (t === 'panstart') {
        this.origin = o
      }
      this.start(v, a, d)
    }
  }

  // setup start
  private setupEndListener() {
    this.isStopped = false
    $(document.body).one('mouseleave touchend mouseup', () => {
      // constant velocity for now
      this.detector.endSwipe(avg(this.velocities))
      this.isStopped = true
    })
  }

  private start(velocity: number, angle: number, delta: number) {
    if (this.waitingForTouchEnd) { return }
    // let meetsVelocityReq = Math.abs(velocity) > this.VELOCITY_THRESHOLD
    // // console.log('vel', Math.abs(ev.velocityX))
    // if (!meetsVelocityReq) { return }

    let meetsOriginDistReq = Math.abs(delta) < 100
    // console.log('odx', Math.abs(ev.deltaX))
    if (!meetsOriginDistReq) { return }


    // console.log('ang', (ang > 90 ? 180 - ang : ang))
    let direction = this.angleThreshold.check(angle)
    if (direction == null) { this.waitForTouchEnd(); return }

    this.setupEndListener()
    this.detector.startSwipe({ direction, origin: this.origin, delta })
  }

  waitForTouchEnd() {
    this.waitingForTouchEnd = true;
    $(document.body).one('touchend mouseup mouseleave', () => this.waitingForTouchEnd = false)
  }
}

function make_vel(isX: boolean): (ev: HammerInput) => { o, v, d, a, t } {
  return isX
    ? function (ev: HammerInput) {
      return { o: (<PointerEvent>ev.srcEvent).clientX, v: ev.velocityX, d: ev.deltaX, t: ev.type, a: ev.angle }
    }
    : function (ev: HammerInput) {
      return { o: (<PointerEvent>ev.srcEvent).clientY, v: ev.velocityY, d: ev.deltaY, t: ev.type, a: ev.angle }
    }
}

function avg(n: number[]) {
  return n.reduce((p, c) => p + c, 0) / n.length
}

class AngleThreshold {
  private degs = 360
  private degs2 = this.degs * .5
  // 'LEFT (null) TOP (null) RIGHT (null) BOTTOM (null) LEFT'.split(' ')
  private directions: SwipeDirection[]
  private len = 8
  private rec  = this.len / this.degs
  private centering = this.degs / this.len * .5
  constructor(isX: boolean) {
    this.directions = isX
      ? [SwipeDirection.START, null, null, null, SwipeDirection.END, null, null, null, SwipeDirection.START]
      : [null, null, SwipeDirection.START, null, null, null, SwipeDirection.END, null, null]
  }
  check = an => {
    let cang = (an + this.degs2 + this.centering) % this.degs
    /* tslint:disable:no-bitwise */
    let lm = (cang * this.rec) | 0
    return this.directions[lm]
    // (ang > 90 ? 180 - ang : ang) < leftRightThreshAngle
  }
}

function rotateRecord(arr: number[], len: number = arr.length) {
  let i = 0
  return n => {
    arr[i++ % len] = n
  }
}
