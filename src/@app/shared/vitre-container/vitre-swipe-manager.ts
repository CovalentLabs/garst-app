/* tslint:disable:member-ordering curly */

import { VitreSwipeDetector, SwipeDirection } from './vitre-swipe-detector'

export enum SwipeOrientation {
  ROW = 0, COLUMN = 1
}

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

export class VitreSwipeManager {
  private frameIndex: number
  private framesLength: number
  private frameWidth: number
  private detector: VitreSwipeDetector
  private contentTranslator: ContentTranslator
  // Configurable
  public onSwiping = function (isSwiping: boolean) {}

  // <vitre-container (open)="">
  // @Output() open = new EventEmitter()
  constructor(
      private orientation: SwipeOrientation,
      private container: HTMLElement,
      private content: HTMLElement,
      private onChangeIndex: (index: number) => void
      ) {
    let isX = this.orientation === SwipeOrientation.ROW
    this.detector = new VitreSwipeDetector(container, isX)

    // Whenever the content stops transitioning, assume that this is the end of a swipe
    // There isn't too much of an issue to be wrong.
    $(this.content).on('transitionend', (event) => {
      if (!this.isSwiping && event.target.isSameNode(this.content)) {
        this.onSwiping(false)
      }
    })

    this.contentTranslator = new ContentTranslator(content, isX)
    this.resize()
    this.listen()
  }

  private delta: number
  private isSwiping = false
  private static NOOP = function (arg) {}
  private listen() {
    let origin = 0
    let currentDirection: SwipeDirection = null
    const move = (del) => {
      // This multiplies the delta of a swipe to make the window move faster or slower
      this.delta = 1.5 * del
      // set location of container
      this.translateFromIndex(this.delta)
    }
    const end = (velocity) => {
      let width = this.frameWidth
      // set location of container

      // Revert back to using css transition
      this.content.style.transition = null

      // const time = 1000
      const travel = velocity * 1000
      const travel300 = velocity * 300
      if (currentDirection === SwipeDirection.START) {
        // FORWARD
        const moveForeGoal = width * -.5
        // Would it make it to the goal in 300ms?
        const moveFore = this.delta + travel300 < moveForeGoal
        if (moveFore) {
          // See how far this would travel with avg velocity
          const goalDist = -1 * width - this.delta
          // Set transitions?
          let dur = `${calcTransitionDur(goalDist, travel)}s`
          this.content.style.transitionDuration = dur
          // console.log("Transdur", dur)
          setTimeout(() => this.setIndex(this.frameIndex + 1), 0)
        }
      } else {
        // BACKWARD
        const moveBackGoal = width * .5
        // Would it make it to the goal in 300ms?
        const moveBack = this.delta + travel300 > moveBackGoal
        if (moveBack) {
          // See how far this would travel with avg velocity
          const goalDist = this.delta - width
          // Set transitions based on velocity?
          let dur = `${calcTransitionDur(goalDist, travel)}s`
          this.content.style.transitionDuration = dur
          // console.log("Transdur", dur)
          setTimeout(() => this.setIndex(this.frameIndex - 1), 0)
        }
      }
      // console.log("put back", { width, delta: this.delta, index: this.frameIndex })
      // console.log({origin, delta: this.delta })
      this.isSwiping = false
      this.detector.moveSwipe = VitreSwipeManager.NOOP
      this.detector.endSwipe = VitreSwipeManager.NOOP


      // if (travel > ) {
      //   console.log("put back")
      //   panes.style.transform = `translateX(0px)`
      //   handlerRight = handleRight
      // } else {
      //   console.log("open")
      //   panes.style.transform = `translateX(-${w}px)`
      //   handlerRight = handleLeft
      // }
      this.translateFromIndex()
    }

    this.detector.startSwipe = (input) => {
      origin = input.origin
      currentDirection = input.direction
      if (currentDirection === SwipeDirection.START) {
        if (this.canGoForward()) {
          this.setTranslateBounds(true, false)
          this.isSwiping = true
        } else {
          this.isSwiping = false
        }

      } else if (currentDirection === SwipeDirection.END) {
        if (this.canGoBackward()) {
          this.setTranslateBounds(false, true)
          this.isSwiping = true
        } else {
          this.isSwiping = false
        }
      }
      if (this.isSwiping) {
        // trigger our events on move and on end
        this.detector.moveSwipe = move
        this.detector.endSwipe = end

        this.content.style.transition = 'none'
        this.onSwiping(true)

        move(input.delta)

      } else {
        this.detector.moveSwipe = VitreSwipeManager.NOOP
        this.detector.endSwipe = VitreSwipeManager.NOOP
      }
    }
    this.detector.moveSwipe = VitreSwipeManager.NOOP
    this.detector.endSwipe = VitreSwipeManager.NOOP
  }

