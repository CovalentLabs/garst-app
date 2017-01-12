import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { ItemDialog, ItemDialogOptions } from '../item-dialog.interface'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'
import { AppStateService, LobbyActions } from '@app/core'

@Component({
  selector: 'pw-dialog-react-to-item',
  templateUrl: './react-to-item.dialog.html'
})
export class ReactToItemDialogComponent implements ItemDialog {

  content: string = null
  itemId: string = null

  constructor(
      private app: AppStateService,
      private lobby: LobbyActions,
      public dialogRef: MdDialogRef<ReactToItemDialogComponent>
  ) {}

  set(options: ItemDialogOptions) {
    this.itemId = options.Post.Id

    if (options.Post.Type === M.LobbyItemType.TEXT) {
      const data = <MLI.DataText> options.Data
      this.content = data
    }
  }

  onSelectReaction(reaction: string) {
    if (reaction) {
      // lobby action to react
      this.lobby.toggleReaction(this.itemId, reaction)
    }
    // close dialog
    this.dialogRef.close()
  }
}
