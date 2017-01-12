/**
 * Here, we establish Data structures which are easier to use than
 * base datastructures provided by JavaScript, and typing is nice.
 * Thank you @Basarat for typescript-collections.
 */

import { Dictionary, Set, LinkedList } from 'typescript-collections'
import { RenderedItemGroup, RenderedItem, Reaction, ReactionItem } from './lobby-renderer.interface'

import * as MLI from '@app/core/model/lobby-item.model'

export
class ItemsDictionary extends Dictionary<string, MLI.LobbyItem> {
  constructor() {
    super()
  }
  add(item: MLI.LobbyItem) {
    if (!this.containsKey(item.Id)) {
      this.setValue(item.Id, item)
    }
  }
}

export
enum PostHistoryStatus { CLEAN, EDITED, DELETED }

type ReactionSet = LobbyItemSet

export
type FlatPost = {
  // Original Post
  Post: MLI.LobbyItem
  Data: MLI.LobbyItemData
  Hist: { Status: PostHistoryStatus, ChangedAt: Date, ProfileId: string }
  Reac: ReactionSet
}
type PostsList = LinkedList<MLI.LobbyItem>

export
class PostsDictionary {
  // lookups
  private _flatIndex: Dictionary<string, FlatPost>
  // lookup ReactionId -> reactions to item
  private _reacToSet: Dictionary<string, ReactionSet>

  private _flatList: LinkedList<FlatPost> = new LinkedList<FlatPost>()
  // For looking up full histories of each post's changes
  private _history: Dictionary<string, PostsList>
  constructor() {
    this._flatIndex = new Dictionary<string, FlatPost>()
    this._reacToSet = new Dictionary<string, ReactionSet>()
    this._flatList = new LinkedList<FlatPost>()
    this._history = new Dictionary<string, PostsList>()
  }

  // Only pass in DELETE and EDIT LobbyItems!
  update(update: MLI.LobbyItem) {
    const target = this.getOriginal(update.OperationTargetItemId)
    if (target == null) {
      throw new TypeError(`Cannot update without a target Item! ${JSON.stringify(update)}`)
    }

    switch (target.Type) {
      case MLI.LobbyItemType.REACTION:
        // update reaction can only be a reaction delete.
        switch (update.Operation) {
          case MLI.LobbyItemOperation.DELETE:
            this.deleteReaction(target); break
          // Updating reaction in future?
        }
        break
      default:
        // update flat
        const flatValue = this._flatIndex.getValue(target.Id)
        switch (update.Operation) {
          case MLI.LobbyItemOperation.DELETE:
            flatValue.Hist = { Status: PostHistoryStatus.DELETED, ProfileId: update.ProfileId, ChangedAt: update.CreatedAt }
            // if reaction, then update reactions array
            break
          case MLI.LobbyItemOperation.EDIT:
            flatValue.Hist = { Status: PostHistoryStatus.EDITED, ProfileId: update.ProfileId, ChangedAt: update.CreatedAt }
            // update data
            // hopefully the data is also updated in the _list...
            flatValue.Data = update.Data; break
        }

        // add to history
        const history = this._history.getValue(target.Id)
        history.add(update)
    }
  }

  // Only pass in POST LobbyItems!
  post(post: MLI.LobbyItem) {
    // If flatValue properties are updated in one, we want it updated in the other as well!
    switch (post.Type) {
      case MLI.LobbyItemType.REACTION:
        // reaction are processed in a way for storing lookups
        this.postReaction(post); break

      default:
        // otherwise put into flatposts which can receive reactions
        const flatValue: FlatPost = {
          Post: post,
          Data: post.Data,
          Hist: {
            Status: PostHistoryStatus.CLEAN,
            ProfileId: post.ProfileId,
            ChangedAt: post.CreatedAt
          },
          Reac: new LobbyItemSet()
        }
        this._flatIndex.setValue(post.Id, flatValue)
        this._flatList.add(flatValue)

    }
    const newHistory = new LinkedList<MLI.LobbyItem>()
    newHistory.add(post)
    this._history.setValue(post.Id, newHistory)
  }

  private postReaction(reaction: MLI.LobbyItem) {
    const data = <MLI.DataReaction> reaction.Data
    // this is the set of reactions belonging to the flat post
    const reactToReactionSet = this._flatIndex.getValue(data.ItemId).Reac
    // add our reaction to this set
    reactToReactionSet.add(reaction)
    // add a lookup to this reaction set in the case we need to update this reaction later
    this._reacToSet.setValue(reaction.Id, reactToReactionSet)
  }

