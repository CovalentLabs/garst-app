import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core'

import { Router } from '@angular/router'

import { AppStateService, AppState } from '@app/core'
import { RenderedItemGroup } from '@app/core/data'

import { LobbyRendererService } from './lobby-renderer'
import { LobbyItemOptionsDialogService } from './dialogs'

import { Subscription } from 'rxjs'

@Component({
  templateUrl: './lobby.component.html',
  styleUrls: [
    '../../../@app/shared-style/component/full.css',
    './lobby.component.css',
  ]
})
export class LobbyComponent implements OnInit, OnDestroy {
  // Overall AppState
  AppState: AppState
  ItemGroups: RenderedItemGroup[] = []
  myProfileId: string

  private _stateSub: Subscription
  private _renderSub: Subscription

  constructor(
      private _app: AppStateService,
      private _render: LobbyRendererService,
      private _ref: ElementRef,
      private _optionsDialog: LobbyItemOptionsDialogService,
      private _router: Router) {
    this._stateSub = this._app.state.subscribe(
        appState => {
      this.AppState = appState
      this.myProfileId = appState.Login.Credentials.Profile.Id
      this._render.updateLobby(appState.Lobby)

      this.checkItemOptions()
    })
    this._renderSub = this._render.render.subscribe(
        render => this.ItemGroups = render)
  }

  sendMessage(event) {
    console.log('%csendMessage', 'color: dodgerblue; font-weight: bold', event)
  }

  checkItemOptions() {
    let lobby = this.AppState.Lobby
    this._optionsDialog.update(lobby.ItemOptions, lobby.ItemOption)
  }
  ngOnInit() {
    // trigger update so AppState becomes set.
    this._app.next()
  }

  ngOnDestroy() {
    // free up resources by unsubscribing.
    this._stateSub.unsubscribe()
    this._renderSub.unsubscribe()
  }
}
