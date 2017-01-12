
import { AppState, PartialAppState, DefaultAppState } from '@app/core'
import * as moment from 'moment'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'

import * as _mergeWith from 'lodash.mergewith'
let mergeWith: (obj: any, source: any, customizer?: (objValue, srcValue) => any) => any = _mergeWith
// https://lodash.com/docs/4.16.4#mergeWith
// In the future, we may be interested in customizing this further
// for better support of large message arrays maybe.
function mergeExceptArrays (objValue, srcValue) {
  if (objValue instanceof Array && srcValue instanceof Array) {
    return srcValue
  }
}


// Profiles
const pr$0: M.Profile = { FirstName: 'Jackson',  Id: 'pr0',  ImageURL: '', Tagline: 'Captain Action' }
// My Pod
const pr$1: M.Profile = { FirstName: 'Road',     Id: 'pr$1', ImageURL: '', Tagline: 'Meep! Meep!' }
const pr$2: M.Profile = { FirstName: 'Tweety',   Id: 'pr$2', ImageURL: '', Tagline: 'I tawt I taw a puddy-tat!' }

const pra1: M.Profile = { FirstName: 'Bugs',     Id: 'pra1', ImageURL: '', Tagline: 'What a maroon!' }
const pra2: M.Profile = { FirstName: 'Daffy',    Id: 'pra2', ImageURL: '', Tagline: 'You\'re dethpicable' }
const pra3: M.Profile = { FirstName: 'Porky',    Id: 'pra3', ImageURL: '', Tagline: 'Y-y-you can\'t fool me.' }
const pra4: M.Profile = { FirstName: 'Lola',     Id: 'pra4', ImageURL: '', Tagline: 'Don\'t ever call me doll' }
const prb1: M.Profile = { FirstName: 'Yosemite', Id: 'prb1', ImageURL: '', Tagline: 'Great horny toads!' }
const prb2: M.Profile = { FirstName: 'Elmer',    Id: 'prb2', ImageURL: '', Tagline: 'Gweat gwasshoppers!' }
const prc1: M.Profile = { FirstName: 'Speedy',   Id: 'prc1', ImageURL: '', Tagline: 'Arriba! Arriba!' }
const prc2: M.Profile = { FirstName: 'Wile',     Id: 'prc2', ImageURL: '', Tagline: 'YEeooooowwwwwwwww!!!' }

// Friends --------------------
const fr1: M.Friend = nfri(pr$1, M.FriendStatus.IN_GROUP)
const fr2: M.Friend = nfri(pr$2, M.FriendStatus.ONLINE)

// Peas and Pods --------------

// Pod $: Jackson (me), Road
const pe$0: M.Pea = npea(pr$0, { start: 1, end: 3.5 })
const pe$1: M.Pea = npea(pr$1, { start: .5, end: 3 })
const pe$2: M.Pea = npea(pr$2, { start: 1, end: 4 })
const pod$: M.Pod = npod('$', pe$0, pe$1, pe$2)

// Pod A: Bugs, Daffy, Lola, Porky
const pea1: M.Pea = npea(pra1, { start: 1, end: 3 })
const pea2: M.Pea = npea(pra2, { start: 1.5, end: 3 })
const pea3: M.Pea = npea(pra3, { start: 1, end: 2.5 })
const pea4: M.Pea = npea(pra4, { start: 1, end: 3 })
const poda: M.Pod = npod('a', pea1, pea2, pea3, pea4)

// Pod B: Yosemite, Elmer
const peb1: M.Pea = npea(prb1, { start: 1, end: 3 })
const peb2: M.Pea = npea(prb2, { start: 1.5, end: 3 })
const podb: M.Pod = npod('b', peb1, peb2)

// Pod C: Speedy, Wile
const pec1: M.Pea = npea(prc1, { start: 4, end: 7 })
const pec2: M.Pea = npea(prc2, { start: 4.5, end: 7 })
const podc: M.Pod = npod('c', pec1, pec2)

function nfri(profile: M.Profile, status: M.FriendStatus): M.Friend {
  return {
    Id: profile.Id + '+fri',
    Profile: profile,
    Status: status
  }
}
// Create new Pea Model using provided profile and availability
// Availability is represented as hours relative from time now.
function npea(profile: M.Profile, avail_rel_hours: { start: number, end: number }): M.Pea {
  const {start, end} = avail_rel_hours
  return {
    Id: profile.Id + '+pea',
    Profile: profile,
    Availability: [{ Id: profile.Id + '+av', Start: reltime(start, 'h'), End: reltime(end, 'h') }],
  }
}
function npod(id: string, ...peas: M.Pea[]): M.Pod {
  return {
    Id: id + '+pod',
    Peas: peas,
  }
}

