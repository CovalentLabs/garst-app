import { Component, OnInit, OnDestroy } from '@angular/core'

import { AppStateService, AppState, LoginActions } from '@app/core'

import { Subscription } from 'rxjs'

@Component({
  templateUrl: './login.component.html',
  styleUrls: [
    '../../../@app/shared-style/component/full.css',
    './login.component.css',
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  // Overall AppState
  AppState: AppState

  private _stateSub: Subscription

  constructor(
      private _app: AppStateService,
      private _login: LoginActions) {
    this._stateSub = this._app.state.subscribe(
        appState => {
      this.AppState = appState
    })
  }

  onClickLogin() {
    this._login.promptLogin()
  }

  onClickLogout() {
    this._login.promptLogout()
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
