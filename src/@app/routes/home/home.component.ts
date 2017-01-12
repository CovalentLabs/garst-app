import { Component, OnInit, OnDestroy } from '@angular/core'

import { AppStateService, AppState, DiscoverActions } from '@app/core'

import { Subscription } from 'rxjs'

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  // Overall AppState
  AppState: AppState

  private _stateSub: Subscription

  constructor(
      private _app: AppStateService,
      private _discover: DiscoverActions) {
    this._stateSub = this._app.state.subscribe(
        appState => {
      this.AppState = appState
    })
  }

  clickStartDiscover() {
    this._discover.startDiscover()
  }

  ngOnInit() {
    // trigger update so AppState becomes set.
    this._app.next()
  }

  ngOnDestroy() {
    // free up resources by unsubscribing.
    this._stateSub.unsubscribe()
  }
}
