import { NgModule }           from '@angular/core'
import { SharedModule }       from '@app/shared/shared.module'
import { DiscoverComponent } from './discovering.component'

// Availability
import { InputAvailabilityComponent } from './input-availability/input-availability.component'
import { InputTimeComponent } from './input-availability/input-time/input-time.component'

import { DiscoveringRoutingModule } from './discovering-routing.module'
@NgModule({
  imports:      [ SharedModule, DiscoveringRoutingModule ],
  declarations: [
    DiscoverComponent,
    InputAvailabilityComponent, InputTimeComponent
  ],
  providers:    []
})
export class DiscoveringModule { }
