import { Component, Input } from '@angular/core';

import { RenderedItemGroup } from '@app/core/data'

@Component({
  selector: 'pw-lobby-messages',
  templateUrl: './lobby-messages.component.html',
  styleUrls: [
    './lobby-messages.component.css',
  ]
})
export class LobbyMessagesComponent {
  // <pw-lobby-messages [itemGroups]="" [myProfile]>
  @Input() itemGroups: RenderedItemGroup[]
  @Input() myProfileId: string
}
