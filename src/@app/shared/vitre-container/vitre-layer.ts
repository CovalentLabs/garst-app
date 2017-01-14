/* tslint:disable:member-ordering curly */

import { VitreSwipeDetector, SwipeDirection } from './vitre-swipe-detector'

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

import { VitreLayerComponent } from './vitre-container.component'
export { VitreLayerComponent }

export enum SwipeOrientation {
  ROW = 0, COLUMN = 1
}

export enum SwipeEndResult {
  FORWARD = 1, NONE = 0, BACKWARD = -1
}

export function debug(...args) {
  let prefix = 'layer'
  console.log('%c' + prefix, 'font-weight: bold; color: #feea12;', ...args)
}

export class VitreLayer {
  private frameIndex: number
  private framesLength: number
  private frameWidth: number

  constructor(
      private orientation: SwipeOrientation,
      private component: VitreLayerComponent,
      private onChangeIndex: (index: number) => void,
      ) {
    debug('Hello', this.component)
    /*
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
    */
  }


  setFramesLength(frames: number) {
    this.framesLength = frames
  }

  public resize() {
    this.component.resize()
  }


  private translateZero: number = 0
  private translateMin: number
  private translateMax: number

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
}
