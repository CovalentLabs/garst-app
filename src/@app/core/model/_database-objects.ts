

// These are items which have Id properties
// It is important for us to keep track of the items
// which can be changed on one side of the App,
// and need to stay up to date across the app.
export type SharedDBObjectName
  = 'Profile'
  | 'Friend'
  | 'Availability'
  | 'Pea'
  | 'Pod'
  | 'PodMatch'
  | 'SentInvitation'
  | 'PodSentInvitation'
  | 'Group'
  | 'GroupUser'
export const SharedDBObjectNames: SharedDBObjectName[] =
  [ 'Profile'
  , 'Friend'
  , 'Availability'
  , 'Pea'
  , 'Pod'
  , 'PodMatch'
  , 'SentInvitation'
  , 'PodSentInvitation'
  , 'Group'
  , 'GroupUser' ]
// import { SharedDBObjectName, SharedDBObjectNames } from './shared'
import { DBObjectName as DB1, DBObjectNames as DBN1 } from './login-credentials.model'
import { DBObjectName as DB2, DBObjectNames as DBN2 } from './lobby-item.model'
import { DBObjectName as DB3, DBObjectNames as DBN3 } from './user-item.model'

export type DatabaseObjects
  = SharedDBObjectName
  | DB1
  | DB2
  | DB3
// These are the complete names of every object which has a trackable Id
export const DatabaseObjectNames: DatabaseObjects[] =
  <DatabaseObjects[]>
  (<string[]> SharedDBObjectNames)
    .concat(DBN1)
    .concat(DBN2)
    .concat(DBN3)
