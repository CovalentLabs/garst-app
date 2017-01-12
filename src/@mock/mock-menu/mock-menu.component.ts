import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { getMockState, MOCK_STATE_KEYS, MockState } from '@mock/states'

import { AppStateService, AppState, Timeline, TimelineService } from '@app/core'
import { Subscription } from 'rxjs'

export
type Folder = { name: string, children?: Folder[], key?: string }

@Component({
  selector: 'pw-mock-menu',
  templateUrl: './mock-menu.component.html',
  styleUrls: [
    './mock-menu.component.css',
  ]
})
export class MockMenuComponent implements OnDestroy, OnInit {
  // Overall AppState
  AppState: AppState
  Timeline: Timeline
  private _stateSub: Subscription
  private _timelineSub: Subscription

  mockStateKeys: string[] = []
  showState = false
  mockSelectionOpen = false

  mockUrls: string[] = [
    '/home',
    '/discovering',
    '/lobby',
    '/login',
    '/history',
    '/',
  ]

  mockStateFolders: Folder[] = []
  constructor(private _app: AppStateService,
      private _router: Router,
      private _timeline: TimelineService) {
    this.mockStateKeys = MOCK_STATE_KEYS

    this.setupFolders()
    this._timelineSub = this._timeline.timeline
      .subscribe(timeline => this.Timeline = timeline)
  }

  // Sets up directory tree structure view
  setupFolders() {
    let keys = this.mockStateKeys
    let contents = createFolders(keys)
    this.mockStateFolders = contents
  }

  ngOnInit() {
    // Set up state subscription after view is initiallized
    this._stateSub = this._app.state
      .subscribe(appState => this.AppState = appState)

    // trigger update so AppState becomes set.
    this._app.next()
  }

  ngOnDestroy() {
    // free up resources by unsubscribing.
    this._stateSub.unsubscribe()
    this._timelineSub.unsubscribe()
  }

  select(key: string) {
    this.setState(getMockState(key))
  }

  navigate(url: string) {
    this._router.navigateByUrl(url)
  }

  setState(ms: MockState) {
    const update = this._app.action("Mock Update State", 'reset')

    update("Mock:" + ms.name, ms.state)
  }

  selectTimelineEntry(id: any) {
    let timeline = this._timeline.getUpTo(id)
    this._app.applyTimeline(timeline)
  }

  toggleMockMenu(show?: boolean) {
    if (show == null) {
      show = !this.AppState.Mock.ShowMockMenu
    }
    const update = this._app.action("Mock ShowMockMenu", 'skip')

    update(show ? 'Show' : 'Hide',  {
      Mock: { ShowMockMenu: show }
    })
  }

  toggleDebugState(show?: boolean) {
    if (show == null) {
      show = !this.AppState.Mock.ShowDebugState
    }
    const update = this._app.action("Mock ShowDebugState", 'skip')

    update(show ? 'Show' : 'Hide',  {
      Mock: { ShowDebugState: show }
    })
  }

  toggleTimeline(show?: boolean) {
    if (show == null) {
      show = !this.AppState.Mock.ShowTimeline
    }
    const update = this._app.action("Mock ShowTimeline", 'skip')

    update(show ? 'Show' : 'Hide',  {
      Mock: { ShowTimeline: show }
    })
  }
}

const prefix_re = /^[^\/]+\//
function createFolders(keys: string[], prefix = ''): Folder[] {
  const res: Folder[] = []
  const items: {[prefix: string]: string[]} = {}
  keys
    .map(key => ({ name: key.replace(prefix, ''), key: key }))
    .map(nk => {
      let match = nk.name.match(prefix_re)
      if (match) {
        let pre = match[0]
        if (!items[pre]) {
          items[pre] = []
        }
        items[pre].push(nk.key)
      } else {
        res.push(nk)
      }
    })
  return res.concat(
    Object.keys(items)
      .map(pre => ({ name: pre, children: createFolders(items[pre], prefix + pre) }))
  )
}
