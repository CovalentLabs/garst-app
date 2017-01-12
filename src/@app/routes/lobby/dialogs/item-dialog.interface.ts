
import * as M from '@app/core/model'

// TODO: clean. type isn't DRY
export type ItemDialogOptions = { Post: M.LobbyItem, Data: M.LobbyItemData, CanEdit: boolean }

export interface ItemDialog {
  set(options: ItemDialogOptions): any
}
