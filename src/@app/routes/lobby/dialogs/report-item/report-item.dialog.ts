import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { ItemDialog, ItemDialogOptions } from '../item-dialog.interface'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'
import { AppStateService, LobbyActions } from '@app/core'

@Component({
  selector: 'pw-dialog-report-item',
  templateUrl: './report-item.dialog.html'
})
export class ReportItemDialogComponent implements ItemDialog {

  reasonString: string = ''
  content: string = null
  itemId: string = null
  hasReported = false

  constructor(
      private app: AppStateService,
      private lobby: LobbyActions,
      public dialogRef: MdDialogRef<ReportItemDialogComponent>
  ) {}

  set(options: ItemDialogOptions) {
    this.itemId = options.Post.Id

    if (options.Post.Type === M.LobbyItemType.TEXT) {
      const data = <MLI.DataText> options.Data
      this.content = data
    }
  }

  onConfirm(doReport: boolean) {
    if (doReport) {
      this.lobby.reportItem(this.itemId, this.reasonString)
      this.hasReported = true
      setTimeout(() => this.dialogRef.close("Reported"), 1200)
    } else {
      // close dialog
      this.dialogRef.close()
    }
  }
}
