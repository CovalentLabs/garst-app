import {
  Component, Input
} from '@angular/core';

import { LobbyActions } from '@app/core'

import { RenderedItem } from '@app/core/data'

import * as MLI from '@app/core/model/lobby-item.model'

import { ItemLockUpdateComponent } from './item-lock-update/item-lock-update.component'
import { ItemTextComponent } from './item-text/item-text.component'
import { ItemUserStatusUpdateComponent } from './item-user-status-update/item-user-status-update.component'
import { ItemReactionsComponent } from './item-reactions/item-reactions.component'

export const ITEM_DECLARATIONS = [
  ItemTextComponent,
  ItemLockUpdateComponent,
  ItemUserStatusUpdateComponent,
  ItemReactionsComponent
]

@Component({
  selector: 'pw-item',
  templateUrl: './item.component.html',
  styleUrls: [
    './item.component.css',
  ]
})
export class ItemComponent {
  LOCK_UPDATE = MLI.LobbyItemType.LOCK_UPDATE
  // REACTION = MLI.LobbyItemType.REACTION
  TEXT = MLI.LobbyItemType.TEXT
  USER_DATA_UPDATE = MLI.LobbyItemType.USER_DATA_UPDATE
  USER_HAS_ARRIVED_UPDATE = MLI.LobbyItemType.USER_HAS_ARRIVED_UPDATE
  USER_STATUS_UPDATE = MLI.LobbyItemType.USER_STATUS_UPDATE

  // <item [item]="">
  @Input() item: RenderedItem

  constructor(private _lobby: LobbyActions) {}

  onPress(event: HammerInput) {
    catchPressEnd()
    this._lobby.showItemOptions(this.item.ItemId)
  }

  onReact(reactionValue?: string) {
    if (reactionValue == null || reactionValue.length === 0) {
      this._lobby.showReactionOptions(this.item.ItemId)
    } else {
      this._lobby.toggleReaction(this.item.ItemId, reactionValue)
    }
  }
}

function catchPressEnd() {
  // create intermediary backdrop to prevent immediately closing dialog
  // upon the exit of the touch event.
  $(`<div class="cdk-overlay-backdrop">`)
    .css({ "z-index": 1001 })
    .appendTo('body')
    .on('mouseup touchend contextmenu', (upEvent) => {
      upEvent.stopPropagation()
      upEvent.preventDefault()
      // Remove this element after press completes
      upEvent.target.remove()
    })
}
