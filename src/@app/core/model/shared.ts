
export interface Profile {
  Id: string
  FirstName: string
  Tagline: string
  ImageURL: string
}

export enum FriendStatus {
  ONLINE,
  OFFLINE,
  DISCOVER,
  IN_GROUP,
  // JOINABLE,
}

export type Friend = {
  Id: string
  // TODO: FriendData may include contact link maybe for SMS,
  // or, it may not be needed at all.
  // Data: FriendData
  Profile: Profile
  Status: FriendStatus
}

// Single availability configuration from, to, times
export type Availability = {
  Id: string
  Start: Date
  End: Date
}

// One user's vehicle for discovering in
export type Pea = {
  Id: string
  Availability: Availability[]
  Profile: Profile
}

// As multiple users group together, we form Pods
// of multiple Peas.
export type Pod = {
  Id: string
  Peas: Pea[]
}

export enum PodMatchVoteChoice {
  // Perhaps if one person denys/blocks, the group becomes locked and cannot be voted for?
  ACCEPT, DENY
}

// We separate out ruling method as a parameter, because the server needs to be able to
// share the same logic, and the server may optimize the match ruling method
export enum PodMatchRulingMethod {
  // Each pod must have at least one person accept the match,
  // and overall, there needs to be more than half total peas
  // casting ACCEPT
  // So, |A| = 3, |B| = 2, there must be
  //    1 vote from A,
  //    1 vote from B, and
  //    1 vote from either to reach majority
  // OR, |A| = 2, |B| = 2, there must be
  //    1 vote from A,
  //    1 vote from B, and
  //    1 vote from either to reach majority.
  // OR, |A| = 3, |B| = 3, there must be
  //    1 vote from A,
  //    1 vote from B, and
  //    2 votes from either to reach majority
  ONE_FROM_EACH_OVERALL_MAJORITY,

  // Each pod must have at least half of their peas agreeing
  // and overall, there must be a majority.
  // So, |A| = 3, |B| = 2, there must be
  //    2 votes from A, and
  //    1 vote from B
  // OR, |A| = 2, |B| = 2, there must be
  //    1 vote from A,
  //    1 vote from B, and
  //    1 vote from either to reach majority.
  // OR, |A| = 3, |B| = 3, there must be
  //    2 votes from A, and
  //    2 votes from B
  HALF_FROM_EACH_OVERALL_MAJORITY
}

export type PodMatchVote = {
  Id: string
  Pea: Pea
  Choice: PodMatchVoteChoice
}

// TODO: in future these may all be stored as Items and work similarly to the LobbyItem pattern, due to efficiency
// I'm not so sure how we will be leveraging channels for cx... we'll see!
export type PodMatch = {
  Id: string
  Pod: Pod // if their pod size changes, the following will need to be updated!
  OurVotes: PodMatchVote[]
  TheirVotes: PodMatchVote[]
  RulingMethod: PodMatchRulingMethod
}

export type PodInvitation = {
  Id: string
  From: Pea
  Pod: Pod
  To: Friend
}

export enum GroupLockStatus {
  LOCKED,
  UNLOCKED,
}

// The reason Group is a shared model,
// as opposed to only being in Lobby is because
// the Group model will be used in the history screen as well!

// This is the final group which you are in to go to the event with,
// It is not formed until all pods have accepted each other and are
// paired together.
export type Group = {
  Id: string
  Name: string
  FormedAt: Date
  MeetingAt: Date
  LockStatus: GroupLockStatus
  GroupUsers: GroupUser[]
}

export enum GroupUserStatus {
  ACTIVE, AWAY, QUIT
}

export type GroupUserData = {
  // Describing what color this person is wearing
  // to make it easier to locate each other.
  WearingColor?: string,
}

export type GroupUser = {
  Id: string
  // Purely for tracking how people were podded
  PodId: string
  Profile: Profile

  // This is configurable, updatable, data for the user
  Data: GroupUserData

  Status: GroupUserStatus
}
