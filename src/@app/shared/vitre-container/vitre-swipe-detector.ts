
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
  private offsetLeft: number
  private offsetWidth: number
  private curtainWidth: number

  constructor(
      private host: HTMLElement,
      private isX: boolean,
      public curtainWidthPx: number = 100,
      public curtainWidthRatio: number = .5) {
    let noop = function(_){}
    this.startSwipe = noop
    this.moveSwipe = noop
    this.endSwipe = noop

    listenForSwipes({
      host,
      isX,
      detector: this
    })

    this.resize()
  }

  resize() {
    if (this.isX) {
      this.offsetLeft = this.host.offsetLeft
      this.offsetWidth = this.host.offsetWidth
    } else {
      this.offsetLeft = this.host.offsetTop
      this.offsetWidth = this.host.offsetHeight
    }

    let maxCurtainWidth = Math.max(this.offsetWidth * this.curtainWidthRatio, this.curtainWidthPx)
    // ensure our curtains are not too big for our width
    this.curtainWidth = Math.min(maxCurtainWidth, this.offsetWidth * .5)
  }

  moveHandler (dX: number) {
    this.moveSwipe(dX)
  }

  endHandler (velocity: number) {
    this.endSwipe(velocity)
  }

  startHandler(
      direction: SwipeDirection,
      origin: number,
      delta: number
  ) {
    // Change direction to emit to
    this.startSwipe({
      direction: direction,
      delta: delta,
      origin: origin
    })
  }

  inStartCurtain(ox) {
    let localX = ox - this.offsetLeft
    // console.log({localX})
    return (localX + this.curtainWidth) > this.offsetWidth
        && localX < this.offsetWidth
  }

  inEndCurtain(ox) {
    let localX = ox - this.offsetLeft
    // console.log({localX})
    return 0 < (this.curtainWidth - localX)
        && localX > 0
  }

  destroy() {
    // TODO unsubscribe from hammer
  }
}

function listenForSwipes(
    opts: {
      host: HTMLElement,
      isX: boolean,
      detector: VitreSwipeDetector
    }) {
  const detector = opts.detector
  const meetsAngleRequirement = getAngleThreshold()
  const velocityThresh = 1
  let origin = 0
  let isStopped = true
  let velocities = [0, 0, 0]
  let recordVelocity = rotateRecord(velocities)

  // setup start
  function setupEndListener() {
    isStopped = false
    one(document.body, 'touchend mouseleave mouseup', () => {
      detector.endHandler(avg(velocities))
      isStopped = true
    })
  }

  const mc = new Hammer.Manager(opts.host, {
    recognizers: [
      [Hammer.Pan, { direction: opts.isX ? Hammer.DIRECTION_HORIZONTAL : Hammer.DIRECTION_VERTICAL }]
    ]
  })

  function start(velocity: number, angle: number, delta: number) {

    let meetsVelocityReq = Math.abs(velocity) > velocityThresh
    // console.log('vel', Math.abs(ev.velocityX))
    if (!meetsVelocityReq) { return }

    /*
    let meetsOriginDistReq = Math.abs(ev.deltaX) + Math.abs(ev.deltaY) < 150
    // console.log('odx', Math.abs(ev.deltaX))
    if (!meetsOriginDistReq) { return console.log("WRONG ORIGIN",
      {dx: ev.deltaX, dy: ev.deltaY})}
      */

    // console.log('ang', (ang > 90 ? 180 - ang : ang))
    let direction = meetsAngleRequirement(angle)
    if (direction == null) { return }

    switch (direction) {
      case SwipeDirection.START:
        if (!detector.inStartCurtain(origin)) { return }
        break
      case SwipeDirection.END:
        if (!detector.inEndCurtain(origin)) { return }
        break
    }
    detector.startHandler(direction, origin, delta)
    setupEndListener()
  }

  type velpass = { o, v, d, a, t }
  const vel: (ev: HammerInput) => velpass = make_vel(opts.isX)
  const onpan = function ({ o, v, d, a, t }: velpass) {
    if (!isStopped) {
      recordVelocity(v)
      detector.moveHandler(d)
    } else {
      if (t === 'panstart') {
        origin = o
      }
      start(v, a, d)
    }
  }
  mc.on('panstart panmove', function (ev: HammerInput) { onpan(vel(ev)) })
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

// I'm sorry.
// This is essentially a way for us to find numbers in ranges quickly.
function getAngleThreshold(): (ang: number) => SwipeDirection {
  const degs = 360
  const degs2 = degs * .5
  // 'LEFT - TOP - RIGHT - BOTTOM - LEFT'.split(' ')
  const directions = [SwipeDirection.START, null, SwipeDirection.START, null, SwipeDirection.END, null, SwipeDirection.END, null]
  const len = 8
  const rec  = len / degs
  const centering = degs / len * .5
  return an => {
    // let ang = Math.abs(an)
    let cang = (an + degs2 + centering) % degs
    /* tslint:disable:no-bitwise */
    let lm = (cang * rec) | 0
    return directions[lm]
    // (ang > 90 ? 180 - ang : ang) < leftRightThreshAngle
  }
}


function rotateRecord(arr: number[], len: number = arr.length) {
  let i = 0
  return n => {
    arr[i++ % len] = n
  }
}

function one(elt: Element, events: string, fun: Function) {
  const evts = events.split(' ')
  evts.forEach(evt => {
    elt.addEventListener(evt, OneListener)
  })
  function OneListener(...args) {
    evts.forEach(evt => elt.removeEventListener(evt, OneListener) )
    fun(...args)
  }
}