// Lobby ----------------------

const gus$: M.GroupUser[] = ngroupusers(pod$, poda)
const gr$0: M.Group = ngroup('gr$0', 'Flingalingables', gus$)

function nrandgroupuser(podId: string, pea: M.Pea): M.GroupUser {
  const color = ['dodgerblue', 'maroon', 'lawngreen', 'darkgray'][pea.Profile.Tagline.length % 4]
  const status = [M.GroupUserStatus.ACTIVE, M.GroupUserStatus.AWAY][pea.Profile.FirstName.length % 2]
  return {
    Id: pea.Profile.Id + '-gu-' + podId,
    PodId: podId,
    Profile: pea.Profile,
    Status: status,
    Data: { WearingColor: color },
  }
}

function nlidelete(id_gen: () => string, profile: M.Profile, mins: number, item: M.LobbyItem) {
  return {
    Id: id_gen(),
    ProfileId: profile.Id,
    OperationTargetItemId: item.Id,
    Operation: MLI.LobbyItemOperation.DELETE,
    CreatedAt: reltime(mins, 'minutes'),
    Data: null,
    Type: null,
  }
}

function nlitextedit(id_gen: () => string, profile: M.Profile, mins: number, item: M.LobbyItem, text: string) {
  const data: MLI.DataText = text
  return {
    Id: id_gen(),
    ProfileId: profile.Id,
    OperationTargetItemId: item.Id,
    Operation: MLI.LobbyItemOperation.EDIT,
    CreatedAt: reltime(mins, 'minutes'),
    Data: data,
    Type: MLI.LobbyItemType.TEXT,
  }
}

function nlitext(id_gen: () => string, profile: M.Profile, mins: number, text: string) {
  const data: MLI.DataText = text
  return nli(id_gen, profile, mins, { type: MLI.LobbyItemType.TEXT, data })
}

function nlireac(id_gen: () => string, profile: M.Profile, mins: number, item: M.LobbyItem, reaction: string) {
  const data: MLI.DataReaction = { ItemId: item.Id, Reaction: reaction }
  return nli(id_gen, profile, mins, { type: MLI.LobbyItemType.REACTION, data })
}

// Create a unique ID generator
function luid(name: string) {
  let item_id = 0
  return function luid_gen(): string { return `${item_id++}-${name}` }
}

function nli(id_gen: () => string, profile: M.Profile, mins: number, data: MLI.LobbyItemTypeAndData): M.LobbyItem {
  return {
    Id: id_gen(),
    ProfileId: profile.Id,
    OperationTargetItemId: null,
    Operation: MLI.LobbyItemOperation.POST,
    CreatedAt: reltime(mins, 'minutes'),
    Data: data.data,
    Type: data.type,
  }
}

function ngroupusers(...pods: M.Pod[]): M.GroupUser[] {
  return pods
    .map(pod =>
      pod.Peas
    .map(pea => nrandgroupuser(pod.Id, pea)))
    // flatten 2d arrays into 1d
    .reduce((prev, curr) => prev.concat(curr), [])
}

function ngroup(id: string, name: string, users: M.GroupUser[]): M.Group {
  return {
    Id: id,
    Name: name,
    LockStatus: M.GroupLockStatus.UNLOCKED,
    MeetingAt: reltime(.5, 'h'),
    FormedAt: new Date(),
    GroupUsers: users,
  }
}

// Relative time from now
function reltime(rel: number, unit: moment.unitOfTime.DurationConstructor): Date {
  return moment().add(rel, unit).toDate()
}

export
type MockState = { name: string, state: AppState }

