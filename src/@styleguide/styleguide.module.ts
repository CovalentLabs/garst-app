import { NgModule, ApplicationRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { LocationStrategy, HashLocationStrategy } from '@angular/common'
import { CommonModule }      from '@angular/common'

/* Shared Modules */
import { SharedModule } from '@app/shared'
import { MaterialModule } from '@angular/material'

// import { CoreModule } from '@app/core'

/* Routing Module */
import { StyleguideRoutingModule } from './styleguide-routing.module'

import { removeNgStyles, createNewHosts } from '@angularclass/hmr'

import { Component } from '@angular/core'

// Triggers generation of global styles.
import '../@styles/global.scss';

@Component({
  selector: 'pw-app', // <pw-app></pw-app>
  template: `
<div class="outlet">
  <router-outlet></router-outlet>
</div>
`,
  styleUrls: [
    '../@app/shared-style/component/full.css',
    './styleguide.component.css',
  ],
})
export
class StyleguideComponent {}

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    SharedModule,

    // CoreModule defines everything that needs to be imported once,
    // and app-wide singletons such as the DeviceStateService
    MaterialModule.forRoot(),
    // CoreModule.forRoot(),

    StyleguideRoutingModule
  ],
  declarations: [
    StyleguideComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [ StyleguideComponent ]
})
export class StyleguideModule {
  constructor(
      public appRef: ApplicationRef,
      // private _appStateService: AppStateService,
      // private _timelineService: TimelineService
  ) {}

  hmrOnInit(store) {
    console.log("HMR store", store)

    /*
    if (store && store.timeline) {
      this._appStateService.applyTimeline(store.timeline)

      // change detection
      this.appRef.tick()
      delete store.timeline
    } else {
    }*/
  }

  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement)
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation)

    // Save state to hmr
    // store.timeline = this._timelineService.getTimeline()

    // remove leftovers
    $('.cdk-overlay-container').remove()

    // remove styles
    removeNgStyles()

    // Clear console on destruction
    if ('clear' in console) { console.clear() }
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts()
    delete store.disposeOldHosts
  }
}
