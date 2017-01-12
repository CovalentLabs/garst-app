import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import * as MLI from '@app/core/model/lobby-item.model'

@Component({
  selector: 'pw-lobby-item-input',
  templateUrl: './lobby-item-input.component.html',
  styleUrls: [
    './lobby-item-input.component.css',
  ]
})
export class LobbyItemInputComponent implements OnChanges {
  LOCK_UPDATE = MLI.LobbyItemType.LOCK_UPDATE
  // REACTION = MLI.LobbyItemType.REACTION
  TEXT = MLI.LobbyItemType.TEXT
  USER_DATA_UPDATE = MLI.LobbyItemType.USER_DATA_UPDATE
  USER_HAS_ARRIVED_UPDATE = MLI.LobbyItemType.USER_HAS_ARRIVED_UPDATE
  USER_STATUS_UPDATE = MLI.LobbyItemType.USER_STATUS_UPDATE

  MEDIA = 999

  @Input() editItem: MLI.LobbyItemTypeAndData
  @Output() cancelEdit = new EventEmitter()
  @Output() saveEdit = new EventEmitter<MLI.LobbyItemData>()

  @Output() send = new EventEmitter<MLI.LobbyItemTypeAndData>()

  data: MLI.LobbyItemData = ""
  type: MLI.LobbyItemType = MLI.LobbyItemType.TEXT

  ngOnChanges(changes) {
    // on changes
    console.log('onChanges', this.editItem)
    if (this.editItem != null) {
      this.type = this.editItem.type
      this.data = this.editItem.data
    }
  }

  onClickSend() {
    console.log('Sending', this.type, this.data)
    // do something on click!
  }
}
