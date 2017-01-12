import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { ItemDialog, ItemDialogOptions } from '../item-dialog.interface'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'
import { AppStateService, LobbyActions } from '@app/core'

@Component({
  selector: 'pw-dialog-edit-text-item',
  templateUrl: './edit-text-item.dialog.html',
  styleUrls: [
`
textarea {
  resize: none;
  overflow: hidden;
  min-height: 50px;
  max-height: 150px;
}
`
  ]
})
export class EditTextItemDialogComponent implements ItemDialog {

  editString: string = null
  itemId: string = null

  constructor(
      private app: AppStateService,
      private lobby: LobbyActions,
      public dialogRef: MdDialogRef<EditTextItemDialogComponent>
  ) {}

  set(options: ItemDialogOptions) {
    this.itemId = options.Post.Id

    if (options.Post.Type === M.LobbyItemType.TEXT) {
      const data = <MLI.DataText> options.Data
      this.editString = data
    }
  }

  onConfirm(doEdit: boolean) {
    if (doEdit) {
      // lobby action to delete
      this.lobby.editText(this.itemId, this.editString)
    }
    // close dialog
    this.dialogRef.close()
  }
}
