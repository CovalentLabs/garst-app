
import * as S from './shared'

import { LobbyItem, LobbyItemData } from './lobby-item.model'

export
enum LobbyItemOption {
  DELETE, REACT, EDIT, REPORT
}

export
type Lobby = {
  Group: S.Group
  LobbyItems: LobbyItem[]
  // tracking data from Phoenix (send since last received)
  LastReceivedItem: LobbyItem,
  // For showing unseen notifications
  UnseenItems: LobbyItem[],
  // If set, show modal for responding.
  ItemOptions: {
    Post: LobbyItem
    // Latest Data
    Data: LobbyItemData
    // FUTURE: Do we want to show previous versions of this message?
    // Versions: LobbyItem[], // Versions/PastVersions etc..
    CanEdit: boolean
  }
  // If set, show modal for the specified option
  // We can do this, since at no point would we want to be doing
  // two options of editing, deleting, reporting, reacting etc.
  ItemOption: LobbyItemOption
}

export
const DefaultLobby: Lobby = {
  Group: null,
  LobbyItems: null,
  LastReceivedItem: null,
  UnseenItems: [],
  ItemOptions: null,
  ItemOption: null,
}
