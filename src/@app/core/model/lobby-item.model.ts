
import * as S from './shared'

// All objects here which have an Id attribute
// are tied to a database entry.
export type DBObjectName
  = 'LobbyItem'
export const DBObjectNames: DBObjectName[] =
  [ 'LobbyItem' ]

// POST = Created/wrote message, is new.
// EDIT = Updates existing item specified by TargetItemId
// DELETE = Deletes existing item specified by TargetItemId
export enum LobbyItemOperation {
  POST, EDIT, DELETE
}

// FUTURE: Media type
// Then add a DataMedia type which represents a
// Media Resource URL, etc
export enum LobbyItemType {
  TEXT, REACTION,
  LOCK_UPDATE,
  USER_STATUS_UPDATE, USER_DATA_UPDATE, USER_HAS_ARRIVED_UPDATE
}

export type DataLockStatusUpdate = S.GroupLockStatus
export type DataText = string
// ItemId is the LobbyItem the reaction is in reference to
export type DataReaction = { ItemId: string, Reaction: string }
export type DataUserStatusUpdate = S.GroupUserStatus
export type DataUserDataUpdate = S.GroupUserData
export type DataUserHasArrivedUpdate = boolean

// Messages in the chat room / lobby
// This can represent either a post, edit, or deletion of an item
export type LobbyItem = {
  Id: string
  CreatedAt: Date
  ProfileId: string

  Operation: LobbyItemOperation
  // Would be empty only if POST
  OperationTargetItemId?: string

  // Payload of the message
  Type: LobbyItemType
  Data: LobbyItemData
}

export type LobbyItemData
  = DataText
  | DataReaction
  | DataLockStatusUpdate
  | DataUserStatusUpdate
  // Ex: Configures color they are wearing
  | DataUserDataUpdate
  // they arrived at location
  | DataUserHasArrivedUpdate

// Helper for enforcing pairing of type and appropriate data type
export type LobbyItemTypeAndData
  = { type: LobbyItemType.TEXT,                    data: DataText }
  | { type: LobbyItemType.LOCK_UPDATE,             data: DataLockStatusUpdate }
  | { type: LobbyItemType.REACTION,                data: DataReaction }
  | { type: LobbyItemType.USER_DATA_UPDATE,        data: DataUserDataUpdate }
  | { type: LobbyItemType.USER_HAS_ARRIVED_UPDATE, data: DataUserHasArrivedUpdate }
  | { type: LobbyItemType.USER_STATUS_UPDATE,      data: DataUserStatusUpdate }
