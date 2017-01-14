/* tslint:disable: directive-selector */

import { Directive, Input, ElementRef } from '@angular/core'

// TODO set up service for centrallizing value retrieval

import { COLORS } from './material-colors'

export const VALUE_RE = /^(\w+)\s*=\s*([\w\s]+)$/
type Color = { color: string, text: 'black' | 'white' }

export const COLOR_VALUE_RE = /(A?\d+)/
export const COLOR_FAMILY_RE = /([a-zA-Z\s]+)/

/**
 * Sprinkles!
 * Short-term: this helps us easily customize the colors used across the app via JavaScript
 * Long-term: we can centrallize feature flags for driving A/B testing
 */
@Directive({
  selector: '[sprinkle]'
})
export class SprinkleDirective {
  @Input('sprinkle') set sprinkles(value: string) {
    if (this._lastValue !== value) {
      this._lastValue = value
      this.applyStyles()
    }
  }

  private _lastValue: string
  private _prevProperty: string
  private _prevValue: string
  private host: HTMLElement
  private lookup = new LookupUIColors()

  constructor(_ref: ElementRef) { this.host = <HTMLElement> _ref.nativeElement }

  private applyStyles = () => {
    // parsing
    const value = VALUE_RE.exec(this._lastValue)
    if (value == null) return console.warn(`Unable to parse [sprinkle]="${this._lastValue}"`)
    const [, property, key] = value
    if (!(property in this.host.style))
      return console.warn(`Unable to apply property to style of host: ${property}. (Received [sprinkle]="${this._lastValue}")`)
    const lookupValue = this.lookup.lookupColor(key)
    if (lookupValue == null) return console.warn(`Unable to find value for key: ${key}. (Received [sprinkle]="${this._lastValue}")`)

    // reemplace prior style
    if (null != this._prevProperty) this.host.style[this._prevProperty] = this._prevValue

    this._prevProperty = property
    this._prevValue = this.host.style[property]
    this.host.style[property] = lookupValue.color
  }
}

// Yay new mapped types 2017-01-10
type PartialStyleDeclartion = { [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] }

type ColorFamily = keyof typeof COLORS
type ColorValue = keyof typeof COLORS['red']

class LookupUIColors {
  constructor(
      private primaryFamily: ColorFamily = 'amber',
      private muteFamily: ColorFamily = 'blue grey',
      private primaryValue: ColorValue = '400',
      ) {}

  lookupColor(key: string): Color {
    let family: ColorFamily = this.muteFamily
    const matchFamily = COLOR_FAMILY_RE.exec(key)
    if (key.includes('primary')) family = this.primaryFamily
    else if (matchFamily != null) family = <ColorFamily> matchFamily[1].trim().toLowerCase()
    else family = this.muteFamily

    let value = this.primaryValue
    const matchValue = COLOR_VALUE_RE.exec(key)
    if (matchValue != null) value = <ColorValue> matchValue[1]

    if (COLORS[family]) return COLORS[family][value]
  }
}
