import { Component } from '@angular/core'

import { VitreComponent } from '../vitre/vitre.component'

/**
 * The VitreDrawerComponent behaves and sizes the same way that the pw-vitre
 * does, except that in use, it is treated differently.
 */
@Component({
  selector: 'pw-vitre-drawer',
  template: '<ng-content></ng-content>',
})
export class VitreDrawerComponent extends VitreComponent {}
