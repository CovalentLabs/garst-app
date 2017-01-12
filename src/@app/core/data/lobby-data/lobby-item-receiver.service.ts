import { Injectable } from '@angular/core'

import * as I from './lobby-renderer-data-structures'

import * as MLI from '@app/core/model/lobby-item.model'

function debug(title: string, ...obj) {
  // let args = [`Renderer %c${title}`, 'font-weight: bold', ...obj]
  // console.log.apply(console, args)
}

@Injectable()
export class LobbyItemReceiverService {
  private _posts: I.PostsDictionary
  get posts()  {
    return this._posts
  }

  // private _updates: I.ItemsDictionary
  private _lastSeen: MLI.LobbyItem

  constructor() {
    this._posts = new I.PostsDictionary()
  }

  update(lobbyItems: MLI.LobbyItem[]) {
    let newItemsStart = 0
    if (this._lastSeen != null) {
      newItemsStart = 1 + lobbyItems.findIndex((item) => item.Id === this._lastSeen.Id)
      // QUESTION: Guard if the item is not present for some reason?
    }
    for (let i = newItemsStart; i < lobbyItems.length; i++) {
      this.add(lobbyItems[i])
    }
    // Check if any items have been added
    const hasAddedItems = newItemsStart < lobbyItems.length
    if (hasAddedItems) {
      this._lastSeen = lobbyItems[lobbyItems.length - 1]
      debug('lastseen', this._lastSeen)
    }
  }

  private add(item: MLI.LobbyItem) {
    this.organize(item)
  }

  private organize(item: MLI.LobbyItem) {
    debug('organize', item)
    if (item.Operation === MLI.LobbyItemOperation.POST) {
      this._posts.post(item)
    } else {
      this._posts.update(item)
      // this._updates.setValue(item.OperationTargetItemId, item)
    }
  }
}
