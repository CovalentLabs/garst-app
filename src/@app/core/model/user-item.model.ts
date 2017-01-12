
import * as S from './shared'

// All objects here which have an Id attribute
// are tied to a database entry.
export type DBObjectName
  = 'UserItem'
export const DBObjectNames: DBObjectName[] =
  [ 'UserItem' ]

export enum UserItemType {
  POD_INVITE, FRIEND_ADDED
}

export type DataPodInvite =  S.PodInvitation
export type DataFriendAdded =  S.Friend

// Messages in the chat room / lobby
// This can represent either a post, edit, or deletion of an item
export type UserItem = {
  Id: string
  CreatedAt: Date

  // Payload of the message
  Type: UserItemType
  Data: DataPodInvite
    | DataFriendAdded
}
