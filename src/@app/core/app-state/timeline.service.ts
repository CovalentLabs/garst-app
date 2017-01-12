import { Injectable } from '@angular/core'

import { Observer, Observable } from 'rxjs'

import * as M from '@app/core/model'

// Results from Device action
export type TimelineAction = {
  type: string,
  name: string,
  from: M.PartialAppState,
  to: M.PartialAppState
}
// Results from Server action
export type TimelineEffect = TimelineAction

export type TimelineNavigation = {
  reason: string,
  from: string,
  to: string,
}

export type TimelineNote = {
  type: string,
  message: string
}

export type TimelineEntryType = 'action' | 'effect' | 'note' | 'navigation'
export type TimelineEntryData = TimelineAction | TimelineEffect | TimelineNote | TimelineNavigation

export type TimelineEntry = {
  id: any
  type: TimelineEntryType
  data: TimelineEntryData
}

export type Timeline = TimelineEntry[]

@Injectable()
export class TimelineService {
  private _timeline: Timeline
  private _id: number = 0
  private _timelineObserver: Observer<Timeline>

  public timeline: Observable<Timeline>

  constructor() {
    this.timeline = Observable.create(observer => {
      this._timelineObserver = observer
      // Any cleanup logic might go here
      return () => console.log('disposed timeline subscription')
    })
    this.timeline.subscribe(noop => noop)
    this.reset()
  }

  next() {
    this._timelineObserver.next(this._timeline)
  }

  reset() {
    // FUTURE Reset timeline
    console.log('%cTimeline Reset', 'font-weight: bold; color: green')

    this._timeline = []
    this._id = 0
    this.next()
  }

  getAfter(id: any): Timeline {
    id = Number(id)

    return this._timeline
      .filter(entry => entry.id > id)
  }

  getUpTo(id: any): Timeline {
    id = Number(id)

    return this._timeline
      .filter(entry => entry.id <= id)
  }

  getTimeline(): Timeline {
    return this._timeline
  }

  enter(entry_type: TimelineEntryType, data: TimelineEntryData) {
    // Time travel is so hot right now.
    // Logging out based on type
    let title
    let message
    let style
    switch (entry_type) {
      case 'action':
        title = (<TimelineAction> data).type
        message = (<TimelineAction> data).name
        style = `color: #501cec`
        break
      case 'effect':
        title = (<TimelineEffect> data).type
        message = (<TimelineEffect> data).name
        style = `color: #008fcb`
        break
      case 'note':
        title = (<TimelineNote> data).type
        message = (<TimelineNote> data).message
        style = `color: #444`
        break
      case 'navigation':
        let navdata = (<TimelineNavigation> data)
        title = navdata.reason
        message = `${navdata.from} => ${navdata.to}`
        style = `color: #cc3366`
        break
    }

    console.log('%c' + entry_type.toUpperCase() + '%c: ' + title + ' %c' + message,
                style, 'font-weight: bold', 'color: blue')

    this._timeline.push({
      id: this._id++,
      type: entry_type,
      data: data
    })

    this.next()
  }
}
