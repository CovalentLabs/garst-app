import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { ItemDialog, ItemDialogOptions } from '../item-dialog.interface'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'
import { AppStateService, LobbyActions } from '@app/core'

@Component({
  selector: 'pw-dialog-delete-item',
  templateUrl: './delete-item.dialog.html'
})
export class DeleteItemDialogComponent implements ItemDialog {

  content: string = null
  itemId: string = null

  constructor(
      private app: AppStateService,
      private lobby: LobbyActions,
      public dialogRef: MdDialogRef<DeleteItemDialogComponent>
  ) {}

  set(options: ItemDialogOptions) {
    if (options.Post.Type === M.LobbyItemType.TEXT) {
      const data = <MLI.DataText> options.Data
      this.itemId = options.Post.Id
      this.content = data
    }
  }

  onConfirm(doDelete: boolean) {
    if (doDelete) {
      // lobby action to delete
      this.lobby.deleteItem(this.itemId)
    }
    // close dialog
    this.dialogRef.close()
  }
}
