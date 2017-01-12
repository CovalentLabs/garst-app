
import { Directive, HostListener, ElementRef } from '@angular/core'

// Listens for textarea input events
@Directive({ selector: 'textarea[pw-auto-grow]' })
export class AutoGrowDirective {
  @HostListener('input') onInput() {
    autoGrow(this._ref.nativeElement)
  }
  constructor(private _ref: ElementRef) {
    setTimeout(() => autoGrow(this._ref.nativeElement), 0)
  }
}

function autoGrow(textarea: HTMLTextAreaElement) {
  const hasValue = textarea.value.length > 0
  textarea.style.height = "5px"
  if (!hasValue) { textarea.value = " " }
  textarea.style.height = textarea.scrollHeight + "px"
  if (!hasValue) { textarea.value = "" }
}
