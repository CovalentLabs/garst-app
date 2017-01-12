
import * as MLI from '@app/core/model/lobby-item.model'

export
type RenderedItem = {
  ItemId: string,
  Data: MLI.LobbyItemData,
  Type: MLI.LobbyItemType,
  Reactions: Reaction[],
  IsEdited: boolean,
  IsDeleted: boolean,
}

export type Reaction = {
  // Unique for Array
  Reaction: string,

  // All Items with this Reaction.
  Items: ReactionItem[]
}

export type ReactionItem = {
  ItemId: string,
  ProfileId: string,
}

export
type RenderedItemGroup = {
  ProfileId: string,
  PostedAt: Date,
  Items: RenderedItem[],
}
