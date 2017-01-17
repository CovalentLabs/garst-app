/* tslint:disable:member-ordering */
import {
  Component, EventEmitter,
  AfterContentInit, OnChanges, OnDestroy,
  ElementRef, HostBinding,
  ContentChild,
  ChangeDetectorRef,
  Input, Output, ContentChildren, QueryList, ViewEncapsulation
} from '@angular/core'

import { VitreSwipeManager, SwipeOrientation } from './vitre-swipe-manager'

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

enum DIR { row, column }

import {
  AMBER_COLORS, AMBER_COLORS_LEN,
  GRID_BREAKPOINTS,
  VITRE_COLUMNS, VITRE_ROWS
} from './constants'

type ViewType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

@Component({
  selector: 'pw-vitre-container',
  templateUrl: './vitre-container.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './vitre-container.component.css',
  ]
})
export class VitreContainerComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(VitreComponent) vitres: QueryList<VitreComponent>
  @HostBinding('attr.vitre-view') get attrView(): ViewType { return this.view }
  @Input('vitre-direction') direction: 'row' | 'column' = null
  @Input('vitre-frame-index') frameIndexAttr: string
  @Output('overscroll') overscollEmitter = new EventEmitter<any>()

  @Input() set lock(lock: boolean) {
    if (this.swipeManager != null) { this.swipeManager.lock(lock) }
    this._lock = lock
  }
  private _lock: boolean = false

  private view: ViewType;
  private $host: JQuery
  private set isSwiping(swiping: boolean) {
    this.$host.toggleClass("vitre-swiping", swiping)
  }
  private swipeManager: VitreSwipeManager
  private vitreNameToFrameIndex: { [name: string]: number } = {}

  resizeDebounceInterval = 400
  resizeDebounce: any
  onresize = () => {
    clearTimeout(this.resizeDebounce)
    this.resizeDebounce =
    setTimeout(
      () => this.reset(),
      this.resizeDebounceInterval
    )
  }
  constructor(private _ref: ElementRef, private _changes: ChangeDetectorRef) {}
  private setup(orientation: SwipeOrientation) {
    this.$host = $(this.host())
    let container = <HTMLElement> this.host()
    let content = <HTMLElement> this.host().firstElementChild
    this.swipeManager = new VitreSwipeManager(orientation, container, content, (index) => this.onChangeFrameIndex(index))

    this.swipeManager.onSwiping = (swiping) => this.isSwiping = swiping
    this.swipeManager.onOverscroll = (event) => this.overscollEmitter.emit(event)

    this.swipeManager.lock(this._lock)

    window.addEventListener('resize', this.onresize)
  }

  ngOnChanges(changes) {
    this.reset()
  }

  ngAfterContentInit() {
    // Clear console on destruction
    // if ('clear' in console) { console.clear() }

    // only once.
    this.setup(this.isRow() ? SwipeOrientation.ROW : SwipeOrientation.COLUMN)

    // this.vitres.forEach((v, i) => v.backgroundColor = AMBER_COLORS[i % AMBER_COLORS_LEN])

    this.reset()
  }

  ngOnDestroy() {
    // this.swipeManager.destroy()
    // window.removeEventListener('resize', this.onresize)
  }

  private onChangeFrameIndex(index: number) {
    this.applyActiveStylesToFrame(index)
  }

  private applyActiveStylesToFrame(index: number) {
    this.vitres.forEach(vitre => {
      let isInFrame = this.vitreNameToFrameIndex[vitre.name] === index
      vitre.isActive = isInFrame
    })
  }

  private reset() {
    this.vitreResizer = createVitreResizer(this.isRow())

    // resize the view (md, sm, lg, xl)
    // for this new space size.
    this.recalcView()

    let wasSuccessful = this.resetFrame()
    if (!wasSuccessful) { return }

    this.swipeManager.resize()

    this._changes.detectChanges()
  }

  private recalcView() {
    // when direction is column, we use height
    // when direction is row, we use width
    const host = this.host()
    const size = this.isRow() ? host.offsetWidth : host.offsetHeight


    const breakpoint = GRID_BREAKPOINTS.find(a => a[1] < size)

    this.view = breakpoint != null ? breakpoint[0] : 'xs'
  }

  private resetFrame(): boolean {
    const view = this.view || null
    const vits = this.vitres
    if (vits == null) { return false }

    const sizes = vits.map(
      this.isRow()
        ? vit => {  return { vit, size: vit.getCol(view) }}
        : vit => {  return { vit, size: vit.getRow(view) }}
    )

    // using these sizes, we can calculate the number of frames we need.
    let frames = 0
    const newIndex: {[n: string]: number} = {}

    const SPANS = this.isRow() ? VITRE_COLUMNS : VITRE_ROWS

    sizes.reduce((prev, curr) => {
      let total = prev + curr.size
      // Set the index for this view
      newIndex[curr.vit.name] = frames

      if (total < SPANS) {
        // We haven't reached the full span
        return total
      } else if (total === SPANS) {
        // Ensure we land on the span count
        frames += 1
        // Restart counting
        return 0
      } else {
        throw new Error(
          `Vitre columns do not divide evenly over total ${SPANS} spans.`
          + `\n(Received sizes: ${sizes.map(s => s.size).join(', ')} for view: ${view})`)
      }
    }, 0)

    this.vitreNameToFrameIndex = newIndex

    this.swipeManager.setFramesLength(frames)

    this.resizeVitres(frames, sizes)

    return true
  }

  vitreResizer = createVitreResizer(true)
  resizeVitres(
      frameCount: number,
      sizes: {
        vit: VitreComponent;
        size: number;
      }[]
      ) {
    this.vitreResizer(frameCount, this.isRow() ? VITRE_COLUMNS : VITRE_ROWS, sizes)
  }

  goto(name: string): boolean {
    let index = this.vitreNameToFrameIndex[name]
    if (index == null) { return false }
    this.swipeManager.gotoFrame(index)
    return true
  }

  private host(): HTMLElement {
    return this._ref.nativeElement
  }

  private isRow(): boolean {
    return this.direction !== 'column'
  }
}

type VitreSizePair = { vit: VitreComponent, size: number }
type VitreResizerFn = (frameCount: number, spans: number, sizes: VitreSizePair[]) => any
function createVitreResizer(isRow: boolean): VitreResizerFn {
  return createVitreResizerTicking(
    isRow
      ? rec => pair => pair.vit.width = `${rec * pair.size}%`
      : rec => pair => pair.vit.height = `${rec * pair.size}%`
  )
}
function createVitreResizerTicking(fn: (rec: number) => (pair: VitreSizePair) => void): VitreResizerFn {
  let lastKnownSizes: VitreSizePair[] = null
  let lastKnownRows: number = null
  let lastKnownFrameCount: number = null
  let isTicking = false
  function updateVitreSizes() {
    lastKnownSizes.forEach(fn(100 / (lastKnownRows * lastKnownFrameCount)))
    isTicking = false
  }
  return function resizeVitreColumns(frameCount: number, rows, sizes: VitreSizePair[]) {
    lastKnownRows = rows
    lastKnownFrameCount = frameCount
    lastKnownSizes = sizes
    if (!isTicking) {
      isTicking = true
      requestAnimationFrame(updateVitreSizes)
    }
  }
}
