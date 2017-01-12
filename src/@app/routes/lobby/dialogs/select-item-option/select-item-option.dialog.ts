import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

import { ItemDialog, ItemDialogOptions } from '../item-dialog.interface'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'
import { AppStateService } from '@app/core'

const REPORTABLE_TYPES = [
  M.LobbyItemType.TEXT,
]
const EDITABLE_TYPES = [
  M.LobbyItemType.TEXT,
]

@Component({
  selector: 'pw-dialog-select-item-option',
  templateUrl: './select-item-option.dialog.html',
})
export class SelectItemOptionDialogComponent implements ItemDialog {
  OPTION_DELETE = M.LobbyItemOption.DELETE
  OPTION_EDIT = M.LobbyItemOption.EDIT
  OPTION_REACT = M.LobbyItemOption.REACT
  OPTION_REPORT = M.LobbyItemOption.REPORT

  canEdit = false
  canReport = false

  content: string = null

  constructor(
      private app: AppStateService,
      public dialogRef: MdDialogRef<SelectItemOptionDialogComponent>
  ) {}

  set(options: ItemDialogOptions) {
    this.canEdit = options.CanEdit && EDITABLE_TYPES.includes(options.Post.Type)
    this.canReport = REPORTABLE_TYPES.includes(options.Post.Type)

    if (options.Post.Type === M.LobbyItemType.TEXT) {
      const data = <MLI.DataText> options.Data
      this.content = data
    }
  }

  onSelectOption(opt: M.LobbyItemOption, name: string) {
    let action = this.app.action("LobbyItem SelectOptionDialog")

    action(name, { Lobby: { ItemOption: opt } })
  }
}
