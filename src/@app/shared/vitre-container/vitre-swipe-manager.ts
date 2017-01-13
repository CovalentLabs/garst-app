/* tslint:disable:member-ordering curly */

import { VitreSwipeDetector, SwipeDirection } from './vitre-swipe-detector'

export enum SwipeOrientation {
  ROW = 0, COLUMN = 1
}

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

export function debug(...args) {
  let prefix = 'debug'
  if (args[0] && typeof args[0] === 'string') {
    prefix = args[0]
    args = args.slice(1)
  }
  console.log('%c' + prefix, 'font-weight: bold; color: green;', ...args)
}

export class VitreSwipeManager {
  private frameIndex: number
  private framesLength: number
  private frameWidth: number
  private detector: VitreSwipeDetector
  private contentTranslator: ContentTranslator
  private drawerBackwardTranslator: ContentTranslator
  private drawerForwardTranslator: ContentTranslator
  // Configurable
  public onSwiping = function (isSwiping: boolean) {}

  // In the future maybe we have named drawers
  private startDrawersOpen: number = 0
  private endDrawersOpen: number = 0
  constructor(
      private orientation: SwipeOrientation,
      private container: HTMLElement,
      private content: HTMLElement,
      private startDrawers: HTMLElement[],
      private endDrawers: HTMLElement[],
      private onChangeIndex: (index: number) => void,
      private onChangeDrawerIndex: (index: number) => void,
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

    this.contentTranslator = new ContentTranslator(isX, content)
    this.drawerBackwardTranslator = new ContentTranslator(isX)
    this.drawerForwardTranslator = new ContentTranslator(isX)
    this.resize()
    this.listen()
  }

