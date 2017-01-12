
import { Directive, HostListener, ElementRef, OnDestroy } from '@angular/core'

// Listens for textarea input events
@Directive({
  selector: '[pw-shadow-scroller]'
})
export class ShadowScrollerDirective implements OnDestroy {
  @HostListener('scroll') onScroll() {
    this.scroll()
  }
  scroll = function(){}
  constructor(_ref: ElementRef) {
    addStyles(_ref.nativeElement)
    this.scroll = createAutoShader(_ref)
    window.addEventListener("resize", this.scroll)
    setTimeout(this.scroll, 0)
  }

  ngOnDestroy() {
    window.removeEventListener("resize", this.scroll)
  }
}

// Yay new mapped types 2017-01-10
type PartialStyleDeclartion = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] }
const styles: PartialStyleDeclartion = {
  overflowY: 'auto',
  flex: "1",
  transition: 'box-shadow .4s ease-in'
}

function addStyles(elt: HTMLElement) {
  Object.assign(elt.style, styles)
}

function createAutoShader(ref: ElementRef) {
  const topShadow = `inset 0 13px 10px -10px rgba(0,0,0,0.2)`
  const topShadow0 = `inset 0 13px 10px -10px rgba(0,0,0,0)`
  const btmShadow = `inset 0 -13px 10px -10px rgba(0,0,0,0.2)`
  const btmShadow0 = `inset 0 -13px 10px -10px rgba(0,0,0,0)`

  let lastKnownScrollTop = 0
  let lastKnownScrollHeight = 0
  let lastKnownHeight = 0
  let ticking = false

  function requestTick() {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(update)
    }
  }

  function update() {
    ticking = false
    let shadows = []
    if (lastKnownScrollTop > 2) {
      shadows.push(topShadow)
    } else {
      shadows.push(topShadow0)
    }
    if (lastKnownScrollHeight - lastKnownHeight - lastKnownScrollTop > 2) {
      shadows.push(btmShadow)
    } else {
      shadows.push(btmShadow0)
    }

    ref.nativeElement.style.boxShadow = shadows.join(', ')
  }

  return function autoShade() {
    const elt: HTMLElement = ref.nativeElement
    lastKnownHeight = elt.offsetHeight
    lastKnownScrollHeight = elt.scrollHeight
    lastKnownScrollTop = elt.scrollTop
    requestTick()
  }
}
