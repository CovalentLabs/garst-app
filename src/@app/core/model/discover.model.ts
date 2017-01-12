
import * as S from './shared'

export
type Discover = {
  // Others are unable to join this pod,
  // this setting is shared between you and the other peas.
  IsPodLocked: boolean

  // Your pea
  Pea: S.Pea

  // Your pod
  Pod: S.Pod

  // Potential matches for your Pod
  Matches: S.PodMatch[]

  // Display availability configuration options for yourself
  ShowAvailabilityOptions: boolean

  // Display friends list to invite
  ShowInvitationOptions: boolean

  InvitationOptions: {
    Friends: S.Friend[]
  }
}

export
const DefaultDiscover: Discover = {
  IsPodLocked: false,
  Pea: null,
  Pod: null,
  Matches: null,
  ShowAvailabilityOptions: false,
  ShowInvitationOptions: false,
  InvitationOptions: null
}