// States
const MOCK_STATES: MockState[] = (function () {
  let res: MockState[] = []
  let add = state(res)

  // Login ------------

  let notLoggedInBase: AppState =
    assign(DefaultAppState, {
      // This should be the default anyway,
      // but here we are being very deliberate.
      Login: {
        Credentials: null,
        HasLoggedOut: false,
        IsLoggedIn: false,
        LoginError: null
      }
    })

  add(//////////////////
    'Styleguide',
    notLoggedInBase,
    { Device: { URL: '/styleguide' } }
  )

  add(//////////////////
    'Login/Not logged in/Not logged in',
    notLoggedInBase
  )

  add(//////////////////
    'Login/Not logged in/Has logged out',
    notLoggedInBase,
    { Login: { HasLoggedOut: true } }
  )


  add(//////////////////
    'Login/Not logged in/Log in error',
    notLoggedInBase,
    {
      Login: {
        LoginError: { ErrorId: 'conn-0', Reason: 'We lost connection unfortunately' }
      }
    }
  )

  const loggedInBase1: AppState
  = assign(notLoggedInBase, {
    Device: {
      URL: "/home",
    },
    Login: {
      Credentials: {
        FirstName: 'Jackson',
        LastName: 'Rains',
        Profile: pr$0,
        Id: 'jr0'
      },
      IsLoggedIn: true,
      UserItems: [],
    }
  })

  add(//////////////////
    'Login/Logged in 1',
    loggedInBase1
  )

  const loggedInBase2: AppState
  = assign(notLoggedInBase, {
    Device: {
      URL: "/home",
    },
    Login: {
      Credentials: {
        FirstName: 'Bugs',
        LastName: 'Bunny',
        Profile: pra1,
        Id: 'pa0'
      },
      IsLoggedIn: true,
      UserItems: [],
    }
  })

  add(//////////////////
    'Login/Logged in 2',
    loggedInBase2
  )

  // Discovering ------

  const discoverBase1: AppState
  = ((fn) => fn())(
  function CreateDiscoverBase1Mock() {
    const podMatches: M.PodMatch[] = []
    // id generators for mocking
    const pmid1 = luid('pm1')
    const pmvid1 = luid('pmv1')
    // helpers
    function pea_to_vote(pea: M.Pea): M.PodMatchVote { return { Id: pmvid1(), Pea: pea, Choice: M.PodMatchVoteChoice.ACCEPT } }
    function add_match(
        pod: M.Pod,
        opts: { ourVotes: M.Pea[], theirVotes: M.Pea[] },
        ruling = M.PodMatchRulingMethod.ONE_FROM_EACH_OVERALL_MAJORITY
    ): M.PodMatch {
      let match: M.PodMatch = {
        Id: pmid1(),
        Pod: pod,
        RulingMethod: ruling,
        OurVotes: opts.ourVotes.map(pea_to_vote),
        TheirVotes: opts.theirVotes.map(pea_to_vote),
      }
      podMatches.push(match)
      return match
    }

    add_match(poda, { theirVotes: [ pea1, pea3 ], ourVotes: [ pe$0 ] })
    add_match(poda, { theirVotes: [ pea1 ], ourVotes: [ pe$0 ] })
    add_match(poda, { theirVotes: [ pea1 ], ourVotes: [ pe$0 ] }, M.PodMatchRulingMethod.HALF_FROM_EACH_OVERALL_MAJORITY)
    add_match(poda, { theirVotes: [ ], ourVotes: [ pe$0, pe$2 ] })
    add_match(podb, { theirVotes: [ ], ourVotes: [ pe$0, pe$2, pe$1 ] })
    add_match(podb, { theirVotes: [ peb1 ], ourVotes: [ pe$0, pe$2, pe$1 ] })
    add_match(podc, { theirVotes: [ pec1 ], ourVotes: [ pe$0 ] })
    add_match(podc, { theirVotes: [ pec1 ], ourVotes: [ pe$0 ] }, M.PodMatchRulingMethod.HALF_FROM_EACH_OVERALL_MAJORITY)
    add_match(podc, { theirVotes: [ pec1 ], ourVotes: [ pe$0, pe$2 ] })

    return assign(loggedInBase1, {
      Device: {
        URL: '/discovering',
      },
      Discover: {
        Pea: pe$0,
        Pod: pod$,
        Matches: podMatches,
        IsPodLocked: false,
        InvitationOptions: {
          Friends: [ fr1, fr2 ]
        },
        ShowAvailabilityOptions: false,
        ShowInvitationOptions: false
      }
    })
  })

  add(//////////////////
    'Discover/Base',
    discoverBase1
  )

  add(//////////////////
    'Discover/Show Availability',
    discoverBase1,
    { Discover: { ShowAvailabilityOptions: true } }
  )

  add(//////////////////
    'Discover/Show Invitations',
    discoverBase1,
    { Discover: { ShowInvitationOptions: true } }
  )

  // Lobby ------------

  // set when lobbyBase1 is created
  let item1: M.LobbyItem = null
  let item2: M.LobbyItem = null
  const lobbyBase1: AppState
    = ((fn) => fn())(
  function CreateLobbyBase1Mock() {
    // locally unique id generator
    const liid1 = luid('li1')
    const items: M.LobbyItem[] = []
    function add_item(item: M.LobbyItem): M.LobbyItem {
      items.push(item)
      return item
    }
    add_item(nlitext(liid1, pra1, -20,   'Howdy'))
    const ia12: M.LobbyItem =
    add_item(nlitext(liid1, pr$1, -19.8, `Good to see you again, ${pra1.FirstName}!`))
    const to_del_smile =
    add_item(nlireac(liid1, pr$2, -19.7, ia12, 'smile'))
    add_item(nlireac(liid1, pra1, -19.6, ia12, 'smile'))
    // delete reaction
    add_item(nlidelete(liid1, pr$2, -19.55, to_del_smile))
    add_item(nlireac(liid1, pr$2, -19.5, ia12, 'agree'))

    add_item(nlitext(liid1, pr$2, -14, `Does anyone know what's for breakfast?`))
    // accidentally duplicate message?
    const to_delete =
    add_item(nlitext(liid1, pr$2, -14, `Does anyone know what's for breakfast?`))
    add_item(nlidelete(liid1, pr$2, -13.8, to_delete))

    add_item(nli(liid1, pra3, -10.1, { type: M.LobbyItemType.LOCK_UPDATE, data: M.GroupLockStatus.LOCKED }))
    add_item(nlitext(liid1, pr$0, -10, `Hey ${pra1.FirstName}, how do you know ${pra4.FirstName}?`))

    const to_edit =
    add_item(nlitext(liid1, pra1, -7, `I met ${pra4.FirstName} in my biology class!`))
    add_item(nlitextedit(liid1, pra1, -6.7, to_edit, `I met ${pra4.FirstName} in my public speaking class!`))
    add_item(nli(liid1, pra3, -6.2, { type: M.LobbyItemType.LOCK_UPDATE, data: M.GroupLockStatus.UNLOCKED }))

    item1 =
    add_item(nlitext(liid1, pr$0, -6,   `I am very excited to meet you guys, I just have an episode of Bobs Burgers to complete.`))
    add_item(nlitext(liid1, pr$0, -5.7, `So, I'll be away until I see you all at the dining center.`))

    item2 =
    add_item(nli(liid1, pra3, -5, { type: M.LobbyItemType.USER_STATUS_UPDATE, data: M.GroupUserStatus.ACTIVE }))
    const ia30: M.LobbyItem = add_item(nlitext(liid1, pra3, -4.7, `Hey guys!`))
    add_item(nlireac(liid1, pr$0, -4.8, ia30, 'wave'))
    add_item(nlireac(liid1, pra1, -4.7, ia30, 'wave'))
    add_item(nli(liid1, pr$1, -5, { type: M.LobbyItemType.USER_STATUS_UPDATE, data: M.GroupUserStatus.AWAY }))
    add_item(nlireac(liid1, pra3, -4.2, ia30, 'smile'))

    return assign(loggedInBase1, {
      Device: {
        URL: '/lobby',
        State: M.DeviceState.IN_GROUP,
      },
      Lobby: {
        ItemOption: null,
        ItemOptions: null,
        Group: gr$0,
        LobbyItems: items
      }
    })
  })

  add(//////////////////
    'Lobby/Base',
    lobbyBase1
  )

  const canEditItem1 = item1.ProfileId === lobbyBase1.Login.Credentials.Profile.Id
  const item1Options = { Post: item1, Data: item1.Data, CanEdit: canEditItem1 }
  add(//////////////////
    'Lobby/ShowOptions 1 Can Edit',
    lobbyBase1,
    { Lobby: { ItemOptions: item1Options, ItemOption: null } }
  )

  const canEditItem2 = item2.ProfileId === lobbyBase1.Login.Credentials.Profile.Id
  const item2Options = { Post: item2, Data: item2.Data, CanEdit: canEditItem2 }
  add(//////////////////
    'Lobby/ShowOptions 2 Not Edit',
    lobbyBase1,
    { Lobby: { ItemOptions: item2Options, ItemOption: null } }
  )

  add(//////////////////
    'Lobby/Editing 1',
    lobbyBase1,
    { Lobby: { ItemOptions: item1Options, ItemOption: M.LobbyItemOption.EDIT } }
  )

  add(//////////////////
    'Lobby/Deleting 1',
    lobbyBase1,
    { Lobby: { ItemOptions: item1Options, ItemOption: M.LobbyItemOption.DELETE } }
  )

  add(//////////////////
    'Lobby/Reacting 2',
    lobbyBase1,
    { Lobby: { ItemOptions: item2Options, ItemOption: M.LobbyItemOption.REACT } }
  )

  // TODO Future mocks please retain comment delimiters,
  // These help us visually delimit this file.

  return res;
})();

Object.freeze(MOCK_STATES)


export function getMockState(name: string) {
  return MOCK_STATES.find(state => state.name === name)
}

function state (arr: MockState[]) {
  return function AddMockState (name: string, state: AppState, partial?: PartialAppState): void {
    state = assign(state, partial)
    arr.push({ name, state })
  }
}

function assign (state: AppState, partial?: PartialAppState): AppState {
  state = mergeWith({}, state)
  if (partial != null) {
    mergeWith(state, partial, mergeExceptArrays)
  }
  return state
}

export const MOCK_STATE_KEYS = MOCK_STATES.map(state => state.name)