  setFramesLength(frames: number) {
    this.framesLength = frames
    this.setIndex()
  }

  public resize() {
    let size = this.orientation ===  SwipeOrientation.ROW
        ? this.container.offsetWidth
        : this.container.offsetHeight

    this.setSize(size)

    this.setIndex()
  }

  public gotoFrame(index: number) {
    return this.setIndex(index)
  }

  public destroy() {
    this.detector.destroy()
  }

  // which frame are we currently viewing
  private setSize(frameWidth: number) {
    let framesLength = this.framesLength
    if (this.orientation === SwipeOrientation.ROW) {
      this.content.style.width = `${frameWidth * framesLength}px`
    } else {
      this.content.style.height = `${frameWidth * framesLength}px`
    }

    this.frameWidth = frameWidth
  }

  private translateZero: number = 0
  private translateMin: number
  private translateMax: number

  // recalibrate's min and max
  private setIndex(frameIndex: number = this.frameIndex) {
    // Indicate swiping when transitioning here.
    this.onSwiping(true)

    if (frameIndex == null) {
      frameIndex = 0
    }

    // Keep Frame Index inbounds
    // if frame index is gt 0, it has a value we need to keep in bounds
    if (frameIndex >= this.framesLength) {
      frameIndex = this.framesLength - 1
    } else if (frameIndex < 0) {
      frameIndex = 0
    }

    // base index
    // Everything is in terms of X, though X is Y if the direction is column
    this.translateZero = -1 * frameIndex * this.frameWidth

    this.frameIndex = frameIndex

    this.setTranslateBounds(this.canGoForward(), this.canGoBackward())

    this.onChangeIndex(this.frameIndex)

    // set location of container
    // no additional arg resets it to 0
    this.translateFromIndex()

    // console.log('setIndex', { zero: this.translateZero, frameIndex, len: this.framesLength })
  }

  private canGoForward(): boolean {
    return this.frameIndex + 1 < this.framesLength
  }

  private canGoBackward(): boolean {
    return this.frameIndex - 1 >= 0
  }

  private setTranslateBounds(canSwipeForward: boolean, canSwipeBackward: boolean) {
    // Set translateMin and translateMax

    // set max to frame width
    if (canSwipeBackward) this.translateMax = this.frameWidth
    else this.translateMax = 0

    // set min to negative frame width
    if (canSwipeForward) this.translateMin = -1 * this.frameWidth
    else this.translateMin = 0
  }

  private translateFromIndex(delta: number = 0) {
    // set location of container
    if (delta > this.translateMax) delta = this.translateMax
    else if (delta < this.translateMin) delta = this.translateMin

    this.contentTranslator.translate(this.translateZero + delta)
  }
}
// the calc transition duration was used to help calculate how fast the transition
// should be with a final velocity.
// ensures that we don't jerk too much
const maxPixelsPerSecond = 1000
// ensures that we don't jerk too much
const minPixelsPerSecond = 500
// since we use ease-out, we are going to need the animation to be a little longer for
// our velocities to match up correctly
const easeStartAdjust = 1.2
function calcTransitionDur(dist, pxPerSecond) {
  pxPerSecond = Math.abs(pxPerSecond)

  if (pxPerSecond > maxPixelsPerSecond) pxPerSecond = maxPixelsPerSecond;
  if (pxPerSecond < minPixelsPerSecond) pxPerSecond = minPixelsPerSecond;
  return easeStartAdjust * Math.abs(dist) / pxPerSecond
}

class ContentTranslator {
  private prefix: string
  private lastKnownDist: number = 0
  private ticking = false

  constructor(private content: HTMLElement, isRow: boolean) {
    this.prefix = `translate${isRow ? 'X' : 'Y'}(`
  }

  translate(dist: number) {
    this.lastKnownDist = dist
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(this.update)
    }
  }

  private update = () => {
    this.ticking = false
    this.content.style.transform = this.prefix + this.lastKnownDist + 'px)'
  }
}
