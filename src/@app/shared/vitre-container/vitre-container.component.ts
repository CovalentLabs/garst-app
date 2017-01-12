/* tslint:disable:member-ordering */
import {
  Component,
  AfterContentInit, OnChanges, OnDestroy,
  ElementRef,
  Input, ContentChildren, QueryList, ViewEncapsulation
} from '@angular/core'

import { VitreSwipeManager, SwipeOrientation } from './vitre-swipe-manager'

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

const VITRE_COLUMNS = 12
const VITRE_ROWS = 12
enum DIR { row, column }
const AMBER_COLORS =
`50 #FFF8E1
100 #FFECB3
200 #FFE082
300 #FFD54F
400 #FFCA28
500 #FFC107
600 #FFB300
700 #FFA000
800 #FF8F00
900 #FF6F00`
.split(/\n/g)
.map(a => a.split(/\s+/)[1])

const AMBER_COLORS_LEN = AMBER_COLORS.length

type ViewType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// Borrowed from _custom.css
const GRID_BREAKPOINTS =
`  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px`
.replace(/\s+/g, '')
.split(',')
.map(function (b): [ViewType, number] {
  let [name, px] = b.split(':')
  return [<ViewType> name, parseFloat(px)]
})

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
  @Input('vitre-view') view: null | ViewType = null
  @Input('vitre-direction') direction: null | 'row' | 'column' = null
  @Input('vitre-frame-index') frameIndexAttr: string

  // <vitre-container [curtainSize]="">
  // TODO connect manager to listener for these curtains
  @Input() curtainSize: number = 200
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
  constructor(private _ref: ElementRef) {}
  private setup(orientation: SwipeOrientation) {
    let container = <HTMLElement> this.host()
    let content = <HTMLElement> this.host().firstElementChild
    this.swipeManager = new VitreSwipeManager(orientation, container, content)


    window.addEventListener('resize', this.onresize)
  }

  onChanges() {
    this.reset()
  }

  ngOnChanges(changes) {
    this.onChanges()
  }

  ngAfterContentInit() {
    // Clear console on destruction
    if ('clear' in console) { console.clear() }

    // only once.
    this.setup(this.isRow() ? SwipeOrientation.ROW : SwipeOrientation.COLUMN)

    this.vitres.forEach((v, i) => v.backgroundColor = AMBER_COLORS[i % AMBER_COLORS_LEN])

    this.reset()
  }

  ngOnDestroy() {
    // this.swipeManager.destroy()
    // window.removeEventListener('resize', this.onresize)
  }

  private reset() {
    this.vitreResizer = createVitreResizer(this.isRow())

    // resize the view (md, sm, lg, xl)
    // for this new space size.
    this.recalcView()

    let wasSuccessful = this.resetFrame()
    if (!wasSuccessful) { return }

    this.swipeManager.resize()

    this.setAttrs()
  }

  private recalcView() {
    // when direction is column, we use height
    // when direction is row, we use width
    const host = this.host()
    const size = this.isRow() ? host.offsetWidth : host.offsetHeight


    // console.log({ size, GRID: GRID_BREAKPOINTS.map(a => a.join('=>')) })
    const breakpoint = GRID_BREAKPOINTS.reverse().find(a => a[1] < size)

    this.view = breakpoint != null ? breakpoint[0] : 'xs'
    this.attr('vitre-view', this.view)
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

  private setAttrs() {
    this.attr('vitre-direction', this.direction || 'row')
  }

  private host(): HTMLElement {
    return this._ref.nativeElement
  }

  private isRow(): boolean {
    return this.direction !== 'column'
  }

  private attr(key: string, value: any) {
    let el = this.host()

    return value == null
        ? el.removeAttribute(key)
        : el.setAttribute(key, '' + value)
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
