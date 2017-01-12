import { Component, OnInit, Input } from '@angular/core';

import { RenderedItemGroup, RenderedItem } from '@app/core/data'

import * as M from '@app/core/model'
import * as MLI from '@app/core/model/lobby-item.model'

import * as moment from 'moment'

// ten minute max
const MAX_TIME_FOR_REL_DISPLAY = 1000 * 60 * 10

@Component({
  selector: 'pw-item-group',
  templateUrl: './item-group.component.html',
  styleUrls: [
    './item-group.component.css',
  ]
})
export class ItemGroupComponent implements OnInit {
  // <item-group [itemGroup]="">
  @Input() itemGroup: RenderedItemGroup

  items: RenderedItem[]
  profile: M.Profile
  displayDate: string

  public isDateMonitored = true

  constructor() {}

  ngOnInit() {
    // on init
    // interval for updating display date?
    // subscribe to something which calls the update?
    // do we need to be in view?
    this.items = this.itemGroup.Items
      .filter((item) => !item.IsDeleted && item.Type !== MLI.LobbyItemType.USER_STATUS_UPDATE)

    // get profile from profile service
    this.profile = {
      FirstName: this.itemGroup.ProfileId,
      Id: this.itemGroup.ProfileId,
      ImageURL: '',
      Tagline: "Unknown"
    }

    this.updateDate()
  }

  updateDate() {
    if (this.isDateMonitored) {
      const now = Date.now()
      const mom = moment(this.itemGroup.PostedAt)
      if (this.itemGroup.PostedAt.valueOf() + MAX_TIME_FOR_REL_DISPLAY > now) {
        // posted within max diff
        // So we render relative time
        this.displayDate = mom.fromNow()
      } else {
        this.displayDate = mom.format("h:mm a")
        // stop watching.
        this.isDateMonitored = false
      }
    }
  }
}
