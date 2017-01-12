import { Injectable } from '@angular/core'

import { Observer, Observable } from 'rxjs'

import { Router, NavigationEnd, NavigationStart } from '@angular/router'

import * as _mergeWith from 'lodash.mergewith'
let mergeWith: (obj: any, source: any, customizer?: (objValue, srcValue) => any) => any = _mergeWith
import * as _isEqualWith from 'lodash.isequalwith'
let deepEqual: (value: any, other: any, customizer?: (objValue, srcValue) => any) => any = _isEqualWith

// https://lodash.com/docs/4.16.4#mergeWith
// In the future, we may be interested in customizing this further
// for better support of large message arrays maybe.
function mergeExceptArrays (objValue, srcValue) {
  if (objValue instanceof Array && srcValue instanceof Array) {
    return srcValue
  }
}

import * as M from '@app/core/model'

export type ActionUpdate = (name: string, partial: M.PartialAppState) => void
export type EffectUpdate = ActionUpdate
export type NoteUpdate = (message: string) => void
export type NavigationUpdate = (from_url: string, to_url: string) => void

import { TimelineService, Timeline } from './timeline.service'
import * as T from './timeline.service'

@Injectable()
export class AppStateService {
  public state: Observable<M.AppState>
  private _state: M.AppState = M.DefaultAppState
  private _stateObserver: Observer<M.AppState>

  constructor(
      private _timeline: TimelineService,
      private _router: Router) {
    this.state = Observable.create(observer => {
      this._stateObserver = observer
      // Any cleanup logic might go here
      return () => console.log('%cdisposed state subscription', 'color: slategrey')
    })

    this._router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe(event => {
      const isLoginPath = event.url.startsWith('/login')
      const isStyleguidePath = event.url.startsWith('/styleguide')
      const isLoggedIn = this._state.Login.IsLoggedIn
      if (!(isLoginPath || isStyleguidePath) && !isLoggedIn) {
        // Not sure if we should log these or not.
        this.note('Not logged in redirect')(`Access: ${event.url}`)
        this._router.navigateByUrl('/login')
      }
    })

    this._router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(event => {
      let prevUrl = this._state.Device.URL
      if (prevUrl !== event.url) {
        this.navigation("Detected")(prevUrl, event.url)
        // Put the update into the state.
        this.updateState({ Device: { URL: event.url } })
      }
    })

    this.state.subscribe(() => void(0))
  }

  private updateState(partial: M.PartialAppState) {
    let track_from: M.PartialAppState = {}
    let to: M.PartialAppState = {}
    for (let key in partial) {
      if (!deepEqual(this._state[key], partial[key])) {
        track_from[key] = this._state[key]
        to[key] = partial[key]
      }
    }

    // Special merge update of traits
    let from: M.PartialAppState = {}
    mergeWith(from, track_from, mergeExceptArrays)
    mergeWith(this._state, to, mergeExceptArrays)

    this.next()

    return { from, to }
  }

  getState(): M.AppState {
    return this._state
  }

  next() {
    this._stateObserver.next(this._state)
  }

  applyTimeline(timeline: Timeline) {
    this._state = M.DefaultAppState
    this._timeline.reset()
    for (let entry of timeline) {
      // enter each timeline entry back into timeline
      switch (entry.type) {
        case 'action':
          const action_data = <T.TimelineAction> entry.data
          this.action(action_data.type)(action_data.name, action_data.to)
        break
        case 'effect':
          const effect_data = <T.TimelineEffect> entry.data
          this.effect(effect_data.type)(effect_data.name, effect_data.to)
        break
        case 'note':
          // Do not recreate notes because they tend to multiply
          // const note_data = <T.TimelineNote> entry.data
        break
        case 'navigation':
          const navigation_data = <T.TimelineNavigation> entry.data
          this._router.navigateByUrl(navigation_data.to)
        break
      }
    }
  }

  // This is the fundamental way to change the Application,
  // Here you can create an update function, which can be passed
  // your PartialAppState update, and it will be stored and logged.
  action(type: string, time_travel?: 'reset' | 'skip' | 'store'): ActionUpdate {
    function ActionUpdateFunction (name: string, partial: M.PartialAppState) {
      const app = (<AppStateService> this)

      if (time_travel === 'reset') {
        app._timeline.reset()
      }

      const change = app.updateState(partial)

      if (partial.Device && partial.Device.URL !== app._router.url) {
        app._router.navigateByUrl(partial.Device.URL)
      }

      if (time_travel !== 'skip') {
        app._timeline.enter(
          'action',
          // This type guard is for future proofing, rather than it being
          // required for this to work. So, if TimelineAction changes structure,
          // this will update
          <T.TimelineAction> { type, name, from: change.from, to: change.to }
        )
      }
    }

    return ActionUpdateFunction.bind(this)
  }

  // This is the fundamental way which server originated changes,
  // update the Application state.
  effect(type: string): EffectUpdate {
    function EffectUpdateFunction (name: string, partial: M.PartialAppState) {
      const app = (<AppStateService> this)

      const change = app.updateState(partial)

      if (partial.Device && partial.Device.URL !== app._router.url) {
        app._router.navigateByUrl(partial.Device.URL)
      }

      app._timeline.enter(
        'effect',
        <T.TimelineEffect> { type, name, from: change.from, to: change.to }
      )
    }

    return EffectUpdateFunction.bind(this)
  }

  // This is the fundamental way which server originated changes,
  // update the Application state.
  navigation(reason: string): NavigationUpdate {
    function NavigationUpdateFunction (from_url: string, to_url: string) {
      const app = (<AppStateService> this)

      // We've commented this out, because we are solely relying on listening
      // for router url changes.
      // Unfortunately, this means we need to do weird things to time travel,
      // but we'll cross that bridge when we come to it.
      // We will likely just end up separating navigation and
      // app._router.navigateByUrl(url)

      app._timeline.enter(
        'navigation',
        <T.TimelineNavigation> { reason, from: from_url, to: to_url }
      )
    }

    return NavigationUpdateFunction.bind(this)
  }

  // This is a simple way to add notes to the timeline that do not perform any updates
  note(type: string): NoteUpdate {
    function NoteUpdateFunction (message: string) {
      const app = (<AppStateService> this)

      app._timeline.enter(
        'note',
        <T.TimelineNote> { type, message }
      )
    }

    return NoteUpdateFunction.bind(this)
  }
}
