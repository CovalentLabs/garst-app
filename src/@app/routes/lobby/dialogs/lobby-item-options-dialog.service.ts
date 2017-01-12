/* tslint:disable:no-unused-variable */
import { Injectable, OnDestroy } from '@angular/core'

import { AppStateService } from '@app/core/app-state'
import { DataService } from '@app/core/data'
import { MdDialog, MdDialogRef, ComponentType } from '@angular/material'
import { ItemDialog } from './item-dialog.interface'

import { EditTextItemDialogComponent } from './edit-text-item/edit-text-item.dialog'
import { DeleteItemDialogComponent } from './delete-item/delete-item.dialog'
import { ReactToItemDialogComponent } from './react-to-item/react-to-item.dialog'
import { ReportItemDialogComponent } from './report-item/report-item.dialog'
import { SelectItemOptionDialogComponent } from './select-item-option/select-item-option.dialog'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'

import * as moment from 'moment'
function reltime(num: number, unit: moment.unitOfTime.DurationConstructor): Date {
  return moment().add(num, unit).toDate()
}

// TODO: clean. type isn't DRY
type Options = { Post: M.LobbyItem, Data: M.LobbyItemData, CanEdit: boolean }

export const DIALOGS = [
  EditTextItemDialogComponent,
  DeleteItemDialogComponent,
  ReactToItemDialogComponent,
  ReportItemDialogComponent,
  SelectItemOptionDialogComponent,
]

@Injectable()
export class LobbyItemOptionsDialogService implements OnDestroy {
  private lastOption: M.LobbyItemOption
  private lastOptions: Options
  private isDialogOpen: boolean
  private openDialogRef: MdDialogRef<ItemDialog>

  constructor(
      private app: AppStateService,
      private data: DataService,
      private dialog: MdDialog) {}

  push(...obj) {
    let args = [`LobbyAction %cpush`, 'font-weight: bold', ...obj]
    console.log.apply(console, args)
  }

  private close() {
    // close MdDialog
    this.isDialogOpen = false
    this.lastOptions = null
    this.openDialogRef.close()
  }

  private open(options: Options, option: M.LobbyItemOption) {
    if (this.isDialogOpen) {
      this.close()
    }

    if (options == null) { return }

    let dialogRef: MdDialogRef<ItemDialog>
    // depending on the dialog type, we open different dialogs
    switch (option) {
      case M.LobbyItemOption.DELETE:
        dialogRef = this.dialog.open(DeleteItemDialogComponent); break
      case M.LobbyItemOption.EDIT:
        dialogRef = this.dialog.open(EditTextItemDialogComponent, { width: '80vw' }); break
      case M.LobbyItemOption.REACT:
        dialogRef = this.dialog.open(ReactToItemDialogComponent); break
      case M.LobbyItemOption.REPORT:
        dialogRef = this.dialog.open(ReportItemDialogComponent); break
      default:
        dialogRef = this.dialog.open(SelectItemOptionDialogComponent); break
    }
    this.isDialogOpen = true
    this.openDialogRef = dialogRef
    this.lastOptions = options
    this.lastOption = option

    // provide item options
    dialogRef.componentInstance.set(options)

    dialogRef.afterClosed().subscribe(result => {
      if (!this.isDialogOpen) { return }
      this.isDialogOpen = false

      let action = this.app.action("Close ItemDialog")

      console.log("DIALOG RESULT", result)

      action(`Result: ${result}`, { Lobby: { ItemOptions: null } })
    })
  }

  update(options: Options, option: M.LobbyItemOption) {
    if (this.isDialogOpen) {
      // we have something open

      if (options == null) {
        // close what we have open
        return this.close()
      }

      if (options.Post.Id === this.lastOptions.Post.Id
          && option === this.lastOption) {
        // we have the same thing open as before
        return
      }

      return this.open(options, option)

    } else {
      // we currently have nothing open

      // still nothing open
      if (options == null) { return }

      return this.open(options, option)
    }
  }

  // We'll listen for destruction so we can close the dialog in the case of hot reload
  ngOnDestroy() {
    if (this.isDialogOpen) {
      this.isDialogOpen = false
      this.openDialogRef.close()
    }
  }
}
