
import { Profile } from './shared'

// All objects here which have an Id attribute
// are tied to a database entry.
export type DBObjectName
  = 'LoginCredentials'
export const DBObjectNames: DBObjectName[] =
  [ 'LoginCredentials' ]

// Verification tokens for verifying commands
// to the server.
export type LoginCredentials = {
  Id: string
  FirstName: string
  LastName: string
  Profile: Profile
}
