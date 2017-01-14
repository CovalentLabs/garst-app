
import { Directive, ElementRef, OnDestroy } from '@angular/core'

type ViewType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// Borrowed from _custom.css
// this adds sm(340px) to the breakpoints for flexibility
export const GRID_BREAKPOINTS =
`  xs: 0,
  sm: 340px,
  md: 576px,
  lg: 768px,
  xl: 992px`
.replace(/\s+/g, '')
.split(',')
.map(function (b): [ViewType, number] {
  let [name, px] = b.split(':')
  return [<ViewType> name, parseFloat(px)]
})
.reverse()

// Listens for textarea input events
/* tslint:disable: directive-selector */
@Directive({ selector: '[bs-width]' })
export class BSWidthDirective implements OnDestroy {
  // debounce resizing
  private ticking: any

  constructor(private _ref: ElementRef) {
    setTimeout(() => setView(this._ref.nativeElement), 0)
    window.addEventListener('resize', this.resizerFn)
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizerFn)
  }

  private resizerFn = () => {
    clearTimeout(this.ticking)
    this.ticking = setTimeout(setView, 50, this._ref.nativeElement)
  }
}

function setView(host: HTMLElement) {
  const size = host.offsetWidth
  const breakpoint = GRID_BREAKPOINTS.find(a => a[1] < size)
  host.dataset["view"] = breakpoint != null ? breakpoint[0] : 'xs'
}