  // @param reaction: must be the original reaction item
  private deleteReaction(reaction: MLI.LobbyItem) {
    // remove original reaction's flat post's set lookup
    // reaction set which the reaction belonged to:
    const reactionSet = this._reacToSet.remove(reaction.Id)

    // remove original reaction from flat post's set
    reactionSet.remove(reaction)
  }

  // @param reaction: must be the original reaction item
  getReactionsOf(id: string): MLI.LobbyItem[] {
    return this.getFlatPost(id).Reac.toArray()
  }

  getOriginal(id: string): MLI.LobbyItem {
    let originals = this._history.getValue(id)
    if (originals) { return originals.first() }
  }

  getHistory(id: string): MLI.LobbyItem[] {
    let originals = this._history.getValue(id)
    if (originals) { return originals.toArray() }
  }

  getFlatPost(id: string): FlatPost {
    return this._flatIndex.getValue(id)
  }

  // FUTURE: Caching?
  getRenderedItemGroups(): RenderedItemGroup[] {
    // RenderedItemGroup, RenderedItem
    const groups: LinkedList<RenderedItemGroup> = new LinkedList<RenderedItemGroup>()

    // If messages are posted in sequence with less than this amount of difference in date,
    // then keep them in same groups
    // 1 minute
    const MAX_TIME_DIFF = 1000 * 60 * 1

    let group: RenderedItemGroup = null
    let lastTime: number = null
    let lastProfileId: string = null

    function updateLast(flatValue: FlatPost) {
      lastTime = flatValue.Post.CreatedAt.valueOf()
      lastProfileId = flatValue.Post.ProfileId
    }

    function isInGroup(flatValue: FlatPost): boolean {
      const isSameAuthor = lastProfileId === flatValue.Post.ProfileId
      if (!isSameAuthor) {
        return false
      }
      const isInTime = lastTime - flatValue.Post.CreatedAt.valueOf() < MAX_TIME_DIFF
      return isInTime
    }

    function newGroup(flatValue: FlatPost, item: RenderedItem): RenderedItemGroup {
      return {
        PostedAt: flatValue.Post.CreatedAt,
        ProfileId: flatValue.Post.ProfileId,
        Items: [ item ]
      }
    }

    function render(flatValue: FlatPost) {
      // Use date and profileId to determine whether we need to start a new render item group
      const item: RenderedItem = {
        ItemId: flatValue.Post.Id,
        Type: flatValue.Post.Type,
        Data: flatValue.Data,
        IsDeleted: flatValue.Hist.Status === PostHistoryStatus.DELETED,
        IsEdited: flatValue.Hist.Status === PostHistoryStatus.EDITED,
        Reactions: reactionSetToRenderReactions(flatValue.Reac)
      }

      // If no group or not within diff and same profileId create group
      if (group == null) {
        group = newGroup(flatValue, item)

      } else if (isInGroup(flatValue)) {
        group.Items.push(item)

      } else {
        // push group and then new
        groups.add(group)
        group = newGroup(flatValue, item)

      }
      updateLast(flatValue)
    }

    this._flatList.forEach((v) => render(v))

    return groups.toArray()
  }
}

function reactionSetToRenderReactions(set: ReactionSet): Reaction[] {
  const dict = new Dict<string, ReactionItem[]>()
  set.forEach(r => {
    let data = <MLI.DataReaction> r.Data
    let arr = dict.getValue(data.Reaction)
    let ins: ReactionItem = { ItemId: r.Id, ProfileId: r.ProfileId }
    if (arr) {
      arr.push(ins)
    } else {
      dict.setValue(data.Reaction, [ins])
    }
  })

  return dict.reactionAndItems()
}
export
class LobbyItemSet extends Set<MLI.LobbyItem> {
  constructor() {
    super(LobbyItemToString)
  }
}

function LobbyItemToString(item: MLI.LobbyItem): string {
  return item.Id
}

// for performance we are redefining Dictionary so we can dually get keys and values
interface IDictionaryPair<K, V> {
  key: K
  value: V
}
class Dict<K, V> extends Dictionary<K, V> {
  reactionAndItems(): { Reaction: K, Items: V }[] {
    const array: { Reaction: K, Items: V }[] = []
    for (const name in this.table) {
      const pair: IDictionaryPair<K, V> = this.table[name]
      array.push({ Reaction: pair.key, Items: pair.value })
    }
    return array
  }
}
