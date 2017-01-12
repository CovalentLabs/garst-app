import { Injectable, OnDestroy } from '@angular/core'

import { AppStateService } from '@app/core/app-state'
import { AppState } from '@app/core/model'

import { LobbyItemReceiverService } from './lobby-data'

import { Subscription } from 'rxjs'

@Injectable()
export class DataService implements OnDestroy {
  // Overall AppState
  private _state: AppState
  private _stateSub: Subscription

  constructor(
      private _app: AppStateService,
      private _lobby: LobbyItemReceiverService) {
    this._stateSub = this._app.state.subscribe(
        appState => {
      this._state = appState
    })
    // trigger update so AppState becomes set.
    this._state = this._app.getState()
  }

  isMyProfile(profileId: string): boolean {
    return this.getMyProfileId() === profileId
  }

  getMyProfileId() {
    if (this._state && this._state.Login.IsLoggedIn) {
      return this._state.Login.Credentials.Profile.Id
    }
    return ''
  }

  get lobbyPosts() {
    return this._lobby.posts
  }

  ngOnDestroy() {
    // free up resources by unsubscribing.
    this._stateSub.unsubscribe()
  }
}
