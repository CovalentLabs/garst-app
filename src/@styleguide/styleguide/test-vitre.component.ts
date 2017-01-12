import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core'

import { ActivatedRoute } from '@angular/router'

import { AppState } from '@app/core'
import { getMockState } from '@mock/states'

import { Subscription } from 'rxjs'

const mock = getMockState("Lobby/Base").state

@Component({
  // Nunjucks now available for templating
  templateUrl: './test-vitre.html',
  styleUrls: [
    '../../@app/shared-style/component/full.css',
    // '@app/shared/shared/message.css',
    './test-vitre.css',
  ]
})
export class TestVitreComponent implements OnInit, OnDestroy, AfterViewInit {
  // Test vars
  time = 'Now'
  vitreView = null
  AppState: AppState = mock
  pod$ = mock.Lobby.Group.GroupUsers.slice(0, 3)
  pod1 = mock.Lobby.Group.GroupUsers.slice(3)

  private _paramsSub: Subscription

  constructor(
      private _route: ActivatedRoute,
      private _ref: ElementRef) {
    this._paramsSub = this._route.params.subscribe(
        params => {
      console.log('Styleguide params:', params)
    })
  }

  ngAfterViewInit() {

  }

  test(...args) {
    console.log.apply(console, ["%ctest", 'font-weight: bold;'].concat(args))
  }

  ngOnInit() {}

  ngOnDestroy() {
    // free up resources by unsubscribing.
    this._paramsSub.unsubscribe()
  }
}