  private delta: number
  private isSwiping = false
  private isOpeningDrawerBackward = false
  private isOpeningDrawerForward = false
  private static NOOP = function (arg) {}
  /**
   * Sets up listeners for the Hammer pans and such.
   */
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
        if (this.isOpeningDrawerForward) {
          debug("Forth drawer open?")
        } else {
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
        }
      } else {
        if (this.isOpeningDrawerBackward) {
          debug("Back drawer open?", { delta: this.delta, width: this.activeTranslateDrawerBackward.offsetWidth * .5 })
          if (this.delta > this.activeTranslateDrawerBackward.offsetWidth * .5) {
            this.endDrawersOpen += 1
          } else {
            // close drawer
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
      }
      // console.log("put back", { width, delta: this.delta, index: this.frameIndex })
      // console.log({origin, delta: this.delta })
      this.isSwiping = false
      this.isOpeningDrawerBackward = false
      this.isOpeningDrawerForward = false
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

      this.isSwiping = false
      this.isOpeningDrawerBackward = false
      this.isOpeningDrawerForward = false

      debug("startSwipe", input)

      if (currentDirection === SwipeDirection.START) {
        if (this.activateOpenDrawerBackward()) {
          this.isOpeningDrawerBackward = true

        } else if (this.hasFrameForward()) {
          this.setTranslateBounds(true, false)
          this.isSwiping = true

        } else if (this.activateNextDrawerForward()) {
          // set the active drawer to the next drawer
          // funny pun
          this.isOpeningDrawerForward = true
        }

      } else if (currentDirection === SwipeDirection.END) {
        if (this.hasFrameBackward()) {
          this.setTranslateBounds(false, true)
          this.isSwiping = true

        } else if (this.activateNextDrawerBackward()) {
          // set the active drawer to the next drawer
          // funny pun
          this.isOpeningDrawerBackward = true
        }
      }
      if (this.isSwiping || this.isOpeningDrawerBackward || this.isOpeningDrawerForward) {
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
    } // end start swipe listener

    // default noop
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

    this.setTranslateBounds(this.hasFrameForward(), this.hasFrameBackward())

    this.onChangeIndex(this.frameIndex)

    // set location of container
    // no additional arg resets it to 0
    this.translateFromIndex()

    // console.log('setIndex', { zero: this.translateZero, frameIndex, len: this.framesLength })
  }

  private hasFrameForward(): boolean {
    return this.frameIndex + 1 < this.framesLength
  }

  private hasFrameBackward(): boolean {
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

  private activeTranslateDrawerBackward: HTMLElement
  private drawerBackwardTranslateMin: number = 0
  private drawerBackwardTranslateMax: number = 0
  private activeTranslateDrawerForward: HTMLElement
  private drawerForwardTranslateMin: number = 0
  private drawerForwardTranslateMax: number = 0
  private setActiveDrawerTranslateBounds(isBack: boolean) {
    if (isBack) {
      this.drawerBackwardTranslateMin = 0
      // TODO if column
      // TODO if start(backward), likely the opposite of the start
      if (this.orientation === SwipeOrientation.ROW) {
        this.drawerBackwardTranslateMax = this.activeTranslateDrawerBackward.offsetWidth
      } else {
        this.drawerBackwardTranslateMax = this.activeTranslateDrawerBackward.offsetHeight
      }
    } else {
      this.drawerForwardTranslateMax = 0
      // TODO if column
      // TODO if end(forward), likely the opposite of the start
      if (this.orientation === SwipeOrientation.ROW) {
        this.drawerForwardTranslateMin = -1 * this.activeTranslateDrawerForward.offsetWidth
      } else {
        this.drawerForwardTranslateMin = -1 * this.activeTranslateDrawerForward.offsetHeight
      }
    }
  }

  private activateNextDrawerBackward(): boolean {
    if (this.startDrawersOpen < this.startDrawers.length) {
      this.activeTranslateDrawerBackward = this.startDrawers[this.startDrawersOpen]
      this.drawerBackwardTranslator.setContent(this.activeTranslateDrawerBackward)
      this.setActiveDrawerTranslateBounds(true)
      this.translateBackwardZero = 0
      return true
    } else {
      return false
    }
  }

  private activateOpenDrawerBackward(): boolean {
    if (this.startDrawersOpen > 0) {
      this.activeTranslateDrawerBackward = this.startDrawers[this.startDrawersOpen]
      this.drawerBackwardTranslator.setContent(this.activeTranslateDrawerBackward)
      this.setActiveDrawerTranslateBounds(true)
      this.translateBackwardZero = -1 * this.activeTranslateDrawerBackward.offsetWidth
      return true
    } else {
      return false
    }
  }

  private activateNextDrawerForward(): boolean {
    if (this.endDrawersOpen < this.endDrawers.length) {
      this.activeTranslateDrawerForward = this.endDrawers[this.endDrawersOpen]
      this.drawerForwardTranslator.setContent(this.activeTranslateDrawerForward)
      this.setActiveDrawerTranslateBounds(false)
      return true
    } else {
      return false
    }
  }

  private translateBackwardZero = 0
  private translateForwardZero = 0
  private translateFromIndex(delta: number = 0) {
    if (this.isOpeningDrawerBackward) {
      let drawerDelta = delta
      if (drawerDelta > this.drawerBackwardTranslateMax) drawerDelta = this.drawerBackwardTranslateMax
      if (drawerDelta < this.drawerBackwardTranslateMin) drawerDelta = this.drawerBackwardTranslateMin
      this.drawerBackwardTranslator.translate(this.translateBackwardZero + drawerDelta)
    }

    if (this.isOpeningDrawerForward) {
      let drawerDelta = delta
      if (drawerDelta > this.drawerForwardTranslateMax) drawerDelta = this.drawerForwardTranslateMax
      if (drawerDelta < this.drawerForwardTranslateMin) drawerDelta = this.drawerForwardTranslateMin
      this.drawerForwardTranslator.translate(this.translateForwardZero + drawerDelta)
    }

    // set location of container
    if (delta > this.translateMax) delta = this.translateMax
    if (delta < this.translateMin) delta = this.translateMin

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

  constructor(isRow: boolean, private content: HTMLElement = null) {
    this.prefix = `translate${isRow ? 'X' : 'Y'}(`
  }

  setContent(content: HTMLElement) { this.unsetTransitions(); this.content = content; this.content.style.transition = 'none' }
  unsetTransitions() { if (this.content != null) this.content.style.transition = null }

  translate(dist: number) {
    this.lastKnownDist = dist
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(this.update)
    }
  }

  private update = () => {
    this.ticking = false
    if (null != this.content) this.content.style.transform = this.prefix + this.lastKnownDist + 'px)'
  }
}
