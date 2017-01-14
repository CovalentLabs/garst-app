/* tslint:disable:member-ordering */
import {
  Component,
  AfterContentInit, OnChanges, OnDestroy,
  ElementRef, HostBinding, ViewChildren,
  ChangeDetectorRef,
  Input, ContentChildren, QueryList, ViewEncapsulation
} from '@angular/core'

import { VitreLayerManager, SwipeOrientation } from './vitre-layer-manager'

import { VitreComponent } from './vitre/vitre.component'
export { VitreComponent }

import { VitreDrawerComponent } from './vitre-drawer/vitre-drawer.component'
export { VitreDrawerComponent }

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

// borrowed from _color-map
const CYAN_COLORS =
`"200": #80deea
"300": #4dd0e1
"400": #26c6da
"500": #00bcd4
"600": #00acc1`
.split(/\n/g)
.map(a => a.split(/\s+/)[1])

const CYAN_COLORS_LEN = CYAN_COLORS.length

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
.reverse()


export function debug(...args) {
  let prefix = 'vitre container'
  console.log('%c' + prefix, 'font-weight: bold; color: dodgerblue;', ...args)
}

@Component({
  selector: 'pw-vitre-layer',
  template: '<ng-content selector="pw-vitre"></ng-content>'
})
export class VitreLayerComponent implements AfterContentInit {
  @ViewChildren(VitreComponent) vitres
  @Input('vitre-direction') direction: 'row' | 'column' = null

  private view: ViewType;
  private host: JQuery
  private vitreResizer: VitreResizerFn

  setView(view: ViewType) { this.view = view; this.reset() }

  constructor(private _ref: ElementRef) {}

  ngAfterContentInit() {
    this.host = $(this._ref.nativeElement)
    this.vitres.forEach((v, i) => v.backgroundColor = CYAN_COLORS[i % CYAN_COLORS_LEN])
  }

  private isRow(): boolean {
    return this.direction !== 'column'
  }

  private reset() {
    this.vitreResizer = createVitreResizer(this.isRow())

    // let wasSuccessful = this.resetFrame()
    // if (!wasSuccessful) { return }
  }

  resize() {
    const view = this.view || null
    const vits = this.vitres
    if (vits == null) { return false }

    const sizeMapper = this.isRow()
        ? (vit: VitreComponent) => {  return { vit, size: vit.getCol(view) }}
        : (vit: VitreComponent) => {  return { vit, size: vit.getRow(view) }}

    const sizes = vits.map(sizeMapper)

    // using these sizes, we can calculate the number of frames we need.
    let frames = 0
    const newIndex: {[n: string]: number} = {}

    const SPANS = this.isRow() ? VITRE_COLUMNS : VITRE_ROWS

    sizes.reduce((prev, curr) => {
      // drawers do not affect the size of the container.
      if (curr.vit.isDrawer) { return prev }

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

    this.vitreResizer(frames, this.isRow() ? VITRE_COLUMNS : VITRE_ROWS, sizes)

    return true
  }
}

@Component({
  selector: 'pw-vitre-container',
  templateUrl: './vitre-container.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './vitre-container.component.css',
  ],
})
export class VitreContainerComponent implements AfterContentInit, OnChanges, OnDestroy {
  @ContentChildren(VitreLayerComponent) layers: QueryList<VitreLayerComponent>
  @HostBinding('attr.vitre-view') get attrView(): ViewType { return this.view }
  @Input('vitre-direction') direction: 'row' | 'column' = null

  private view: ViewType
  private $host: JQuery
  private set isSwiping(swiping: boolean) { this.$host.toggleClass("vitre-swiping", swiping) }

  // <vitre-container [curtainSize]="">
  // TODO connect manager to listener for these curtains
  // @Input() curtainSize: number = 200

  private layerManager: VitreLayerManager
  private layerNameToFrameIndex: { [name: string]: number } = {}

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
    let container = this.host()

    // let layers = Array.from<HTMLElement>(this.host().chil)

    this.layerManager = new VitreLayerManager(
      orientation,
      container,
      this.layers.toArray(),
      (index) => debug('change index', index)
    )

    this.layerManager.onSwiping = (swiping) => this.isSwiping = swiping

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

    this.reset()
  }

  ngOnDestroy() {
    // this.swipeManager.destroy()
    // window.removeEventListener('resize', this.onresize)
  }

  private reset() {
    if (this.layerManager == null) { return }

    this.layerManager.resize()

    // resize the view (md, sm, lg, xl)
    // for this new space size.
    this.recalcView()

    this.layers.forEach(layer => layer.setView(this.view))

    this._changes.detectChanges()
  }

  private recalcView() {
    // when direction is column, we use height
    // when direction is row, we use width
    const host = this.$host
    const size = this.isRow() ? host.width() : host.height()

    const breakpoint = GRID_BREAKPOINTS.find(a => a[1] < size)

    this.view = breakpoint != null ? breakpoint[0] : 'xs'
  }

  goto(name: string): boolean {
    let index = this.layerNameToFrameIndex[name]
    if (index == null) { return false }
    this.layerManager.gotoFrame(index)
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
