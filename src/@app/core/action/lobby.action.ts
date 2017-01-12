/* tslint:disable:no-unused-variable */
import { Injectable } from '@angular/core'

import { AppStateService } from '@app/core/app-state'
import { DataService } from '@app/core/data'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'

import * as moment from 'moment'
function reltime(num: number, unit: moment.unitOfTime.DurationConstructor): Date {
  return moment().add(num, unit).toDate()
}

@Injectable()
export class LobbyActions {
  constructor(private app: AppStateService,
      private data: DataService) {}

  // TODO set up listener to phoenix channel coming back
  // TODO: Listen for new LobbyItems,
  //   Note which Items are ours, (establish common pattern to be used with Pea and Pods)
  //   Reduce Deletes,
  //   Reduce Edits,
  //   Collect Reactions,
  //   etc,

  push(...obj) {
    let args = [`LobbyAction %cpush`, 'font-weight: bold', ...obj]
    console.log.apply(console, args)
  }

  sendText(body: string) {
    // TODO
    const message = {
      op: 'post_text',
      body: body
    }
    this.push(message)
  }

  editText(targetItemId: string, body: string) {
    // TODO push up change
    const message = {
      op: 'edit_text',
      id: targetItemId,
      body: body
    }
    this.push(message)
  }

  deleteItem(targetItemId: string) {
    // TODO send message to delete text
    const message = {
      op: 'delete',
      id: targetItemId
    }
    this.push(message)
  }

  toggleReaction(targetItemId: string, reaction: string) {
    let existingReactions = this.getReactionItemsOf(targetItemId, {
      reaction: { ItemId: targetItemId, Reaction: reaction },
      profileId: this.data.getMyProfileId()
    })

    if (existingReactions.length) {
      // delete existing reaction
      existingReactions.forEach((reactionItem) => this.deleteItem(reactionItem.Id))

    } else {
      // TODO note that our pod accepts the other pod
      const message = {
        op: 'post_react',
        // Item we are reacting to
        item_id: targetItemId,
        reaction: reaction,
      }
      this.push(message)
    }
  }

  reportItem(targetItemId: string, reason: string) {
    const message = {
      op: 'report',
      id: targetItemId,
      reasonString: reason,
    }
    this.push(message)
  }

  showItemOptions(itemId: string) {
    // TODO action
    const update = this.app.action("Show LobbyItem Options")

    const postAndData = this.getPostAndData(itemId)

    update(`Options:(${postAndData.Post.Id}):${postAndData.Data}`, {
      Device: { URL: '/lobby' },
      Lobby: {
        // Only one modal may be open
        ItemOptions: postAndData,
        // null means that we need the menu to choose.
        ItemOption: null
      }
    })
  }

  showEditItem(itemId: string) {
    // TODO check if deleted?
    const update = this.app.action("Show Edit LobbyItem")

    const postAndData = this.getPostAndData(itemId)

    update(`Edit:(${postAndData.Post.Id}):${postAndData.Data}`, {
      Device: { URL: '/lobby' },
      Lobby: {
        ItemOptions: postAndData,
        ItemOption: M.LobbyItemOption.EDIT
      }
    })
  }

  showDeleteItem(itemId: string) {
    // TODO check if deleted?
    const update = this.app.action("Show Delete LobbyItem Confirmation")

    const postAndData = this.getPostAndData(itemId)

    update(`Delete:(${postAndData.Post.Id}):${postAndData.Post.Data}`, {
      Device: { URL: '/lobby' },
      Lobby: {
        ItemOptions: postAndData,
        ItemOption: M.LobbyItemOption.DELETE
      }
    })
  }

  showReactionOptions(itemId: string) {
    const update = this.app.action("Show Delete LobbyItem Confirmation")

    const postAndData = this.getPostAndData(itemId)

    update(`Delete:(${postAndData.Post.Id}):${postAndData.Post.Data}`, {
      Device: { URL: '/lobby' },
      Lobby: {
        ItemOptions: postAndData,
        ItemOption: M.LobbyItemOption.REACT
      }
    })
  }

  showReportingOptions(itemId: string) {
    const update = this.app.action("Show Delete LobbyItem Confirmation")

    const postAndData = this.getPostAndData(itemId)

    update(`Delete:(${postAndData.Post.Id}):${postAndData.Post.Data}`, {
      Device: { URL: '/lobby' },
      Lobby: {
        ItemOptions: postAndData,
        ItemOption: M.LobbyItemOption.DELETE
      }
    })
  }

  // This returns the original LobbyItem Post, and teh most up to date Data for it.
  getPostAndData(itemId: string) {
    const flatPost = this.data.lobbyPosts.getFlatPost(itemId)
    return {
      Post: flatPost.Post,
      Data: flatPost.Data,
      CanEdit: this.data.isMyProfile(flatPost.Post.ProfileId),
    }
  }

  getReactionItemsOf(itemId: string, opts?: { reaction?: MLI.DataReaction, profileId?: string }): MLI.LobbyItem[] {
    let res = this.data.lobbyPosts.getReactionsOf(itemId)
    if (opts == null) { return res }

    if (opts.profileId != null) {
      res = res.filter(reac => reac.ProfileId === opts.profileId)
    }

    if (opts.reaction != null) {
      res = res.filter(reac => (<MLI.DataReaction> reac.Data).Reaction === opts.reaction.Reaction)
    }

    return res
  }
}
